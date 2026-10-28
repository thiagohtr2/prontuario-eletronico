import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Logo } from './Logo'

/**
 * Composição "Clássico central": formulário centralizado, poucos elementos e
 * acesso imediato. Acabamento plano: borda fina, sem sombra nem transparência.
 */
export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div
      className="flex min-h-[100dvh] flex-col bg-canvas px-4"
      style={{
        paddingTop: 'max(16px, env(safe-area-inset-top))',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
      }}
    >
      <div className="mx-auto flex w-full max-w-[440px] items-center justify-between gap-3 py-2">
        <Logo />
        <Link
          to="/"
          className="inline-flex min-h-touch shrink-0 items-center gap-2 rounded-pill px-4 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden />
          <span>
            Voltar<span className="hidden sm:inline"> ao site</span>
          </span>
        </Link>
      </div>

      <main className="flex flex-1 items-center justify-center py-6 sm:py-10">
        <div className="w-full max-w-[440px]">
          <div className="mb-6 text-center">
            <h1 className="display-title text-[34px] leading-[1.1] sm:text-[40px]">{title}</h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted sm:text-base">{description}</p>
          </div>
          <div className="rounded-card border border-line bg-surface p-5 sm:p-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        </div>
      </main>
    </div>
  )
}
