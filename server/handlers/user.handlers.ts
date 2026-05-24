import type { HttpResult } from '../runtime/http'
import { getUserProfileBundle, listUserActivity, updateUserProfile } from '../services/user.service'

type SessionUserLike = {
  userId: string
  name: string
  email: string
  role: string
}

export async function getUserProfileHandler(input: { user: SessionUserLike }): Promise<HttpResult> {
  return { status: 200, body: await getUserProfileBundle(input.user) }
}

export async function listUserActivityHandler(input: { user: SessionUserLike }): Promise<HttpResult> {
  return { status: 200, body: await listUserActivity(input.user.userId) }
}

export type UpdateUserProfileHandlerResult = {
  http: HttpResult
  audit?: { action: 'update_profile'; resourceId: string }
}

export async function updateUserProfileHandler(input: {
  user: SessionUserLike
  body: { name?: unknown; timezone?: unknown; bio?: unknown }
}): Promise<UpdateUserProfileHandlerResult> {
  const name = String(input.body?.name || '').trim()
  const timezone = String(input.body?.timezone || 'UTC').trim() || 'UTC'
  const bio = String(input.body?.bio || '').trim()

  if (!name) return { http: { status: 400, body: { error: 'name is required' } } }

  const payload = await updateUserProfile({ user: input.user, name, timezone, bio })
  return {
    http: { status: 200, body: payload },
    audit: { action: 'update_profile', resourceId: input.user.userId },
  }
}
