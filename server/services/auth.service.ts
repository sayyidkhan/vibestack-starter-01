import { and, eq, gt } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { appSettings, roles, sessions, users } from '../../db/schema'
import { db } from '../db'
import { hashPassword, verifyPassword } from '../lib/password'

export type SessionUser = {
  userId: string
  name: string
  email: string
  role: string
}

export async function getSessionUser(sessionId: string | undefined): Promise<SessionUser | null> {
  if (!sessionId) return null
  const now = new Date()
  const result = await db
    .select({ userId: users.id, name: users.name, email: users.email, role: roles.name })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, now)))

  return result[0] ?? null
}

export async function issueSession(userId: string) {
  const sessionId = randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await db.insert(sessions).values({ id: sessionId, userId, expiresAt })
  return sessionId
}

export async function revokeSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId))
}

export async function signupWithPassword(input: { name: string; email: string; password: string }) {
  const allowSignupSetting = await db.select().from(appSettings).where(eq(appSettings.key, 'allow_signup'))
  if (allowSignupSetting[0]?.value !== 'true') return { error: 'signup disabled' as const }

  const existing = await db.select().from(users).where(eq(users.email, input.email))
  if (existing[0]) return { error: 'email already exists' as const }

  const roleRows = await db.select().from(roles).where(eq(roles.name, 'user'))
  const roleId = roleRows[0]?.id
  if (!roleId) return { error: 'user role missing' as const }

  const userId = randomUUID()
  await db.insert(users).values({
    id: userId,
    email: input.email,
    name: input.name,
    roleId,
    passwordHash: hashPassword(input.password),
  })

  return {
    user: { id: userId, name: input.name, email: input.email, role: 'user' as const },
  }
}

export async function loginWithPassword(input: { email: string; password: string }) {
  const result = await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      role: roles.name,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.email, input.email))

  const user = result[0]
  if (!user || !verifyPassword(input.password, user.passwordHash)) return null

  return { id: user.userId, name: user.name, email: user.email, role: user.role as 'user' | 'admin' }
}
