import { PageHeader } from '@/ui'
import { LiveSitePreview } from './LiveSitePreview'

export default function PreviewPage() {
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Estrutura"
        title="Live Site Preview"
        description="Todas as suas escolhas juntas: layout, header, sidebar, paleta, tipografia, landing, login e cadastro. Alterne entre computador, tablet e celular e olhe com calma: é assim que o site deve ficar?"
      />
      <LiveSitePreview />
    </div>
  )
}
