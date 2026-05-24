import type { HttpResult } from '../runtime/http'
import { createItem, deleteItem, listItems, updateItem } from '../services/items.service'

type SessionUserLike = { userId: string }

export async function listItemsHandler(): Promise<HttpResult> {
  return { status: 200, body: await listItems() }
}

export type CreateItemHandlerResult = {
  http: HttpResult
  audit?: { action: 'create_item'; resourceId: string }
}

export async function createItemHandler(input: {
  user: SessionUserLike
  body: { title?: unknown }
}): Promise<CreateItemHandlerResult> {
  const title = String(input.body?.title || '').trim()
  if (!title) return { http: { status: 400, body: { error: 'title is required' } } }

  const item = await createItem({ userId: input.user.userId, title })
  return { http: { status: 201, body: item }, audit: { action: 'create_item', resourceId: item.id } }
}

export type UpdateItemHandlerResult = {
  http: HttpResult
  audit?: { action: 'update_item'; resourceId: string; metadata: Record<string, unknown> }
}

export async function updateItemHandler(input: {
  user: SessionUserLike
  itemId: string
  body: { title?: unknown; status?: unknown }
}): Promise<UpdateItemHandlerResult> {
  const title = input.body?.title ? String(input.body.title).trim() : undefined
  const status = input.body?.status === 'published' ? 'published' : input.body?.status === 'draft' ? 'draft' : undefined
  if (!title && !status) return { http: { status: 400, body: { error: 'title or status required' } } }

  const updates: { title?: string; status?: 'draft' | 'published' } = {}
  if (title) updates.title = title
  if (status) updates.status = status

  const updated = await updateItem({ id: input.itemId, updates })
  if (!updated) return { http: { status: 404, body: { error: 'item not found' } } }
  return {
    http: { status: 200, body: updated },
    audit: { action: 'update_item', resourceId: input.itemId, metadata: updates },
  }
}

export type DeleteItemHandlerResult = {
  http: HttpResult
  audit?: { action: 'delete_item'; resourceId: string }
}

export async function deleteItemHandler(input: { user: SessionUserLike; itemId: string }): Promise<DeleteItemHandlerResult> {
  await deleteItem(input.itemId)
  return { http: { status: 204 }, audit: { action: 'delete_item', resourceId: input.itemId } }
}
