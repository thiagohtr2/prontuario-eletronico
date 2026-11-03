import { PageHeader } from '@/ui'
import { DesktopGallery } from './galleries'
import { ScopeOptions } from './ScopeOptions'

export default function DesktopPage() {
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Esqueleto · Computador"
        title="Arquitetura desktop"
        description="Escolha como o site se organiza em telas grandes: onde ficam o menu, a barra superior, o conteúdo e os painéis. São 42 modelos em 8 famílias, desenhados para você comparar só de olhar."
      />
      <DesktopGallery />
      <ScopeOptions show="desktop" />
    </div>
  )
}
