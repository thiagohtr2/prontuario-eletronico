import { PageHeader } from '@/ui'
import { NavigationShowcase } from './NavigationShowcase'

export default function NavigationPage() {
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Navegação"
        title="Header e sidebar (menus)"
        description="36 headers e 36 sidebars, cada um com duas composições: 144 formas de apresentar a navegação do seu site, todas com a sua identidade visual."
      />
      <NavigationShowcase />
    </div>
  )
}
