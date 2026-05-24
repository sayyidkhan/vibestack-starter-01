import type { ExampleItem } from '../context/app-state'
import type { AppUser, Role } from './types'

const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787'

export type AdminUser = {
  id: string
  name: string
  email: string
  role: Role
  status: 'active' | 'invited'
}

export type AuditLog = {
  id: string
  actor: string
  action: string
  at: string
  metadata: string | null
  resourceId: string | null
}

export type AppSetting = {
  id: string
  key: string
  value: string
  updatedAt: string
}

export type FeatureFlag = {
  key: string
  enabled: boolean
  description: string | null
}

export type UserProfile = {
  id: string
  userId: string
  bio: string | null
  avatarUrl: string | null
  timezone: string | null
  createdAt: string
}

export type UserActivityItem = {
  id: string
  action: string
  at: string
  resourceId: string | null
}

export type UserNote = {
  id: string
  userId: string
  title: string
  body: string
  pinned: boolean
  createdAt: string
  updatedAt: string
}

export type DashboardData = {
  metrics: { activeUsers: number; publishedItems: number; draftItems: number }
  activity: Array<{ id: string; action: string; at: string }>
}

export type AIProviderInfo = {
  defaultProvider: 'openai' | 'anthropic' | 'gemini' | 'local'
  promptMaxChars: number
  models: { openai: string; anthropic: string; gemini: string }
  moderation: { enabled: boolean; blockedCategories: string[] }
  providers: Array<{ key: 'openai' | 'anthropic' | 'gemini' | 'local'; configured: boolean; allowed: boolean }>
}

export type ApiAdapter = {
  signup: (name: string, email: string, password: string) => Promise<AppUser>
  login: (email: string, password: string) => Promise<AppUser>
  me: () => Promise<AppUser>
  logout: () => Promise<void>
  getDashboard: () => Promise<DashboardData>
  getProfile: () => Promise<{ user: AppUser; profile: UserProfile | null }>
  getUserActivity: () => Promise<UserActivityItem[]>
  updateProfile: (payload: { name: string; timezone: string; bio: string }) => Promise<{ user: AppUser; profile: UserProfile }>
  listFeatureFlags: () => Promise<FeatureFlag[]>
  listItems: () => Promise<ExampleItem[]>
  createItem: (title: string) => Promise<ExampleItem>
  updateItem: (id: string, updates: Partial<Pick<ExampleItem, 'title' | 'status'>>) => Promise<ExampleItem>
  deleteItem: (id: string) => Promise<void>
  listNotes: () => Promise<UserNote[]>
  createNote: (payload: { title: string; body?: string; pinned?: boolean }) => Promise<UserNote>
  updateNote: (id: string, updates: Partial<Pick<UserNote, 'title' | 'body' | 'pinned'>>) => Promise<UserNote>
  deleteNote: (id: string) => Promise<void>
  adminListUsers: () => Promise<AdminUser[]>
  adminChangeUserRole: (id: string, role: Role) => Promise<AdminUser>
  adminListAuditLogs: () => Promise<AuditLog[]>
  adminListSettings: () => Promise<AppSetting[]>
  adminUpdateSetting: (key: string, value: string) => Promise<AppSetting>
  adminListFeatureFlags: () => Promise<FeatureFlag[]>
  adminUpdateFeatureFlag: (key: string, enabled: boolean) => Promise<FeatureFlag>
  listAIMessages: () => Promise<Array<{ id: string; prompt: string; response: string; provider: string; createdAt: string }>>
  getAIProviders: () => Promise<AIProviderInfo>
  sendAIPrompt: (prompt: string, provider: string) => Promise<{ id: string; prompt: string; response: string; provider: string; createdAt: string }>
}

