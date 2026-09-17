import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export function PageHeader({
  title,
  description,
  action,
  search,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  search?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('border-b border-line bg-surface', className)}>
      <div className="mx-auto flex max-w-content flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-ink lg:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
          {search}
          {action}
        </div>
      </div>
    </header>
  )
}

export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto max-w-content px-4 py-6 sm:px-6 lg:py-8', className)}>{children}</div>
  )
}
