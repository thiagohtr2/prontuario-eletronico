import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'md' | 'sm'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white border border-transparent hover:bg-accent-hover active:bg-accent-pressed',
  secondary:
    'bg-surface text-ink border border-line hover:bg-slate-50 active:bg-slate-100',
  ghost:
    'bg-transparent text-muted border border-transparent hover:bg-slate-100 hover:text-ink active:bg-slate-200',
  danger:
    'bg-danger text-white border border-transparent hover:bg-danger-hover active:bg-[#991B1B]',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-sm',
  sm: 'h-9 px-3.5 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', loading, icon, fullWidth, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
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
