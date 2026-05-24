import { afterEach, describe, expect, it, vi } from 'vitest'
import { api, resetApiAdapter, setApiAdapter, type ApiAdapter } from '../lib/api'

function createStubAdapter(overrides: Partial<ApiAdapter>): ApiAdapter {
  const fallback = vi.fn(async () => {
    throw new Error('stub method not implemented')
  })

  return {
    signup: overrides.signup ?? (fallback as ApiAdapter['signup']),
    login: overrides.login ?? (fallback as ApiAdapter['login']),
    me: overrides.me ?? (fallback as ApiAdapter['me']),
    logout: overrides.logout ?? (fallback as ApiAdapter['logout']),
    getDashboard: overrides.getDashboard ?? (fallback as ApiAdapter['getDashboard']),
    getProfile: overrides.getProfile ?? (fallback as ApiAdapter['getProfile']),
    getUserActivity: overrides.getUserActivity ?? (fallback as ApiAdapter['getUserActivity']),
    updateProfile: overrides.updateProfile ?? (fallback as ApiAdapter['updateProfile']),
    listFeatureFlags: overrides.listFeatureFlags ?? (fallback as ApiAdapter['listFeatureFlags']),
    listItems: overrides.listItems ?? (fallback as ApiAdapter['listItems']),
    createItem: overrides.createItem ?? (fallback as ApiAdapter['createItem']),
    updateItem: overrides.updateItem ?? (fallback as ApiAdapter['updateItem']),
    deleteItem: overrides.deleteItem ?? (fallback as ApiAdapter['deleteItem']),
    listNotes: overrides.listNotes ?? (fallback as ApiAdapter['listNotes']),
    createNote: overrides.createNote ?? (fallback as ApiAdapter['createNote']),
    updateNote: overrides.updateNote ?? (fallback as ApiAdapter['updateNote']),
    deleteNote: overrides.deleteNote ?? (fallback as ApiAdapter['deleteNote']),
    adminListUsers: overrides.adminListUsers ?? (fallback as ApiAdapter['adminListUsers']),
    adminChangeUserRole: overrides.adminChangeUserRole ?? (fallback as ApiAdapter['adminChangeUserRole']),
    adminListAuditLogs: overrides.adminListAuditLogs ?? (fallback as ApiAdapter['adminListAuditLogs']),
    adminListSettings: overrides.adminListSettings ?? (fallback as ApiAdapter['adminListSettings']),
    adminUpdateSetting: overrides.adminUpdateSetting ?? (fallback as ApiAdapter['adminUpdateSetting']),
    adminListFeatureFlags: overrides.adminListFeatureFlags ?? (fallback as ApiAdapter['adminListFeatureFlags']),
    adminUpdateFeatureFlag: overrides.adminUpdateFeatureFlag ?? (fallback as ApiAdapter['adminUpdateFeatureFlag']),
    listAIMessages: overrides.listAIMessages ?? (fallback as ApiAdapter['listAIMessages']),
    getAIProviders: overrides.getAIProviders ?? (fallback as ApiAdapter['getAIProviders']),
    sendAIPrompt: overrides.sendAIPrompt ?? (fallback as ApiAdapter['sendAIPrompt']),
  }
}

describe('api adapter switching', () => {
  afterEach(() => {
    resetApiAdapter()
  })

  it('delegates through the active adapter', async () => {
    const me = vi.fn(async () => ({ id: 'u1', name: 'User', email: 'u@example.com', role: 'user' as const }))
    setApiAdapter(createStubAdapter({ me }))

    const user = await api.me()
    expect(user).toEqual({ id: 'u1', name: 'User', email: 'u@example.com', role: 'user' })
    expect(me).toHaveBeenCalledTimes(1)
  })
})
