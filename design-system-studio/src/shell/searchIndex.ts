import { palettes } from '@/modules/color/catalog'
import { componentCategories, visualFamilies } from '@/modules/components/catalog'
import { landings, logins, signups } from '@/modules/entry/catalog'
import { inspirationSites } from '@/modules/inspiration/catalog'
import { desktopLayouts, mobileLayouts } from '@/modules/layouts/catalog'
import { headers, sidebars } from '@/modules/navigation/catalog'
import { templates } from '@/modules/templates/catalog'
import { ALL_ENTRIES, type NavEntry } from './nav'

/**
 * Índice da busca (UX-23): além dos módulos, os modelos, paletas, famílias e componentes pelo nome.
 * Carregado só quando a busca abre, para não pesar nas telas.
 */
export function buildSearchIndex(): NavEntry[] {
  const iconFor = (path: string) => ALL_ENTRIES.find((e) => e.path === path)?.icon ?? ALL_ENTRIES[0].icon
  const make = (kind: string, path: string, list: { id: string; name: string; description?: string }[], keywords = '') =>
    list.map((m) => ({ id: `${kind}:${m.id}`, label: m.name, path, icon: iconFor(path), description: `${kind} · ${m.description ?? ''}`.slice(0, 140), keywords: `${kind} ${keywords}` }))
  return [
    ...make('Landing page', '/modulos/landing', landings, 'landing pagina apresentacao'),
    ...make('Login', '/modulos/login', logins, 'login entrar'),
    ...make('Cadastro', '/modulos/cadastro', signups, 'cadastro conta'),
    ...make('Arquitetura do computador', '/modulos/desktop', desktopLayouts, 'layout desktop'),
    ...make('Arquitetura do celular', '/modulos/mobile', mobileLayouts, 'layout mobile celular'),
    ...make('Paleta', '/modulos/cores', palettes.map((p) => ({ id: p.id, name: p.name, description: p.spec.summary })), 'paleta cores'),
    ...make('Header', '/modulos/navegacao', headers, 'header barra topo'),
    ...make('Sidebar', '/modulos/navegacao', sidebars, 'sidebar menu lateral'),
    ...make('Componente', '/modulos/componentes', componentCategories, 'componente'),
    ...make('Família visual', '/modulos/componentes', visualFamilies, 'familia estilo componente'),
    ...make('Inspiração', '/modulos/inspiracao', inspirationSites.map((s) => ({ id: s.id, name: s.brand, description: s.segment ?? '' })), 'inspiracao site'),
    ...make('Template', '/modulos/templates', templates, 'template modelo pagina'),
  ]
}
