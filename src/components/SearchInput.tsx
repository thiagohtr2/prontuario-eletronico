import { Search, X } from 'lucide-react'
import { cn } from '../lib/cn'

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar...',
  label,
  className,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label: string
  className?: string
}) {
  return (
    <div className={cn('relative w-full min-w-0 sm:w-80', className)}>
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-icon"
        aria-hidden
      />
      <input
        type="search"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        enterKeyHint="search"
        className="h-control w-full rounded-field border border-line-control bg-surface pl-11 pr-12 text-md text-ink transition-colors placeholder:text-placeholder hover:border-line-hover focus:border-line-focus focus:shadow-[0_0_0_3px_var(--brand-focus-ring)] focus:outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          className="absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill text-icon transition-colors hover:bg-surface-hover hover:text-icon-hover"
        >
          <X size={16} aria-hidden />
        </button>
      )}
    </div>
  )
}
