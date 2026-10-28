import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

/**
 * Abertura da página dentro da área de conteúdo: título em serifa, descrição
 * e ações. A localização (breadcrumbs) fica no header flutuante do layout.
 */
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
    <header className={cn('pb-6 pt-2 md:pt-0', className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="display-title break-words text-[34px] leading-[1.1] sm:text-[40px]">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">{description}</p>}
        </div>
        {(search || action) && (
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:shrink-0 lg:justify-end">
            {search}
            {action}
          </div>
        )}
      </div>
    </header>
  )
}

export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('max-w-content pb-8', className)}>{children}</div>
}
