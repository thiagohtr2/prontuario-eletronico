import { PageHeader } from '@/ui'
import { SignupGallery } from './galleries'

export default function SignupPage() {
  return (
    <div className="ui-page">
      <PageHeader title="Signup" />
      <SignupGallery />
    </div>
  )
}
