import { useEffect, useState } from 'react'
import { ErrorState, TableSkeleton } from '../../components/shared/States'
import { Card, SectionHeader } from '../../components/ui/primitives'
import { api, type AuditLog } from '../../lib/api'

export function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.adminListAuditLogs().then(setLogs).catch(() => setError('Unable to load audit logs'))
  }, [])

  if (error) return <ErrorState message={error} />
  if (!logs) return <TableSkeleton titleWidth="30%" rows={6} />

  return (
    <Card tone="table">
      <SectionHeader eyebrow="Governance" title="Audit Logs" pill={`${logs.length} events`} />
      <ul className="list timeline">
        {logs.map((log) => (
          <li key={log.id}>
            <span className="timeline-dot" />
            <div>
              <strong>{log.actor}</strong> {log.action}
              <p className="muted">{new Date(log.at).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
