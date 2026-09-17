import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Limpa o valor vindo da variável de ambiente.
 *
 * Painéis de deploy costumam guardar o valor com aspas ou espaços em volta
 * quando se cola o texto sem cuidado, e isso quebra a conexão de um jeito
 * difícil de enxergar. Aqui esses casos são corrigidos em silêncio.
 */
function clean(value?: string): string {
  return (value ?? '')
    .trim()
    .replace(/^["']|["']$/g, '')
    .trim()
}

const url = clean(import.meta.env.VITE_SUPABASE_URL).replace(/\/+$/, '')
const anonKey = clean(import.meta.env.VITE_SUPABASE_ANON_KEY)

/** Quais variáveis não chegaram ao site. */
export const missingEnvVars: string[] = [
  !url && 'VITE_SUPABASE_URL',
  !anonKey && 'VITE_SUPABASE_ANON_KEY',
].filter((name): name is string => Boolean(name))

/** O endereço configurado, para a tela de erro poder mostrá-lo. */
export const configuredUrl = url

/**
 * Descreve um endereço inválido. O erro mais comum é colar o link do painel
 * do Supabase (supabase.com/dashboard/...) no lugar do endereço da API.
 */
export const urlProblem: string | null = (() => {
  if (!url) return null

  if (/supabase\.com\/dashboard/i.test(url) || /\/project\//i.test(url)) {
    return 'Esse é o endereço do painel do Supabase, não o do projeto. O endereço correto termina em .supabase.co'
  }
  if (!/^https?:\/\//i.test(url)) {
    return 'O endereço precisa começar com https://'
  }
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('.')) return 'O endereço não parece completo.'
  } catch {
    return 'O endereço não é um link válido.'
  }
  return null
})()

export const isSupabaseConfigured = missingEnvVars.length === 0 && urlProblem === null

if (!isSupabaseConfigured) {
  console.warn(
    missingEnvVars.length > 0
      ? `Supabase não configurado. Faltando: ${missingEnvVars.join(', ')}`
      : `Endereço do Supabase inválido (${url}): ${urlProblem}`,
  )
}

export const supabase = createClient<Database>(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
