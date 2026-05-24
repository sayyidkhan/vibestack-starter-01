import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { Bot, Command, LayoutDashboard, LogOut, Menu, NotebookPen, Settings, Sparkles, User, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFeatureFlags } from '../../context/feature-flags'
import { useAuth } from '../../lib/auth'
import { Badge, Button } from '../ui/primitives'

const nav = [
  ['/', 'Home'],
  ['/pricing', 'Pricing'],
  ['/dashboard', 'Dashboard'],
  ['/notes', 'Notes'],
  ['/items', 'Items'],
  ['/profile', 'Profile'],
  ['/settings', 'Settings'],
  ['/admin', 'Admin'],
  ['/ai/assistant', 'AI'],
] as const

export function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { isEnabled } = useFeatureFlags()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')
  const [recentActionIds, setRecentActionIds] = useState<string[]>([])
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl+K')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [theme, setTheme] = useState<'forest' | 'paper'>('forest')
  const [themeHydrated, setThemeHydrated] = useState(false)
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const commandInputRef = useRef<HTMLInputElement | null>(null)

  const visibleNav = nav.filter(([to]) => {
    if (!user && to !== '/' && to !== '/pricing') return false
    if (to === '/items') return isEnabled('EXAMPLE_CRUD')
    if (to === '/settings') return isEnabled('USER_SETTINGS')
    if (to === '/admin') return isEnabled('ADMIN_PANEL') && user?.role === 'admin'
    if (to === '/ai/assistant') return isEnabled('AI_ASSISTANT')
    return true
  })

  const mobileDock = [
    ['/dashboard', 'Dashboard', LayoutDashboard],
    ['/notes', 'Notes', NotebookPen],
    ['/ai/assistant', 'AI', Bot],
    ['/settings', 'Settings', Settings],
  ] as const

  const visibleDock = mobileDock.filter(([to]) => {
    if (!user) return false
    if (to === '/ai/assistant') return isEnabled('AI_ASSISTANT')
    if (to === '/settings') return isEnabled('USER_SETTINGS')
    return true
  })

  function navIconFor(to: string) {
    if (to === '/dashboard') return LayoutDashboard
    if (to === '/notes') return NotebookPen
    if (to === '/profile') return User
    if (to === '/settings') return Settings
    if (to === '/ai/assistant') return Bot
    if (to === '/admin') return Command
    return Sparkles
  }

  function isActivePath(to: string) {
    if (to === '/') return pathname === to
    return pathname === to || pathname.startsWith(`${to}/`)
  }

  const commandActions = useMemo(() => {
    const actions: Array<{
      id: string
      label: string
      hint: string
      icon: React.ComponentType<{ size?: number }>
      run: () => Promise<void> | void
    }> = [
      {
        id: 'go-dashboard',
        label: 'Go to Dashboard',
        hint: '/dashboard',
        icon: LayoutDashboard,
        run: async () => navigate({ to: '/dashboard' }),
      },
      {
        id: 'go-notes',
        label: 'Open Notes',
        hint: '/notes',
        icon: NotebookPen,
        run: async () => navigate({ to: '/notes' }),
      },
      {
        id: 'go-profile',
        label: 'Open Profile',
        hint: '/profile',
        icon: User,
        run: async () => navigate({ to: '/profile' }),
      },
    ]

    if (isEnabled('AI_ASSISTANT')) {
      actions.push({
        id: 'go-ai',
        label: 'Open AI Assistant',
        hint: '/ai/assistant',
        icon: Bot,
        run: async () => navigate({ to: '/ai/assistant' }),
      })
    }

    if (isEnabled('USER_SETTINGS')) {
      actions.push({
        id: 'go-settings',
        label: 'Open Settings',
        hint: '/settings',
        icon: Settings,
        run: async () => navigate({ to: '/settings' }),
      })
    }

    if (isEnabled('ADMIN_PANEL') && user?.role === 'admin') {
      actions.push({
        id: 'go-admin',
        label: 'Open Admin',
        hint: '/admin',
        icon: Command,
        run: async () => navigate({ to: '/admin' }),
      })
    }

    if (user) {
      actions.push({
        id: 'logout',
        label: 'Logout',
        hint: 'end session',
        icon: LogOut,
        run: async () => logout(),
      })
    }

    actions.push({
      id: 'theme-forest',
      label: 'Use Forest Theme',
      hint: 'starter default',
      icon: Sparkles,
      run: () => setTheme('forest'),
    })

    actions.push({
      id: 'theme-paper',
      label: 'Use Paper Theme',
      hint: 'neutral editorial',
      icon: Sparkles,
      run: () => setTheme('paper'),
    })

    return actions
  }, [isEnabled, logout, navigate, user])

  const filteredActions = useMemo(() => {
    const q = commandQuery.trim().toLowerCase()
    const filtered = q ? commandActions.filter((action) => {
      return action.label.toLowerCase().includes(q) || action.hint.toLowerCase().includes(q)
    }) : commandActions

    if (recentActionIds.length === 0) return filtered
    const order = new Map(recentActionIds.map((id, index) => [id, index]))
    return [...filtered].sort((a, b) => {
      const aRank = order.get(a.id)
      const bRank = order.get(b.id)
      if (aRank === undefined && bRank === undefined) return 0
      if (aRank === undefined) return 1
      if (bRank === undefined) return -1
      return aRank - bRank
    })
  }, [commandActions, commandQuery, recentActionIds])

  const recentActionSet = useMemo(() => new Set(recentActionIds.slice(0, 3)), [recentActionIds])

  function runAction(action: (typeof commandActions)[number]) {
    setRecentActionIds((prev) => {
      const next = [action.id, ...prev.filter((id) => id !== action.id)].slice(0, 8)
      try {
        window.localStorage.setItem('vibestack_recent_actions', JSON.stringify(next))
      } catch {
        // Ignore storage issues and keep in-memory behavior.
      }
      return next
    })
    void action.run()
    setCommandOpen(false)
  }

  const selectedAction = filteredActions[selectedIndex]

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('vibestack_recent_actions')
      if (!raw) return
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) return
      setRecentActionIds(parsed.filter((value): value is string => typeof value === 'string').slice(0, 8))
    } catch {
      // Ignore read/parse issues.
    }
  }, [])

  useEffect(() => {
    const platform = window.navigator?.platform.toLowerCase() || ''
    setShortcutLabel(platform.includes('mac') ? '⌘K' : 'Ctrl+K')
  }, [])

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('vibestack_theme')
      if (saved === 'paper' || saved === 'forest') setTheme(saved)
    } catch {
      // Ignore storage read errors.
    }
    setThemeHydrated(true)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!themeHydrated) return
    try {
      window.localStorage.setItem('vibestack_theme', theme)
    } catch {
      // Ignore storage write errors.
    }
  }, [theme, themeHydrated])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      if (!isShortcut) return
      event.preventDefault()
      setCommandOpen((prev) => !prev)
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (!commandOpen) {
      setCommandQuery('')
      setSelectedIndex(0)
      return
    }
    commandInputRef.current?.focus()
  }, [commandOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [commandQuery])

  useEffect(() => {
    if (filteredActions.length === 0) {
      setSelectedIndex(0)
      return
    }
    if (selectedIndex > filteredActions.length - 1) {
      setSelectedIndex(filteredActions.length - 1)
    }
  }, [filteredActions, selectedIndex])

  return (
    <div className="app-bg">
      <header className="topbar">
        <Link to="/" className="brand">
          <Sparkles size={16} /> VibeStack OS
        </Link>
        <nav className="desktop-nav">
          {visibleNav.map(([to, label]) => (
            <Link key={to} to={to} className={isActivePath(to) ? 'nav-link active' : 'nav-link'}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="topbar-right">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((prev) => (prev === 'forest' ? 'paper' : 'forest'))}
          >
            {theme === 'forest' ? 'Paper' : 'Forest'}
          </button>
          {user ? (
            <button className="command-trigger" type="button" onClick={() => setCommandOpen(true)}>
              <Command size={14} />
              <span>Quick Actions</span>
              <kbd>{shortcutLabel}</kbd>
            </button>
          ) : null}
          {user ? (
            <>
              <Badge tone="info">{user.role}</Badge>
              <Button tone="secondary" onClick={async () => logout()}>Logout</Button>
            </>
          ) : (
            <Link to="/login"><Button tone="secondary">Login</Button></Link>
          )}
          <button
            className="mobile-nav-btn"
            aria-label={mobileOpen ? 'close menu' : 'open menu'}
            onClick={() => setMobileOpen((state) => !state)}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-nav-wrap">
          <nav className="mobile-nav">
            {visibleNav.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className={isActivePath(to) ? 'mobile-nav-link active' : 'mobile-nav-link'}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <div className={user ? 'shell-frame shell-frame-auth' : 'shell-frame'}>
        {user ? (
          <aside className="desktop-sidebar">
            <div className="desktop-sidebar-card">
              <p className="eyebrow">Operator Nav</p>
              <nav className="desktop-sidebar-nav">
                {visibleNav.map(([to, label]) => {
                  const Icon = navIconFor(to)
                  return (
                    <Link key={to} to={to} className={isActivePath(to) ? 'desktop-sidebar-link active' : 'desktop-sidebar-link'}>
                      <Icon size={15} />
                      <span>{label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="desktop-sidebar-card">
              <p className="eyebrow">Focus</p>
              <p className="muted">Run one growth experiment and one reliability improvement each cycle.</p>
              <div className="row">
                <Badge tone="info">{user.role}</Badge>
                <Badge tone="neutral">Theme: {theme}</Badge>
              </div>
            </div>
          </aside>
        ) : null}
        <main className={user ? 'container shell-main' : 'container'}>{children}</main>
      </div>
      {commandOpen ? (
        <div className="command-backdrop" role="dialog" aria-modal="true" onClick={() => setCommandOpen(false)}>
          <div className="command-panel" onClick={(event) => event.stopPropagation()}>
            <div className="command-head">
              <Command size={16} />
              <input
                ref={commandInputRef}
                className="command-input"
                placeholder="Search actions or routes..."
                value={commandQuery}
                onChange={(event) => setCommandQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setCommandOpen(false)
                    return
                  }
                  if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    if (filteredActions.length === 0) return
                    setSelectedIndex((prev) => (prev + 1) % filteredActions.length)
                    return
                  }
                  if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    if (filteredActions.length === 0) return
                    setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length)
                    return
                  }
                  if (event.key === 'Enter' && selectedAction) {
                    event.preventDefault()
                    runAction(selectedAction)
                  }
                }}
              />
            </div>
            <div className="command-list">
              {recentActionIds.length > 0 ? (
                <div className="command-list-meta">
                  <span className="muted">Recent actions prioritized</span>
                  <button
                    type="button"
                    className="command-clear"
                    onClick={() => {
                      setRecentActionIds([])
                      try {
                        window.localStorage.removeItem('vibestack_recent_actions')
                      } catch {
                        // Ignore storage failures.
                      }
                    }}
                  >
                    Clear recent
                  </button>
                </div>
              ) : null}
              {filteredActions.length === 0 ? <p className="muted">No actions found.</p> : null}
              {filteredActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.id}
                    type="button"
                    className={index === selectedIndex ? 'command-item active' : 'command-item'}
                    onClick={() => runAction(action)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className="command-item-main">
                      <Icon size={14} />
                      {action.label}
                      {recentActionSet.has(action.id) ? <span className="command-recent">Recent</span> : null}
                    </span>
                    <span className="command-hint">{action.hint}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}
      {visibleDock.length > 0 && (
        <div className="mobile-dock-wrap">
          <nav className="mobile-dock">
            {visibleDock.map(([to, label, Icon]) => (
              <Link key={to} to={to} className={isActivePath(to) ? 'mobile-dock-link active' : 'mobile-dock-link'}>
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
      <footer className="container footer muted">Built for fast operator-grade iteration.</footer>
    </div>
  )
}
