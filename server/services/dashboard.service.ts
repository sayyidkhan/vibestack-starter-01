import { desc, eq } from 'drizzle-orm'
import { auditLogs, exampleItems, users } from '../../db/schema'
import { db } from '../db'

export async function getDashboardData() {
  const [allUsers, publishedItems, draftItems, recentLogs] = await Promise.all([
    db.select({ count: users.id }).from(users),
    db.select().from(exampleItems).where(eq(exampleItems.status, 'published')),
    db.select().from(exampleItems).where(eq(exampleItems.status, 'draft')),
    db
      .select({ id: auditLogs.id, action: auditLogs.action, createdAt: auditLogs.createdAt })
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(6),
  ])

  return {
    metrics: {
      activeUsers: allUsers.length,
      publishedItems: publishedItems.length,
      draftItems: draftItems.length,
    },
    activity: recentLogs.map((log) => ({
      id: log.id,
      action: log.action,
      at: log.createdAt,
    })),
  }
}
