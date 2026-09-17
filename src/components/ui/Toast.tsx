import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react'
import type { ToastItem, ToastKind } from '../../context/toast-types'
import { cn } from '../../lib/cn'

const icons: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
}

const tones: Record<ToastKind, string> = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
}

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
}) {
  if (toasts.length === 0) return null
  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
      aria-live="polite"
      role="status"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.kind]
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3 shadow-toast"
          >
            <Icon size={18} className={cn('mt-0.5 shrink-0', tones[toast.kind])} aria-hidden />
            <p className="flex-1 text-sm text-ink">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Fechar aviso"
              className="-mr-1 -mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-slate-100 hover:text-ink"
            >
              <X size={15} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
