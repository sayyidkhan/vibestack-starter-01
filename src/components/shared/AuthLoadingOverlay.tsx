import { Loader2 } from 'lucide-react'

type AuthLoadingOverlayProps = {
  title: string
  description: string
}

export function AuthLoadingOverlay({ title, description }: AuthLoadingOverlayProps) {
  return (
    <div className="auth-loading-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="auth-loading-panel">
        <Loader2 className="auth-loading-spinner" size={28} aria-hidden />
        <p className="auth-loading-title">{title}</p>
        <p className="auth-loading-description">{description}</p>
      </div>
    </div>
  )
}
