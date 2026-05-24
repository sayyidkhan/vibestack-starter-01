import { useEffect, useState } from 'react'
import { UserTable } from '../../components/admin/UserTable'
import { ErrorState, TableSkeleton } from '../../components/shared/States'
import { useToast } from '../../context/toast'
import { api, type AdminUser } from '../../lib/api'

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null)
  const [error, setError] = useState('')
  const [busyUserId, setBusyUserId] = useState<string | null>(null)
  const { pushToast } = useToast()

  useEffect(() => {
    api.adminListUsers().then(setUsers).catch(() => setError('Unable to load users'))
  }, [])

  if (error) return <ErrorState message={error} />
  if (!users) return <TableSkeleton titleWidth="34%" rows={6} />

  return (
    <UserTable
      users={users}
      busyUserId={busyUserId}
      onChangeRole={async (id, role) => {
        setBusyUserId(id)
        try {
          const updated = await api.adminChangeUserRole(id, role)
          setUsers((prev) => (prev ? prev.map((u) => (u.id === id ? updated : u)) : prev))
          pushToast(`Role changed to ${updated.role}`)
        } catch {
          pushToast('Failed to update role')
        } finally {
          setBusyUserId(null)
        }
      }}
    />
  )
}
