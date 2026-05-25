import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition duration-150 hover:-translate-y-px hover:shadow-sm active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none',
  {
    variants: {
      variant: {
        default: 'bg-[var(--accent)] text-white hover:brightness-105',
        secondary: 'border border-[var(--line)] bg-white text-[var(--text)] hover:border-[#bfdbfe] hover:bg-[var(--accent-soft)]',
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
