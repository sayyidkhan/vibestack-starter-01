import type { HttpResult } from '../runtime/http'
import { changeUserRole, listAdminAuditLogs, listAdminUsers } from '../services/admin.service'

export async function listAdminUsersHandler(): Promise<HttpResult> {
  return { status: 200, body: await listAdminUsers() }
}

export type ChangeAdminUserRoleHandlerResult = {
  http: HttpResult
  audit?: { resourceId: string; metadata: Record<string, unknown> }
}

export async function changeAdminUserRoleHandler(input: {
  targetId: string
  roleRaw: unknown
}): Promise<ChangeAdminUserRoleHandlerResult> {
  const nextRole = input.roleRaw === 'admin' ? 'admin' : 'user'
  const updated = await changeUserRole({ targetId: input.targetId, nextRole })
  if (updated === null) return { http: { status: 400, body: { error: 'role not found' } } }
  if (updated === undefined) return { http: { status: 404, body: { error: 'user not found' } } }

  return {
    http: { status: 200, body: updated },
    audit: { resourceId: input.targetId, metadata: { role: nextRole } },
  }
}

export async function listAdminAuditLogsHandler(): Promise<HttpResult> {
  return { status: 200, body: await listAdminAuditLogs() }
}
