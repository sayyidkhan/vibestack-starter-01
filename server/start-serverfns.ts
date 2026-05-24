import { createServerFn } from '@tanstack/react-start'
import { startFunctions } from './start-functions'

type SessionInput = { sessionId?: string }
type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

function sessionInput(data: SessionInput) {
  return data
}

function toSerializable(result: unknown) {
  return JSON.parse(JSON.stringify(result)) as {
    status: number
    body?: JsonValue
  }
}

export const authMeServerFn = createServerFn({ method: 'POST' })
  .inputValidator(sessionInput)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.auth.me({ sessionId: data.sessionId }))
  })

export const dashboardServerFn = createServerFn({ method: 'POST' })
  .inputValidator(sessionInput)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.app.dashboard({ sessionId: data.sessionId }))
  })

export const featureFlagsServerFn = createServerFn({ method: 'POST' })
  .inputValidator(sessionInput)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.app.featureFlags({ sessionId: data.sessionId }))
  })

export const listNotesServerFn = createServerFn({ method: 'POST' })
  .inputValidator(sessionInput)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.notes.list({ sessionId: data.sessionId }))
  })

export const createNoteServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { sessionId?: string; title?: unknown; body?: unknown; pinned?: unknown }) => data)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.notes.create(
      { title: data.title, body: data.body, pinned: data.pinned },
      { sessionId: data.sessionId },
    ))
  })

export const sendAiPromptServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { sessionId?: string; prompt?: unknown; provider?: unknown }) => data)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.ai.createMessage(
      { prompt: data.prompt, provider: data.provider },
      { sessionId: data.sessionId },
    ))
  })

export const signupServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { name?: unknown; email?: unknown; password?: unknown }) => data)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.auth.signup(data))
  })

export const loginServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { email?: unknown; password?: unknown }) => data)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.auth.login(data))
  })

export const logoutServerFn = createServerFn({ method: 'POST' })
  .inputValidator(sessionInput)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.auth.logout({ sessionId: data.sessionId }))
  })

export const userProfileServerFn = createServerFn({ method: 'POST' })
  .inputValidator(sessionInput)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.user.profile.get({ sessionId: data.sessionId }))
  })

export const userActivityServerFn = createServerFn({ method: 'POST' })
  .inputValidator(sessionInput)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.user.activity.list({ sessionId: data.sessionId }))
  })

export const updateProfileServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { sessionId?: string; name?: unknown; timezone?: unknown; bio?: unknown }) => data)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.user.profile.update(
      { name: data.name, timezone: data.timezone, bio: data.bio },
      { sessionId: data.sessionId },
    ))
  })

export const listItemsServerFn = createServerFn({ method: 'POST' })
  .inputValidator(sessionInput)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.items.list({ sessionId: data.sessionId }))
  })

export const createItemServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { sessionId?: string; title?: unknown }) => data)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.items.create(
      { title: data.title },
      { sessionId: data.sessionId },
    ))
  })

export const updateItemServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { sessionId?: string; itemId: string; title?: unknown; status?: unknown }) => data)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.items.update(
      data.itemId,
      { title: data.title, status: data.status },
      { sessionId: data.sessionId },
    ))
  })

export const deleteItemServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { sessionId?: string; itemId: string }) => data)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.items.remove(data.itemId, { sessionId: data.sessionId }))
  })

export const updateNoteServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { sessionId?: string; noteId: string; title?: unknown; body?: unknown; pinned?: unknown }) => data)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.notes.update(
      data.noteId,
      { title: data.title, body: data.body, pinned: data.pinned },
      { sessionId: data.sessionId },
    ))
  })

export const deleteNoteServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { sessionId?: string; noteId: string }) => data)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.notes.remove(data.noteId, { sessionId: data.sessionId }))
  })

export const aiMessagesServerFn = createServerFn({ method: 'POST' })
  .inputValidator(sessionInput)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.ai.listMessages({ sessionId: data.sessionId }))
  })

export const aiProvidersServerFn = createServerFn({ method: 'POST' })
  .inputValidator(sessionInput)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.ai.providers({ sessionId: data.sessionId }))
  })

export const adminUsersServerFn = createServerFn({ method: 'POST' })
  .inputValidator(sessionInput)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.admin.users.list({ sessionId: data.sessionId }))
  })

export const adminChangeRoleServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { sessionId?: string; targetId: string; roleRaw: unknown }) => data)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.admin.users.changeRole(
      data.targetId,
      data.roleRaw,
      { sessionId: data.sessionId },
    ))
  })

export const adminAuditLogsServerFn = createServerFn({ method: 'POST' })
  .inputValidator(sessionInput)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.admin.auditLogs.list({ sessionId: data.sessionId }))
  })

export const adminFeatureFlagsServerFn = createServerFn({ method: 'POST' })
  .inputValidator(sessionInput)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.admin.config.listFeatureFlags({ sessionId: data.sessionId }))
  })

export const adminUpdateFeatureFlagServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { sessionId?: string; key: string; enabled: boolean }) => data)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.admin.config.updateFeatureFlag(
      data.key,
      data.enabled,
      { sessionId: data.sessionId },
    ))
  })

export const adminSettingsServerFn = createServerFn({ method: 'POST' })
  .inputValidator(sessionInput)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.admin.config.listSettings({ sessionId: data.sessionId }))
  })

export const adminUpdateSettingServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { sessionId?: string; key: string; value: string }) => data)
  .handler(async ({ data }) => {
    return toSerializable(await startFunctions.admin.config.updateSetting(
      data.key,
      data.value,
      { sessionId: data.sessionId },
    ))
  })
