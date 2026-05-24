export type Role = 'user' | 'admin'

export type AppUser = {
  id: string
  name: string
  email: string
  role: Role
}
