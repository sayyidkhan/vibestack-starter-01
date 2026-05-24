import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-60',
  {
    variants: {
      variant: {
        default: 'bg-[var(--accent)] text-white hover:brightness-105',
        secondary: 'border border-[var(--line)] bg-white text-[var(--text)] hover:bg-slate-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />
}

