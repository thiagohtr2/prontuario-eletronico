import { PageHeader } from '@/ui'
import { NavigationShowcase } from './NavigationShowcase'

export default function NavigationPage() {
  return (
    <div className="ui-page">
      <PageHeader title="Navigation Showcase" />
      <NavigationShowcase />
    </div>
  )
}
