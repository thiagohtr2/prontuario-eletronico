import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { createPortal } from 'react-dom'
import { create } from 'zustand'
import { AlertTriangle, Check, CheckCircle2, Copy, Info, Monitor, Smartphone, Tablet, X, XCircle } from 'lucide-react'
import { GLOSSARY } from '@/core/glossary'
import type { Device } from '@/core/types'

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')
export { cx }

/* -------------------------------------------------------------------------- */
/* Botões                                                                      */
/* -------------------------------------------------------------------------- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  iconRight?: ReactNode
  block?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', icon, iconRight, block, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx('ui-btn', `ui-btn--${variant}`, size !== 'md' && `ui-btn--${size}`, block && 'ui-btn--block', className)}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  )
})

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  outlined?: boolean
  size?: 'sm' | 'md'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, outlined, size = 'md', className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cx('ui-icon-btn', outlined && 'ui-icon-btn--outlined', size === 'sm' && 'ui-icon-btn--sm', className)}
      {...rest}
    >
      {children}
    </button>
  )
})

/** Agrupa ações com espaçamento consistente (nunca botões grudados). */
export function Actions({ children, align, className }: { children: ReactNode; align?: 'end' | 'between'; className?: string }) {
  return <div className={cx('ui-actions', align && `ui-actions--${align}`, className)}>{children}</div>
}

/* -------------------------------------------------------------------------- */
/* Controles                                                                   */
/* -------------------------------------------------------------------------- */

export function Switch({
  checked,
  onChange,
  label,
  description,
  id,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  description?: ReactNode
  id?: string
}) {
  const autoId = useId()
  return (
    <label className="ui-switch" htmlFor={id ?? autoId}>
      <input id={id ?? autoId} type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="ui-switch__track" aria-hidden="true" />
      <span>
        {label}
        {description && <span className="ui-help" style={{ display: 'block' }}>{description}</span>}
      </span>
    </label>
  )
}

