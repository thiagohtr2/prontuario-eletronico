import { PageHeader } from '@/ui'
import { MobileStudio } from './galleries'

export default function MobilePage() {
  return (
    <div className="ui-page">
      <PageHeader title="Mobile" />
      <MobileStudio />
    </div>
  )
}
