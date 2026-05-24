import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from './api'
import type { AppUser } from './types'

type AuthContextValue = {
  user: AppUser | null
  loadingAuth: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const me = await api.me()
        setUser(me)
      } catch {
        setUser(null)
      } finally {
        setLoadingAuth(false)
      }
    }

    void load()
  }, [])

  const value = useMemo(
    () => ({
      user,
      loadingAuth,
      login: async (email: string, password: string) => {
        const next = await api.login(email, password)
        setUser(next)
      },
      signup: async (name: string, email: string, password: string) => {
        const next = await api.signup(name, email, password)
        setUser(next)
      },
      logout: async () => {
        await api.logout()
        setUser(null)
      },
    }),
    [user, loadingAuth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
