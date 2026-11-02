import { PageHeader } from '@/ui'
import { DesktopGallery } from './galleries'

export default function DesktopPage() {
  return (
    <div className="ui-page">
      <PageHeader title="Desktop" />
      <DesktopGallery />
    </div>
  )
}
