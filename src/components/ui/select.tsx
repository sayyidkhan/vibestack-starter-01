import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'mt-1 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[var(--accent)] focus:ring-2',
        className,
      )}
      {...props}
    />
  )
}

