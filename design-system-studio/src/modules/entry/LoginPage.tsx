import { PageHeader, Section } from '@/ui'
import { LoginGallery } from './galleries'

export default function LoginPage() {
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Estrutura"
        title="Login"
        description="A tela de login é a porta da área restrita: onde a pessoa digita e-mail e senha (ou usa outra forma de acesso) para entrar no sistema. Escolha a composição que combina com o seu projeto — as cores e fontes vêm da sua identidade visual."
      />
      <Section
        id="biblioteca-login"
        title="Biblioteca de telas de login"
        description="24 composições: centralizadas, divididas com imagem, corporativas, com QR code, link por e-mail e mais. Abra a prévia para testar estados de erro, mostrar senha e a troca entre Entrar e Criar conta."
      >
        <LoginGallery />
      </Section>
    </div>
  )
}
