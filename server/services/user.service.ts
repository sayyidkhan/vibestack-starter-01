import { desc, eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { auditLogs, userProfiles, users } from '../../db/schema'
import { db } from '../db'

type SessionUserLike = {
  userId: string
  name: string
  email: string
  role: string
}

export async function getUserProfileBundle(user: SessionUserLike) {
  const profileRow = await db.select().from(userProfiles).where(eq(userProfiles.userId, user.userId))
  return {
    user: { id: user.userId, name: user.name, email: user.email, role: user.role as 'user' | 'admin' },
    profile: profileRow[0] ?? null,
  }
}

export async function listUserActivity(userId: string) {
  const logs = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      resourceType: auditLogs.resourceType,
      createdAt: auditLogs.createdAt,
      resourceId: auditLogs.resourceId,
    })
    .from(auditLogs)
    .where(eq(auditLogs.actorUserId, userId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(12)

  return logs.map((log) => ({
    id: log.id,
    action: `${log.action} (${log.resourceType})`,
    at: log.createdAt,
    resourceId: log.resourceId,
  }))
}

export async function updateUserProfile(input: {
  user: SessionUserLike
  name: string
  timezone: string
  bio: string
}) {
  await db.update(users).set({ name: input.name }).where(eq(users.id, input.user.userId))

  const profile = await db.select().from(userProfiles).where(eq(userProfiles.userId, input.user.userId))
  if (!profile[0]) {
    await db.insert(userProfiles).values({
      id: randomUUID(),
      userId: input.user.userId,
      timezone: input.timezone,
      bio: input.bio,
    })
  } else {
    await db.update(userProfiles).set({ timezone: input.timezone, bio: input.bio }).where(eq(userProfiles.userId, input.user.userId))
  }

  const updatedProfile = await db.select().from(userProfiles).where(eq(userProfiles.userId, input.user.userId))
  return {
    user: { id: input.user.userId, name: input.name, email: input.user.email, role: input.user.role as 'user' | 'admin' },
    profile: updatedProfile[0],
  }
}
