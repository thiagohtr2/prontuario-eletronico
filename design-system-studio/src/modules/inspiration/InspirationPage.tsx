import { PageHeader } from '@/ui'
import { InspirationGallery } from './InspirationGallery'

export default function InspirationPage() {
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Referências"
        title="Inspiration Gallery"
        description="20 sites fictícios completos, cada um com identidade própria e 8 propostas de paleta. Encontre uma experiência inteira que tenha a cara do seu projeto — não só um menu ou um botão."
      />
      <InspirationGallery />
    </div>
  )
}
