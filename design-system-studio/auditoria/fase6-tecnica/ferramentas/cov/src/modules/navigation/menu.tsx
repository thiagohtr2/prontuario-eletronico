import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
} from 'react'

/**
 * Infraestrutura de menus das prévias: um único menu aberto por prévia, fechamento com
 * Esc e clique fora, foco devolvido ao gatilho e painéis posicionados para nunca sair
 * da moldura da prévia (`[data-nv-frame]`) — ou da janela, quando não houver moldura.
 */

export interface MenuApi {
  open: string | null
  enabled: boolean
  /** O último menu foi aberto pelo teclado (o foco deve ir para dentro do painel). */
  keyboard: boolean
  toggle: (id: string, e?: ReactMouseEvent) => void
  show: (id: string) => void
  close: (returnFocus?: boolean) => void
  trigger: (id: string, haspopup?: 'menu' | 'dialog' | 'listbox' | 'true') => {
    'data-nv-trigger': string
    'aria-expanded': boolean
    'aria-haspopup': 'menu' | 'dialog' | 'listbox' | 'true'
    ref: (el: HTMLElement | null) => void
    onClick: (e: ReactMouseEvent) => void
  }
  triggerEl: (id: string) => HTMLElement | undefined
}

export function useMenus(enabled = true): MenuApi {
  const [open, setOpen] = useState<string | null>(null)
  const openRef = useRef<string | null>(null)
  openRef.current = open
  const triggers = useRef(new Map<string, HTMLElement>())
  // Callbacks de ref estáveis por id: o React não desanexa/reanexa o gatilho a cada render.
  const refCbs = useRef(new Map<string, (el: HTMLElement | null) => void>())
  const keyboard = useRef(false)
  const refFor = (id: string) => {
    let cb = refCbs.current.get(id)
    if (!cb) {
      cb = (el: HTMLElement | null) => {
        if (el) triggers.current.set(id, el)
        else triggers.current.delete(id)
      }
      refCbs.current.set(id, cb)
    }
    return cb
  }

  const close = useCallback((returnFocus = false) => {
    const current = openRef.current
    setOpen(null)
    if (returnFocus && current) triggers.current.get(current)?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const el = e.target as Element | null
      if (!el || typeof el.closest !== 'function') return
      if (el.closest(`[data-nv-panel="${open}"]`) || el.closest(`[data-nv-trigger="${open}"]`)) return
      setOpen(null)
    }
    // Captura na janela: o Esc fecha o menu antes de chegar a outros ouvintes (ex.: um modal).
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      e.preventDefault()
      close(true)
    }
    document.addEventListener('pointerdown', onDown, true)
    window.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      window.removeEventListener('keydown', onKey, true)
    }
  }, [open, close])

  return {
    open,
    enabled,
    keyboard: keyboard.current,
    toggle: (id, e) => {
      if (!enabled) return
      keyboard.current = e ? e.detail === 0 : false
      setOpen((o) => (o === id ? null : id))
    },
    show: (id) => {
      if (!enabled) return
      keyboard.current = false
      setOpen(id)
    },
    close,
    trigger: (id, haspopup = 'menu') => ({
      'data-nv-trigger': id,
      'aria-expanded': open === id,
      'aria-haspopup': haspopup,
      ref: refFor(id),
      onClick: (e: ReactMouseEvent) => {
        if (!enabled) return
        keyboard.current = e.detail === 0
        setOpen((o) => (o === id ? null : id))
      },
    }),
    triggerEl: (id) => triggers.current.get(id),
  }
}

export type Placement = 'bottom' | 'top' | 'right' | 'sheet'

interface Bounds {
  left: number
  right: number
  top: number
  bottom: number
  width: number
}

function boundsFor(root: HTMLElement): Bounds {
  const frame = root.closest('[data-nv-frame]') as HTMLElement | null
  if (frame) {
    const b = frame.getBoundingClientRect()
    return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, width: b.width }
  }
  const w = window.innerWidth
  const h = window.innerHeight
  return { left: 0, right: w, top: 0, bottom: h, width: w }
}

