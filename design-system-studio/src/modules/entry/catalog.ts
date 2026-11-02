/**
 * Catálogos das páginas de entrada (somente dados, sem JSX).
 * Os dados ficam em arquivos separados por tipo; este arquivo é o ponto de acesso estável
 * usado pelo motor de prompts, pelos testes e pelos outros módulos.
 */
import { landings } from './catalog-landings'
import { logins } from './catalog-logins'
import { signups } from './catalog-signups'

/** 24 conceitos de landing page. */
export { landings }
/** 24 composições de login. */
export { logins }
/** 8 fluxos de cadastro. */
export { signups }

export const landingById = (id: string | null | undefined) => landings.find((l) => l.id === id)
export const loginById = (id: string | null | undefined) => logins.find((l) => l.id === id)
export const signupById = (id: string | null | undefined) => signups.find((l) => l.id === id)
