import { Link } from '@tanstack/react-router'
import { Bot, ChevronDown, LogOut, Settings, ShieldCheck, User2 } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { AppUser } from '../../lib/types'
import { Badge } from '../ui/primitives'

type UserMenuProps = {
  user: AppUser
  showSettings: boolean
  adminTools?: Array<{ to: string; label: string; icon: ReactNode }>
  onSignOut: () => void
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U'
}

export function UserMenu({ user, showSettings, adminTools = [], onSignOut }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    let removeListeners: (() => void) | undefined
    const timer = window.setTimeout(() => {
      function handlePointer(event: MouseEvent) {
        if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
      }
      function handleKey(event: KeyboardEvent) {
        if (event.key === 'Escape') setOpen(false)
      }
      document.addEventListener('mousedown', handlePointer)
      document.addEventListener('keydown', handleKey)
      removeListeners = () => {
        document.removeEventListener('mousedown', handlePointer)
        document.removeEventListener('keydown', handleKey)
      }
    }, 0)
    return () => {
      window.clearTimeout(timer)
      removeListeners?.()
    }
  }, [open])

  return (
    <div className="nav-menu user-menu" ref={rootRef}>
      <button
        type="button"
        className="user-menu-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${user.name}`}
        onClick={() => setOpen((state) => !state)}
      >
        <span className="user-menu-avatar" aria-hidden>{initials(user.name)}</span>
        <span className="user-menu-label">{user.name.split(' ')[0]}</span>
        <ChevronDown size={14} className={open ? 'nav-menu-chevron open' : 'nav-menu-chevron'} aria-hidden />
      </button>
      {open ? (
        <div className="nav-menu-panel user-menu-panel" role="menu">
          <div className="user-menu-header">
            <span className="user-menu-header-name">{user.name}</span>
            <span className="user-menu-header-email">{user.email}</span>
            <Badge tone={user.role === 'admin' ? 'info' : 'neutral'}>{user.role}</Badge>
          </div>
          <Link to="/profile" role="menuitem" className="nav-menu-item" onClick={() => setOpen(false)}>
            <User2 size={14} aria-hidden />
            Profile
          </Link>
          {showSettings ? (
            <Link to="/settings" role="menuitem" className="nav-menu-item" onClick={() => setOpen(false)}>
              <Settings size={14} aria-hidden />
              Settings
            </Link>
          ) : null}
          {adminTools.length > 0 ? (
            <>
              <p className="nav-menu-section-label">Admin tools</p>
              {adminTools.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  role="menuitem"
                  className="nav-menu-item"
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </>
          ) : null}
          <button type="button" role="menuitem" className="nav-menu-item nav-menu-item-danger" onClick={() => {
            setOpen(false)
            onSignOut()
          }}>
            <LogOut size={14} aria-hidden />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  )
}
