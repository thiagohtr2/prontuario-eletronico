import { ENTRY_FLOWS, PROJECT_TYPES, STORIES_OPTIONS, WIDE_OPTIONS, type Project } from '@/core/project'
import { fontName, RADIUS_VALUES, TOKEN_LABEL } from '@/core/tokens'
import type { TokenKey } from '@/core/types'
import { paletteById } from '@/modules/color/catalog'
import { categoryById, familyById } from '@/modules/components/catalog'
import { landingById, loginById, signupById } from '@/modules/entry/catalog'
import { siteById } from '@/modules/inspiration/catalog'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import { headerById, sidebarById } from '@/modules/navigation/catalog'
import { templateById } from '@/modules/templates/catalog'
import { buildProjectSpec } from './spec'
import { renderMasterPrompt } from './text'

/**
 * Comparação entre duas versões do projeto (5.0): o que mudou em cada decisão, em linguagem
 * simples, e quanto o Master Prompt mudou.
 */

export interface Change {
  area: string
  label: string
  before: string
  after: string
}

const none = (v: string | null | undefined, empty = '—') => (v && v.trim() ? v : empty)

function facts(p: Project): { area: string; label: string; value: string }[] {
  const flow = ENTRY_FLOWS.find((f) => f.id === p.entry.flow)
  const header = p.navigation.header ? headerById(p.navigation.header.id) : undefined
  const sidebar = p.navigation.sidebar ? sidebarById(p.navigation.sidebar.id) : undefined
  const t = p.identity.typography
  const g = p.identity.geometry
  return [
    { area: 'Projeto', label: 'Nome', value: none(p.meta.name) },
    { area: 'Projeto', label: 'Tipo', value: none(p.meta.projectType === 'outro' ? p.meta.projectTypeOther : PROJECT_TYPES.find((x) => x.id === p.meta.projectType)?.name) },
    { area: 'Projeto', label: 'Itens do menu', value: none(p.meta.navItems.map((s) => s.trim()).filter(Boolean).join(' · ')) },
    { area: 'Projeto', label: 'Funcionalidades', value: none(p.meta.features.join(' · ')) },
    { area: 'Entrada', label: 'Fluxo', value: none(flow?.name) },
    { area: 'Entrada', label: 'Landing', value: none(landingById(p.entry.landingId)?.name) },
    { area: 'Entrada', label: 'Login', value: none(loginById(p.entry.loginId)?.name) },
    { area: 'Entrada', label: 'Cadastro', value: p.entry.noSignup ? 'Não haverá cadastro' : none(signupById(p.entry.signupId)?.name) },
    { area: 'Arquitetura', label: 'Computador', value: none(desktopById(p.layout.desktopId)?.name) },
    { area: 'Arquitetura', label: 'Celular', value: none(mobileById(p.layout.mobileId)?.name) },
    { area: 'Arquitetura', label: 'Monitores grandes', value: none(WIDE_OPTIONS.find((o) => o.id === p.layout.wide)?.name, 'padrão') },
    { area: 'Arquitetura', label: 'Telas com stories', value: none(STORIES_OPTIONS.find((o) => o.id === p.layout.storiesScope)?.name, 'padrão') },
    { area: 'Navegação', label: 'Header', value: header ? `${header.name} · ${p.navigation.header!.variant === 0 ? 'A' : 'B'}` : '—' },
    { area: 'Navegação', label: 'Sidebar', value: sidebar ? `${sidebar.name} · ${p.navigation.sidebar!.variant === 0 ? 'A' : 'B'}` : '—' },
    { area: 'Identidade', label: 'Paleta', value: none(paletteById(p.identity.paletteId)?.name ?? p.identity.paletteId) },
    {
      area: 'Identidade',
      label: 'Cores ajustadas',
      value: none(
        (Object.entries(p.identity.overrides) as [TokenKey, string][])
          .map(([k, v]) => `${TOKEN_LABEL[k] ?? k} ${v}`)
          .join(' · '),
        'nenhuma',
      ),
    },
    { area: 'Identidade', label: 'Fontes', value: `${fontName(t.heading)} ${t.headingWeight} + ${fontName(t.body)} ${t.bodyWeight}, base ${t.baseSize} px` },
    { area: 'Identidade', label: 'Cantos', value: RADIUS_VALUES[g.radius].label },
    { area: 'Identidade', label: 'Superfícies', value: `${g.surface}, borda ${g.borderWidth} px, sombra ${g.shadow}, densidade ${g.density}, ícones ${g.iconStyle}` },
    {
      area: 'Componentes',
      label: 'Componentes',
      value: none(
        p.components.map((c) => `${c.label || categoryById(c.categoryId)?.name || c.categoryId} (${familyById(c.familyId)?.name ?? c.familyId})`).join(' · '),
        'nenhum',
      ),
    },
    { area: 'Referências', label: 'Inspiração', value: none(p.inspiration ? siteById(p.inspiration.siteId)?.brand : null) },
    { area: 'Referências', label: 'Template', value: none(p.template ? templateById(p.template.id)?.name : null) },
  ]
}

/** Decisões que mudaram de `before` para `after`. */
export function diffProjects(before: Project, after: Project): Change[] {
  const a = facts(before)
  const b = facts(after)
  return b.flatMap((f, i) => (f.value !== a[i].value ? [{ area: f.area, label: f.label, before: a[i].value, after: f.value }] : []))
}

/** Quanto o Master Prompt mudou entre as duas versões (linhas que saíram e que entraram). */
export function diffPrompts(before: Project, after: Project): { removed: number; added: number } {
  const lines = (p: Project) =>
    renderMasterPrompt(buildProjectSpec(p))
      .split('\n')
      .filter((l) => l.trim() && !/^> Especificação gerada/.test(l))
  const a = lines(before)
  const b = lines(after)
  const setA = new Set(a)
  const setB = new Set(b)
  return { removed: a.filter((l) => !setB.has(l)).length, added: b.filter((l) => !setA.has(l)).length }
}
