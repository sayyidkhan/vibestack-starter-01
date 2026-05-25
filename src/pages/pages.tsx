import { Link, useNavigate } from '@tanstack/react-router'
import { BarChart3, CheckCircle2, Compass, Rocket, Shield, Users } from 'lucide-react'
import { useState } from 'react'
import { AuthLoadingOverlay } from '../components/shared/AuthLoadingOverlay'
import { Card, Button, Input, PasswordInput } from '../components/ui/primitives'
import { useAuth } from '../lib/auth'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function LandingPage() {
  return (
    <div className="landing-stack">
      <section className="hero card">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80"
          alt="Team operating from analytics dashboards"
          loading="lazy"
        />
        <p className="eyebrow">VibeStack Full-Stack Starter</p>
        <h1>One product. Three clear surfaces: intro, user, and admin.</h1>
        <p className="muted">
          Built to help you move from build-only cycles to operational execution with tighter feedback loops.
        </p>
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
    <section className="page-stack">
      <Card>
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1600&q=80"
          alt="Pricing and growth planning workspace"
          loading="lazy"
        />
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
    <div className="page-stack">
      <Card tone="spotlight">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
          alt="Product team planning execution roadmap"
          loading="lazy"
        />
        <p className="eyebrow">About VibeStack</p>
        <h2>Built for founders who need operating leverage, not template noise.</h2>
        <p className="muted">
          VibeStack is a practical full-stack baseline designed to reduce setup drag and help teams run faster
          product loops across intro, user, and admin surfaces.
        </p>
      </Card>

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

      <section className="grid three">
        <Card>
          <p className="eyebrow">Operating Principles</p>
          <h3>Execution over ceremony</h3>
          <ul className="list">
            <li>Ship complete flows, not isolated components.</li>
            <li>Instrument admin controls from day one.</li>
            <li>Keep architecture simple enough to reuse fast.</li>
          </ul>
        </Card>
        <Card>
          <p className="eyebrow">Current Scope</p>
          <h3>What this starter optimizes for</h3>
          <ul className="list">
            <li>Role-aware auth and guarded routes.</li>
            <li>Admin visibility, settings, and governance logs.</li>
            <li>AI-ready workflows with policy controls.</li>
          </ul>
        </Card>
        <Card>
          <p className="eyebrow">Roadmap</p>
          <h3>Near-term improvements</h3>
          <ul className="list">
            <li>Deeper analytics and conversion instrumentation.</li>
            <li>More configurable admin workflow templates.</li>
            <li>Better deployment presets for multi-env teams.</li>
          </ul>
        </Card>
      </section>
    </div>
  )
}

export function ContactPage() {
  return (
    <div className="page-stack">
      <Card tone="spotlight">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80"
          alt="Business meeting and collaboration"
          loading="lazy"
        />
        <p className="eyebrow">Contact</p>
        <h2>Get the right help channel based on your stage.</h2>
        <p className="muted">
          Whether you are debugging implementation, evaluating adoption, or planning a rollout, route your request to
          the most relevant team for faster response.
        </p>
      </Card>

      <section className="grid three">
        <Card>
          <h3>Support</h3>
          <p className="muted">support@vibestack.dev</p>
          <p className="muted">Bug reports, implementation issues, and environment troubleshooting.</p>
        </Card>
        <Card>
          <h3>Sales</h3>
          <p className="muted">sales@vibestack.dev</p>
          <p className="muted">Plan fit, pricing discussion, and migration planning.</p>
        </Card>
        <Card>
          <h3>Partnerships</h3>
          <p className="muted">partners@vibestack.dev</p>
          <p className="muted">Co-build opportunities, integrations, and ecosystem collaboration.</p>
        </Card>
      </section>

      <section className="grid three">
        <Card>
          <p className="eyebrow">Response Targets</p>
          <ul className="list">
            <li>Critical production issues: under 4 hours.</li>
            <li>Standard support and setup questions: under 1 business day.</li>
            <li>Commercial and partnership inquiries: under 2 business days.</li>
          </ul>
        </Card>
        <Card>
          <p className="eyebrow">Include in your message</p>
          <ul className="list">
            <li>Environment and deployment context.</li>
            <li>Exact route/page where issue occurs.</li>
            <li>Error output or screenshot + steps to reproduce.</li>
          </ul>
        </Card>
        <Card>
          <p className="eyebrow">Enterprise Requests</p>
          <ul className="list">
            <li>Admin governance and policy requirements.</li>
            <li>Custom onboarding and training support.</li>
            <li>Security and compliance review workflows.</li>
          </ul>
        </Card>
      </section>
    </div>
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
    <section className="auth-page">
      <section className={`card form-card auth-card${busy ? ' auth-card-busy' : ''}`}>
        {busy ? (
          <AuthLoadingOverlay
            title="Signing you in"
            description="Verifying your credentials and preparing your dashboard."
          />
        ) : null}
        <p className="eyebrow">User Access</p>
        <h2>Login</h2>
        <p className="muted auth-demo">
          Demo user: user@vibestack.dev / user12345<br />
          Demo admin: admin@vibestack.dev / admin12345
        </p>
        <form
          className="grid auth-form"
          aria-busy={busy}
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
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Login failed'
              setError(message.toLowerCase().includes('invalid credentials') ? 'Invalid credentials' : message)
            } finally {
              setBusy(false)
            }
          }}
        >
          <fieldset className="auth-form-fields" disabled={busy}>
            <label>Email<Input value={email} placeholder="you@company.com" onChange={(event) => setEmail(event.target.value)} /></label>
            <label>Password<PasswordInput placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            {error ? <p className="field-error">{error}</p> : null}
            <Button tone="secondary" className="auth-submit" type="submit" disabled={busy}>
              {busy ? 'Logging in...' : 'Login'}
            </Button>
          </fieldset>
        </form>
        <p className="muted auth-switch">
          New user?{' '}
          {busy ? (
            <span className="text-link text-link-disabled">Register here</span>
          ) : (
            <Link to="/signup" className="text-link">Register here</Link>
          )}
        </p>
      </section>
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
    <section className="auth-page">
      <section className={`card form-card auth-card${busy ? ' auth-card-busy' : ''}`}>
        {busy ? (
          <AuthLoadingOverlay
            title="Creating your account"
            description="Setting up your profile and signing you in."
          />
        ) : null}
        <p className="eyebrow">Create Account</p>
        <h2>Sign up</h2>
        <form
          className="grid auth-form"
          aria-busy={busy}
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
          <fieldset className="auth-form-fields" disabled={busy}>
            <label>Name<Input value={name} placeholder="Your name" onChange={(event) => setName(event.target.value)} /></label>
            <label>Email<Input value={email} placeholder="you@company.com" onChange={(event) => setEmail(event.target.value)} /></label>
            <label>Password<PasswordInput placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            {error ? <p className="field-error">{error}</p> : null}
            <Button tone="secondary" className="auth-submit" type="submit" disabled={busy}>
              {busy ? 'Creating account...' : 'Create account'}
            </Button>
          </fieldset>
        </form>
        <p className="muted auth-switch">
          Already have an account?{' '}
          {busy ? (
            <span className="text-link text-link-disabled">Login</span>
          ) : (
            <Link to="/login" className="text-link">Login</Link>
          )}
        </p>
      </section>
    </section>
  )
}
