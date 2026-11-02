import type { DesktopFamily, DesktopLayout, MobileGroup } from './types'

/**
 * Textos para leigos usados pelas galerias (dados puros). Complementam as descrições
 * curtas de `DESKTOP_FAMILIES` e `MOBILE_GROUPS` com “quando usar”.
 */
export const DESKTOP_FAMILY_GUIDE: Record<DesktopFamily, string> = {
  'sidebar-integral':
    'O menu fica colado na lateral, do topo até o fim da tela. Passa sensação de sistema sólido e organizado — ótimo para quem usa todo dia.',
  'sidebar-flutuante':
    'O menu vira um “cartão” solto, com espaço em volta e cantos arredondados. Visual mais leve e moderno, mas ocupa um pouco mais de espaço.',
  'rail-dupla':
    'Um trilho bem fino só com ícones libera espaço para o conteúdo. Pode vir acompanhado de um segundo menu para organizar sistemas grandes.',
  direita: 'Menus ou painéis no lado direito. Bom para ferramentas em que o conteúdo é o protagonista e os detalhes ficam ao lado.',
  'sem-sidebar': 'Sem menu lateral: tudo fica numa barra no topo. Ideal para sites, lojas e produtos com poucas áreas.',
  editorial: 'Composições de revista, com imagens grandes e textos bem espaçados. Para apresentar marcas, produtos e trabalhos.',
  multicoluna: 'Várias colunas lado a lado para ver muita informação de uma vez: dashboards, CRMs, prontuários e ferramentas.',
  'one-screen':
    'Tudo cabe em uma única tela, sem rolar a página. Para painéis, TVs e totens. Conteúdo longo rola dentro dos blocos, nunca é cortado.',
}

export const MOBILE_GROUP_GUIDE: Record<MobileGroup, string> = {
  inferior: 'O menu fica embaixo, onde o polegar alcança. É o jeito mais confortável para apps usados todo dia.',
  flutuantes: 'Barras soltas das bordas, como ilhas arredondadas. Visual moderno; o conteúdo aparece por trás.',
  hibridos: 'Combinações: barra no topo, faixa de destaques, menu flutuante embaixo e menus extras.',
  superior: 'Tudo no topo: abas, busca ou o botão de menu. Bom para sites e conteúdos para ler.',
  drawers: 'Menus escondidos que deslizam para dentro da tela quando a pessoa toca no botão.',
  'lateral-compacta': 'Uma coluna fina de ícones sempre visível na lateral, sem precisar abrir menus.',
  'tela-cheia': 'Ao abrir, o menu ocupa a tela inteira, com opções grandes e fáceis de tocar.',
  'one-screen': 'Cada tela cabe inteira no celular, sem rolar. Para consultas rápidas, controles e quiosques.',
}

export const MEASURE_LABEL: Record<keyof DesktopLayout['measurements'], string> = {
  sidebar: 'Sidebar',
  header: 'Header',
  rail: 'Rail',
  panel: 'Painel',
  submenu: 'Submenu',
  detail: 'Detalhes',
  gap: 'Espaço entre blocos',
  contentMax: 'Largura máx. do conteúdo',
  footer: 'Rodapé',
}

/** Converte chaves camelCase das medidas textuais (ex.: `barraDeFiltros`) em rótulos legíveis. */
export function humanizeKey(key: string): string {
  const spaced = key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
  const fixed = spaced
    .replace(/\bcabecalho\b/g, 'cabeçalho')
    .replace(/\bpagina\b/g, 'página')
    .replace(/\bpilula\b/g, 'pílula')
    .replace(/\bicone\b/g, 'ícone')
    .replace(/\bbotao\b/g, 'botão')
    .replace(/\balca\b/g, 'alça')
    .replace(/\bcirculo\b/g, 'círculo')
    .replace(/\bacoes\b/g, 'ações')
    .replace(/\bcapsula\b/g, 'cápsula')
    .replace(/\bindicadores\b/g, 'indicadores')
    .replace(/\bbottom nav\b/g, 'bottom navigation')
  return fixed.charAt(0).toUpperCase() + fixed.slice(1)
}

/** Lista de medidas recomendadas (número + texto) para exibição como fatos. */
export function desktopMeasureFacts(layout: DesktopLayout): { label: string; value: string }[] {
  const facts = (Object.keys(MEASURE_LABEL) as (keyof DesktopLayout['measurements'])[])
    .filter((k) => layout.measurements[k] !== undefined)
    .map((k) => ({ label: MEASURE_LABEL[k], value: `≈${layout.measurements[k]} px` }))
  for (const [k, v] of Object.entries(layout.spec.measurements ?? {})) facts.push({ label: humanizeKey(k), value: v })
  return facts
}
