import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium capitalize',
  {
    variants: {
      variant: {
        neutral: 'bg-slate-100 border-slate-200',
        success: 'bg-emerald-100 border-emerald-200',
        info: 'bg-blue-100 border-blue-200',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
)

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

