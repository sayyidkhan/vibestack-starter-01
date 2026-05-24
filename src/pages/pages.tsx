import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, Button, Input } from '../components/ui/primitives'
import { useAuth } from '../lib/auth'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function LandingPage() {
  return (
    <>
      <section className="hero card hero-grid">
        <div>
          <p className="eyebrow">Starter that compounds</p>
          <h1>Build faster, operate smarter, and scale with leverage.</h1>
          <p className="muted">VibeStack OS gives you auth, admin, AI-ready architecture, docs, and guardrails by default.</p>
          <div className="row">
            <Link to="/signup"><Button>Start Building</Button></Link>
            <Link to="/dashboard"><Button tone="secondary">Open Dashboard</Button></Link>
          </div>
          <div className="hero-tags">
            <span className="tag">Role-aware auth</span>
            <span className="tag">Feature flags</span>
            <span className="tag">AI guardrails</span>
            <span className="tag">Audit logs</span>
          </div>
        </div>
        <aside className="hero-panel">
          <p className="eyebrow">Operator Loop</p>
          <ul className="timeline">
            <li>
              <span className="timeline-dot" />
              <div>
                <strong>Ship foundations in hours</strong>
                <p className="muted">Skip setup churn and launch a functional app baseline immediately.</p>
              </div>
            </li>
            <li>
              <span className="timeline-dot" />
              <div>
                <strong>Measure what matters</strong>
                <p className="muted">Track user/admin activity and policy outcomes from day one.</p>
              </div>
            </li>
            <li>
              <span className="timeline-dot" />
              <div>
                <strong>Iterate with leverage</strong>
                <p className="muted">Reuse modules across products instead of rewriting core workflows.</p>
              </div>
            </li>
          </ul>
        </aside>
      </section>
      <section className="proof-strip card">
        {[
          ['8', 'Core Modules Wired'],
          ['17', 'E2E Scenarios Passing'],
          ['<1 day', 'From Clone to Deployable Baseline'],
          ['5', 'Initial Feature Flags'],
        ].map(([value, label]) => (
          <div key={label} className="proof-cell">
            <p className="proof-value">{value}</p>
            <p className="muted">{label}</p>
          </div>
        ))}
      </section>
      <section className="card">
        <div className="section-head">
          <div>
            <p className="eyebrow">Launch Checklist</p>
            <h2>Everything you need before first customer traffic.</h2>
          </div>
          <span className="pill">template baseline</span>
        </div>
        <div className="grid three checklist-grid">
          {[
            ['Auth + RBAC', 'Signup/login/logout, protected routes, role-scoped admin access.'],
            ['Ops Visibility', 'Admin logs, feature settings, and content controls in one place.'],
            ['AI Safety', 'Prompt checks, provider allow-lists, redaction, and policy hooks.'],
          ].map(([title, desc]) => (
            <Card key={title} className="checklist-card">
              <h3>{title}</h3>
              <p className="muted">{desc}</p>
            </Card>
          ))}
        </div>
      </section>
      <section className="grid three">
        {[
          ['Execution Speed', 'Pre-wired routes, role guards, and service boundaries.'],
          ['Learning Velocity', 'Clear conventions make every iteration reusable.'],
          ['Compounding Leverage', 'Template patterns are built for reuse across products.'],
        ].map(([title, desc]) => (
          <Card key={title} className="value-card"><h3>{title}</h3><p className="muted">{desc}</p></Card>
        ))}
      </section>
    </>
  )
}

export function PricingPage() {
  return (
    <section className="grid">
      <Card>
        <p className="eyebrow">Pricing</p>
        <h2>Launch now, optimize pricing from real usage later.</h2>
        <p className="muted">Use this starter pricing surface to test positioning and conversion before product complexity grows.</p>
      </Card>
      <section className="grid three">
        {[
          ['Starter', '$0', 'For experiments and internal tools', 'Best for hackathons'],
          ['Builder', '$49', 'For first paying customers and teams', 'Most popular'],
          ['Operator', '$199', 'For scale, controls, and automation', 'For serious operators'],
        ].map(([name, price, subtitle, tag]) => (
          <Card key={name} className={name === 'Builder' ? 'pricing-card featured' : 'pricing-card'}>
            <h3>{name}</h3>
            <span className="pill">{tag}</span>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, margin: '.2rem 0' }}>{price}</p>
            <p className="muted">{subtitle}</p>
            <p className="muted">{name === 'Starter' ? 'Includes core modules and starter docs.' : name === 'Builder' ? 'Adds admin workflows and analytics-ready foundations.' : 'Adds advanced governance and policy flexibility.'}</p>
            <Button tone={name === 'Builder' ? 'primary' : 'secondary'}>{name === 'Starter' ? 'Start free' : 'Choose plan'}</Button>
          </Card>
        ))}
      </section>
    </section>
  )
}

export function AboutPage() {
  return (
    <section className="grid">
      <Card>
        <p className="eyebrow">About</p>
        <h2>VibeStack OS is built for operators, not just coders.</h2>
        <p className="muted">
          It starts with app foundations done right so teams can spend cycles on distribution, monetization, and durable
          growth loops.
        </p>
      </Card>
      <section className="grid three">
        <Card>
          <h3>Positioning</h3>
          <p className="muted">A reusable operating system for shipping SaaS and AI products, not just sample code.</p>
        </Card>
        <Card>
          <h3>Principle</h3>
          <p className="muted">Bias toward leverage: every module should be reused across multiple launches.</p>
        </Card>
        <Card>
          <h3>Outcome</h3>
          <p className="muted">Faster iteration cycles with stronger quality and less setup debt.</p>
        </Card>
      </section>
    </section>
  )
}

