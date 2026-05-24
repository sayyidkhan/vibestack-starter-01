import { notifyPolicyEvent } from './ai/policy'
import { startBridge } from './start-bridge'
import { getSessionUser, type SessionUser } from './services/auth.service'
import { isFeatureEnabled } from './services/feature-flags.service'

type PolicyEvent = {
  type: 'ai_prompt_blocked' | 'ai_provider_blocked'
  reason: string
  metadata: Record<string, unknown>
}

type AuditEvent = {
  actorUserId: string | null
  action: string
  resourceType: string
  resourceId?: string
  metadata?: string
}

export type StartFunctionEffects = {
  setSessionId?: (sessionId: string) => void
  clearSessionId?: () => void
  logAudit?: (event: AuditEvent) => Promise<void>
  notifyPolicy?: (event: PolicyEvent, userId: string) => Promise<void>
}

export type StartFunctionContext = {
  sessionId?: string
  user?: SessionUser
  effects?: StartFunctionEffects
}

async function resolveUser(context: StartFunctionContext) {
  if (context.user) return context.user
  if (!context.sessionId) return null
  return getSessionUser(context.sessionId)
}

async function requireUser(context: StartFunctionContext) {
  const user = await resolveUser(context)
  if (!user) return { error: { status: 401, body: { error: 'unauthorized' } } as const }
  return { user }
}

async function requireFeature(key: string) {
  const enabled = await isFeatureEnabled(key)
  if (!enabled) return { error: { status: 403, body: { error: `${key} feature is disabled` } } as const }
  return { ok: true as const }
}

async function requireAdmin(context: StartFunctionContext) {
  const auth = await requireUser(context)
  if ('error' in auth) return auth
  if (auth.user.role !== 'admin') return { error: { status: 403, body: { error: 'forbidden' } } as const }
  return auth
}

async function emitAudit(effects: StartFunctionEffects | undefined, event: AuditEvent) {
  if (effects?.logAudit) await effects.logAudit(event)
}

async function emitPolicy(effects: StartFunctionEffects | undefined, userId: string, event: PolicyEvent) {
  if (effects?.notifyPolicy) {
    await effects.notifyPolicy(event, userId)
    return
  }
  await notifyPolicyEvent({
    type: event.type,
    userId,
    reason: event.reason,
    metadata: event.metadata,
    at: new Date().toISOString(),
  })
}

