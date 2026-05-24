import type { AdminUser } from '../../lib/api'
import { Badge, Card } from '../ui/primitives'

type UserTableProps = {
  users: AdminUser[]
  busyUserId?: string | null
  onChangeRole: (id: string, role: 'user' | 'admin') => Promise<void>
}

export function UserTable({ users, busyUserId = null, onChangeRole }: UserTableProps) {
  return (
    <Card className="table-card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>Users</h2>
          <p className="muted">Role assignments are privileged operations and are fully audit-tracked.</p>
        </div>
        <span className="pill">{users.length} total</span>
      </div>
      <div className="table-wrap admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <p className="admin-primary-cell">{u.name}</p>
                  <p className="admin-secondary-cell">ID: {u.id.slice(0, 8)}</p>
                </td>
                <td className="admin-email-cell">{u.email}</td>
                <td>
                  <Badge tone={u.role === 'admin' ? 'info' : 'neutral'}>{u.role}</Badge>
                </td>
                <td><Badge tone="success">{u.status}</Badge></td>
                <td>
                  <button
                    className="btn secondary"
                    type="button"
                    disabled={busyUserId === u.id}
                    onClick={async () => onChangeRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                  >
                    {busyUserId === u.id ? 'Updating...' : `Make ${u.role === 'admin' ? 'User' : 'Admin'}`}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
