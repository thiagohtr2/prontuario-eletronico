import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'

export type Crumb = { label: string; to?: string }

/** Breadcrumbs Soft Pill. O último item é a página atual. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Você está em" className={cn('min-w-0', className)}>
      <ol className="flex min-w-0 items-center gap-1">
        {items.map((item, index) => {
          const current = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className={cn('flex min-w-0 items-center gap-1', !current && 'shrink-0')}>
              {item.to && !current ? (
                <Link
                  to={item.to}
                  className="inline-flex min-h-touch items-center rounded-pill px-3 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-ink"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={current ? 'page' : undefined}
                  className="inline-flex min-h-touch min-w-0 items-center rounded-pill bg-primary-soft px-4 text-sm font-semibold text-primary"
                >
                  <span className="truncate">{item.label}</span>
                </span>
              )}
              {!current && <ChevronRight size={16} className="shrink-0 text-icon" aria-hidden />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
