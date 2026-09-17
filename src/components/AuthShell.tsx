import type { ReactNode } from 'react'
import { Stethoscope } from 'lucide-react'

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="flex min-h-full items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <Stethoscope size={22} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-1.5 text-sm text-muted">{description}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-6 shadow-card sm:p-7">{children}</div>
        <p className="mt-5 text-center text-sm text-muted">{footer}</p>
      </div>
    </div>
  )
}
