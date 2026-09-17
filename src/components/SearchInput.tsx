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
    <div className={cn('relative w-full sm:w-80', className)}>
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        aria-hidden
      />
      <input
        type="search"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-line bg-surface pl-10 pr-10 text-sm text-ink placeholder:text-slate-400 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors hover:bg-slate-100 hover:text-ink"
        >
          <X size={15} />
        </button>
      )}
    </div>
  )
}
