import { cn } from '../lib/cn'

/** Monograma da Singulare: um "S" em serifa sobre o vinho da marca. */
export function LogoMark({ size = 40, inverse = false, className }: { size?: number; inverse?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-[30%] font-display font-semibold leading-none',
        inverse ? 'bg-primary-fg text-primary' : 'bg-primary text-primary-fg',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.68 }}
    >
      <span style={{ transform: 'translateY(-4%)' }}>S</span>
    </span>
  )
}

/** Marca completa. Em fundos escuros, use inverse. */
export function Logo({
  inverse = false,
  compact = false,
  tagline,
  className,
}: {
  inverse?: boolean
  compact?: boolean
  tagline?: string
  className?: string
}) {
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-3', className)}>
      <LogoMark inverse={inverse} />
      {!compact && (
        <span className="min-w-0">
          <span
            className={cn(
              'block truncate font-display text-[26px] font-semibold leading-none tracking-tight',
              inverse ? 'text-primary-fg' : 'text-ink',
            )}
          >
            Singulare
          </span>
          {tagline && (
            <span className={cn('mt-1 block truncate text-xs', inverse ? 'text-primary-soft' : 'text-muted')}>
              {tagline}
            </span>
          )}
        </span>
      )}
    </span>
  )
}
