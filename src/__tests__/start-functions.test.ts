import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  return {
    signup: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
    featureFlags: vi.fn(),
    dashboard: vi.fn(),
    notesList: vi.fn(),
    aiCreateMessage: vi.fn(),
    adminUsersList: vi.fn(),
    notesCreate: vi.fn(),
    getSessionUser: vi.fn(),
    isFeatureEnabled: vi.fn(),
    notifyPolicyEvent: vi.fn(),
  }
})

vi.mock('../../server/start-bridge', () => ({
  startBridge: {
    auth: {
      signup: mocks.signup,
      login: mocks.login,
      logout: mocks.logout,
      me: mocks.me,
    },
    system: {
      featureFlags: mocks.featureFlags,
      dashboard: mocks.dashboard,
    },
    notes: {
      list: mocks.notesList,
      create: mocks.notesCreate,
    },
    ai: {
      createMessage: mocks.aiCreateMessage,
    },
    admin: {
      users: {
        list: mocks.adminUsersList,
      },
      auditLogs: {
        list: vi.fn(),
      },
      config: {
        listFeatureFlags: vi.fn(),
        updateFeatureFlag: vi.fn(),
        listSettings: vi.fn(),
        updateSetting: vi.fn(),
      },
    },
  },
}))

vi.mock('../../server/services/auth.service', () => ({
  getSessionUser: mocks.getSessionUser,
}))

vi.mock('../../server/services/feature-flags.service', () => ({
  isFeatureEnabled: mocks.isFeatureEnabled,
}))

vi.mock('../../server/ai/policy', () => ({
  notifyPolicyEvent: mocks.notifyPolicyEvent,
}))

import { startFunctions } from '../../server/start-functions'

describe('startFunctions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 for dashboard when user cannot be resolved', async () => {
    mocks.getSessionUser.mockResolvedValue(null)
    const result = await startFunctions.app.dashboard({ sessionId: 'missing' })
    expect(result).toEqual({ status: 401, body: { error: 'unauthorized' } })
    expect(mocks.dashboard).not.toHaveBeenCalled()
  })

  it('resolves session user and calls dashboard bridge', async () => {
    const user = { userId: 'u1', role: 'user', name: 'User', email: 'u@example.com' }
    mocks.getSessionUser.mockResolvedValue(user)
    mocks.dashboard.mockResolvedValue({ status: 200, body: { metrics: {}, activity: [] } })

    const result = await startFunctions.app.dashboard({ sessionId: 's1' })

    expect(mocks.getSessionUser).toHaveBeenCalledWith('s1')
    expect(mocks.dashboard).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ status: 200, body: { metrics: {}, activity: [] } })
  })

  it('auth login triggers session + audit side effects', async () => {
    const setSessionId = vi.fn()
    const logAudit = vi.fn().mockResolvedValue(undefined)
    mocks.login.mockResolvedValue({
      http: { status: 200, body: { ok: true } },
      sessionId: 'sess_new',
      audit: {
        actorUserId: 'u1',
        action: 'auth_login',
        resourceType: 'session',
        resourceId: 'sess_new',
      },
    })

    const result = await startFunctions.auth.login(
      { email: 'user@vibestack.dev', password: 'secret' },
      { effects: { setSessionId, logAudit } },
    )

    expect(result).toEqual({ status: 200, body: { ok: true } })
    expect(setSessionId).toHaveBeenCalledWith('sess_new')
    expect(logAudit).toHaveBeenCalledWith({
      actorUserId: 'u1',
      action: 'auth_login',
      resourceType: 'session',
      resourceId: 'sess_new',
    })
  })

  it('ai createMessage enforces feature flag before bridge call', async () => {
    const user = { userId: 'u2', role: 'user', name: 'User', email: 'u2@example.com' }
    mocks.isFeatureEnabled.mockResolvedValue(false)

    const result = await startFunctions.ai.createMessage(
      { prompt: 'hello', provider: 'openai' },
      { user },
    )

    expect(result).toEqual({ status: 403, body: { error: 'AI_ASSISTANT feature is disabled' } })
    expect(mocks.aiCreateMessage).not.toHaveBeenCalled()
  })

  it('ai createMessage emits audit + policy fallback when blocked policy is returned', async () => {
    const user = { userId: 'u3', role: 'user', name: 'User', email: 'u3@example.com' }
    const logAudit = vi.fn().mockResolvedValue(undefined)
    mocks.isFeatureEnabled.mockResolvedValue(true)
    mocks.aiCreateMessage.mockResolvedValue({
      http: { status: 200, body: { id: 'm1' } },
      audit: {
        action: 'ai_message_blocked',
        resourceId: 'm1',
        metadata: { reason: 'prompt blocked' },
      },
      policy: {
        type: 'ai_prompt_blocked',
        reason: 'prompt blocked',
        metadata: { provider: 'openai' },
      },
    })

    const result = await startFunctions.ai.createMessage(
      { prompt: 'test', provider: 'openai' },
      { user, effects: { logAudit } },
    )

    expect(result).toEqual({ status: 200, body: { id: 'm1' } })
    expect(logAudit).toHaveBeenCalledWith({
      actorUserId: 'u3',
      action: 'ai_message_blocked',
      resourceType: 'ai_message',
      resourceId: 'm1',
      metadata: JSON.stringify({ reason: 'prompt blocked' }),
    })
    expect(mocks.notifyPolicyEvent).toHaveBeenCalledTimes(1)
    expect(mocks.notifyPolicyEvent.mock.calls[0][0]).toMatchObject({
      type: 'ai_prompt_blocked',
      userId: 'u3',
      reason: 'prompt blocked',
      metadata: { provider: 'openai' },
    })
  })

  it('admin users list rejects non-admin user', async () => {
    const result = await startFunctions.admin.users.list({
      user: { userId: 'u4', role: 'user', name: 'User', email: 'u4@example.com' },
    })
    expect(result).toEqual({ status: 403, body: { error: 'forbidden' } })
    expect(mocks.adminUsersList).not.toHaveBeenCalled()
  })

  it('notes create emits audit effect on success', async () => {
    const logAudit = vi.fn().mockResolvedValue(undefined)
    mocks.notesCreate.mockResolvedValue({
      status: 201,
      body: { id: 'n1', title: 'Note', body: '', pinned: false },
    })

    const result = await startFunctions.notes.create(
      { title: 'Note' },
      {
        user: { userId: 'u5', role: 'user', name: 'User', email: 'u5@example.com' },
        effects: { logAudit },
      },
    )

    expect(result).toEqual({
      status: 201,
      body: { id: 'n1', title: 'Note', body: '', pinned: false },
    })
    expect(logAudit).toHaveBeenCalledWith({
      actorUserId: 'u5',
      action: 'create_note',
      resourceType: 'user_note',
      resourceId: 'n1',
    })
  })
})
