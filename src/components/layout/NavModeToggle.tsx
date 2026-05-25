export type NavMode = 'public' | 'user' | 'admin'

type NavModeToggleProps = {
  mode: NavMode
  showUser: boolean
  showAdmin: boolean
  onChange: (mode: NavMode) => void
}

export function NavModeToggle({ mode, showUser, showAdmin, onChange }: NavModeToggleProps) {
  const tabs: Array<{ id: NavMode; label: string }> = [{ id: 'public', label: 'Public' }]
  if (showUser) tabs.push({ id: 'user', label: 'User' })
  if (showAdmin) tabs.push({ id: 'admin', label: 'Admin' })

  return (
    <div className="nav-mode-toggle" role="tablist" aria-label="Navigation section">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={mode === tab.id}
          className={mode === tab.id ? 'nav-mode-btn active' : 'nav-mode-btn'}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function inferNavMode(pathname: string, options: { hasUser: boolean; hasAdmin: boolean }): NavMode {
  if (options.hasAdmin && (pathname.startsWith('/admin') || pathname.startsWith('/ai/'))) return 'admin'
  if (
    options.hasUser &&
    (pathname === '/dashboard' || pathname.startsWith('/profile') || pathname.startsWith('/settings'))
  ) {
    return 'user'
  }
  return 'public'
}
