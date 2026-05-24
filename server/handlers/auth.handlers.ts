import type { HttpResult } from '../runtime/http'
import {
  getSessionUser,
  issueSession,
  loginWithPassword,
  revokeSession,
  signupWithPassword,
  type SessionUser,
} from '../services/auth.service'

export type SignupHandlerResult = {
  http: HttpResult
  sessionId?: string
  audit?: { actorUserId: string; action: 'signup'; resourceType: 'user'; resourceId: string }
}

export async function signupHandler(input: { body: { name?: unknown; email?: unknown; password?: unknown } }): Promise<SignupHandlerResult> {
  const name = String(input.body?.name || '').trim()
  const email = String(input.body?.email || '').trim().toLowerCase()
  const password = String(input.body?.password || '')

  if (!name || !email || !password || password.length < 8) {
    return { http: { status: 400, body: { error: 'name, email, and password(min 8 chars) required' } } }
  }

  const result = await signupWithPassword({ name, email, password })
  if ('error' in result) {
    if (result.error === 'signup disabled') return { http: { status: 403, body: { error: result.error } } }
    if (result.error === 'email already exists') return { http: { status: 409, body: { error: result.error } } }
    return { http: { status: 500, body: { error: result.error } } }
  }

  const sessionId = await issueSession(result.user.id)
  return {
    http: { status: 201, body: { user: result.user } },
    sessionId,
    audit: { actorUserId: result.user.id, action: 'signup', resourceType: 'user', resourceId: result.user.id },
  }
}

export type LoginHandlerResult = {
  http: HttpResult
  sessionId?: string
  audit?: { actorUserId: string; action: 'login'; resourceType: 'session'; resourceId: string }
}

export async function loginHandler(input: { body: { email?: unknown; password?: unknown } }): Promise<LoginHandlerResult> {
  const email = String(input.body?.email || '').trim().toLowerCase()
  const password = String(input.body?.password || '')
  if (!email || !password) return { http: { status: 400, body: { error: 'email and password required' } } }

  const user = await loginWithPassword({ email, password })
  if (!user) return { http: { status: 401, body: { error: 'invalid credentials' } } }

  const sessionId = await issueSession(user.id)
  return {
    http: { status: 200, body: { user } },
    sessionId,
    audit: { actorUserId: user.id, action: 'login', resourceType: 'session', resourceId: sessionId },
  }
}

export type LogoutHandlerResult = {
  http: HttpResult
  clearSessionCookie: boolean
  audit?: { actorUserId: string | null; action: 'logout'; resourceType: 'session'; resourceId: string }
}

export async function logoutHandler(input: { sessionId: string }): Promise<LogoutHandlerResult> {
  if (!input.sessionId) {
    return { http: { status: 204 }, clearSessionCookie: true }
  }

  const user = await getSessionUser(input.sessionId)
  await revokeSession(input.sessionId)
  return {
    http: { status: 204 },
    clearSessionCookie: true,
    audit: { actorUserId: user?.userId ?? null, action: 'logout', resourceType: 'session', resourceId: input.sessionId },
  }
}

export async function meHandler(input: { user: SessionUser }): Promise<HttpResult> {
  return {
    status: 200,
    body: {
      user: { id: input.user.userId, name: input.user.name, email: input.user.email, role: input.user.role as 'user' | 'admin' },
    },
  }
}
