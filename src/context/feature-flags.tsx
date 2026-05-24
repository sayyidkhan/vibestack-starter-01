import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../lib/auth'
import { api } from '../lib/api'

type FlagKey = 'AI_ASSISTANT' | 'ADMIN_PANEL' | 'AUDIT_LOGS' | 'EXAMPLE_CRUD' | 'USER_SETTINGS'

const DEFAULT_FLAGS: Record<FlagKey, boolean> = {
  AI_ASSISTANT: true,
  ADMIN_PANEL: true,
  AUDIT_LOGS: true,
  EXAMPLE_CRUD: true,
  USER_SETTINGS: true,
}

type FeatureFlagsContextValue = {
  loadingFlags: boolean
  isEnabled: (key: FlagKey) => boolean
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | undefined>(undefined)

export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const { user, loadingAuth } = useAuth()
  const [flags, setFlags] = useState<Record<FlagKey, boolean>>(DEFAULT_FLAGS)
  const [loadingFlags, setLoadingFlags] = useState(true)

  useEffect(() => {
    if (loadingAuth) return
    if (!user) {
      setFlags(DEFAULT_FLAGS)
      setLoadingFlags(false)
      return
    }

    setLoadingFlags(true)
    api
      .listFeatureFlags()
      .then((nextFlags) => {
        const mapped = { ...DEFAULT_FLAGS }
        for (const flag of nextFlags) {
          if (flag.key in mapped) {
            mapped[flag.key as FlagKey] = flag.enabled
          }
        }
        setFlags(mapped)
      })
      .catch(() => setFlags(DEFAULT_FLAGS))
      .finally(() => setLoadingFlags(false))
  }, [loadingAuth, user])

  const value = useMemo<FeatureFlagsContextValue>(
    () => ({
      loadingFlags,
      isEnabled: (key: FlagKey) => flags[key],
    }),
    [flags, loadingFlags],
  )

  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext)
  if (!context) throw new Error('useFeatureFlags must be used within FeatureFlagsProvider')
  return context
}
