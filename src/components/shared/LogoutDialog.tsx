import { Loader2, LogOut } from 'lucide-react'
import type { AppUser } from '../../lib/types'
import { Button } from '../ui/primitives'

type LogoutDialogProps = {
  open: boolean
  user: AppUser | null
  busy?: boolean
  onConfirm: () => Promise<void> | void
  onCancel: () => void
}

export function LogoutDialog({ open, user, busy = false, onConfirm, onCancel }: LogoutDialogProps) {
  if (!open) return null

  return (
    <div className="dialog-backdrop logout-dialog-backdrop" role="presentation" onClick={busy ? undefined : onCancel}>
      <section
        className="dialog card logout-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="logout-dialog-icon" aria-hidden>
          <LogOut size={20} />
        </div>
        <p className="eyebrow">Session</p>
        <h3 id="logout-dialog-title">Sign out of VibeStack?</h3>
        <p className="muted logout-dialog-copy">
          You will leave your workspace and return to the public site. Unsaved changes in open forms may be lost.
        </p>
        {user ? (
          <div className="logout-dialog-user">
            <span className="logout-dialog-user-name">{user.name}</span>
            <span className="logout-dialog-user-email">{user.email}</span>
          </div>
        ) : null}
        <div className="logout-dialog-actions">
          <Button tone="secondary" className="logout-dialog-cancel" onClick={onCancel} disabled={busy}>
            Stay signed in
          </Button>
          <Button className="logout-dialog-confirm" onClick={onConfirm} disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="logout-dialog-spinner" size={16} aria-hidden />
                Signing out...
              </>
            ) : (
              'Sign out'
            )}
          </Button>
        </div>
      </section>
    </div>
  )
}
