import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const cardVariants = cva('card', {
  variants: {
    variant: {
      default: '',
      spotlight: 'spotlight',
      table: 'table-card',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type CardProps = HTMLAttributes<HTMLElement> & VariantProps<typeof cardVariants>

export function Card({ className, variant, ...props }: CardProps) {
  return <section className={cn(cardVariants({ variant }), className)} {...props} />
}

