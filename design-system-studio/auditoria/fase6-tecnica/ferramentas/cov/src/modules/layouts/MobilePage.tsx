import { PageHeader } from '@/ui'
import { MobileStudio } from './galleries'

export default function MobilePage() {
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Esqueleto · Celular"
        title="Arquitetura mobile"
        description="Escolha como as pessoas navegam pelo celular: menu embaixo, barras flutuantes, menus que deslizam ou de tela cheia. São 44 modelos — teste cada um no celular grande."
      />
      <MobileStudio />
    </div>
  )
}
