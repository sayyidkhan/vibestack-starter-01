import {
  listAdminFeatureFlagsHandler,
  listAdminSettingsHandler,
  updateAdminFeatureFlagHandler,
  updateAdminSettingHandler,
} from './handlers/admin-config.handlers'
import { changeAdminUserRoleHandler, listAdminAuditLogsHandler, listAdminUsersHandler } from './handlers/admin-core.handlers'
import { createAIMessageHandler, getAIProvidersHandler, listAIMessagesHandler } from './handlers/ai.handlers'
import { loginHandler, logoutHandler, meHandler, signupHandler } from './handlers/auth.handlers'
import { getDashboardHandler } from './handlers/dashboard.handlers'
import { listFeatureFlagsHandler } from './handlers/feature-flags.handlers'
import { createItemHandler, deleteItemHandler, listItemsHandler, updateItemHandler } from './handlers/items.handlers'
import { createNoteHandler, deleteNoteHandler, listNotesHandler, updateNoteHandler } from './handlers/notes.handlers'
import { getUserProfileHandler, listUserActivityHandler, updateUserProfileHandler } from './handlers/user.handlers'
import type { SessionUser } from './services/auth.service'

type SessionContext = {
  user: SessionUser
}

export const startBridge = {
  auth: {
    signup: signupHandler,
    login: loginHandler,
    logout: logoutHandler,
    me: meHandler,
  },
  system: {
    dashboard: getDashboardHandler,
    featureFlags: listFeatureFlagsHandler,
  },
  user: {
    profile: {
      get: (ctx: SessionContext) => getUserProfileHandler({ user: ctx.user }),
      update: (ctx: SessionContext, body: { name?: unknown; timezone?: unknown; bio?: unknown }) =>
        updateUserProfileHandler({ user: ctx.user, body }),
    },
    activity: {
      list: (ctx: SessionContext) => listUserActivityHandler({ user: ctx.user }),
    },
  },
  items: {
    list: () => listItemsHandler(),
    create: (ctx: SessionContext, body: { title?: unknown }) => createItemHandler({ user: ctx.user, body }),
    update: (ctx: SessionContext, itemId: string, body: { title?: unknown; status?: unknown }) =>
      updateItemHandler({ user: ctx.user, itemId, body }),
    remove: (ctx: SessionContext, itemId: string) => deleteItemHandler({ user: ctx.user, itemId }),
  },
  notes: {
    list: (ctx: SessionContext) => listNotesHandler({ user: ctx.user }),
    create: (ctx: SessionContext, body: { title?: unknown; body?: unknown; pinned?: unknown }) =>
      createNoteHandler({ user: ctx.user, body }),
    update: (ctx: SessionContext, noteId: string, body: { title?: unknown; body?: unknown; pinned?: unknown }) =>
      updateNoteHandler({ user: ctx.user, noteId, body }),
    remove: (ctx: SessionContext, noteId: string) => deleteNoteHandler({ user: ctx.user, noteId }),
  },
  ai: {
    listMessages: (ctx: SessionContext) => listAIMessagesHandler({ user: ctx.user }),
    providers: getAIProvidersHandler,
    createMessage: (ctx: SessionContext, body: { prompt?: unknown; provider?: unknown }) =>
      createAIMessageHandler({ user: ctx.user, body }),
  },
  admin: {
    users: {
      list: listAdminUsersHandler,
      changeRole: (targetId: string, roleRaw: unknown) => changeAdminUserRoleHandler({ targetId, roleRaw }),
    },
    auditLogs: {
      list: listAdminAuditLogsHandler,
    },
    config: {
      listFeatureFlags: listAdminFeatureFlagsHandler,
      updateFeatureFlag: (key: string, enabled: boolean) => updateAdminFeatureFlagHandler({ key, enabled }),
      listSettings: listAdminSettingsHandler,
      updateSetting: (key: string, value: string) => updateAdminSettingHandler({ key, value }),
    },
  },
} as const