export interface SegmentOption<T extends string> {
  value: T
  label: ReactNode
  icon?: ReactNode
  title?: string
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T
  onChange: (value: T) => void
  options: SegmentOption<T>[]
  label: string
}) {
  return (
    <div className="ui-segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} title={o.title} onClick={() => onChange(o.value)}>
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function DeviceToggle({
  value,
  onChange,
  devices = ['desktop', 'mobile'],
}: {
  value: Device
  onChange: (d: Device) => void
  devices?: Device[]
}) {
  const all: SegmentOption<Device>[] = [
    { value: 'desktop', label: 'Computador', icon: <Monitor /> },
    { value: 'tablet', label: 'Tablet', icon: <Tablet /> },
    { value: 'mobile', label: 'Celular', icon: <Smartphone /> },
  ]
  return <Segmented label="Dispositivo da prévia" value={value} onChange={onChange} options={all.filter((o) => devices.includes(o.value))} />
}

export interface FilterOption {
  id: string
  label: string
  count?: number
}

/** Filtros em formato de chips. Trocar filtro nunca move a rolagem da página. */
export function FilterChips({
  options,
  value,
  onChange,
  label,
}: {
  options: FilterOption[]
  value: string
  onChange: (id: string) => void
  label: string
}) {
  return (
    <div className="ui-chips" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" className="ui-chip" aria-pressed={o.id === value} onClick={() => onChange(o.id)}>
          {o.label}
          {o.count !== undefined && <span className="ui-chip__count">{o.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function Badge({ tone, children, icon }: { tone?: 'accent' | 'success' | 'warning' | 'danger'; children: ReactNode; icon?: ReactNode }) {
  return (
    <span className={cx('ui-badge', tone && `ui-badge--${tone}`)}>
      {icon}
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Campos                                                                      */
/* -------------------------------------------------------------------------- */

export function Field({
  label,
  help,
  error,
  children,
  full,
  htmlFor,
}: {
  label: ReactNode
  help?: ReactNode
  error?: ReactNode
  children: ReactNode
  full?: boolean
  htmlFor?: string
}) {
  return (
    <div className={cx('ui-field', full && 'ui-field--full')}>
      <label className="ui-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error ? <span className="ui-error">{error}</span> : help ? <span className="ui-help">{help}</span> : null}
    </div>
  )
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { mono?: boolean }>(function Input(
  { className, mono, ...rest },
  ref,
) {
  return <input ref={ref} className={cx('ui-input', mono && 'ui-input--mono', className)} {...rest} />
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...rest },
  ref,
) {
  return <textarea ref={ref} className={cx('ui-textarea', className)} {...rest} />
})

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...rest },
  ref,
) {
  return (
    <select ref={ref} className={cx('ui-select', className)} {...rest}>
      {children}
    </select>
  )
})

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar…',
  label,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  label: string
}) {
  return (
    <div className="ui-search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input className="ui-input" type="search" aria-label={label} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Estrutura de página                                                         */
/* -------------------------------------------------------------------------- */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header className="ui-page-head">
      <div className="ui-page-head__text">
        {eyebrow && <span className="ui-eyebrow">{eyebrow}</span>}
        <h1 className="ui-page-title">{title}</h1>
        {description && <p className="ui-page-desc">{description}</p>}
      </div>
      {actions && <Actions>{actions}</Actions>}
    </header>
  )
}

export function Section({
  title,
  description,
  actions,
  children,
  id,
}: {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  children: ReactNode
  id?: string
}) {
  return (
    <section className="ui-section" id={id} aria-labelledby={title && id ? `${id}-title` : undefined}>
      {(title || actions) && (
        <div className="ui-section__head">
          <div className="u-stack-sm" style={{ gap: 4 }}>
            {title && (
              <h2 className="ui-section__title" id={id ? `${id}-title` : undefined}>
                {title}
              </h2>
            )}
            {description && <p className="ui-section__desc">{description}</p>}
          </div>
          {actions && <Actions>{actions}</Actions>}
        </div>
      )}
      {children}
    </section>
  )
}

export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warning' | 'danger' | 'success'
  title?: ReactNode
  children?: ReactNode
}) {
  const icon =
    tone === 'warning' ? <AlertTriangle /> : tone === 'danger' ? <XCircle /> : tone === 'success' ? <CheckCircle2 /> : <Info />
  return (
    <div className={cx('ui-callout', tone !== 'info' && `ui-callout--${tone}`)} role={tone === 'danger' ? 'alert' : undefined}>
      {icon}
      <div>
        {title && <strong>{title} </strong>}
        {children}
      </div>
    </div>
  )
}

export function EmptyState({ icon, title, children, action }: { icon?: ReactNode; title: ReactNode; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="ui-empty">
      {icon}
      <p className="ui-empty__title">{title}</p>
      {children && <p className="u-small">{children}</p>}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  )
}

export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
  label,
}: {
  value: T
  onChange: (v: T) => void
  tabs: { value: T; label: ReactNode; icon?: ReactNode }[]
  label: string
}) {
  return (
    <div className="ui-tabs" role="tablist" aria-label={label}>
      {tabs.map((t) => (
        <button key={t.value} type="button" role="tab" className="ui-tab" aria-selected={t.value === value} onClick={() => onChange(t.value)}>
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Cartão selecionável                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Cartão de galeria. Clicar seleciona e mantém a posição de rolagem: o estado
 * "selecionado" é desenhado com borda + selo absoluto, sem alterar a altura do cartão.
 */
export function OptionCard({
  selected,
  onSelect,
  media,
  title,
  meta,
  description,
  footer,
  selectedLabel = 'Selecionado',
  testId,
  ariaLabel,
}: {
  selected: boolean
  onSelect: () => void
  media?: ReactNode
  title: ReactNode
  meta?: ReactNode
  description?: ReactNode
  footer?: ReactNode
  selectedLabel?: string
  testId?: string
  ariaLabel?: string
}) {
  return (
    <div className="ui-option" data-selected={selected} data-testid={testId}>
      {selected && (
        <span className="ui-option__check">
          <Check aria-hidden="true" />
          {selectedLabel}
        </span>
      )}
      <button
        type="button"
        className="ui-option__hit"
        aria-pressed={selected}
        aria-label={ariaLabel}
        onClick={() => keepScroll(onSelect)}
      >
        {media && <div className="ui-option__media">{media}</div>}
        <div className="ui-option__body">
          <span className="ui-option__title">{title}</span>
          {meta && <span className="ui-option__meta">{meta}</span>}
          {description && <span className="ui-option__desc">{description}</span>}
        </div>
      </button>
      {footer && <div className="ui-option__footer">{footer}</div>}
    </div>
  )
}

/**
 * Executa uma alteração de estado garantindo que a página continue exatamente na mesma
 * posição vertical. Não rola para lugar nenhum: apenas desfaz qualquer deslocamento
 * acidental provocado pelo navegador (foco, ancoragem, mudança de altura).
 */
export function keepScroll(action: () => void) {
  if (typeof window === 'undefined') return action()
  const x = window.scrollX
  const y = window.scrollY
  action()
  const restore = () => {
    if (window.scrollY !== y || window.scrollX !== x) window.scrollTo({ left: x, top: y, behavior: 'instant' as ScrollBehavior })
  }
  requestAnimationFrame(() => {
    restore()
    requestAnimationFrame(restore)
  })
}

/* -------------------------------------------------------------------------- */
/* Glossário para leigos                                                       */
/* -------------------------------------------------------------------------- */

/** Termo técnico com explicação simples ao passar o mouse, focar ou tocar. */
export function Term({ id, children }: { id: keyof typeof GLOSSARY; children?: ReactNode }) {
  // Passar o mouse mostra; clicar ou tocar fixa a explicação até Esc, outro clique ou sair do termo.
  const [hover, setHover] = useState(false)
  const [pinned, setPinned] = useState(false)
  const open = hover || pinned
  const entry = GLOSSARY[id]
  const tipId = useId()
  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <button
        type="button"
        className="ui-term"
        aria-describedby={open ? tipId : undefined}
        aria-expanded={pinned}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => {
          setHover(false)
          setPinned(false)
        }}
        onClick={() => setPinned((p) => !p || hover)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setHover(false)
            setPinned(false)
          }
        }}
        style={{ all: 'unset', borderBottom: '1px dashed var(--s-text-3)', cursor: 'help' }}
      >
        {children ?? entry.term}
      </button>
      {open && (
        <span
          role="tooltip"
          id={tipId}
          style={{
            position: 'absolute',
            left: 0,
            top: 'calc(100% + 6px)',
            zIndex: 60,
            width: 'min(280px, 80vw)',
            padding: '10px 12px',
            borderRadius: 10,
            background: '#15151a',
            color: '#fff',
            fontSize: 13.5,
            lineHeight: 1.45,
            fontWeight: 400,
            boxShadow: 'var(--float-shadow)',
          }}
        >
          <strong style={{ display: 'block', marginBottom: 2 }}>{entry.term}</strong>
          {entry.text}
        </span>
      )}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Modal                                                                       */
/* -------------------------------------------------------------------------- */

/** Pilha de modais abertos: garante que Esc e Tab atuem só no modal do topo. */
const MODAL_STACK: object[] = []
let bodyOverflowBeforeModals = ''

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 640,
  testId,
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  footer?: ReactNode
  width?: number
  testId?: string
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  // Referência estável: o efeito não roda de novo quando o pai passa uma função nova a cada render.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const token = {}
    if (MODAL_STACK.length === 0) bodyOverflowBeforeModals = document.body.style.overflow
    MODAL_STACK.push(token)
    const isTop = () => MODAL_STACK[MODAL_STACK.length - 1] === token
    const onKey = (e: KeyboardEvent) => {
      // Com modais sobrepostos, só o mais recente reage ao teclado (Esc fecha um por vez).
      if (!isTop()) return
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCloseRef.current()
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }))
    return () => {
      document.removeEventListener('keydown', onKey)
      const index = MODAL_STACK.indexOf(token)
      if (index >= 0) MODAL_STACK.splice(index, 1)
      if (MODAL_STACK.length === 0) document.body.style.overflow = bodyOverflowBeforeModals
      previous?.focus?.({ preventScroll: true })
    }
  }, [open])

  if (!open) return null
  return createPortal(
    <div className="ui-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCloseRef.current()}>
      <div
        ref={panelRef}
        className="ui-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{ ['--modal-w' as string]: `${width}px` }}
        data-testid={testId}
      >
        <div className="ui-modal__head">
          <div style={{ minWidth: 0 }}>
            <h2 className="ui-modal__title" id={titleId}>
              {title}
            </h2>
            {subtitle && <p className="ui-modal__subtitle">{subtitle}</p>}
          </div>
          <IconButton label="Fechar" onClick={onClose}>
            <X />
          </IconButton>
        </div>
        <div className="ui-modal__body">{children}</div>
        {footer && <div className="ui-modal__foot">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}

/* -------------------------------------------------------------------------- */
/* Toasts                                                                      */
/* -------------------------------------------------------------------------- */

interface ToastItem {
  id: number
  message: string
  tone: 'success' | 'error' | 'info'
}

const useToasts = create<{ items: ToastItem[]; push: (t: Omit<ToastItem, 'id'>) => void; dismiss: (id: number) => void }>((set) => ({
  items: [],
  push: (t) => {
    const id = Date.now() + Math.random()
    set((s) => ({ items: [...s.items.slice(-2), { ...t, id }] }))
    setTimeout(() => set((s) => ({ items: s.items.filter((i) => i.id !== id) })), 3200)
  },
  dismiss: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}))

export const toast = {
  success: (message: string) => useToasts.getState().push({ message, tone: 'success' }),
  error: (message: string) => useToasts.getState().push({ message, tone: 'error' }),
  info: (message: string) => useToasts.getState().push({ message, tone: 'info' }),
}

export function Toaster() {
  const items = useToasts((s) => s.items)
  return (
    <div className="ui-toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={cx('ui-toast', t.tone === 'error' && 'ui-toast--error')}>
          {t.tone === 'error' ? <XCircle /> : t.tone === 'success' ? <CheckCircle2 /> : <Info />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Copiar                                                                      */
/* -------------------------------------------------------------------------- */

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback para contextos sem permissão de área de transferência (ex.: file://).
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    ta.remove()
    return ok
  }
}

export function CopyButton({
  text,
  label = 'Copiar',
  variant = 'secondary',
  size = 'md',
}: {
  text: string | (() => string)
  label?: string
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
}) {
  const [done, setDone] = useState(false)
  return (
    <Button
      variant={variant}
      size={size}
      icon={done ? <Check /> : <Copy />}
      onClick={async () => {
        const ok = await copyText(typeof text === 'function' ? text() : text)
        if (ok) {
          setDone(true)
          toast.success('Copiado para a área de transferência.')
          setTimeout(() => setDone(false), 1600)
        } else {
          toast.error('Não foi possível copiar. Selecione o texto e copie manualmente.')
        }
      }}
    >
      {done ? 'Copiado' : label}
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/* Media query                                                                 */
/* -------------------------------------------------------------------------- */

/** Acompanha uma media query (ex.: '(max-width: 720px)'). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => (typeof window !== 'undefined' && 'matchMedia' in window ? window.matchMedia(query).matches : false))
  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}
