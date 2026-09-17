import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Field'
import { AuthShell } from '../components/AuthShell'
import { errorMessage } from '../lib/api'

export function SignupPage() {
  const { signUp, session, loading: authLoading } = useAuth()
  const [form, setForm] = useState({ nome: '', especialidade: '', crm: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  if (!authLoading && session) return <Navigate to="/" replace />

  function update(field: keyof typeof form) {
    return (event: { target: { value: string } }) =>
      setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    try {
      const { needsConfirmation } = await signUp(form)
      if (needsConfirmation) setConfirmationSent(true)
    } catch (caught) {
      setError(errorMessage(caught, 'Não foi possível criar a conta. Tente novamente.'))
    } finally {
      setLoading(false)
    }
  }

  if (confirmationSent) {
    return (
      <AuthShell
        title="Confirme seu e-mail"
        description="Enviamos um link de confirmação para o seu e-mail."
        footer={
          <Link to="/login" className="font-medium text-accent hover:underline">
            Voltar para o login
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <CheckCircle2 size={28} className="text-success" aria-hidden />
          <p className="text-sm leading-6 text-muted">
            Abra o e-mail enviado para <span className="font-medium text-ink">{form.email}</span> e clique no
            link para ativar sua conta. Depois é só entrar normalmente.
          </p>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Criar conta"
      description="Centralize o histórico dos seus pacientes."
      footer={
        <>
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Nome completo"
          required
          autoComplete="name"
          value={form.nome}
          onChange={update('nome')}
          placeholder="Dra. Ana Souza"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Especialidade"
            value={form.especialidade}
            onChange={update('especialidade')}
            placeholder="Ginecologia"
          />
          <Input label="CRM" value={form.crm} onChange={update('crm')} placeholder="12345-BA" />
        </div>
        <Input
          label="E-mail"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={update('email')}
          placeholder="seu@email.com"
        />
        <Input
          label="Senha"
          type="password"
          required
          autoComplete="new-password"
          value={form.password}
          onChange={update('password')}
          placeholder="Mínimo de 6 caracteres"
          hint="Use pelo menos 6 caracteres."
        />
        {error && (
          <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Criar conta
        </Button>
      </form>
    </AuthShell>
  )
}