function createHttpAdapter(url: string): ApiAdapter {
  let csrfToken: string | null = null

  async function getCsrfToken() {
    const response = await fetch(`${url}/api/csrf`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) throw new Error('Unable to fetch csrf token')
    const payload = (await response.json()) as { csrfToken: string }
    csrfToken = payload.csrfToken
  }

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const method = (init?.method || 'GET').toUpperCase()
    const isUnsafe = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)

    if (isUnsafe && !csrfToken) {
      await getCsrfToken()
    }

    const response = await fetch(`${url}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && isUnsafe ? { 'x-csrf-token': csrfToken } : {}),
        ...(init?.headers || {}),
      },
      ...init,
    })

    if (!response.ok) {
      const contentType = response.headers.get('content-type') || ''
      const payloadText = await (async () => {
        try {
          if (contentType.includes('application/json')) {
            const payloadJson = (await response.json()) as { error?: string }
            return payloadJson.error || JSON.stringify(payloadJson)
          }
          return await response.text()
        } catch {
          return await response.text().catch(() => '')
        }
      })()
      if (response.status === 403 && payloadText.includes('invalid csrf token')) {
        csrfToken = null
      }
      throw new Error(payloadText || `Request failed with ${response.status}`)
    }

    if (response.status === 204) return undefined as T
    return response.json() as Promise<T>
  }

  return {
    signup: async (name: string, email: string, password: string) => {
      const result = await request<{ user: AppUser }>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })
      return result.user
    },
    login: async (email: string, password: string) => {
      const result = await request<{ user: AppUser }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      return result.user
    },
    me: async () => {
      const result = await request<{ user: AppUser }>('/api/auth/me')
      return result.user
    },
    logout: async () => {
      await request<void>('/api/auth/logout', { method: 'POST' })
    },
    getDashboard: async () => request<DashboardData>('/api/dashboard'),
    getProfile: async () => request<{ user: AppUser; profile: UserProfile | null }>('/api/user/profile'),
    getUserActivity: async () => request<UserActivityItem[]>('/api/user/activity'),
    updateProfile: async (payload: { name: string; timezone: string; bio: string }) =>
      request<{ user: AppUser; profile: UserProfile }>('/api/user/profile', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    listFeatureFlags: async () => request<FeatureFlag[]>('/api/feature-flags'),
    listItems: () => request<ExampleItem[]>('/api/items'),
    createItem: (title: string) => request<ExampleItem>('/api/items', { method: 'POST', body: JSON.stringify({ title }) }),
    updateItem: (id: string, updates: Partial<Pick<ExampleItem, 'title' | 'status'>>) =>
      request<ExampleItem>(`/api/items/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
    deleteItem: (id: string) => request<void>(`/api/items/${id}`, { method: 'DELETE' }),
    listNotes: () => request<UserNote[]>('/api/notes'),
    createNote: (payload: { title: string; body?: string; pinned?: boolean }) =>
      request<UserNote>('/api/notes', { method: 'POST', body: JSON.stringify(payload) }),
    updateNote: (id: string, updates: Partial<Pick<UserNote, 'title' | 'body' | 'pinned'>>) =>
      request<UserNote>(`/api/notes/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
    deleteNote: (id: string) => request<void>(`/api/notes/${id}`, { method: 'DELETE' }),
    adminListUsers: () => request<AdminUser[]>('/api/admin/users'),
    adminChangeUserRole: (id: string, role: Role) =>
      request<AdminUser>(`/api/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
    adminListAuditLogs: () => request<AuditLog[]>('/api/admin/audit-logs'),
    adminListSettings: () => request<AppSetting[]>('/api/admin/settings'),
    adminUpdateSetting: (key: string, value: string) =>
      request<AppSetting>(`/api/admin/settings/${key}`, { method: 'PATCH', body: JSON.stringify({ value }) }),
    adminListFeatureFlags: () => request<FeatureFlag[]>('/api/admin/feature-flags'),
    adminUpdateFeatureFlag: (key: string, enabled: boolean) =>
      request<FeatureFlag>(`/api/admin/feature-flags/${key}`, { method: 'PATCH', body: JSON.stringify({ enabled }) }),
    listAIMessages: () => request<Array<{ id: string; prompt: string; response: string; provider: string; createdAt: string }>>('/api/ai/messages'),
    getAIProviders: () => request<AIProviderInfo>('/api/ai/providers'),
    sendAIPrompt: (prompt: string, provider: string) =>
      request<{ id: string; prompt: string; response: string; provider: string; createdAt: string }>('/api/ai/messages', {
        method: 'POST',
        body: JSON.stringify({ prompt, provider }),
      }),
  }
}

const httpAdapter = createHttpAdapter(baseUrl)
let activeAdapter: ApiAdapter = httpAdapter

export function setApiAdapter(nextAdapter: ApiAdapter) {
  activeAdapter = nextAdapter
}

export function resetApiAdapter() {
  activeAdapter = httpAdapter
}

export const api: ApiAdapter = {
  signup: (name: string, email: string, password: string) => activeAdapter.signup(name, email, password),
  login: (email: string, password: string) => activeAdapter.login(email, password),
  me: () => activeAdapter.me(),
  logout: () => activeAdapter.logout(),
  getDashboard: () => activeAdapter.getDashboard(),
  getProfile: () => activeAdapter.getProfile(),
  getUserActivity: () => activeAdapter.getUserActivity(),
  updateProfile: (payload: { name: string; timezone: string; bio: string }) => activeAdapter.updateProfile(payload),
  listFeatureFlags: () => activeAdapter.listFeatureFlags(),
  listItems: () => activeAdapter.listItems(),
  createItem: (title: string) => activeAdapter.createItem(title),
  updateItem: (id: string, updates: Partial<Pick<ExampleItem, 'title' | 'status'>>) => activeAdapter.updateItem(id, updates),
  deleteItem: (id: string) => activeAdapter.deleteItem(id),
  listNotes: () => activeAdapter.listNotes(),
  createNote: (payload: { title: string; body?: string; pinned?: boolean }) => activeAdapter.createNote(payload),
  updateNote: (id: string, updates: Partial<Pick<UserNote, 'title' | 'body' | 'pinned'>>) => activeAdapter.updateNote(id, updates),
  deleteNote: (id: string) => activeAdapter.deleteNote(id),
  adminListUsers: () => activeAdapter.adminListUsers(),
  adminChangeUserRole: (id: string, role: Role) => activeAdapter.adminChangeUserRole(id, role),
  adminListAuditLogs: () => activeAdapter.adminListAuditLogs(),
  adminListSettings: () => activeAdapter.adminListSettings(),
  adminUpdateSetting: (key: string, value: string) => activeAdapter.adminUpdateSetting(key, value),
  adminListFeatureFlags: () => activeAdapter.adminListFeatureFlags(),
  adminUpdateFeatureFlag: (key: string, enabled: boolean) => activeAdapter.adminUpdateFeatureFlag(key, enabled),
  listAIMessages: () => activeAdapter.listAIMessages(),
  getAIProviders: () => activeAdapter.getAIProviders(),
  sendAIPrompt: (prompt: string, provider: string) => activeAdapter.sendAIPrompt(prompt, provider),
}
