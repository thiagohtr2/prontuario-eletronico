import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, MailCheck } from 'lucide-react'
import { MIN_PASSWORD_LENGTH, useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { FormError, Input, PasswordInput } from '../components/ui/Field'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { AuthShell } from '../components/AuthShell'
import { errorMessage } from '../lib/api'
import { HOME_PATH } from '../lib/navigation'

export type AuthMode = 'entrar' | 'cadastro' | 'recuperar'

const paths: Record<AuthMode, string> = {
  entrar: '/entrar',
  cadastro: '/cadastro',
  recuperar: '/recuperar-senha',
}

const copy: Record<AuthMode, { title: string; description: string }> = {
  entrar: {
    title: 'Que bom ter você aqui',
    description: 'Entre para acessar o prontuário dos seus pacientes.',
  },
  cadastro: {
    title: 'Crie sua conta',
    description: 'Seu prontuário pronto em poucos minutos, para todas as clínicas onde você atende.',
  },
  recuperar: {
    title: 'Recuperar acesso',
    description: 'Informe o e-mail da sua conta. Enviaremos um link para você criar uma nova senha.',
  },
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RESEND_COOLDOWN = 60

type Errors = Partial<Record<'nome' | 'email' | 'password', string>>
type Sent = { kind: 'confirmacao' | 'recuperacao'; email: string } | null

/**
 * Acesso no modelo "Clássico central", com cadastro na mesma tela: Entrar e
 * Criar conta alternam na mesma composição. A recuperação de senha também
 * acontece aqui. Toda a autenticação é feita no servidor (Supabase Auth).
 */
export function AuthPage({ mode }: { mode: AuthMode }) {
  const { signIn, signUp, requestPasswordReset, resendConfirmation, session, loading: authLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', especialidade: '', crm: '', email: '', password: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState<Sent>(null)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    setErrors({})
    setError(null)
    setSent(null)
  }, [mode])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [cooldown])

  if (!authLoading && session) {
    const from = (location.state as { from?: string } | null)?.from ?? HOME_PATH
    return <Navigate to={from} replace />
  }

  function update(field: keyof typeof form) {
    return (event: { target: { value: string } }) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
      if (field in errors) setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  function switchMode(next: AuthMode) {
    navigate(paths[next], { replace: true, state: location.state })
  }

  function validate(): Errors {
    const found: Errors = {}
    if (mode === 'cadastro' && !form.nome.trim()) found.nome = 'Informe seu nome completo.'
    if (!form.email.trim()) found.email = 'Informe seu e-mail.'
    else if (!EMAIL_PATTERN.test(form.email.trim())) found.email = 'Confira o e-mail: falta o @ ou o domínio.'
    if (mode !== 'recuperar') {
      if (!form.password) found.password = 'Informe sua senha.'
      else if (mode === 'cadastro' && form.password.length < MIN_PASSWORD_LENGTH)
        found.password = `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`
    }
    return found
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0]
      document.getElementById(`auth-${first}`)?.focus()
      return
    }
    setLoading(true)
    try {
      if (mode === 'entrar') {
        await signIn(form.email, form.password)
      } else if (mode === 'cadastro') {
        const { needsConfirmation } = await signUp(form)
        if (needsConfirmation) {
          setSent({ kind: 'confirmacao', email: form.email.trim() })
          setCooldown(RESEND_COOLDOWN)
        }
      } else {
        await requestPasswordReset(form.email)
        setSent({ kind: 'recuperacao', email: form.email.trim() })
        setCooldown(RESEND_COOLDOWN)
      }
    } catch (caught) {
      setError(errorMessage(caught, 'Não foi possível concluir agora. Tente novamente.'))
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (!sent || cooldown > 0) return
    setError(null)
    setLoading(true)
    try {
      if (sent.kind === 'confirmacao') await resendConfirmation(sent.email)
      else await requestPasswordReset(sent.email)
      setCooldown(RESEND_COOLDOWN)
    } catch (caught) {
      setError(errorMessage(caught))
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    const confirmation = sent.kind === 'confirmacao'
    return (
      <AuthShell
        title={confirmation ? 'Confirme seu e-mail' : 'Verifique seu e-mail'}
        description={
          confirmation
            ? 'Falta só um passo para ativar sua conta.'
            : 'Se houver uma conta com este e-mail, o link já está a caminho.'
        }
        footer={
          <Link
            to="/entrar"
            className="inline-flex min-h-touch items-center gap-2 rounded-pill px-4 font-medium text-primary hover:bg-primary-soft"
          >
            <ArrowLeft size={16} aria-hidden />
            Voltar para entrar
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-4 text-center" role="status">
          <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-success-soft text-success">
            <MailCheck size={22} aria-hidden />
          </span>
          <p className="text-sm leading-6 text-muted">
            {confirmation ? 'Enviamos um link de ativação para ' : 'Enviamos as instruções para '}
            <span className="break-all font-medium text-ink">{sent.email}</span>.{' '}
            {confirmation
              ? 'Abra o e-mail e clique no link. Depois é só entrar normalmente.'
              : 'O link vale por tempo limitado e só pode ser usado uma vez.'}
          </p>
          <p className="text-xs leading-5 text-muted">Não chegou? Confira a caixa de spam ou peça um novo envio.</p>
          {error && <FormError>{error}</FormError>}
          <Button variant="secondary" fullWidth loading={loading} disabled={cooldown > 0} onClick={() => void handleResend()}>
            {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar e-mail'}
          </Button>
        </div>
      </AuthShell>
    )
  }

  const recovering = mode === 'recuperar'

  return (
    <AuthShell
      title={copy[mode].title}
      description={copy[mode].description}
      footer={
        mode === 'cadastro' ? (
          <p className="mx-auto max-w-sm text-xs leading-5">
            Usamos seus dados apenas para identificar você no sistema e nos documentos que você emitir.
          </p>
        ) : undefined
      }
    >
      {recovering ? (
        <button
          type="button"
          onClick={() => switchMode('entrar')}
          className="-ml-2 mb-5 inline-flex min-h-touch items-center gap-2 rounded-pill px-3 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden />
          Voltar para entrar
        </button>
      ) : (
        <SegmentedControl
          label="Acesso"
          idPrefix="auth"
          className="mb-6"
          value={mode}
          onChange={switchMode}
          options={[
            { value: 'entrar', label: 'Entrar' },
            { value: 'cadastro', label: 'Criar conta' },
          ]}
        />
      )}

      <form
        id="auth-panel"
        role={recovering ? undefined : 'tabpanel'}
        aria-labelledby={recovering ? undefined : `auth-tab-${mode}`}
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
        noValidate
      >
        {mode === 'cadastro' && (
          <>
            <Input
              id="auth-nome"
              label="Nome completo"
              required
              autoComplete="name"
              value={form.nome}
              onChange={update('nome')}
              error={errors.nome}
              placeholder="Dra. Ana Souza"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Especialidade"
                autoComplete="organization-title"
                value={form.especialidade}
                onChange={update('especialidade')}
                placeholder="Ginecologia"
              />
              <Input
                label="CRM"
                autoComplete="off"
                value={form.crm}
                onChange={update('crm')}
                placeholder="12345-BA"
                hint="Opcional agora."
              />
            </div>
          </>
        )}

        <Input
          id="auth-email"
          label="E-mail"
          type="email"
          inputMode="email"
          autoComplete={mode === 'cadastro' ? 'email' : 'username'}
          autoCapitalize="none"
          spellCheck={false}
          required
          value={form.email}
          onChange={update('email')}
          error={errors.email}
          placeholder="voce@email.com"
        />

        {!recovering && (
          <div>
            <PasswordInput
              id="auth-password"
              label="Senha"
              required
              autoComplete={mode === 'cadastro' ? 'new-password' : 'current-password'}
              value={form.password}
              onChange={update('password')}
              error={errors.password}
              hint={mode === 'cadastro' ? `Pelo menos ${MIN_PASSWORD_LENGTH} caracteres, com letras e números.` : undefined}
            />
            {mode === 'entrar' && (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => switchMode('recuperar')}
                  className="inline-flex min-h-touch items-center rounded-pill px-3 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}
          </div>
        )}

        {error && <FormError>{error}</FormError>}

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          {mode === 'entrar' ? 'Entrar' : mode === 'cadastro' ? 'Criar conta' : 'Enviar link de recuperação'}
        </Button>
      </form>
    </AuthShell>
  )
}

/**
 * Destino do link de redefinição enviado por e-mail. O Supabase valida o
 * token do link e abre uma sessão temporária; aqui a médica define a nova senha.
 */
export function ResetPasswordPage() {
  const { session, loading: authLoading, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  // O Supabase devolve o motivo no endereço quando o link expirou.
  const linkError = /error_code=([^&]+)/.exec(window.location.hash)?.[1] ?? null

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    const found: typeof errors = {}
    if (password.length < MIN_PASSWORD_LENGTH)
      found.password = `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`
    if (confirm !== password) found.confirm = 'As senhas não coincidem.'
    setErrors(found)
    if (Object.keys(found).length > 0) return
    setLoading(true)
    try {
      await updatePassword(password)
      setDone(true)
    } catch (caught) {
      setError(errorMessage(caught))
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <AuthShell title="Redefinir senha" description="Validando o link de redefinição...">
        <p className="text-center text-sm text-muted" role="status">
          Aguarde um instante.
        </p>
      </AuthShell>
    )
  }

  if (done) {
    return (
      <AuthShell title="Senha atualizada" description="Sua nova senha já está valendo.">
        <div className="flex flex-col items-center gap-5 text-center" role="status">
          <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-success-soft text-success">
            <CheckCircle2 size={22} aria-hidden />
          </span>
          <Button variant="primary" fullWidth onClick={() => navigate(HOME_PATH, { replace: true })}>
            Ir para o painel
          </Button>
        </div>
      </AuthShell>
    )
  }

  if (!session) {
    return (
      <AuthShell
        title="Link inválido"
        description={
          linkError === 'otp_expired'
            ? 'Este link de redefinição expirou. Peça um novo para continuar.'
            : 'Este link já foi usado ou não é válido. Peça um novo para continuar.'
        }
      >
        <Button variant="primary" fullWidth onClick={() => navigate('/recuperar-senha', { replace: true })}>
          Pedir novo link
        </Button>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Crie uma nova senha" description="Escolha uma senha que você não use em outros sites.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <input type="email" autoComplete="username" value={session.user.email ?? ''} readOnly hidden />
        <PasswordInput
          label="Nova senha"
          required
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          hint={`Pelo menos ${MIN_PASSWORD_LENGTH} caracteres, com letras e números.`}
        />
        <PasswordInput
          label="Confirme a nova senha"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={errors.confirm}
        />
        {error && <FormError>{error}</FormError>}
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Salvar nova senha
        </Button>
      </form>
    </AuthShell>
  )
}
