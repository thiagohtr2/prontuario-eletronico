import type { ReactNode } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

export function Spinner({ className }: { className?: string }) {
  return <Loader2 size={20} className={cn('animate-spin text-muted', className)} aria-hidden />
}

export function LoadingState({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-muted" role="status">
      <Spinner />
      <span>{label}</span>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-muted">
          {icon}
        </div>
      )}
      <p className="text-md font-semibold text-ink">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center" role="alert">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-danger">
        <AlertCircle size={22} />
      </div>
      <p className="text-md font-semibold text-ink">Não foi possível carregar</p>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-slate-100', className)} />
}
