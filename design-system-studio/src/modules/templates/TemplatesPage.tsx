import { ModuleStub } from '@/shell/ModuleStub'
import { PageHeader } from '@/ui'

export default function TemplatesPage() {
  return (
    <div className="ui-page">
      <PageHeader title="Template Studio" />
      <ModuleStub name="Template Studio" />
    </div>
  )
}