/** Calcula a posição (relativa a `root`) de um painel ancorado em `anchor`, sem sair dos limites. */
export function placePanel(
  anchor: HTMLElement,
  reference: HTMLElement,
  root: HTMLElement,
  width: number | 'anchor',
  align: 'start' | 'end' | 'center',
  placement: Placement,
): CSSProperties {
  // `reference` é o bloco de contenção real do painel (offsetParent); `root` é a prévia.
  const r = reference.getBoundingClientRect()
  const a = anchor.getBoundingClientRect()
  const b = boundsFor(root)
  const gap = 8
  if (placement === 'sheet') {
    const rr = root.getBoundingClientRect()
    return { left: b.left - r.left, width: b.width, top: rr.bottom - r.top, maxHeight: Math.max(160, b.bottom - rr.bottom) }
  }
  const wanted = width === 'anchor' ? a.width : width
  const w = Math.max(160, Math.min(wanted, b.width - gap * 2))
  const minL = b.left - r.left + gap
  const maxL = b.right - r.left - w - gap
  const clampL = (v: number) => Math.max(minL, Math.min(v, maxL))
  if (placement === 'right') {
    let left = a.right - r.left + 6
    if (left > maxL) left = a.left - r.left - w - 6
    const top = Math.max(b.top - r.top + gap, Math.min(a.top - r.top - 6, b.bottom - r.top - 200))
    return { left: Math.max(minL, left), top, width: w, maxHeight: Math.max(140, b.bottom - r.top - top - gap) }
  }
  let left = align === 'end' ? a.right - r.left - w : align === 'center' ? a.left + a.width / 2 - r.left - w / 2 : a.left - r.left
  left = clampL(left)
  if (placement === 'top') {
    return { left, bottom: r.bottom - a.top + 6, width: w, maxHeight: Math.max(140, a.top - b.top - gap) }
  }
  return { left, top: a.bottom - r.top + 6, width: w, maxHeight: Math.max(140, b.bottom - a.bottom - gap - 6) }
}

const FOCUSABLE = '[role="menuitem"], [role="option"], [role="menuitemradio"], button:not([disabled]), input, [href]'

/** Navegação por setas entre as opções de um painel. */
function onPanelKey(e: ReactKeyboardEvent<HTMLDivElement>) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.tagName !== 'INPUT')
  if (!items.length) return
  e.preventDefault()
  const i = items.indexOf(document.activeElement as HTMLElement)
  let next = 0
  if (e.key === 'ArrowDown') next = i < 0 ? 0 : (i + 1) % items.length
  if (e.key === 'ArrowUp') next = i <= 0 ? items.length - 1 : i - 1
  if (e.key === 'End') next = items.length - 1
  items[next].focus({ preventScroll: true })
}

/** Painel flutuante (menu, popover, mega menu, painel do celular) preso à moldura da prévia. */
export function Popover({
  id,
  menus,
  root,
  width,
  align = 'start',
  placement = 'bottom',
  role = 'menu',
  label,
  className,
  style,
  children,
  focusInput,
}: {
  id: string
  menus: MenuApi
  root: RefObject<HTMLElement>
  width: number | 'anchor'
  align?: 'start' | 'end' | 'center'
  placement?: Placement
  role?: 'menu' | 'dialog' | 'listbox' | 'region'
  label: string
  className?: string
  style?: CSSProperties
  children: ReactNode
  /** Foca o primeiro campo do painel ao abrir (paleta de comandos). */
  focusInput?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<CSSProperties | null>(null)
  const isOpen = menus.open === id

  useLayoutEffect(() => {
    if (!isOpen) {
      setPos(null)
      return
    }
    const anchor = menus.triggerEl(id)
    const r = root.current
    if (!anchor || !r) return
    const reference = (ref.current?.offsetParent as HTMLElement | null) ?? r
    setPos(placePanel(anchor, reference, r, width, align, placement))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, id])

  useEffect(() => {
    if (!isOpen || !pos || !ref.current) return
    const el = ref.current
    if (focusInput) {
      el.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true })
    } else if (menus.keyboard) {
      el.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, pos === null])

  if (!isOpen) return null
  return (
    <div
      ref={ref}
      data-nv-panel={id}
      role={role}
      aria-label={label}
      className={['nvs-pop', className].filter(Boolean).join(' ')}
      data-placement={placement}
      style={{ position: 'absolute', zIndex: 30, visibility: pos ? 'visible' : 'hidden', ...pos, ...style }}
      onKeyDown={onPanelKey}
    >
      {children}
    </div>
  )
}

/** Mede a largura de um elemento (0 até a primeira medição; seguro sem ResizeObserver). */
export function useWidth(ref: RefObject<HTMLElement>): number {
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setW(el.getBoundingClientRect().width)
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width !== undefined) setW(width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return w
}

/** Torna um trecho inerte (sem foco nem clique) quando a prévia não é interativa. */
export function useInert(ref: RefObject<HTMLElement>, inert: boolean) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (inert) el.setAttribute('inert', '')
    else el.removeAttribute('inert')
  }, [ref, inert])
}
