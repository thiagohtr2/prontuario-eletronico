import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
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
  signIn: (email: string, password: string) => Promise<void>
  signUp: (input: SignUpInput) => Promise<{ needsConfirmation: boolean }>
  signOut: () => Promise<void>
  refreshDoctor: () => Promise<void>
}

const AuthContext = createContext<AuthApi | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)

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

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
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
      options: { data: { nome: nome.trim(), especialidade: especialidade.trim(), crm: crm.trim() } },
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

  const value = useMemo<AuthApi>(
    () => ({ session, doctor, loading, signIn, signUp, signOut, refreshDoctor }),
    [session, doctor, loading, signIn, signUp, signOut, refreshDoctor],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthApi {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth precisa estar dentro de AuthProvider')
  return context
}

/** Mensagens do Supabase Auth em português, na linguagem do sistema. */
function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'E-mail ou senha incorretos.',
    'Email not confirmed': 'Confirme seu e-mail antes de entrar.',
    'User already registered': 'Já existe uma conta com este e-mail.',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    'Signup requires a valid password': 'Informe uma senha válida.',
    'Unable to validate email address: invalid format': 'E-mail em formato inválido.',
  }
  return map[message] ?? message
}
