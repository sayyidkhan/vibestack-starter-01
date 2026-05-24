import { Link, useNavigate } from '@tanstack/react-router'
import { BarChart3, CheckCircle2, Compass, Rocket, Shield, Users } from 'lucide-react'
import { useState } from 'react'
import { Card, Button, Input } from '../components/ui/primitives'
import { useAuth } from '../lib/auth'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function LandingPage() {
  return (
    <div className="landing-stack">
      <section className="hero card">
        <p className="eyebrow">VibeStack Full-Stack Starter</p>
        <h1>One product. Three clear surfaces: intro, user, and admin.</h1>
        <p className="muted">
          Built to help you move from build-only cycles to operational execution with tighter feedback loops.
        </p>
        <div className="row">
          <Link to="/signup"><Button>Start Building</Button></Link>
          <Link to="/dashboard"><Button tone="secondary">Enter User Section</Button></Link>
          <Link to="/admin"><Button tone="secondary">Enter Admin Section</Button></Link>
        </div>
      </section>

      <section className="grid three">
        <Card>
          <p className="eyebrow">Intro</p>
          <h3>Positioning and conversion</h3>
          <p className="muted">Pricing, credibility, and narrative for first-time visitors.</p>
        </Card>
        <Card>
          <p className="eyebrow">User</p>
          <h3>Daily execution</h3>
          <p className="muted">Dashboard, profile, settings, and AI assistant for iterative delivery work.</p>
        </Card>
        <Card>
          <p className="eyebrow">Admin</p>
          <h3>Control and governance</h3>
          <p className="muted">Feature toggles, user roles, moderation, and operational logs.</p>
        </Card>
      </section>

      <section className="card">
        <div className="section-head">
          <div>
            <p className="eyebrow">Core Capabilities</p>
            <h2>What is already wired in this starter</h2>
          </div>
          <span className="pill">Operator-first baseline</span>
        </div>
        <div className="grid three">
          <Card className="flat-card">
            <Rocket size={18} />
            <h3>Execution Speed</h3>
            <p className="muted">Auth, routing, protected modules, and CRUD flows out of the box.</p>
          </Card>
          <Card className="flat-card">
            <Shield size={18} />
            <h3>Operational Safety</h3>
            <p className="muted">Role-aware access, audit logging, and feature-gated controls.</p>
          </Card>
          <Card className="flat-card">
            <BarChart3 size={18} />
            <h3>Compounding Learnings</h3>
            <p className="muted">Reuse patterns and ship faster across multiple experiments.</p>
          </Card>
        </div>
      </section>
    </div>
  )
}

export function PricingPage() {
  return (
    <section className="grid">
      <Card>
        <p className="eyebrow">Pricing</p>
        <h2>Simple packages for validation, growth, and scale</h2>
      </Card>
      <section className="grid three">
        {[
          ['Starter', '$0', 'Personal and hackathon experiments'],
          ['Builder', '$49', 'Small product teams shipping weekly'],
          ['Operator', '$199', 'Teams running governance and scale loops'],
        ].map(([name, price, subtitle]) => (
          <Card key={name} className={name === 'Builder' ? 'pricing-card featured' : 'pricing-card'}>
            <h3>{name}</h3>
            <p className="price">{price}</p>
            <p className="muted">{subtitle}</p>
            <Button tone={name === 'Builder' ? 'primary' : 'secondary'}>{name === 'Starter' ? 'Start free' : 'Choose plan'}</Button>
          </Card>
        ))}
      </section>
    </section>
  )
}

export function AboutPage() {
  return (
    <section className="grid three">
      <Card>
        <Compass size={18} />
        <h3>Mission</h3>
        <p className="muted">Help builders become operators by shipping systems, not disconnected features.</p>
      </Card>
      <Card>
        <Users size={18} />
        <h3>Audience</h3>
        <p className="muted">Indie founders and lean teams iterating products under real constraints.</p>
      </Card>
      <Card>
        <CheckCircle2 size={18} />
        <h3>Outcome</h3>
        <p className="muted">Higher launch velocity with better reliability, governance, and reuse.</p>
      </Card>
    </section>
  )
}

export function ContactPage() {
  return (
    <section className="grid three">
      <Card><h3>Support</h3><p className="muted">support@vibestack.dev</p></Card>
      <Card><h3>Sales</h3><p className="muted">sales@vibestack.dev</p></Card>
      <Card><h3>Partnerships</h3><p className="muted">partners@vibestack.dev</p></Card>
    </section>
  )
}

export function PrivacyPage() {
  return (
    <Card>
      <h2>Privacy Policy</h2>
      <ul className="list">
        <li>We collect only data required to operate the service.</li>
        <li>Passwords are hashed and session cookies are HTTP-only.</li>
        <li>You can request export or deletion by email.</li>
      </ul>
    </Card>
  )
}

export function TermsPage() {
  return (
    <Card>
      <h2>Terms of Service</h2>
      <ul className="list">
        <li>Use the platform lawfully and respect rate limits.</li>
        <li>You are responsible for your account and generated content.</li>
        <li>Terms may be updated with notice.</li>
      </ul>
    </Card>
  )
}

export function StatusPage() {
  return (
    <section className="grid">
      <Card>
        <SectionStatus />
      </Card>
    </section>
  )
}

function SectionStatus() {
  return (
    <>
      <h2>System Status</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Service</th><th>Status</th><th>Latency</th></tr>
          </thead>
          <tbody>
            <tr><td>API</td><td><span className="badge">Operational</span></td><td>78ms</td></tr>
            <tr><td>Database</td><td><span className="badge">Operational</span></td><td>52ms</td></tr>
            <tr><td>AI Gateway</td><td><span className="badge">Degraded</span></td><td>420ms</td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export function NotFoundPage() {
  return (
    <section className="card state not-found">
      <p className="eyebrow">404</p>
      <h2>Page not found</h2>
      <div className="row" style={{ justifyContent: 'center' }}>
        <Link to="/"><Button>Back to Home</Button></Link>
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
    <section className="card form-card auth-card">
      <p className="eyebrow">User Access</p>
      <h2>Login</h2>
      <p className="muted">Demo admin: admin@vibestack.dev / admin12345</p>
      <form
        className="grid"
        style={{ marginTop: '.8rem' }}
        onSubmit={async (event) => {
          event.preventDefault()
          setError('')
          const normalizedEmail = email.trim().toLowerCase()
          if (!isValidEmail(normalizedEmail)) return setError('Enter a valid email address')
          if (!password.trim()) return setError('Password is required')
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
    <section className="card form-card auth-card">
      <p className="eyebrow">Create Account</p>
      <h2>Sign up</h2>
      <form
        className="grid"
        style={{ marginTop: '.8rem' }}
        onSubmit={async (event) => {
          event.preventDefault()
          setError('')
          const normalizedName = name.trim()
          const normalizedEmail = email.trim().toLowerCase()
          if (normalizedName.length < 2) return setError('Name must be at least 2 characters')
          if (!isValidEmail(normalizedEmail)) return setError('Enter a valid email address')
          if (password.length < 8) return setError('Password must be at least 8 characters')
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
