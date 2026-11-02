import { PageHeader } from '@/ui'
import { ProjectGoalForm } from './ProjectGoalForm'

export default function ProjectGoalPage() {
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Estrutura"
        title="Objetivo do projeto"
        description="Nome, tipo de site, público e funcionalidades. Tudo é salvo automaticamente e entra na seção A do Master Prompt."
      />
      <ProjectGoalForm />
    </div>
  )
}
