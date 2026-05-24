import { useToast } from '../../context/toast'

export function Toaster() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="toaster" aria-live="polite" aria-label="notifications">
      {toasts.map((toast) => (
        <button key={toast.id} className="toast" onClick={() => dismissToast(toast.id)}>
          {toast.message}
        </button>
      ))}
    </div>
  )
}
