import { createUserNote, deleteUserNote, listUserNotes, updateUserNote } from '../services/notes.service'
import type { HttpResult } from '../runtime/http'

type SessionUserLike = { userId: string }

export async function listNotesHandler(input: { user: SessionUserLike }): Promise<HttpResult> {
  const notes = await listUserNotes(input.user.userId)
  return { status: 200, body: notes }
}

export async function createNoteHandler(input: {
  user: SessionUserLike
  body: { title?: unknown; body?: unknown; pinned?: unknown }
}): Promise<HttpResult> {
  const title = String(input.body?.title || '').trim()
  const body = String(input.body?.body || '').trim()
  const pinned = Boolean(input.body?.pinned)
  if (!title) return { status: 400, body: { error: 'title is required' } }

  const note = await createUserNote({ userId: input.user.userId, title, body, pinned })
  return { status: 201, body: note }
}

export async function updateNoteHandler(input: {
  user: SessionUserLike
  noteId: string
  body: { title?: unknown; body?: unknown; pinned?: unknown }
}): Promise<HttpResult> {
  const title = input.body?.title !== undefined ? String(input.body.title).trim() : undefined
  const content = input.body?.body !== undefined ? String(input.body.body).trim() : undefined
  const pinned = input.body?.pinned !== undefined ? Boolean(input.body.pinned) : undefined

  if (title === '' || (title === undefined && content === undefined && pinned === undefined)) {
    return { status: 400, body: { error: 'title, body, or pinned update required' } }
  }

  const updated = await updateUserNote({ userId: input.user.userId, id: input.noteId, title, body: content, pinned })
  if (!updated) return { status: 404, body: { error: 'note not found' } }
  return { status: 200, body: updated }
}

export async function deleteNoteHandler(input: { user: SessionUserLike; noteId: string }): Promise<HttpResult> {
  const deleted = await deleteUserNote({ userId: input.user.userId, id: input.noteId })
  if (!deleted) return { status: 404, body: { error: 'note not found' } }
  return { status: 204 }
}
