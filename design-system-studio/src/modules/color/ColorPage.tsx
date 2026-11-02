import { PageHeader } from '@/ui'
import { ColorSystem } from './ColorSystem'

export default function ColorPage() {
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Identidade"
        title="Color System"
        description="A fonte central de cores e estilos do projeto. Escolha uma das 60 paletas, ajuste tokens individualmente e defina tipografia e formas. Tudo o que herda a identidade global é atualizado na hora."
      />
      <ColorSystem />
    </div>
  )
}
