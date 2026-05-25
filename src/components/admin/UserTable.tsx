import { useMemo, useState } from 'react'
import type { AdminUser } from '../../lib/api'
import { Badge, Card, Input, Select } from '../ui/primitives'
import { EmptyState } from '../shared/States'

type UserTableProps = {
  users: AdminUser[]
  busyUserId?: string | null
  onChangeRole: (id: string, role: 'user' | 'admin') => Promise<void>
}

type RoleFilter = 'all' | AdminUser['role']
type StatusFilter = 'all' | AdminUser['status']

export function UserTable({ users, busyUserId = null, onChangeRole }: UserTableProps) {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return users.filter((user) => {
      if (roleFilter !== 'all' && user.role !== roleFilter) return false
      if (statusFilter !== 'all' && user.status !== statusFilter) return false
      if (!normalizedQuery) return true
      return (
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [users, query, roleFilter, statusFilter])

  const hasFilters = query.trim().length > 0 || roleFilter !== 'all' || statusFilter !== 'all'

  return (
    <Card className="table-card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>Users</h2>
          <p className="muted">Role assignments are privileged operations and are fully audit-tracked.</p>
        </div>
        <span className="pill">
          {hasFilters ? `${filteredUsers.length} of ${users.length}` : `${users.length} total`}
        </span>
      </div>

      <div className="admin-users-toolbar">
        <label className="admin-users-field admin-users-search">
          <span>Search</span>
          <Input
            value={query}
            placeholder="Search by name or email"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="admin-users-field">
          <span>Role</span>
          <Select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}>
            <option value="all">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Select>
        </label>
        <label className="admin-users-field">
          <span>Status</span>
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="invited">Invited</option>
          </Select>
        </label>
        {hasFilters ? (
          <button
            type="button"
            className="admin-users-clear"
            onClick={() => {
              setQuery('')
              setRoleFilter('all')
              setStatusFilter('all')
            }}
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          title="No users match your filters"
          description={hasFilters ? 'Try a different search term or reset the filters.' : 'No users are available yet.'}
        />
      ) : (
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
              {filteredUsers.map((u) => (
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
      )}
    </Card>
  )
}
