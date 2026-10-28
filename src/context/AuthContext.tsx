import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { configuredUrl, supabase } from '../lib/supabase'
import type { Doctor } from '../lib/types'

type SignUpInput = {
  email: string
  password: string
  nome: string
  especialidade: string
  crm: string
}

type AuthApi = {
  session: Session | null
  doctor: Doctor | null
  loading: boolean
  /** Verdadeiro quando a sessão veio de um link de redefinição de senha. */
  recovering: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (input: SignUpInput) => Promise<{ needsConfirmation: boolean }>
  signOut: () => Promise<void>
  refreshDoctor: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  resendConfirmation: (email: string) => Promise<void>
}

/** Tamanho mínimo de senha exigido pelo app (o Supabase deve exigir o mesmo). */
export const MIN_PASSWORD_LENGTH = 8

const AuthContext = createContext<AuthApi | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [recovering, setRecovering] = useState(false)

  const loadDoctor = useCallback(async (userId: string) => {
    const { data, error } = await supabase.from('doctors').select('*').eq('id', userId).maybeSingle()
    if (error) {
      console.error('Falha ao carregar o perfil do médico:', error.message)
      return
    }
    setDoctor(data ?? null)
  }, [])

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      if (data.session?.user) await loadDoctor(data.session.user.id)
      if (active) setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
      if (event === 'SIGNED_OUT') setRecovering(false)
      setSession(nextSession)
      if (nextSession?.user) {
        void loadDoctor(nextSession.user.id)
      } else {
        setDoctor(null)
      }
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [loadDoctor])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) throw new Error(translateAuthError(error.message))
  }, [])

  const signUp = useCallback(async ({ email, password, nome, especialidade, crm }: SignUpInput) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { nome: nome.trim(), especialidade: especialidade.trim(), crm: crm.trim() },
        emailRedirectTo: `${window.location.origin}/inicio`,
      },
    })
    if (error) throw new Error(translateAuthError(error.message))
    return { needsConfirmation: !data.session }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setDoctor(null)
  }, [])

  const refreshDoctor = useCallback(async () => {
    if (session?.user) await loadDoctor(session.user.id)
  }, [session, loadDoctor])

  const requestPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })
    // Só erros de rede ou de limite chegam à tela. Qualquer outro caso recebe a
    // mesma resposta neutra, para não revelar se o e-mail tem conta.
    if (error && isTransientAuthError(error.message)) throw new Error(translateAuthError(error.message))
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw new Error(translateAuthError(error.message))
    setRecovering(false)
  }, [])

  const resendConfirmation = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/inicio` },
    })
    if (error && isTransientAuthError(error.message)) throw new Error(translateAuthError(error.message))
  }, [])

  const value = useMemo<AuthApi>(
    () => ({
      session,
      doctor,
      loading,
      recovering,
      signIn,
      signUp,
      signOut,
      refreshDoctor,
      requestPasswordReset,
      updatePassword,
      resendConfirmation,
    }),
    [session, doctor, loading, recovering, signIn, signUp, signOut, refreshDoctor, requestPasswordReset, updatePassword, resendConfirmation],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthApi {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth precisa estar dentro de AuthProvider')
  return context
}

const NETWORK_ERROR = /Failed to fetch|NetworkError|Load failed/i
const RATE_LIMIT = /rate limit|too many requests|only request this after|over_email_send_rate_limit/i

function isTransientAuthError(message: string): boolean {
  return NETWORK_ERROR.test(message) || RATE_LIMIT.test(message)
}

/**
 * Mensagens do Supabase Auth em português, na linguagem do sistema. Nenhuma
 * delas confirma se um e-mail tem ou não conta cadastrada.
 */
function translateAuthError(message: string): string {
  if (NETWORK_ERROR.test(message)) {
    return `Não foi possível falar com o servidor em ${configuredUrl}. Verifique sua conexão e se esse endereço está correto.`
  }
  const wait = /after (\d+) seconds?/i.exec(message)
  if (wait) return `Por segurança, aguarde ${wait[1]} segundos antes de tentar de novo.`
  if (RATE_LIMIT.test(message)) return 'Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.'
  if (/password should be at least|password is too short|weak password/i.test(message)) {
    return `Use uma senha com pelo menos ${MIN_PASSWORD_LENGTH} caracteres, misturando letras e números.`
  }
  if (/same.+password|should be different/i.test(message)) {
    return 'A nova senha precisa ser diferente da atual.'
  }
  const map: Record<string, string> = {
    'Invalid login credentials': 'E-mail ou senha incorretos.',
    'Email not confirmed': 'Confirme seu e-mail antes de entrar. O link foi enviado no cadastro.',
    // Mensagem neutra: não confirma que o e-mail já tem conta.
    'User already registered':
      'Não foi possível criar a conta com estes dados. Se você já tem cadastro, entre ou recupere a senha.',
    'Signup requires a valid password': 'Informe uma senha válida.',
    'Unable to validate email address: invalid format': 'E-mail em formato inválido.',
    'Auth session missing!': 'O link expirou ou já foi usado. Peça um novo link de redefinição.',
  }
  if (map[message]) return map[message]
  console.warn('Erro de autenticação sem tradução:', message)
  return 'Não foi possível concluir agora. Tente novamente em instantes.'
}
