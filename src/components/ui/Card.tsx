import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type CardProps = HTMLAttributes<HTMLDivElement> & { padded?: boolean }

export function Card({ className, padded = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-line bg-surface shadow-card',
        padded && 'p-5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

type CardHeaderProps = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
