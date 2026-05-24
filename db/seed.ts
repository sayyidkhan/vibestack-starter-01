import 'dotenv/config'
import { createClient } from '@libsql/client'
import { randomUUID } from 'node:crypto'
import { drizzle } from 'drizzle-orm/libsql'
import { appSettings, exampleItems, featureFlags, roles, users } from './schema'

function requiredEnv(name: 'DATABASE_URL' | 'DATABASE_AUTH_TOKEN') {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

export async function seed() {
  const client = createClient({
    url: requiredEnv('DATABASE_URL'),
    authToken: requiredEnv('DATABASE_AUTH_TOKEN'),
  })
  const db = drizzle(client)

  const userRoleId = randomUUID()
  const adminRoleId = randomUUID()
  const userId = randomUUID()
  const adminId = randomUUID()

  await db.insert(roles).values([
    { id: userRoleId, name: 'user', description: 'Default member role' },
    { id: adminRoleId, name: 'admin', description: 'Administrator role' },
  ])

  await db.insert(users).values([
    { id: userId, email: 'user@vibestack.dev', name: 'Uma User', roleId: userRoleId },
    { id: adminId, email: 'admin@vibestack.dev', name: 'Avery Admin', roleId: adminRoleId },
  ])

  await db.insert(featureFlags).values([
    { id: randomUUID(), key: 'AI_ASSISTANT', enabled: true, description: 'Enable AI assistant module' },
    { id: randomUUID(), key: 'ADMIN_PANEL', enabled: true, description: 'Enable admin routes' },
    { id: randomUUID(), key: 'AUDIT_LOGS', enabled: true, description: 'Enable audit visibility' },
    { id: randomUUID(), key: 'EXAMPLE_CRUD', enabled: true, description: 'Enable CRUD demo feature' },
    { id: randomUUID(), key: 'USER_SETTINGS', enabled: true, description: 'Enable user settings route' },
  ])

  await db.insert(appSettings).values([
    { id: randomUUID(), key: 'site_name', value: 'VibeStack OS' },
    { id: randomUUID(), key: 'allow_signup', value: 'true' },
  ])

  await db.insert(exampleItems).values([
    {
      id: randomUUID(),
      title: 'Operator playbook draft',
      content: 'Initial system docs and launch checklist',
      status: 'draft',
      ownerUserId: adminId,
    },
    {
      id: randomUUID(),
      title: 'Landing pricing copy v1',
      content: 'First pass pricing structure and value framing',
      status: 'published',
      ownerUserId: userId,
    },
  ])

  console.log('Seed complete')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
