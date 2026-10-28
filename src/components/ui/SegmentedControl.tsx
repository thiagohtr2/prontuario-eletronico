import { useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { cn } from '../../lib/cn'

type Option<T extends string> = { value: T; label: string }

/**
 * Controle segmentado Soft Pill (padrão de abas do WAI-ARIA): uma única
 * parada de Tab, setas esquerda/direita trocam a opção.
 */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  idPrefix,
  className,
}: {
  label: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  /** Prefixo dos ids, para ligar cada opção ao painel com aria-controls. */
  idPrefix: string
  className?: string
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = (index + step + options.length) % options.length
    refs.current[next]?.focus()
    onChange(options[next].value)
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('grid gap-1 rounded-pill bg-surface-hover p-1', className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option, index) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            ref={(element) => {
              refs.current[index] = element
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${option.value}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              'min-h-touch min-w-0 rounded-pill px-4 text-sm font-medium transition-colors',
              selected ? 'bg-surface text-primary' : 'text-muted hover:bg-primary-soft hover:text-ink',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
