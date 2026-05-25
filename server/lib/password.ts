import { randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'

const DEMO_SALT = 'vibestacksalt'

export function hashDemoPassword(password: string) {
  const key = scryptSync(password, DEMO_SALT, 64).toString('hex')
  return `${DEMO_SALT}:${key}`
}

export function hashPassword(password: string) {
  const salt = randomUUID().replace(/-/g, '')
  const key = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${key}`
}

export function verifyPassword(password: string, stored: string | null) {
  if (!stored) return false
  const [salt, key] = stored.split(':')
  if (!salt || !key) return false
  const next = scryptSync(password, salt, 64)
  const existing = Buffer.from(key, 'hex')
  if (existing.length !== next.length) return false
  return timingSafeEqual(existing, next)
}

export const demoAccounts = [
  {
    id: 'demo-user',
    email: 'user@vibestack.dev',
    name: 'Uma User',
    roleId: 'role-user',
    password: 'user12345',
  },
  {
    id: 'demo-admin',
    email: 'admin@vibestack.dev',
    name: 'Avery Admin',
    roleId: 'role-admin',
    password: 'admin12345',
  },
] as const
