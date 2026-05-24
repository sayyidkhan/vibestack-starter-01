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
      { id: 'auth', title: 'Create your first user account', hint: 'Validate signup/login and session behavior.' },
      { id: 'crud', title: 'Ship one CRUD item end-to-end', hint: 'Use Items + Admin Content publish flow.' },
      { id: 'ai', title: 'Run one AI prompt safely', hint: 'Confirm policy guardrails and audit logs.' },
      { id: 'ops', title: 'Review admin controls', hint: 'Toggle one feature flag and one app setting.' },
    ],
    [],
  )

  const progressPct = Math.round((doneIds.length / checklist.length) * 100)
  const metricCards = useMemo(
    () => [
      {
        key: 'active-users',
        label: 'Active Users',
        value: data?.metrics.activeUsers ?? 0,
        delta: '+12% week over week',
        positive: true,
        trend: [52, 58, 62, 69, 74, 79, 84],
      },
      {
        key: 'published-items',
        label: 'Published Items',
        value: data?.metrics.publishedItems ?? 0,
        delta: 'Publishing cadence improving',
        positive: true,
        trend: [18, 20, 23, 24, 28, 31, 36],
      },
      {
        key: 'draft-items',
        label: 'Draft Items',
        value: data?.metrics.draftItems ?? 0,
        delta: 'Backlog needs prioritization',
        positive: false,
        trend: [42, 46, 43, 48, 50, 47, 52],
      },
    ],
    [data],
  )

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
      // Ignore malformed localStorage values.
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
    <>
      <Card tone="spotlight">
        <SectionHeader eyebrow="Operator Cockpit" title="Run product, not just code." />
        <p className="muted">
          This control surface is optimized for quick decisions: shipping velocity, content posture, and operational
          movement.
        </p>
        <div className="row" style={{ marginTop: '.7rem' }}>
          <Link to="/items"><Button>Open CRUD Module</Button></Link>
          <Link to="/admin"><Button tone="secondary">Go to Admin</Button></Link>
        </div>
      </Card>
      <section className="grid three">
        {metricCards.map((metric) => {
          const max = Math.max(...metric.trend)
          return (
            <Card key={metric.key} className="stat-card">
              <p className="muted">{metric.label}</p>
              <h3>{metric.value}</h3>
              <p className={metric.positive ? 'metric-delta positive' : 'metric-delta'}>{metric.delta}</p>
              <div className="metric-trend" role="img" aria-label={`${metric.label} trend`}>
                {metric.trend.map((point, index) => (
                  <span
                    key={`${metric.key}-${index}`}
                    className={metric.positive ? 'metric-bar up' : 'metric-bar'}
                    style={{ height: `${Math.max(20, Math.round((point / max) * 100))}%` }}
                  />
                ))}
              </div>
            </Card>
          )
        })}
      </section>
      <Card>
        <SectionHeader eyebrow="Execution Loop" title="Operator Onboarding Checklist" pill={`${doneIds.length}/${checklist.length} done`} />
        <div className="checklist-progress" aria-label="checklist progress">
          <div className="checklist-progress-bar" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="muted" style={{ marginTop: '.5rem' }}>{progressPct}% complete</p>
        <ul className="list checklist-list">
          {checklist.map((item) => {
            const done = doneIds.includes(item.id)
            return (
              <li key={item.id} className={done ? 'checklist-item done' : 'checklist-item'}>
                <label className="checklist-control">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleChecklist(item.id)}
                    aria-label={item.title}
                  />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.hint}</small>
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </Card>
      {!!data.activity.length && (
        <Card>
          <SectionHeader title="Recent Activity" />
          <ul className="list timeline">
            {data.activity.map((item) => (
              <li key={item.id}>
                <span className="timeline-dot" />
                <div>
                  <strong>{item.action}</strong>
                  <p className="muted">{new Date(item.at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
      {data.activity.length === 0 && <EmptyState title="No activity yet" description="Your actions and system events will appear here." />}
    </>
  )
}
