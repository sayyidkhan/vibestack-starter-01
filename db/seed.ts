import 'dotenv/config'
import { createClient } from '@libsql/client'
import { randomUUID } from 'node:crypto'
import { drizzle } from 'drizzle-orm/libsql'
import { demoAccounts, hashDemoPassword } from '../server/lib/password'
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

  await db.insert(roles).values([
    { id: 'role-user', name: 'user', description: 'Default member role' },
    { id: 'role-admin', name: 'admin', description: 'Administrator role' },
  ]).onConflictDoNothing()

  await db.insert(users).values(
    demoAccounts.map((account) => ({
      id: account.id,
      email: account.email,
      name: account.name,
      roleId: account.roleId,
      passwordHash: hashDemoPassword(account.password),
    })),
  ).onConflictDoNothing()

  const userId = 'demo-user'
  const adminId = 'demo-admin'

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
