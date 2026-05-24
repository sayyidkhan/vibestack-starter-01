import { createContext, useContext, useMemo, useState } from 'react'

type Toast = { id: string; message: string }

type ToastContextValue = {
  toasts: Toast[]
  pushToast: (message: string) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const value = useMemo(
    () => ({
      toasts,
      pushToast: (message: string) => {
        const id = crypto.randomUUID()
        setToasts((prev) => [...prev, { id, message }])
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id))
        }, 2600)
      },
      dismissToast: (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      },
    }),
    [toasts],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
