import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../lib/auth'
import { api } from '../lib/api'

export type ExampleItem = {
  id: string
  title: string
  status: 'draft' | 'published'
  createdAt: string
}

type AppState = {
  items: ExampleItem[]
  loadingItems: boolean
  apiAvailable: boolean
  createItem: (title: string) => Promise<void>
  renameItem: (id: string, title: string) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  togglePublish: (id: string) => Promise<void>
  refreshItems: () => Promise<void>
}

const AppStateContext = createContext<AppState | undefined>(undefined)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const { user, loadingAuth } = useAuth()
  const [items, setItems] = useState<ExampleItem[]>([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [apiAvailable, setApiAvailable] = useState(true)

  const refreshItems = useCallback(async () => {
    if (!user) {
      setItems([])
      setLoadingItems(false)
      return
    }

    setLoadingItems(true)
    try {
      const next = await api.listItems()
      setItems(next)
      setApiAvailable(true)
    } catch {
      setItems([])
      setApiAvailable(false)
    } finally {
      setLoadingItems(false)
    }
  }, [user])

  useEffect(() => {
    if (loadingAuth) return
    void refreshItems()
  }, [loadingAuth, refreshItems])

  const value = useMemo<AppState>(
    () => ({
      items,
      loadingItems,
      apiAvailable,
      refreshItems,
      createItem: async (title: string) => {
        const next = title.trim()
        if (!next || !apiAvailable || !user) return
        const created = await api.createItem(next)
        setItems((prev) => [created, ...prev])
      },
      renameItem: async (id: string, title: string) => {
        const next = title.trim()
        if (!next || !apiAvailable || !user) return
        const updated = await api.updateItem(id, { title: next })
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
      },
      deleteItem: async (id: string) => {
        if (!apiAvailable || !user) return
        await api.deleteItem(id)
        setItems((prev) => prev.filter((item) => item.id !== id))
      },
      togglePublish: async (id: string) => {
        if (!apiAvailable || !user) return
        const current = items.find((item) => item.id === id)
        if (!current) return
        const updated = await api.updateItem(id, {
          status: current.status === 'draft' ? 'published' : 'draft',
        })
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
      },
    }),
    [items, loadingItems, apiAvailable, user, refreshItems],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) throw new Error('useAppState must be used within AppStateProvider')
  return context
}
