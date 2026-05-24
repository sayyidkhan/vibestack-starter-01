import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { and, eq, gt, lt } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import {
  auditLogs,
  rateLimitEvents,
} from '../db/schema'
import { bootstrapDatabase } from './bootstrap'
import { db } from './db'
import { notifyPolicyEvent } from './ai/policy'
import { sendHttpResult } from './runtime/http'
import { startFunctions } from './start-functions'

const app = express()
const port = Number(process.env.API_PORT || 8787)
const appUrl = process.env.APP_URL || 'http://127.0.0.1:5173'
const isProd = process.env.NODE_ENV === 'production'
const authRateLimitWindowMs = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000)
const authRateLimitMax = Number(process.env.AUTH_RATE_LIMIT_MAX || 30)
const aiRateLimitWindowMs = Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 5 * 60 * 1000)
const aiRateLimitMax = Number(process.env.AI_RATE_LIMIT_MAX || 50)

const allowedOrigins = new Set([appUrl, 'http://127.0.0.1:4173', 'http://localhost:4173', 'http://127.0.0.1:5173', 'http://localhost:5173'])

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  next()
})

function dbRateLimit(options: { bucket: string; windowMs: number; limit: number; message: string }) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = String(req.ip || req.headers['x-forwarded-for'] || 'unknown')
    const identifier = `${ip}:${req.path}`
    const nowMs = Date.now()
    const cutoffMs = nowMs - options.windowMs
    const cutoff = new Date(cutoffMs)

    try {
      await db
        .delete(rateLimitEvents)
        .where(and(eq(rateLimitEvents.bucket, options.bucket), lt(rateLimitEvents.createdAt, cutoff)))
        .catch(() => undefined)

      const recent = await db
        .select({ id: rateLimitEvents.id })
        .from(rateLimitEvents)
        .where(
          and(
            eq(rateLimitEvents.bucket, options.bucket),
            eq(rateLimitEvents.identifier, identifier),
            gt(rateLimitEvents.createdAt, cutoff),
          ),
        )

      if (recent.length >= options.limit) {
        return res.status(429).json({ error: options.message })
      }

      await db.insert(rateLimitEvents).values({
        id: randomUUID(),
        bucket: options.bucket,
        identifier,
        createdAt: new Date(nowMs),
      })
    } catch {
      // Fail-open to avoid hard outage if limiter store has transient issues.
    }

    next()
  }
}

const authLimiter = dbRateLimit({
  bucket: 'auth',
  windowMs: authRateLimitWindowMs,
  limit: authRateLimitMax,
  message: 'Too many auth attempts, try again later.',
})

const aiLimiter = dbRateLimit({
  bucket: 'ai',
  windowMs: aiRateLimitWindowMs,
  limit: aiRateLimitMax,
  message: 'AI rate limit exceeded, slow down.',
})

