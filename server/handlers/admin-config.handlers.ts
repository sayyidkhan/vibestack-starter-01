import type { HttpResult } from '../runtime/http'
import {
  listAdminFeatureFlags,
  listAdminSettings,
  updateAdminFeatureFlag,
  updateAdminSetting,
} from '../services/admin.service'

export async function listAdminFeatureFlagsHandler(): Promise<HttpResult> {
  return { status: 200, body: await listAdminFeatureFlags() }
}

export type UpdateAdminFeatureFlagHandlerResult = {
  http: HttpResult
  audit?: { resourceId: string; metadata: Record<string, unknown> }
}

export async function updateAdminFeatureFlagHandler(input: {
  key: string
  enabled: boolean
}): Promise<UpdateAdminFeatureFlagHandlerResult> {
  const updated = await updateAdminFeatureFlag({ key: input.key, enabled: input.enabled })
  if (!updated) return { http: { status: 404, body: { error: 'feature flag not found' } } }

  return {
    http: { status: 200, body: { key: updated.key, enabled: updated.enabled, description: updated.description } },
    audit: { resourceId: updated.id, metadata: { key: input.key, enabled: input.enabled } },
  }
}

export async function listAdminSettingsHandler(): Promise<HttpResult> {
  return { status: 200, body: await listAdminSettings() }
}

export type UpdateAdminSettingHandlerResult = {
  http: HttpResult
  audit?: { resourceId: string; metadata: Record<string, unknown> }
}

export async function updateAdminSettingHandler(input: {
  key: string
  value: string
}): Promise<UpdateAdminSettingHandlerResult> {
  const updated = await updateAdminSetting({ key: input.key, value: input.value })
  if (!updated) return { http: { status: 404, body: { error: 'setting not found' } } }

  return {
    http: { status: 200, body: updated },
    audit: { resourceId: updated.id, metadata: { key: input.key, value: input.value } },
  }
}
