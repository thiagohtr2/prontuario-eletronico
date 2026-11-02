import { Hammer } from 'lucide-react'
import { EmptyState } from '@/ui'

/** Marcador temporário para módulos ainda não implementados. */
export function ModuleStub({ name }: { name: string }) {
  return (
    <EmptyState icon={<Hammer />} title={`${name} em construção`}>
      Este módulo ainda está sendo implementado.
    </EmptyState>
  )
}
