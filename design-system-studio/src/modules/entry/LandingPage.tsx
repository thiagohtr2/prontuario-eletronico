import { PageHeader } from '@/ui'
import { LandingGallery } from './galleries'

export default function LandingPage() {
  return (
    <div className="ui-page">
      <PageHeader title="Landing" />
      <LandingGallery />
    </div>
  )
}
