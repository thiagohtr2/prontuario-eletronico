import { PageHeader } from '@/ui'
import { ComponentLibrary } from './ComponentLibrary'

export default function ComponentsPage() {
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Biblioteca"
        title="Componentes"
        description="66 tipos de componente em 16 famílias visuais, todos com a paleta do seu projeto. Escolha pelo visual, adicione e personalize."
      />
      <ComponentLibrary />
    </div>
  )
}
