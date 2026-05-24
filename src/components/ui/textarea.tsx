import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'textarea mt-1 w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[var(--accent)] focus:ring-2',
        className,
      )}
      {...props}
    />
  )
}

