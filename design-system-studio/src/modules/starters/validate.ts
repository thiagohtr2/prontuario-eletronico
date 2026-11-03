import { ENTRY_FLOWS } from '@/core/project'
import { FONT_OPTIONS, TOKEN_KEYS } from '@/core/tokens'
import { paletteById } from '@/modules/color/catalog'
import { categoryById, familyById } from '@/modules/components/catalog'
import { landingById, loginById, signupById } from '@/modules/entry/catalog'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import { headerById, sidebarById } from '@/modules/navigation/catalog'
import type { SiteStarter } from './types'

/**
 * Validação de um manifesto de modelo: forma, ids estáveis e únicos, e referências que existem
 * nos catálogos do Studio. Um modelo inválido nunca chega à galeria (os testes rodam isto em todos).
 */
export function validateStarter(s: SiteStarter): string[] {
  const errors: string[] = []
  const err = (m: string) => errors.push(`${s.id}: ${m}`)
  const idRe = /^[a-z0-9]+(-[a-z0-9]+)*$/

  if (!idRe.test(s.id)) err('id do modelo fora do padrão kebab-case')
  if (!Number.isInteger(s.version) || s.version < 1) err('versão inválida')
  if (!s.name.trim() || !s.brand.trim() || !s.description.trim() || !s.artDirection.trim()) err('nome, marca, descrição e direção de arte são obrigatórios')

  // Arquitetura
  const flow = ENTRY_FLOWS.find((f) => f.id === s.entry.flow)
  if (!flow) err(`fluxo de entrada desconhecido: ${s.entry.flow}`)
  if (!desktopById(s.layout.desktopId)) err(`layout desktop inexistente: ${s.layout.desktopId}`)
  const mobile = mobileById(s.layout.mobileId)
  if (!mobile) err(`layout mobile inexistente: ${s.layout.mobileId}`)
  if (s.layout.storiesScope && !mobile?.config.stories) err('escopo de stories definido, mas o layout mobile não tem stories')
  if (s.navigation.header && !headerById(s.navigation.header.id)) err(`header inexistente: ${s.navigation.header.id}`)
  if (s.navigation.sidebar && !sidebarById(s.navigation.sidebar.id)) err(`sidebar inexistente: ${s.navigation.sidebar.id}`)
  if (flow?.needsLanding && !landingById(s.entry.landingId)) err('o fluxo pede landing, mas a landing não existe')
  if (flow?.needsLogin && !loginById(s.entry.loginId)) err('o fluxo pede login, mas o login não existe')
  if (s.entry.signupId && !signupById(s.entry.signupId)) err(`cadastro inexistente: ${s.entry.signupId}`)
  if (flow?.needsLogin && !s.entry.signupId && !s.entry.noSignup) err('com login, defina um cadastro ou marque noSignup')

  // Identidade
  const fonts = FONT_OPTIONS.map((f) => f.id)
  if (!fonts.includes(s.typography.heading) || !fonts.includes(s.typography.body)) err('fonte desconhecida')
  if (!familyById(s.family)) err(`família visual inexistente: ${s.family}`)
  if (s.palettes.length < 6 || s.palettes.length > 12) err('ofereça de 6 a 12 paletas')
  const palIds = new Set<string>()
  for (const p of s.palettes) {
    if (palIds.has(p.id)) err(`paleta repetida: ${p.id}`)
    palIds.add(p.id)
    if (!paletteById(p.paletteId)) err(`paleta inexistente: ${p.paletteId}`)
    for (const k of Object.keys(p.overrides ?? {})) if (!(TOKEN_KEYS as string[]).includes(k)) err(`token desconhecido em ${p.id}: ${k}`)
  }
  if (s.palettes[0] && s.palettes[0].id !== 'original') err('a primeira paleta deve ser a “original”')

  // Componentes
  const compIds = new Set<string>()
  for (const c of s.components) {
    if (!idRe.test(c.id)) err(`id de componente fora do padrão: ${c.id}`)
    if (compIds.has(c.id)) err(`id de componente repetido: ${c.id}`)
    compIds.add(c.id)
    const cat = categoryById(c.categoryId)
    if (!cat) err(`categoria inexistente: ${c.categoryId} (${c.id})`)
    if (c.familyId && !familyById(c.familyId)) err(`família inexistente: ${c.familyId} (${c.id})`)
    for (const key of Object.keys(c.props)) if (cat && !cat.params.some((p) => p.key === key)) err(`propriedade desconhecida “${key}” em ${c.id} (${c.categoryId})`)
  }

  // Páginas
  const pageIds = new Set<string>()
  const used = new Set<string>()
  for (const pg of s.pages) {
    if (!idRe.test(pg.id)) err(`id de página fora do padrão: ${pg.id}`)
    if (pageIds.has(pg.id)) err(`página repetida: ${pg.id}`)
    pageIds.add(pg.id)
    if (pg.kind === 'app' && pg.blocks.length === 0) err(`página sem conteúdo: ${pg.id}`)
    if (pg.navItem && !s.navItems.includes(pg.navItem)) err(`a página ${pg.id} aponta para um item de menu que não existe: ${pg.navItem}`)
    for (const b of [...pg.blocks, ...(pg.aside ?? [])]) {
      if (!compIds.has(b.component)) err(`a página ${pg.id} usa um componente que não existe: ${b.component}`)
      if (!Number.isInteger(b.span) || b.span < 1 || b.span > 12) err(`largura inválida (${b.span}) em ${pg.id}/${b.component}`)
      used.add(b.component)
    }
  }
  for (const id of compIds) if (!used.has(id)) err(`componente declarado e não usado em nenhuma página: ${id}`)
  if (flow?.needsLanding && !s.pages.some((p) => p.kind === 'landing')) err('o fluxo tem landing, mas não há página de landing')
  if (flow?.needsLogin && !s.pages.some((p) => p.kind === 'login')) err('o fluxo tem login, mas não há página de login')
  if (s.entry.signupId && !s.pages.some((p) => p.kind === 'signup')) err('há cadastro, mas não há página de cadastro')
  for (const item of s.navItems) if (!s.pages.some((p) => p.navItem === item)) err(`item de menu sem página: ${item}`)
  if (!s.pages.some((p) => p.kind === 'app' || p.kind === 'landing')) err('o modelo precisa de ao menos uma página de conteúdo')

  return errors
}
