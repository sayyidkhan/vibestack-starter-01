import { and, desc, eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { userNotes } from '../../db/schema'
import { db } from '../db'

export async function listUserNotes(userId: string) {
  return db
    .select()
    .from(userNotes)
    .where(eq(userNotes.userId, userId))
    .orderBy(desc(userNotes.pinned), desc(userNotes.updatedAt))
}

export async function createUserNote(input: { userId: string; title: string; body: string; pinned: boolean }) {
  const now = new Date()
  const note = {
    id: randomUUID(),
    userId: input.userId,
    title: input.title,
    body: input.body,
    pinned: input.pinned,
    createdAt: now,
    updatedAt: now,
  }
  await db.insert(userNotes).values(note)
  return note
}

export async function updateUserNote(
  input: {
    userId: string
    id: string
    title?: string
    body?: string
    pinned?: boolean
  },
) {
  const existing = await db
    .select({ id: userNotes.id })
    .from(userNotes)
    .where(and(eq(userNotes.id, input.id), eq(userNotes.userId, input.userId)))
  if (!existing[0]) return null

  const updates: { title?: string; body?: string; pinned?: boolean; updatedAt: Date } = { updatedAt: new Date() }
  if (input.title !== undefined) updates.title = input.title
  if (input.body !== undefined) updates.body = input.body
  if (input.pinned !== undefined) updates.pinned = input.pinned

  await db.update(userNotes).set(updates).where(and(eq(userNotes.id, input.id), eq(userNotes.userId, input.userId)))
  const updated = await db.select().from(userNotes).where(and(eq(userNotes.id, input.id), eq(userNotes.userId, input.userId)))
  return updated[0] ?? null
}

export async function deleteUserNote(input: { userId: string; id: string }) {
  const existing = await db
    .select({ id: userNotes.id })
    .from(userNotes)
    .where(and(eq(userNotes.id, input.id), eq(userNotes.userId, input.userId)))
  if (!existing[0]) return false

  await db.delete(userNotes).where(and(eq(userNotes.id, input.id), eq(userNotes.userId, input.userId)))
  return true
}
