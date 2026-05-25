import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { client } from './db'
import { demoAccounts, hashDemoPassword } from './lib/password'

async function ensureDemoAccount(account: (typeof demoAccounts)[number]) {
  const passwordHash = hashDemoPassword(account.password)
  const existing = await client.execute({
    sql: 'SELECT id FROM users WHERE email = ? LIMIT 1',
    args: [account.email],
  })

  if (existing.rows[0]) {
    await client.execute({
      sql: 'UPDATE users SET name = ?, role_id = ?, password_hash = ? WHERE email = ?',
      args: [account.name, account.roleId, passwordHash, account.email],
    })
    return
  }

  await client.execute({
    sql: 'INSERT INTO users (id, email, name, role_id, password_hash) VALUES (?, ?, ?, ?, ?)',
    args: [account.id, account.email, account.name, account.roleId, passwordHash],
  })
}

export async function bootstrapDatabase() {
  const migrationPath = resolve(process.cwd(), 'db/migrations/0001_init.sql')
  const sql = await readFile(migrationPath, 'utf8')
  const statements = sql
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean)

  for (const statement of statements) {
    await client.execute(statement)
  }

  await client.execute('ALTER TABLE users ADD COLUMN password_hash TEXT').catch(() => undefined)
  await client
    .execute(
      'CREATE TABLE IF NOT EXISTS rate_limit_events (id TEXT PRIMARY KEY NOT NULL, bucket TEXT NOT NULL, identifier TEXT NOT NULL, created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP)',
    )
    .catch(() => undefined)

  await client.execute("INSERT OR IGNORE INTO roles (id, name, description) VALUES ('role-user','user','Default user role')")
  await client.execute("INSERT OR IGNORE INTO roles (id, name, description) VALUES ('role-admin','admin','Admin role')")

  for (const account of demoAccounts) {
    await ensureDemoAccount(account)
  }

  await client.execute("INSERT OR IGNORE INTO app_settings (id, key, value) VALUES ('setting-allow-signup','allow_signup','true')")
  await client.execute("INSERT OR IGNORE INTO app_settings (id, key, value) VALUES ('setting-ai-enabled','ai_enabled','true')")

  await client.execute("INSERT OR IGNORE INTO feature_flags (id, key, enabled, description) VALUES ('flag-ai-assistant','AI_ASSISTANT',1,'Enable AI assistant module')")
  await client.execute("INSERT OR IGNORE INTO feature_flags (id, key, enabled, description) VALUES ('flag-admin-panel','ADMIN_PANEL',1,'Enable admin routes')")
  await client.execute("INSERT OR IGNORE INTO feature_flags (id, key, enabled, description) VALUES ('flag-audit-logs','AUDIT_LOGS',1,'Enable audit logs')")
  await client.execute("INSERT OR IGNORE INTO feature_flags (id, key, enabled, description) VALUES ('flag-example-crud','EXAMPLE_CRUD',1,'Enable CRUD demo')")
  await client.execute("INSERT OR IGNORE INTO feature_flags (id, key, enabled, description) VALUES ('flag-user-settings','USER_SETTINGS',1,'Enable user settings')")

  await client.execute("UPDATE app_settings SET value = 'true' WHERE key = 'allow_signup'")
  await client.execute("UPDATE app_settings SET value = 'true' WHERE key = 'ai_enabled'")
}
