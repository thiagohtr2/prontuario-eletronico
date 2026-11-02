import { PageHeader } from '@/ui'
import { LoginGallery } from './galleries'

export default function LoginPage() {
  return (
    <div className="ui-page">
      <PageHeader title="Login" />
      <LoginGallery />
    </div>
  )
}
