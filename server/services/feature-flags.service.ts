import { eq } from 'drizzle-orm'
import { featureFlags } from '../../db/schema'
import { db } from '../db'

export async function isFeatureEnabled(key: string) {
  const row = await db.select({ enabled: featureFlags.enabled }).from(featureFlags).where(eq(featureFlags.key, key))
  if (!row[0]) return true
  return Boolean(row[0].enabled)
}

export async function listFeatureFlags() {
  const flags = await db.select().from(featureFlags)
  return flags.map((flag) => ({ key: flag.key, enabled: Boolean(flag.enabled), description: flag.description }))
}
