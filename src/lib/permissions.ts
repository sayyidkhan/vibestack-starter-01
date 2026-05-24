import type { AppUser, Role } from './types'

export function hasRole(user: AppUser | null, role: Role) {
  return !!user && user.role === role
}

export function isAuthenticated(user: AppUser | null) {
  return !!user
}
