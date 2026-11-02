import { PageHeader, Section } from '@/ui'
import { EntryFlowPicker } from './EntryFlowPicker'
import { LandingGallery } from './galleries'

export default function LandingPage() {
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Estrutura"
        title="Landing page"
        description="A landing page é a página pública que apresenta o seu produto ou serviço para quem ainda não o conhece e convida a pessoa a agir — assinar, comprar, agendar ou entrar. Ela não é a tela de login: é a vitrine que vem antes."
      />
      <Section
        id="fluxo-de-entrada"
        title="Como as pessoas chegam ao seu sistema?"
        description="Escolha o caminho de entrada. Ele define se o projeto terá landing page, login, as duas coisas ou nenhuma."
      >
        <EntryFlowPicker />
      </Section>
      <Section
        id="biblioteca-landing"
        title="Biblioteca de landing pages"
        description="24 conceitos com 12 estruturas realmente diferentes. Clique em um cartão para escolher; use “Ver prévia” para ver a página inteira no computador e no celular."
      >
        <LandingGallery />
      </Section>
    </div>
  )
}
