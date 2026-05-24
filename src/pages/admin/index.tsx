import { Link } from '@tanstack/react-router'
import { Button, Card, SectionHeader } from '../../components/ui/primitives'

export function AdminPage() {
  return (
    <section className="grid">
      <Card tone="spotlight">
        <SectionHeader eyebrow="Admin Section" title="Governance and Control Center" />
        <p className="muted">Manage access, risk, rollout safety, and operational observability in one place.</p>
      </Card>

      <section className="grid three">
        <Card className="admin-tile">
          <h3>Users</h3>
          <p className="muted">Role changes and access management.</p>
          <Link to="/admin/users"><Button>Open Users</Button></Link>
        </Card>
        <Card className="admin-tile">
          <h3>Settings</h3>
          <p className="muted">System controls and feature switches.</p>
          <Link to="/admin/settings"><Button tone="secondary">Open Settings</Button></Link>
        </Card>
        <Card className="admin-tile">
          <h3>Audit Logs</h3>
          <p className="muted">Trace privileged and sensitive operations.</p>
          <Link to="/admin/audit-logs"><Button tone="secondary">Open Logs</Button></Link>
        </Card>
      </section>
    </section>
  )
}
