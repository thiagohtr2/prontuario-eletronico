import { lazy, Suspense, useState } from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@/ui'
import type { PromptTarget } from './items'

const PromptModal = lazy(() => import('./PromptModal'))

/**
 * Ação padrão "Gerar prompt deste elemento". Abre um modal com o prompt individual
 * (autossuficiente, com regras de identidade e responsividade), pronto para copiar ou baixar.
 */
export function PromptButton({
  target,
  label = 'Prompt deste elemento',
  size = 'sm',
  variant = 'ghost',
}: {
  target: PromptTarget
  label?: string
  size?: 'sm' | 'md'
  variant?: 'ghost' | 'secondary'
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size={size} variant={variant} icon={<FileText />} onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open && (
        <Suspense fallback={null}>
          <PromptModal target={target} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  )
}
