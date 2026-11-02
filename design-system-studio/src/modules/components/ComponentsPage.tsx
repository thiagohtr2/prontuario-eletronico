import { PageHeader } from '@/ui'
import { ComponentLibrary } from './ComponentLibrary'

export default function ComponentsPage() {
  return (
    <div className="ui-page">
      <PageHeader title="Componentes" />
      <ComponentLibrary />
    </div>
  )
}
