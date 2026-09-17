import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Field'
import { AuthShell } from '../components/AuthShell'
import { errorMessage } from '../lib/api'

export function LoginPage() {
  const { signIn, session, loading: authLoading } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!authLoading && session) {
    const from = (location.state as { from?: string } | null)?.from ?? '/'
    return <Navigate to={from} replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn(email, password)
    } catch (caught) {
      setError(errorMessage(caught, 'Não foi possível entrar. Tente novamente.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Entrar"
      description="Acesse o prontuário dos seus pacientes."
      footer={
        <>
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="font-medium text-accent hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="seu@email.com"
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
        />
        {error && (
          <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Entrar
        </Button>
      </form>
    </AuthShell>
  )
}