export const startFunctions = {
  auth: {
    signup: async (body: { name?: unknown; email?: unknown; password?: unknown }, context: StartFunctionContext = {}) => {
      const result = await startBridge.auth.signup({ body })
      if (result.sessionId && context.effects?.setSessionId) context.effects.setSessionId(result.sessionId)
      if (result.audit) {
        await emitAudit(context.effects, {
          actorUserId: result.audit.actorUserId,
          action: result.audit.action,
          resourceType: result.audit.resourceType,
          resourceId: result.audit.resourceId,
        })
      }
      return result.http
    },
    login: async (body: { email?: unknown; password?: unknown }, context: StartFunctionContext = {}) => {
      const result = await startBridge.auth.login({ body })
      if (result.sessionId && context.effects?.setSessionId) context.effects.setSessionId(result.sessionId)
      if (result.audit) {
        await emitAudit(context.effects, {
          actorUserId: result.audit.actorUserId,
          action: result.audit.action,
          resourceType: result.audit.resourceType,
          resourceId: result.audit.resourceId,
        })
      }
      return result.http
    },
    logout: async (context: StartFunctionContext = {}) => {
      const result = await startBridge.auth.logout({ sessionId: context.sessionId || '' })
      if (result.clearSessionCookie && context.effects?.clearSessionId) context.effects.clearSessionId()
      if (result.audit) {
        await emitAudit(context.effects, {
          actorUserId: result.audit.actorUserId,
          action: result.audit.action,
          resourceType: result.audit.resourceType,
          resourceId: result.audit.resourceId,
        })
      }
      return result.http
    },
    me: async (context: StartFunctionContext = {}) => {
      const auth = await requireUser(context)
      if ('error' in auth) return auth.error
      return startBridge.auth.me({ user: auth.user })
    },
  },
  app: {
    featureFlags: async (context: StartFunctionContext = {}) => {
      const auth = await requireUser(context)
      if ('error' in auth) return auth.error
      return startBridge.system.featureFlags()
    },
    dashboard: async (context: StartFunctionContext = {}) => {
      const auth = await requireUser(context)
      if ('error' in auth) return auth.error
      return startBridge.system.dashboard()
    },
  },
  user: {
    profile: {
      get: async (context: StartFunctionContext = {}) => {
        const auth = await requireUser(context)
        if ('error' in auth) return auth.error
        const feature = await requireFeature('USER_SETTINGS')
        if ('error' in feature) return feature.error
        return startBridge.user.profile.get({ user: auth.user })
      },
      update: async (body: { name?: unknown; timezone?: unknown; bio?: unknown }, context: StartFunctionContext = {}) => {
        const auth = await requireUser(context)
        if ('error' in auth) return auth.error
        const feature = await requireFeature('USER_SETTINGS')
        if ('error' in feature) return feature.error
        const result = await startBridge.user.profile.update({ user: auth.user }, body)
        if (result.audit) {
          await emitAudit(context.effects, {
            actorUserId: auth.user.userId,
            action: result.audit.action,
            resourceType: 'user_profile',
            resourceId: result.audit.resourceId,
          })
        }
        return result.http
      },
    },
    activity: {
      list: async (context: StartFunctionContext = {}) => {
        const auth = await requireUser(context)
        if ('error' in auth) return auth.error
        const feature = await requireFeature('USER_SETTINGS')
        if ('error' in feature) return feature.error
        return startBridge.user.activity.list({ user: auth.user })
      },
    },
  },
  items: {
    list: async (context: StartFunctionContext = {}) => {
      const auth = await requireUser(context)
      if ('error' in auth) return auth.error
      const feature = await requireFeature('EXAMPLE_CRUD')
      if ('error' in feature) return feature.error
      return startBridge.items.list()
    },
    create: async (body: { title?: unknown }, context: StartFunctionContext = {}) => {
      const auth = await requireUser(context)
      if ('error' in auth) return auth.error
      const feature = await requireFeature('EXAMPLE_CRUD')
      if ('error' in feature) return feature.error
      const result = await startBridge.items.create({ user: auth.user }, body)
      if (result.audit) {
        await emitAudit(context.effects, {
          actorUserId: auth.user.userId,
          action: result.audit.action,
          resourceType: 'example_item',
          resourceId: result.audit.resourceId,
        })
      }
      return result.http
    },
    update: async (itemId: string, body: { title?: unknown; status?: unknown }, context: StartFunctionContext = {}) => {
      const auth = await requireUser(context)
      if ('error' in auth) return auth.error
      const feature = await requireFeature('EXAMPLE_CRUD')
      if ('error' in feature) return feature.error
      const result = await startBridge.items.update({ user: auth.user }, itemId, body)
      if (result.audit) {
        await emitAudit(context.effects, {
          actorUserId: auth.user.userId,
          action: result.audit.action,
          resourceType: 'example_item',
          resourceId: result.audit.resourceId,
          metadata: JSON.stringify(result.audit.metadata),
        })
      }
      return result.http
    },
    remove: async (itemId: string, context: StartFunctionContext = {}) => {
      const auth = await requireUser(context)
      if ('error' in auth) return auth.error
      const feature = await requireFeature('EXAMPLE_CRUD')
      if ('error' in feature) return feature.error
      const result = await startBridge.items.remove({ user: auth.user }, itemId)
      if (result.audit) {
        await emitAudit(context.effects, {
          actorUserId: auth.user.userId,
          action: result.audit.action,
          resourceType: 'example_item',
          resourceId: result.audit.resourceId,
        })
      }
      return result.http
    },
  },
  notes: {
    list: async (context: StartFunctionContext = {}) => {
      const auth = await requireUser(context)
      if ('error' in auth) return auth.error
      return startBridge.notes.list({ user: auth.user })
    },
    create: async (body: { title?: unknown; body?: unknown; pinned?: unknown }, context: StartFunctionContext = {}) => {
      const auth = await requireUser(context)
      if ('error' in auth) return auth.error
      const result = await startBridge.notes.create({ user: auth.user }, body)
      if (result.status === 201) {
        const note = result.body as { id: string }
        await emitAudit(context.effects, {
          actorUserId: auth.user.userId,
          action: 'create_note',
          resourceType: 'user_note',
          resourceId: note.id,
        })
      }
      return result
    },
    update: async (
      noteId: string,
      body: { title?: unknown; body?: unknown; pinned?: unknown },
      context: StartFunctionContext = {},
    ) => {
      const auth = await requireUser(context)
      if ('error' in auth) return auth.error
      const result = await startBridge.notes.update({ user: auth.user }, noteId, body)
      if (result.status === 200) {
        const metadata = {
          title: body?.title !== undefined ? String(body.title).trim() : undefined,
          body: body?.body !== undefined ? String(body.body).trim() : undefined,
          pinned: body?.pinned !== undefined ? Boolean(body.pinned) : undefined,
        }
        await emitAudit(context.effects, {
          actorUserId: auth.user.userId,
          action: 'update_note',
          resourceType: 'user_note',
          resourceId: noteId,
          metadata: JSON.stringify(metadata),
        })
      }
      return result
    },
    remove: async (noteId: string, context: StartFunctionContext = {}) => {
      const auth = await requireUser(context)
      if ('error' in auth) return auth.error
      const result = await startBridge.notes.remove({ user: auth.user }, noteId)
      if (result.status === 204) {
        await emitAudit(context.effects, {
          actorUserId: auth.user.userId,
          action: 'delete_note',
          resourceType: 'user_note',
          resourceId: noteId,
        })
      }
      return result
    },
  },
  ai: {
    listMessages: async (context: StartFunctionContext = {}) => {
      const auth = await requireUser(context)
      if ('error' in auth) return auth.error
      const feature = await requireFeature('AI_ASSISTANT')
      if ('error' in feature) return feature.error
      return startBridge.ai.listMessages({ user: auth.user })
    },
    providers: async (context: StartFunctionContext = {}) => {
      const auth = await requireUser(context)
      if ('error' in auth) return auth.error
      const feature = await requireFeature('AI_ASSISTANT')
      if ('error' in feature) return feature.error
      return startBridge.ai.providers()
    },
    createMessage: async (body: { prompt?: unknown; provider?: unknown }, context: StartFunctionContext = {}) => {
      const auth = await requireUser(context)
      if ('error' in auth) return auth.error
      const feature = await requireFeature('AI_ASSISTANT')
      if ('error' in feature) return feature.error

      const result = await startBridge.ai.createMessage({ user: auth.user }, body)
      if (result.audit) {
        await emitAudit(context.effects, {
          actorUserId: auth.user.userId,
          action: result.audit.action,
          resourceType: 'ai_message',
          resourceId: result.audit.resourceId,
          metadata: JSON.stringify(result.audit.metadata),
        })
      }
      if (result.policy) {
        await emitPolicy(context.effects, auth.user.userId, result.policy)
      }
      return result.http
    },
  },
  admin: {
    users: {
      list: async (context: StartFunctionContext = {}) => {
        const admin = await requireAdmin(context)
        if ('error' in admin) return admin.error
        const feature = await requireFeature('ADMIN_PANEL')
        if ('error' in feature) return feature.error
        return startBridge.admin.users.list()
      },
      changeRole: async (targetId: string, roleRaw: unknown, context: StartFunctionContext = {}) => {
        const admin = await requireAdmin(context)
        if ('error' in admin) return admin.error
        const feature = await requireFeature('ADMIN_PANEL')
        if ('error' in feature) return feature.error
        const result = await startBridge.admin.users.changeRole(targetId, roleRaw)
        if (result.audit) {
          await emitAudit(context.effects, {
            actorUserId: admin.user.userId,
            action: 'change_user_role',
            resourceType: 'user',
            resourceId: result.audit.resourceId,
            metadata: JSON.stringify(result.audit.metadata),
          })
        }
        return result.http
      },
    },
    auditLogs: {
      list: async (context: StartFunctionContext = {}) => {
        const admin = await requireAdmin(context)
        if ('error' in admin) return admin.error
        const adminFeature = await requireFeature('ADMIN_PANEL')
        if ('error' in adminFeature) return adminFeature.error
        const auditFeature = await requireFeature('AUDIT_LOGS')
        if ('error' in auditFeature) return auditFeature.error
        return startBridge.admin.auditLogs.list()
      },
    },
    config: {
      listFeatureFlags: async (context: StartFunctionContext = {}) => {
        const admin = await requireAdmin(context)
        if ('error' in admin) return admin.error
        return startBridge.admin.config.listFeatureFlags()
      },
      updateFeatureFlag: async (key: string, enabled: boolean, context: StartFunctionContext = {}) => {
        const admin = await requireAdmin(context)
        if ('error' in admin) return admin.error
        const result = await startBridge.admin.config.updateFeatureFlag(key, enabled)
        if (result.audit) {
          await emitAudit(context.effects, {
            actorUserId: admin.user.userId,
            action: 'update_feature_flag',
            resourceType: 'feature_flag',
            resourceId: result.audit.resourceId,
            metadata: JSON.stringify(result.audit.metadata),
          })
        }
        return result.http
      },
      listSettings: async (context: StartFunctionContext = {}) => {
        const admin = await requireAdmin(context)
        if ('error' in admin) return admin.error
        const feature = await requireFeature('ADMIN_PANEL')
        if ('error' in feature) return feature.error
        return startBridge.admin.config.listSettings()
      },
      updateSetting: async (key: string, value: string, context: StartFunctionContext = {}) => {
        const admin = await requireAdmin(context)
        if ('error' in admin) return admin.error
        const feature = await requireFeature('ADMIN_PANEL')
        if ('error' in feature) return feature.error
        const result = await startBridge.admin.config.updateSetting(key, value)
        if (result.audit) {
          await emitAudit(context.effects, {
            actorUserId: admin.user.userId,
            action: 'update_setting',
            resourceType: 'app_setting',
            resourceId: result.audit.resourceId,
            metadata: JSON.stringify(result.audit.metadata),
          })
        }
        return result.http
      },
    },
  },
} as const
