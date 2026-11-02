import { ENTRY_FLOWS, PROJECT_TYPES, type Project } from '@/core/project'
import { paletteById } from '@/modules/color/catalog'
import { landingById, loginById, signupById } from '@/modules/entry/catalog'
import { siteById } from '@/modules/inspiration/catalog'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import { headerById, sidebarById } from '@/modules/navigation/catalog'
import { templateById } from '@/modules/templates/catalog'

export interface ModuleStatus {
  done: boolean
  text: string
}

/** Resumo do que já foi decidido em cada módulo (usado no modo livre e na revisão). */
export function moduleStatus(project: Project): Record<string, ModuleStatus> {
  const flow = ENTRY_FLOWS.find((f) => f.id === project.entry.flow)
  const type = PROJECT_TYPES.find((t) => t.id === project.meta.projectType)
  const s = (value: string | undefined | null, empty = 'Ainda não escolhido'): ModuleStatus => ({ done: Boolean(value), text: value || empty })
  const header = project.navigation.header ? headerById(project.navigation.header.id)?.name : null
  const sidebar = project.navigation.sidebar ? sidebarById(project.navigation.sidebar.id)?.name : null
  return {
    objetivo: s(project.meta.name ? `${project.meta.name}${type ? ` · ${type.name}` : ''}` : type?.name, 'Defina nome e tipo'),
    landing: flow && !flow.needsLanding ? { done: true, text: 'Sem landing neste fluxo' } : s(landingById(project.entry.landingId)?.name),
    login: flow && !flow.needsLogin ? { done: true, text: 'Sem login neste fluxo' } : s(loginById(project.entry.loginId)?.name),
    cadastro: flow && !flow.needsLogin ? { done: true, text: 'Sem cadastro neste fluxo' } : s(signupById(project.entry.signupId)?.name),
    desktop: s(desktopById(project.layout.desktopId)?.name),
    mobile: s(mobileById(project.layout.mobileId)?.name),
    preview: { done: Boolean(project.layout.desktopId || project.layout.mobileId), text: project.layout.desktopId || project.layout.mobileId ? 'Pronta para visualizar' : 'Escolha os layouts primeiro' },
    cores: { done: true, text: paletteById(project.identity.paletteId)?.name ?? 'Paleta padrão' },
    navegacao: s([header, sidebar].filter(Boolean).join(' + '), 'Opcional'),
    componentes: { done: project.components.length > 0, text: project.components.length ? `${project.components.length} no projeto` : 'Opcional' },
    inspiracao: s(project.inspiration ? siteById(project.inspiration.siteId)?.brand : null, 'Opcional'),
    templates: s(project.template ? templateById(project.template.id)?.name : null, 'Opcional'),
    prompt: { done: true, text: 'Sempre atualizado' },
    exportar: { done: true, text: 'JSON, CSS, HTML e backup' },
    validacao: { done: Boolean(project.validation.report), text: project.validation.report ? `${project.validation.report.issues.length} ocorrência(s) no último relatório` : 'Nenhum relatório importado' },
    projeto: { done: true, text: 'Versões e histórico' },
  }
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.round(diff / 60000)
  if (min < 1) return 'agora mesmo'
  if (min < 60) return `há ${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `há ${h} h`
  return new Date(iso).toLocaleDateString('pt-BR')
}
