import { PageHeader } from '@/ui'
import { PromptWorkspace } from './PromptWorkspace'

export default function PromptCenter() {
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Entrega"
        title="Central de Prompts"
        description="Tudo o que você aprovou, reunido em uma especificação única. Copie o Master Prompt para a IA, gere prompts individuais por elemento e decida a prioridade quando houver escolhas incompatíveis."
      />
      <PromptWorkspace />
    </div>
  )
}
