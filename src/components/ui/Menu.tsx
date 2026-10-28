import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../lib/cn'

export type MenuItem = {
  label: string
  icon?: ReactNode
  to?: string
  onSelect?: () => void
  tone?: 'danger'
  /** Classes extras do item, por exemplo para exibi-lo só no celular. */
  className?: string
}

/**
 * Menu contextual (Soft Neumorphic). Abre e fecha por toque ou clique,
 * navega com as setas, Home e End, fecha com Escape, Tab ou clique fora e
 * devolve o foco ao botão. Não bloqueia a página.
 */
export function Menu({
  label,
  buttonContent,
  buttonClassName,
  header,
  items,
  placement = 'bottom',
}: {
  label: string
  buttonContent: ReactNode
  buttonClassName?: string
  header?: ReactNode
  items: MenuItem[]
  placement?: 'bottom' | 'top'
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const menuId = useId()

  const menuItems = () =>
    Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []).filter(
      (item) => item.offsetParent !== null,
    )

  const close = useCallback((returnFocus = true) => {
    setOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    menuItems()[0]?.focus()

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function onMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const list = menuItems()
    const index = list.indexOf(document.activeElement as HTMLElement)
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        list[(index + 1) % list.length]?.focus()
        break
      case 'ArrowUp':
        event.preventDefault()
        list[(index - 1 + list.length) % list.length]?.focus()
        break
      case 'Home':
        event.preventDefault()
        list[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        list[list.length - 1]?.focus()
        break
      case 'Escape':
        event.preventDefault()
        event.stopPropagation()
        close()
        break
      case 'Tab':
        close(false)
        break
    }
  }

  function select(item: MenuItem) {
    close(false)
    if (item.to) navigate(item.to)
    item.onSelect?.()
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault()
            setOpen(true)
          }
        }}
        className={buttonClassName}
      >
        {buttonContent}
      </button>

      {open && (
        <div
          ref={listRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className={cn(
            'absolute right-0 z-menu w-[min(288px,calc(100vw-32px))] overflow-y-auto rounded-menu bg-surface p-2 shadow-menu',
            placement === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2',
          )}
          style={{ maxHeight: 'min(420px, calc(100dvh - 120px))' }}
        >
          {header && <div className="px-3 pb-3 pt-2">{header}</div>}
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                tabIndex={-1}
                onClick={() => select(item)}
                className={cn(
                  'flex min-h-touch w-full items-center gap-3 rounded-pill px-4 text-left text-sm font-medium transition-colors',
                  'focus-visible:outline-offset-0',
                  item.tone === 'danger'
                    ? 'text-danger hover:bg-danger-soft focus:bg-danger-soft'
                    : 'text-ink hover:bg-surface-hover focus:bg-surface-hover',
                  item.className,
                )}
              >
                {item.icon && (
                  <span className={cn('shrink-0', item.tone === 'danger' ? 'text-danger' : 'text-icon')} aria-hidden>
                    {item.icon}
                  </span>
                )}
                <span className="min-w-0 flex-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
