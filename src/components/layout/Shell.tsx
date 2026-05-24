import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, ShieldCheck, Sparkles, User2, X } from 'lucide-react'
import { useState } from 'react'
import { useFeatureFlags } from '../../context/feature-flags'
import { useAuth } from '../../lib/auth'
import { Badge, Button } from '../ui/primitives'

type NavItem = { to: string; label: string; group: 'intro' | 'user' | 'admin' }

const navItems: NavItem[] = [
  { to: '/', label: 'Intro', group: 'intro' },
  { to: '/pricing', label: 'Pricing', group: 'intro' },
  { to: '/about', label: 'About', group: 'intro' },
  { to: '/contact', label: 'Contact', group: 'intro' },
  { to: '/dashboard', label: 'Dashboard', group: 'user' },
  { to: '/profile', label: 'Profile', group: 'user' },
  { to: '/settings', label: 'Settings', group: 'user' },
  { to: '/admin', label: 'Admin Home', group: 'admin' },
  { to: '/admin/users', label: 'Users', group: 'admin' },
  { to: '/admin/settings', label: 'Admin Settings', group: 'admin' },
  { to: '/admin/audit-logs', label: 'Audit Logs', group: 'admin' },
  { to: '/ai/assistant', label: 'AI Assistant', group: 'admin' },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const { isEnabled } = useFeatureFlags()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [mobileOpen, setMobileOpen] = useState(false)

  const visibleNav = navItems.filter((item) => {
    if (item.group !== 'intro' && !user) return false
    if (item.to === '/settings' && !isEnabled('USER_SETTINGS')) return false
    if (item.to === '/ai/assistant') {
      return isEnabled('ADMIN_PANEL') && user?.role === 'admin' && isEnabled('AI_ASSISTANT')
    }
    if (item.group === 'admin') return isEnabled('ADMIN_PANEL') && user?.role === 'admin'
    return true
  })

  const grouped = {
    intro: visibleNav.filter((item) => item.group === 'intro'),
    user: visibleNav.filter((item) => item.group === 'user'),
    admin: visibleNav.filter((item) => item.group === 'admin'),
  }

  function isActivePath(to: string) {
    if (to === '/') return pathname === to
    return pathname === to || pathname.startsWith(`${to}/`)
  }

  return (
    <div className="app-bg">
      <header className="topbar">
        <div className="topbar-main">
          <div className="topbar-left">
            <Link to="/" className="brand">
              <Sparkles size={16} />
              <span>VibeStack</span>
            </Link>
          </div>
          <div className="topbar-right mobile-actions">
            <button
              className="mobile-nav-btn"
              aria-label={mobileOpen ? 'close menu' : 'open menu'}
              onClick={() => setMobileOpen((state) => !state)}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        <nav className="desktop-nav clean-nav">
          <div className="menu-group">
            <span className="menu-group-label">Public</span>
            <div className="menu-group-links">
              {grouped.intro.map((item) => (
                <Link key={item.to} to={item.to} className={isActivePath(item.to) ? 'nav-link active' : 'nav-link'}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          {grouped.user.length > 0 ? (
            <div className="menu-group">
              <span className="menu-group-label">Signed In User</span>
              <div className="menu-group-links">
                {grouped.user.map((item) => (
                  <Link key={item.to} to={item.to} className={isActivePath(item.to) ? 'nav-link active' : 'nav-link'}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
          {grouped.admin.length > 0 ? (
            <div className="menu-group">
              <span className="menu-group-label">Admin</span>
              <div className="menu-group-links">
                {grouped.admin.map((item) => (
                  <Link key={item.to} to={item.to} className={isActivePath(item.to) ? 'nav-link active' : 'nav-link'}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
          <div className="desktop-auth">
            {user ? <Badge tone={user.role === 'admin' ? 'info' : 'neutral'}>{user.role}</Badge> : null}
            {user ? (
              <Button tone="secondary" onClick={async () => logout()}>Logout</Button>
            ) : (
              <Link to="/login"><Button tone="secondary">Login</Button></Link>
            )}
          </div>
        </nav>
      </header>

      {mobileOpen ? (
        <div className="mobile-nav-wrap">
          <nav className="mobile-nav">
            <p className="menu-group-label">Public</p>
            {grouped.intro.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={isActivePath(item.to) ? 'mobile-nav-link active' : 'mobile-nav-link'}
                onClick={() => setMobileOpen(false)}
              >
                <Sparkles size={14} />
                <span>{item.label}</span>
              </Link>
            ))}
            {grouped.user.length > 0 ? <p className="menu-group-label">Signed In User</p> : null}
            {grouped.user.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={isActivePath(item.to) ? 'mobile-nav-link active' : 'mobile-nav-link'}
                onClick={() => setMobileOpen(false)}
              >
                <User2 size={14} />
                <span>{item.label}</span>
              </Link>
            ))}
            {grouped.admin.length > 0 ? <p className="menu-group-label">Admin</p> : null}
            {grouped.admin.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={isActivePath(item.to) ? 'mobile-nav-link active' : 'mobile-nav-link'}
                onClick={() => setMobileOpen(false)}
              >
                <ShieldCheck size={14} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      ) : null}

      <main className="container">{children}</main>
      <footer className="container footer muted">Designed for high-velocity product execution.</footer>
    </div>
  )
}
