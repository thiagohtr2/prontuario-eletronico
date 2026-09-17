import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger'

const tones: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  accent: 'bg-accent-soft text-accent border-blue-100',
  success: 'bg-green-50 text-success border-green-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  danger: 'bg-red-50 text-danger border-red-100',
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
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}
