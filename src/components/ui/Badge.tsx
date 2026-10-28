import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'

// Verde e âmbar não atingem 4,5:1 sobre os próprios fundos suaves, então o
// texto fica no tom de leitura e a cor semântica vai para o ícone.
const tones: Record<Tone, string> = {
  neutral: 'bg-surface-hover text-ink',
  accent: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-ink [&_svg]:text-success',
  warning: 'bg-warning-soft text-ink [&_svg]:text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
}

export function Badge({
  tone = 'neutral',
  icon,
  children,
  className,
}: {
  tone?: Tone
  icon?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {icon}
      <span className="min-w-0 break-words">{children}</span>
    </span>
  )
}
