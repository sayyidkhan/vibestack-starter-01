import { Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { DashboardSkeleton, EmptyState, ErrorState } from '../components/shared/States'
import { Button, Card, SectionHeader } from '../components/ui/primitives'
import { api, type DashboardData } from '../lib/api'

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')
  const [doneIds, setDoneIds] = useState<string[]>([])

  const checklist = useMemo(
    () => [
      { id: 'auth', title: 'Validate auth flow', hint: 'Test login, logout, and protected routes.' },
      { id: 'crud', title: 'Ship one item workflow', hint: 'Create, rename, publish, and verify in admin.' },
      { id: 'ai', title: 'Run one AI execution pass', hint: 'Confirm policy behavior and provider response.' },
      { id: 'ops', title: 'Review admin controls', hint: 'Update one setting and one feature flag.' },
    ],
    [],
  )

  const progressPct = Math.round((doneIds.length / checklist.length) * 100)

  useEffect(() => {
    api.getDashboard().then(setData).catch(() => setError('Unable to load dashboard data'))
  }, [])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('vibestack_dashboard_checklist')
      if (!raw) return
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) return
      setDoneIds(parsed.filter((value): value is string => typeof value === 'string'))
    } catch {
      // Ignore malformed storage value.
    }
  }, [])

  function toggleChecklist(id: string) {
    setDoneIds((prev) => {
      const next = prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
      try {
        window.localStorage.setItem('vibestack_dashboard_checklist', JSON.stringify(next))
      } catch {
        // Ignore storage write failures.
      }
      return next
    })
  }

  if (error) return <ErrorState message={error} />
  if (!data) return <DashboardSkeleton />

  return (
    <div className="page-stack">
      <Card tone="spotlight">
        <SectionHeader eyebrow="User Section" title="Execution Dashboard" pill="Daily control center" />
        <p className="muted">Track output, close loops quickly, and move the backlog with intent.</p>
        <div className="row" style={{ marginTop: '.7rem' }}>
          <Link to="/profile"><Button>Open Profile</Button></Link>
          <Link to="/settings"><Button tone="secondary">Open Settings</Button></Link>
          <Link to="/admin"><Button tone="secondary">Open Admin</Button></Link>
        </div>
      </Card>

      <section className="grid three">
        <Card className="stat-card"><p className="muted">Active Users</p><h3>{data.metrics.activeUsers}</h3></Card>
        <Card className="stat-card"><p className="muted">Published Items</p><h3>{data.metrics.publishedItems}</h3></Card>
        <Card className="stat-card"><p className="muted">Draft Items</p><h3>{data.metrics.draftItems}</h3></Card>
      </section>

      <Card>
        <SectionHeader eyebrow="Execution Loop" title="Operator Checklist" pill={`${doneIds.length}/${checklist.length} complete`} />
        <div className="checklist-progress" aria-label="checklist progress">
          <div className="checklist-progress-bar" style={{ width: `${progressPct}%` }} />
        </div>
        <ul className="list checklist-list">
          {checklist.map((item) => {
            const done = doneIds.includes(item.id)
            return (
              <li key={item.id} className={done ? 'checklist-item done' : 'checklist-item'}>
                <label className="checklist-control">
                  <input type="checkbox" checked={done} onChange={() => toggleChecklist(item.id)} aria-label={item.title} />
                  <span><strong>{item.title}</strong><small>{item.hint}</small></span>
                </label>
              </li>
            )
          })}
        </ul>
      </Card>

      {data.activity.length > 0 ? (
        <Card>
          <SectionHeader title="Recent Activity" />
          <ul className="list timeline">
            {data.activity.map((item) => (
              <li key={item.id}><span className="timeline-dot" /><div><strong>{item.action}</strong><p className="muted">{new Date(item.at).toLocaleString()}</p></div></li>
            ))}
          </ul>
        </Card>
      ) : (
        <EmptyState title="No activity yet" description="Actions and system events will appear here." />
      )}
    </div>
  )
}