export function ContactPage() {
  return (
    <section className="grid">
      <Card>
        <p className="eyebrow">Contact</p>
        <h2>Get support, pricing help, or integration guidance.</h2>
        <p className="muted">Choose the fastest route based on your current stage.</p>
      </Card>
      <section className="grid three">
        <Card>
          <h3>Support</h3>
          <p className="muted">support@vibestack.dev</p>
          <p className="muted">Bug triage and implementation troubleshooting.</p>
        </Card>
        <Card>
          <h3>Sales</h3>
          <p className="muted">sales@vibestack.dev</p>
          <p className="muted">Plan fit, onboarding, and migration support.</p>
        </Card>
        <Card>
          <h3>Response SLA</h3>
          <p className="muted">Critical issues: under 4 hours.</p>
          <p className="muted">General requests: under 1 business day.</p>
        </Card>
      </section>
    </section>
  )
}

export function PrivacyPage() {
  return (
    <Card>
      <h2>Privacy Policy</h2>
      <ul className="list">
        <li>We collect only the minimum data needed to operate the service.</li>
        <li>Credentials are hashed and session cookies are HTTP-only.</li>
        <li>You can request data export and account deletion by email.</li>
      </ul>
    </Card>
  )
}

export function TermsPage() {
  return (
    <Card>
      <h2>Terms of Service</h2>
      <ul className="list">
        <li>Use the platform lawfully and do not abuse rate-limited endpoints.</li>
        <li>You are responsible for your account and generated content.</li>
        <li>Service terms can be updated with changelog notice.</li>
      </ul>
    </Card>
  )
}

export function StatusPage() {
  return (
    <section className="grid">
      <Card>
        <h2>System Status</h2>
        <p className="muted">Live operational snapshot for core modules.</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Latency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>API</td>
                <td><span className="badge">Operational</span></td>
                <td>78ms</td>
              </tr>
              <tr>
                <td>Database</td>
                <td><span className="badge">Operational</span></td>
                <td>52ms</td>
              </tr>
              <tr>
                <td>AI Gateway</td>
                <td><span className="badge">Degraded</span></td>
                <td>420ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <h3>Recent Incident Notes</h3>
        <ul className="timeline">
          <li>
            <span className="timeline-dot" />
            <div>
              <strong>May 24, 2026 · 14:12 UTC</strong>
              <p className="muted">AI latency spike due to fallback provider throttling. Auto-retry policies restored baseline.</p>
            </div>
          </li>
          <li>
            <span className="timeline-dot" />
            <div>
              <strong>May 24, 2026 · 11:40 UTC</strong>
              <p className="muted">Scheduled schema migration completed with no downtime.</p>
            </div>
          </li>
        </ul>
      </Card>
    </section>
  )
}

export function NotFoundPage() {
  return (
    <section className="card state not-found">
      <p className="eyebrow">404</p>
      <h2>Page not found</h2>
      <p className="muted">The route you requested is unavailable or may have moved.</p>
      <div className="row" style={{ justifyContent: 'center' }}>
        <Link to="/"><Button>Back to Home</Button></Link>
        <Link to="/dashboard"><Button tone="secondary">Open Dashboard</Button></Link>
      </div>
    </section>
  )
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('user@vibestack.dev')
  const [password, setPassword] = useState('user12345')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  return (
    <section className="card form-card">
      <h2>Login</h2>
      <p className="muted">Credential login with backend sessions.</p>
      <form
        className="grid"
        style={{ marginTop: '.8rem' }}
        onSubmit={async (event) => {
          event.preventDefault()
          setError('')
          const normalizedEmail = email.trim().toLowerCase()
          if (!isValidEmail(normalizedEmail)) {
            setError('Enter a valid email address')
            return
          }
          if (!password.trim()) {
            setError('Password is required')
            return
          }
          setBusy(true)
          try {
            await login(normalizedEmail, password)
            await navigate({ to: '/dashboard' })
          } catch {
            setError('Invalid credentials')
          } finally {
            setBusy(false)
          }
        }}
      >
        <label>Email<Input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error ? <p className="field-error">{error}</p> : null}
        <Button type="submit" disabled={busy}>{busy ? 'Logging in...' : 'Login'}</Button>
      </form>
      <p className="muted" style={{ marginTop: '.8rem' }}>Demo admin: `admin@vibestack.dev` / `admin12345`</p>
    </section>
  )
}

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  return (
    <section className="card form-card">
      <h2>Sign up</h2>
      <p className="muted">Create account and start with user role.</p>
      <form
        className="grid"
        style={{ marginTop: '.8rem' }}
        onSubmit={async (event) => {
          event.preventDefault()
          setError('')
          const normalizedName = name.trim()
          const normalizedEmail = email.trim().toLowerCase()
          if (normalizedName.length < 2) {
            setError('Name must be at least 2 characters')
            return
          }
          if (!isValidEmail(normalizedEmail)) {
            setError('Enter a valid email address')
            return
          }
          if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
          }
          setBusy(true)
          try {
            await signup(normalizedName, normalizedEmail, password)
            await navigate({ to: '/dashboard' })
          } catch {
            setError('Unable to sign up. Check inputs or if signup is disabled.')
          } finally {
            setBusy(false)
          }
        }}
      >
        <label>Name<Input value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label>Email<Input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error ? <p className="field-error">{error}</p> : null}
        <Button type="submit" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</Button>
      </form>
    </section>
  )
}
