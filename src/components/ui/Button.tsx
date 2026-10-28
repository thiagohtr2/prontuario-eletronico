import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse'
type Size = 'md' | 'sm'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

/**
 * Botões Soft Pill: pílula sem borda nem sombra. O secundário é o fundo
 * claro com texto e ícone escuros da referência aprovada.
 */
export const buttonVariants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-fg hover:bg-primary-hover active:bg-primary-pressed',
  secondary: 'bg-surface-hover text-ink hover:bg-primary-soft active:bg-selection',
  ghost: 'bg-transparent text-muted hover:bg-surface-hover hover:text-ink active:bg-primary-soft',
  danger: 'bg-danger text-primary-fg hover:brightness-90 active:brightness-[.85]',
  // Para fundos escuros (hero da landing): fundo claro, texto no tom de marca.
  inverse: 'bg-primary-soft text-ink hover:bg-surface active:bg-selection',
}

const sizes: Record<Size, string> = {
  md: 'h-control px-6 text-sm',
  sm: 'h-control-sm px-5 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', loading, icon, fullWidth, className, children, disabled, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex min-w-touch shrink-0 items-center justify-center gap-2 rounded-pill font-medium transition-colors',
        'disabled:cursor-not-allowed',
        buttonVariants[variant],
        // Desabilitado de verdade fica neutro; carregando mantém a cor da ação.
        disabled && !loading && '!bg-disabled !text-disabled-fg hover:!brightness-100',
        loading && 'cursor-wait',
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  )
})

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: string
  icon: ReactNode
  variant?: 'soft' | 'ghost' | 'danger' | 'inverse'
}

const iconVariants = {
  soft: 'bg-surface-hover text-ink hover:bg-primary-soft hover:text-primary active:bg-selection',
  ghost: 'bg-transparent text-icon hover:bg-surface-hover hover:text-icon-hover active:bg-primary-soft',
  danger: 'bg-transparent text-icon hover:bg-danger-soft hover:text-danger active:bg-danger-soft',
  inverse: 'bg-transparent text-primary-fg hover:bg-primary-hover active:bg-primary-pressed',
}

/** Botão de ícone Soft Pill: 44×44 px, sempre com nome acessível. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = 'ghost', className, type = 'button', title, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={title ?? label}
      className={cn(
        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill transition-colors',
        'disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-fg',
        iconVariants[variant],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  )
})
