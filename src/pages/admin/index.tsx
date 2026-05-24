import { Link } from '@tanstack/react-router'
import { Button, Card, SectionHeader } from '../../components/ui/primitives'

export function AdminPage() {
  return (
    <section className="grid">
      <Card tone="spotlight">
        <SectionHeader eyebrow="Admin Surface" title="Control growth, risk, and reliability in one place." />
        <p className="muted">Everything here maps to an operator lever: users, settings, visibility, and governance logs.</p>
      </Card>
      <section className="grid three">
        <Card className="admin-tile">
          <h3>Users</h3>
          <p className="muted">Inspect accounts and adjust roles safely.</p>
          <Link to="/admin/users"><Button>Open</Button></Link>
        </Card>
        <Card className="admin-tile">
          <h3>Audit Logs</h3>
          <p className="muted">Track security-sensitive and operational actions.</p>
          <Link to="/admin/audit-logs"><Button tone="secondary">Open</Button></Link>
        </Card>
        <Card className="admin-tile">
          <h3>Settings</h3>
          <p className="muted">Manage feature switches and policy flags.</p>
          <Link to="/admin/settings"><Button tone="secondary">Open</Button></Link>
        </Card>
      </section>
      <Card>
        <h3>Content Ops</h3>
        <p className="muted">Publish and unpublish sample content to simulate moderation workflows.</p>
        <div className="row" style={{ marginTop: '.8rem' }}>
          <Link to="/admin/content"><Button tone="secondary">Manage Content</Button></Link>
        </div>
      </Card>
    </section>
  )
}
