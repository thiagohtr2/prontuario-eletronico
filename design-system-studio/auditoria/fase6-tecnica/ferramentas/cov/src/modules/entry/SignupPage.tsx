import { PageHeader, Section } from '@/ui'
import { SignupGallery } from './galleries'

export default function SignupPage() {
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Estrutura"
        title="Cadastro"
        description="O cadastro é como uma pessoa nova cria a conta: na mesma tela do login, em uma página própria, em etapas, por convite, sem senha e assim por diante. As prévias usam a tela de login que você escolheu."
      />
      <Section
        id="fluxos-cadastro"
        title="Fluxos de cadastro"
        description="8 formas de criar conta. Abra a prévia para ver campos, mensagens de validação, indicador de etapas e a troca entre Entrar e Criar conta."
      >
        <SignupGallery />
      </Section>
    </div>
  )
}