function setSessionCookie(res: express.Response, sessionId: string) {
  res.cookie('vibestack_session_id', sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

function clearSessionCookie(res: express.Response) {
  res.clearCookie('vibestack_session_id', {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
  })
}

function setCsrfCookie(res: express.Response, token: string) {
  res.cookie('vibestack_csrf_token', token, {
    httpOnly: false,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 24 * 60 * 60 * 1000,
  })
}

function verifyCsrf(req: express.Request) {
  const unsafeMethods = new Set(['POST', 'PATCH', 'PUT', 'DELETE'])
  if (!unsafeMethods.has(req.method)) return true
  if (req.path === '/api/csrf') return true

  const cookieToken = String(req.cookies?.vibestack_csrf_token || '')
  const headerToken = String(req.headers['x-csrf-token'] || '')
  return !!cookieToken && cookieToken === headerToken
}

app.use((req, res, next) => {
  if (!verifyCsrf(req)) {
    return res.status(403).json({ error: 'invalid csrf token' })
  }
  next()
})

async function logAudit(actorUserId: string | null, action: string, resourceType: string, resourceId?: string, metadata?: string) {
  await db.insert(auditLogs).values({
    id: randomUUID(),
    actorUserId,
    action,
    resourceType,
    resourceId,
    metadata,
  })
}

function getStartContext(req: express.Request, res: express.Response) {
  const sessionId = String(req.cookies?.vibestack_session_id || '')
  return {
    sessionId,
    effects: {
      setSessionId: (nextSessionId: string) => setSessionCookie(res, nextSessionId),
      clearSessionId: () => clearSessionCookie(res),
      logAudit: async (event: { actorUserId: string | null; action: string; resourceType: string; resourceId?: string; metadata?: string }) => {
        await logAudit(event.actorUserId, event.action, event.resourceType, event.resourceId, event.metadata)
      },
      notifyPolicy: async (
        event: { type: 'ai_prompt_blocked' | 'ai_provider_blocked'; reason: string; metadata: Record<string, unknown> },
        userId: string,
      ) => {
        await notifyPolicyEvent({
          type: event.type,
          userId,
          reason: event.reason,
          metadata: event.metadata,
          at: new Date().toISOString(),
        })
      },
    },
  }
}

function sendStartHttpResult(res: express.Response, result: { status: number; body?: unknown } | undefined) {
  if (!result) {
    res.status(500).json({ error: 'unexpected empty server response' })
    return
  }
  sendHttpResult(res, result)
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/csrf', (_req, res) => {
  const token = randomUUID()
  setCsrfCookie(res, token)
  res.json({ csrfToken: token })
})

app.post('/api/auth/signup', authLimiter, async (req, res) => {
  const result = await startFunctions.auth.signup(req.body ?? {}, getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.post('/api/auth/login', authLimiter, async (req, res) => {
  const result = await startFunctions.auth.login(req.body ?? {}, getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.post('/api/auth/logout', async (req, res) => {
  const result = await startFunctions.auth.logout(getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.get('/api/auth/me', async (req, res) => {
  const result = await startFunctions.auth.me(getStartContext(req, res))
  sendStartHttpResult(res, result)
})


app.get('/api/feature-flags', async (req, res) => {
  const result = await startFunctions.app.featureFlags(getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.get('/api/dashboard', async (req, res) => {
  const result = await startFunctions.app.dashboard(getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.get('/api/user/profile', async (req, res) => {
  const result = await startFunctions.user.profile.get(getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.get('/api/user/activity', async (req, res) => {
  const result = await startFunctions.user.activity.list(getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.patch('/api/user/profile', async (req, res) => {
  const result = await startFunctions.user.profile.update(req.body ?? {}, getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.get('/api/items', async (req, res) => {
  const result = await startFunctions.items.list(getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.post('/api/items', async (req, res) => {
  const result = await startFunctions.items.create(req.body ?? {}, getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.patch('/api/items/:id', async (req, res) => {
  const result = await startFunctions.items.update(req.params.id, req.body ?? {}, getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.delete('/api/items/:id', async (req, res) => {
  const result = await startFunctions.items.remove(req.params.id, getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.get('/api/notes', async (req, res) => {
  const result = await startFunctions.notes.list(getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.post('/api/notes', async (req, res) => {
  const result = await startFunctions.notes.create(req.body ?? {}, getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.patch('/api/notes/:id', async (req, res) => {
  const result = await startFunctions.notes.update(req.params.id, req.body ?? {}, getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.delete('/api/notes/:id', async (req, res) => {
  const result = await startFunctions.notes.remove(req.params.id, getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.get('/api/admin/users', async (req, res) => {
  const result = await startFunctions.admin.users.list(getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.patch('/api/admin/users/:id/role', async (req, res) => {
  const result = await startFunctions.admin.users.changeRole(req.params.id, req.body?.role, getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.get('/api/admin/audit-logs', async (req, res) => {
  const result = await startFunctions.admin.auditLogs.list(getStartContext(req, res))
  sendStartHttpResult(res, result)
})


app.get('/api/admin/feature-flags', async (req, res) => {
  const result = await startFunctions.admin.config.listFeatureFlags(getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.patch('/api/admin/feature-flags/:key', async (req, res) => {
  const key = req.params.key
  const enabled = Boolean(req.body?.enabled)
  const result = await startFunctions.admin.config.updateFeatureFlag(key, enabled, getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.get('/api/admin/settings', async (req, res) => {
  const result = await startFunctions.admin.config.listSettings(getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.patch('/api/admin/settings/:key', async (req, res) => {
  const key = req.params.key
  const value = String(req.body?.value ?? '')
  const result = await startFunctions.admin.config.updateSetting(key, value, getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.get('/api/ai/messages', async (req, res) => {
  const result = await startFunctions.ai.listMessages(getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.get('/api/ai/providers', async (req, res) => {
  const result = await startFunctions.ai.providers(getStartContext(req, res))
  sendStartHttpResult(res, result)
})

app.post('/api/ai/messages', aiLimiter, async (req, res) => {
  const result = await startFunctions.ai.createMessage(req.body ?? {}, getStartContext(req, res))
  sendStartHttpResult(res, result)
})

export function createApiApp() {
  return app
}

export async function startApiServer() {
  await bootstrapDatabase()
  createApiApp().listen(port, () => {
    console.log(`API server running on http://127.0.0.1:${port}`)
  })
}
