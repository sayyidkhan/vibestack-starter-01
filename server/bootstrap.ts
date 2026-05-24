import { scryptSync } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { client } from './db'

function hashPassword(password: string) {
  const salt = 'vibestacksalt'
  const key = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${key}`
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
  await client.execute(
    "INSERT OR IGNORE INTO users (id, email, name, role_id, password_hash) VALUES ('demo-user','user@vibestack.dev','Uma User','role-user', ?)",
    [hashPassword('user12345')],
  )
  await client.execute(
    "INSERT OR IGNORE INTO users (id, email, name, role_id, password_hash) VALUES ('demo-admin','admin@vibestack.dev','Avery Admin','role-admin', ?)",
    [hashPassword('admin12345')],
  )

  await client.execute("UPDATE users SET password_hash = ? WHERE id = 'demo-user'", [hashPassword('user12345')])
  await client.execute("UPDATE users SET password_hash = ? WHERE id = 'demo-admin'", [hashPassword('admin12345')])
  await client.execute("UPDATE users SET password_hash = ?, role_id = 'role-user' WHERE email = 'user@vibestack.dev'", [hashPassword('user12345')])
  await client.execute("UPDATE users SET password_hash = ?, role_id = 'role-admin' WHERE email = 'admin@vibestack.dev'", [hashPassword('admin12345')])

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
