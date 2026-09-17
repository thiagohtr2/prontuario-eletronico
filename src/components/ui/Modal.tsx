import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  footer?: ReactNode
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
}

export function Modal({ open, onClose, title, description, size = 'md', children, footer }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('input, textarea, select, button')?.focus()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#2B2430]/45 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className={cn(
          'flex max-h-[92vh] w-full flex-col rounded-t-xl bg-surface shadow-modal sm:rounded-xl',
          sizes[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-slate-100 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-line px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  )
}
