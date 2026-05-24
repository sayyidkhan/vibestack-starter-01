import { desc, eq } from 'drizzle-orm'
import { appSettings, auditLogs, featureFlags, roles, users } from '../../db/schema'
import { db } from '../db'

export async function listAdminUsers() {
  const allUsers = await db
    .select({ id: users.id, name: users.name, email: users.email, role: roles.name })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .orderBy(desc(users.createdAt))

  return allUsers.map((user) => ({ ...user, role: user.role as 'user' | 'admin', status: 'active' as const }))
}

export async function changeUserRole(input: { targetId: string; nextRole: 'user' | 'admin' }) {
  const roleRow = await db.select().from(roles).where(eq(roles.name, input.nextRole))
  const roleId = roleRow[0]?.id
  if (!roleId) return null

  await db.update(users).set({ roleId }).where(eq(users.id, input.targetId))
  const updated = await db
    .select({ id: users.id, name: users.name, email: users.email, role: roles.name })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, input.targetId))

  if (!updated[0]) return undefined
  return { ...updated[0], role: updated[0].role as 'user' | 'admin', status: 'active' as const }
}

export async function listAdminAuditLogs() {
  const logs = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      resourceType: auditLogs.resourceType,
      resourceId: auditLogs.resourceId,
      metadata: auditLogs.metadata,
      createdAt: auditLogs.createdAt,
      actorName: users.name,
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.actorUserId, users.id))
    .orderBy(desc(auditLogs.createdAt))

  return logs.map((log) => ({
    id: log.id,
    actor: log.actorName ?? 'System',
    action: `${log.action} (${log.resourceType})`,
    at: log.createdAt,
    metadata: log.metadata,
    resourceId: log.resourceId,
  }))
}

export async function listAdminFeatureFlags() {
  const flags = await db.select().from(featureFlags)
  return flags.map((flag) => ({ key: flag.key, enabled: Boolean(flag.enabled), description: flag.description }))
}

export async function updateAdminFeatureFlag(input: { key: string; enabled: boolean }) {
  await db.update(featureFlags).set({ enabled: input.enabled }).where(eq(featureFlags.key, input.key))
  const updated = await db.select().from(featureFlags).where(eq(featureFlags.key, input.key))
  if (!updated[0]) return null
  return { key: updated[0].key, enabled: Boolean(updated[0].enabled), description: updated[0].description, id: updated[0].id }
}

export async function listAdminSettings() {
  return db.select().from(appSettings)
}

export async function updateAdminSetting(input: { key: string; value: string }) {
  await db.update(appSettings).set({ value: input.value }).where(eq(appSettings.key, input.key))
  const updated = await db.select().from(appSettings).where(eq(appSettings.key, input.key))
  return updated[0] ?? null
}
