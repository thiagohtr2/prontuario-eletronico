import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react'
import type { ToastItem, ToastKind } from '../../context/toast-types'
import { cn } from '../../lib/cn'
import { IconButton } from './Button'

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

/**
 * Avisos temporários. No celular ficam acima do dock flutuante (a variável
 * --toast-bottom é definida pelo layout autenticado); no desktop, no canto.
 */
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
      className="pointer-events-none fixed inset-x-4 z-toast flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
      style={{ bottom: 'var(--toast-bottom, max(16px, env(safe-area-inset-bottom)))' }}
      aria-live="polite"
      role="status"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.kind]
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-brand border border-line bg-surface py-1 pl-4 pr-1 shadow-toast"
          >
            <Icon size={18} className={cn('shrink-0', tones[toast.kind])} aria-hidden />
            <p className="min-w-0 flex-1 py-2 text-sm text-ink">{toast.message}</p>
            <IconButton label="Fechar aviso" icon={<X size={16} />} onClick={() => onDismiss(toast.id)} />
          </div>
        )
      })}
    </div>
  )
}
