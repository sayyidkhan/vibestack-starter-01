import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'
import { Badge as ShadcnBadge } from './badge'
import { Button as ShadcnButton } from './button'
import { Card as ShadcnCard } from './card'
import { Input as ShadcnInput } from './input'
import { Select as ShadcnSelect } from './select'
import { Textarea as ShadcnTextarea } from './textarea'

export function Card({
  className,
  tone,
  children,
}: {
  className?: string
  tone?: 'default' | 'spotlight' | 'table'
  children: ReactNode
}) {
  const variant = tone === 'spotlight' ? 'spotlight' : tone === 'table' ? 'table' : 'default'
  return <ShadcnCard variant={variant} className={className}>{children}</ShadcnCard>
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'info'
}) {
  return <ShadcnBadge variant={tone}>{children}</ShadcnBadge>
}

export function Button({
  className,
  tone,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'primary' | 'secondary'; children: ReactNode }) {
  const variant = tone === 'secondary' ? 'secondary' : 'default'
  return <ShadcnButton variant={variant} className={className} {...props}>{children}</ShadcnButton>
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <ShadcnInput {...props} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <ShadcnTextarea {...props} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <ShadcnSelect {...props} />
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('pill', className)}>{children}</span>
}

export function SectionHeader({
  eyebrow,
  title,
  pill,
}: {
  eyebrow?: string
  title: string
  pill?: ReactNode
}) {
  return (
    <div className="section-head">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {pill ? <Pill>{pill}</Pill> : null}
    </div>
  )
}
