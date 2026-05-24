import { desc, eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { exampleItems } from '../../db/schema'
import { db } from '../db'

export async function listItems() {
  return db.select().from(exampleItems).orderBy(desc(exampleItems.createdAt))
}

export async function createItem(input: { userId: string; title: string }) {
  const item = { id: randomUUID(), title: input.title, content: '', status: 'draft' as const, ownerUserId: input.userId }
  await db.insert(exampleItems).values(item)
  return item
}

export async function updateItem(
  input: {
    id: string
    updates: { title?: string; status?: 'draft' | 'published' }
  },
) {
  await db.update(exampleItems).set(input.updates).where(eq(exampleItems.id, input.id))
  const updated = await db.select().from(exampleItems).where(eq(exampleItems.id, input.id))
  return updated[0] ?? null
}

export async function deleteItem(id: string) {
  await db.delete(exampleItems).where(eq(exampleItems.id, id))
}
