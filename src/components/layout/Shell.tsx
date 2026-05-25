import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { LogIn, LogOut, Menu, ShieldCheck, Sparkles, User2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFeatureFlags } from '../../context/feature-flags'
import { useAuth } from '../../lib/auth'
import { LogoutDialog } from '../shared/LogoutDialog'
import { inferNavMode, NavModeToggle, type NavMode } from './NavModeToggle'
import { UserMenu } from './UserMenu'

type NavItem = { to: string; label: string; group: 'intro' | 'user' | 'admin' }

const navItems: NavItem[] = [
  { to: '/', label: 'Intro', group: 'intro' },
  { to: '/pricing', label: 'Pricing', group: 'intro' },
  { to: '/about', label: 'About', group: 'intro' },
  { to: '/contact', label: 'Contact', group: 'intro' },
  { to: '/dashboard', label: 'Dashboard', group: 'user' },
  { to: '/profile', label: 'Profile', group: 'user' },
  { to: '/settings', label: 'Settings', group: 'user' },
  { to: '/admin', label: 'Overview', group: 'admin' },
  { to: '/admin/users', label: 'Users', group: 'admin' },
  { to: '/admin/settings', label: 'Admin settings', group: 'admin' },
  { to: '/admin/audit-logs', label: 'Audit logs', group: 'admin' },
  { to: '/ai/assistant', label: 'AI assistant', group: 'admin' },
]


export function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const { isEnabled } = useFeatureFlags()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [logoutBusy, setLogoutBusy] = useState(false)
  const [navMode, setNavMode] = useState<NavMode>('public')

  const showUserNav = Boolean(user)
  const showAdminNav = Boolean(user?.role === 'admin' && isEnabled('ADMIN_PANEL'))
  const showSettings = isEnabled('USER_SETTINGS')

  async function handleLogout() {
    setLogoutBusy(true)
    try {
      await logout()
      setLogoutOpen(false)
      setMobileOpen(false)
      await navigate({ to: '/' })
    } finally {
      setLogoutBusy(false)
    }
  }

  function openLogoutDialog() {
    setMobileOpen(false)
    setLogoutOpen(true)
  }

  const visibleNav = navItems.filter((item) => {
    if (item.group !== 'intro' && !user) return false
    if (item.to === '/settings' && !showSettings) return false
    if (item.to === '/ai/assistant') {
      return showAdminNav && isEnabled('AI_ASSISTANT')
    }
    if (item.group === 'admin') return showAdminNav
    return true
  })

  const linksByMode = {
    public: visibleNav.filter((item) => item.group === 'intro'),
    user: visibleNav.filter((item) => item.group === 'user'),
    admin: visibleNav.filter((item) => item.group === 'admin'),
  }

  const activeLinks = user ? linksByMode[navMode] : linksByMode.public

  useEffect(() => {
    if (!user) {
      setNavMode('public')
      return
    }
    setNavMode(
      inferNavMode(pathname, {
        hasUser: showUserNav,
        hasAdmin: showAdminNav,
      }),
    )
  }, [pathname, user, showUserNav, showAdminNav])

  function isActivePath(to: string) {
    if (to === '/') return pathname === to
    return pathname === to || pathname.startsWith(`${to}/`)
  }

  function renderNavLink(item: NavItem, onNavigate?: () => void) {
    const isMobile = Boolean(onNavigate)
    const className = isActivePath(item.to)
      ? isMobile
        ? 'mobile-nav-link active'
        : 'nav-link active'
      : isMobile
        ? 'mobile-nav-link'
        : 'nav-link'

    const icon =
      item.group === 'intro' ? (
        <Sparkles size={14} />
      ) : item.group === 'user' ? (
        <User2 size={14} />
      ) : (
        <ShieldCheck size={14} />
      )

    if (isMobile) {
      return (
        <Link key={item.to} to={item.to} className={className} onClick={onNavigate}>
          {icon}
          <span>{item.label}</span>
        </Link>
      )
    }

    return (
      <Link key={item.to} to={item.to} className={className}>
        {item.label}
      </Link>
    )
  }

  return (
    <div className="app-bg">
      <header className="topbar topbar-unified">
        <Link to="/" className="brand">
          <Sparkles size={16} />
          <span>VibeStack</span>
        </Link>

        <nav className="topbar-nav desktop-only" aria-label="Main">
          <div className="nav-shell">
            {user ? (
              <NavModeToggle
                mode={navMode}
                showUser={showUserNav}
                showAdmin={showAdminNav}
                onChange={setNavMode}
              />
            ) : null}
            <div className="nav-rail" role="tabpanel" aria-label={`${navMode} navigation`}>
              {activeLinks.map((item) => renderNavLink(item))}
            </div>
          </div>
        </nav>

        <div className="topbar-actions">
          {user ? (
            <div className="desktop-only">
              <UserMenu user={user} showSettings={showSettings} onSignOut={openLogoutDialog} />
            </div>
          ) : (
            <button type="button" className="nav-link nav-link-action desktop-only" onClick={() => navigate({ to: '/login' })}>
              <LogIn size={14} aria-hidden />
              Login
            </button>
          )}
          <button
            className="mobile-nav-btn mobile-only"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((state) => !state)}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <div className="mobile-nav-wrap">
          <nav className="mobile-nav" aria-label="Mobile">
            {user ? (
              <NavModeToggle
                mode={navMode}
                showUser={showUserNav}
                showAdmin={showAdminNav}
                onChange={setNavMode}
              />
            ) : null}
            {activeLinks.map((item) => renderNavLink(item, () => setMobileOpen(false)))}
            <div className="mobile-auth">
              {user ? (
                <>
                  <div className="mobile-user-summary">
                    <span className="mobile-user-name">{user.name}</span>
                    <span className="mobile-user-email">{user.email}</span>
                  </div>
                  <button type="button" className="mobile-nav-link mobile-nav-link-logout" onClick={openLogoutDialog}>
                    <LogOut size={14} />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="mobile-nav-link mobile-nav-link-action"
                  onClick={() => {
                    setMobileOpen(false)
                    navigate({ to: '/login' })
                  }}
                >
                  <LogIn size={14} />
                  <span>Login</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      ) : null}

      <LogoutDialog
        open={logoutOpen}
        user={user}
        busy={logoutBusy}
        onCancel={() => {
          if (!logoutBusy) setLogoutOpen(false)
        }}
        onConfirm={handleLogout}
      />

      <main className="container">{children}</main>
      <footer className="container footer muted">Designed for high-velocity product execution.</footer>
    </div>
  )
}
