import type { Project } from '@/core/project'
import { TOKEN_GROUPS } from '@/core/tokens'
import type { ThemeTokens } from '@/core/types'
import { KIND_LABEL, type PromptItem } from './items'
import { GLOBAL_RESPONSIVE_RULES, IMPLEMENTATION_RULES, REFERENCE_WIDTHS, rulesFor } from './responsive'
import { buildProjectSpec, type ProjectSpec } from './spec'

const bulletList = (lines: string[], indent = '') => lines.filter(Boolean).map((l) => `${indent}- ${l}`).join('\n')
const bullet = bulletList

function formatValue(v: unknown): string {
  if (typeof v === 'boolean') return v ? 'sim' : 'não'
  return String(v)
}

/** Linhas já escritas no Master Prompt: texto → item onde apareceu primeiro. */
export type SeenLines = Map<string, { key: string; label: string }>

/**
 * Bloco Markdown completo de um item. Com `seen` (Master Prompt), linhas idênticas a de um item
 * anterior não são repetidas: o bloco termina com uma referência ao item onde elas já estão.
 */
export function renderItem(item: PromptItem, heading = '###', seen?: SeenLines): string {
  const parts: string[] = []
  const label = `${item.name}${item.variant ? ` — ${item.variant}` : ''}`
  const repeatedFrom = new Set<string>()
  const fresh = (line: string) => {
    if (!seen || line.length < 25) return true
    const first = seen.get(line)
    if (!first) {
      seen.set(line, { key: item.key, label })
      return true
    }
    if (first.key === item.key) return true
    repeatedFrom.add(first.label)
    return false
  }
  const bullet = (lines: string[]) => bulletList(lines.filter((l) => l && fresh(l)))
  parts.push(`${heading} ${KIND_LABEL[item.kind]}: ${item.name}${item.variant ? ` — ${item.variant}` : ''}${item.isDefault ? ' (padrão do Studio — não revisado)' : ''}`)
  parts.push(`\`id: ${item.catalogId ?? item.key}\``)
  parts.push(item.summary)
  const section = (title: string, lines: string[]) => {
    const body = bullet(lines)
    if (body) parts.push(`**${title}**\n${body}`)
  }
  section('Estrutura', item.structure)
  const props = Object.entries(item.properties).filter(([, v]) => v !== '' && v !== undefined)
  section('Propriedades', props.map(([k, v]) => `${k}: ${formatValue(v)}`))
  if (item.kind !== 'palette') section('Cores', Object.entries(item.colors).map(([k, v]) => `${k}: ${v}`))
  section('Medidas recomendadas', Object.entries(item.measurements).map(([k, v]) => `${k}: ${v}`))
  section('Comportamento e estados', item.behavior)
  section('Responsividade', item.responsive)
  // Exceções são sempre do próprio item: nunca são resumidas.
  if (item.exceptions.length) parts.push(`**Exceções**\n${bulletList(item.exceptions)}`)
  section('Observações', item.notes)
  if (repeatedFrom.size)
    parts.push(`_Também valem aqui as regras idênticas já descritas em ${[...repeatedFrom].map((l) => `“${l}”`).join(', ')} (não repetidas)._`)
  return parts.join('\n\n')
}

export function renderTokensTable(tokens: ThemeTokens): string {
  // Uma linha por grupo: nome técnico (autoexplicativo) e valor. Mesmo conteúdo da tabela antiga, ~45% menor.
  return bulletList(TOKEN_GROUPS.map((g) => `${g.title}: ${g.keys.map((k) => `\`${k.key}\` ${tokens[k.key]}`).join(' · ')}`))
}

/** Master Prompt: todas as decisões aprovadas, organizadas nas seções A–G. */
export function renderMasterPrompt(spec: ProjectSpec): string {
  const p = spec.project
  const a = spec.architecture
  const out: string[] = []
  const seen: SeenLines = new Map()

  out.push(`# Master Prompt — ${p.name}`)
  out.push(
    `> Especificação gerada pelo Atelier UI (Design System Studio) em ${new Date(spec.generatedAt).toLocaleString('pt-BR')}.\n> As decisões abaixo foram escolhidas pelo usuário no Studio, exceto as marcadas como “padrão do Studio (não revisado)”, que são sugestões neutras. Implemente exatamente o que está descrito; quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração. Em caso de dúvida entre dois textos, valem as “Decisões de prioridade”.`,
  )

  out.push('## A. Informações do projeto')
  out.push(
    bullet([
      `Nome: ${p.name}`,
      `Tipo de aplicação: ${p.type}`,
      p.objective && `Objetivo: ${p.objective}`,
      p.description && `Descrição: ${p.description}`,
      p.audience && `Público-alvo: ${p.audience}`,
      p.purpose && `Finalidade principal: ${p.purpose}`,
      p.features.length ? `Funcionalidades previstas: ${p.features.join('; ')}` : '',
      p.tech && `Tecnologia desejada: ${p.tech}`,
    ].filter(Boolean) as string[]),
  )

  const c = spec.content
  out.push(
    `### Conteúdo do projeto\n${bullet([
      `Marca: ${c.brand ? `“${c.brand}”` : 'ainda não definida (pergunte ao usuário)'}.`,
      c.navItems.length ? `Itens do menu principal, nesta ordem: ${c.navItems.join(' · ')}.` : 'Itens do menu principal: ainda não definidos.',
      c.mobileNav,
      ...c.rules,
    ])}`,
  )

  out.push('## B. Arquitetura geral')
  out.push(
    bullet([
      a.entryFlow ? `Fluxo de entrada: **${a.entryFlow.name}** — ${a.entryFlow.description}` : 'Fluxo de entrada: não definido.',
      `Landing: ${a.landing ? a.landing.name : 'nenhuma'} · Login: ${a.login ? a.login.name : 'nenhum'} · Cadastro: ${a.signup ? a.signup.name : 'nenhum'}`,
      `Layout desktop: ${a.desktop ? a.desktop.name : 'não definido'} · Layout mobile: ${a.mobile ? a.mobile.name : 'não definido'}`,
      a.oneScreen ? 'Experiência One Screen: a interface principal cabe em uma viewport, sem rolagem vertical principal; áreas internas rolam localmente e nada importante é escondido.' : '',
    ].filter(Boolean)),
  )
  for (const item of [a.landing, a.login, a.signup, a.desktop, a.mobile]) if (item) out.push(renderItem(item, '###', seen))
  if (a.desktop && a.mobile) {
    out.push(
      `### Relação entre desktop e celular\n${bullet([
        `No computador, use “${a.desktop.name}”. No celular, use “${a.mobile.name}”. São decisões independentes: não derive uma da outra.`,
        'Entre 768 e 1023 px (tablet), use a estrutura desktop compactada (sidebar recolhida em trilho de ícones, menus excedentes em “Mais”). Abaixo de 768 px vale somente o layout mobile.',
        'As regiões (header, sidebar, conteúdo, painéis) mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões.',
      ])}`,
    )
  }

  out.push('## C. Navegação')
  if (spec.navigation.header || spec.navigation.sidebar) {
    for (const item of [spec.navigation.header, spec.navigation.sidebar]) if (item) out.push(renderItem(item, '###', seen))
  } else {
    out.push('Nenhum modelo específico de header ou sidebar foi escolhido no Navigation Showcase. Use a estrutura do layout desktop/mobile com aparência derivada da identidade visual, sem decoração extra.')
  }
  out.push(
    bullet([
      'Item ativo sempre destacado (cor de navegação ativa) e anunciado a leitores de tela (`aria-current="page"`).',
      'Dropdowns e submenus abrem por clique/toque e por teclado (Enter/Espaço), fecham com Esc e clique fora.',
      'Drawers, bottom sheets e menus de tela cheia prendem o foco enquanto abertos e devolvem o foco ao botão que os abriu.',
    ]),
  )

  out.push('## D. Identidade visual')
  out.push(
    `Paleta global: **${spec.identity.palette?.name ?? 'personalizada'}**${spec.identity.items.find((i) => i.kind === 'palette')?.isDefault ? ' (padrão do Studio — não revisado)' : ''}. Todos os componentes (botões, inputs, headers, sidebars, cards, tabelas, modais, menus, login, landing e templates) herdam estes tokens por padrão. Exceções só onde estiverem explicitamente listadas.`,
  )
  out.push(renderTokensTable(spec.identity.tokens))
  const overrides = Object.entries(spec.identity.overrides)
  if (overrides.length) out.push(`Tokens ajustados manualmente pelo usuário: ${overrides.map(([k, v]) => `\`${k}\` = ${v}`).join(', ')}.`)
  // A observação escrita no item da paleta fica nas exceções do item, que não é renderizado como bloco.
  const paletteNotes = (spec.identity.items.find((i) => i.kind === 'palette')?.exceptions ?? []).filter((e) => e.startsWith('Observação do usuário'))
  if (paletteNotes.length) out.push(`**Observações sobre a paleta**\n${bullet(paletteNotes)}`)
  for (const item of spec.identity.items.filter((i) => i.kind !== 'palette')) out.push(renderItem(item, '###', seen))
  out.push(
    `### Estados visuais\n${bullet([
      'hover: fundo `hover` ou primária `primaryHover`; active/pressed: `active`/`pressed`/`primaryActive`.',
      'focus-visible: anel de 2–3 px na cor `focusRing`, sempre visível ao navegar por teclado.',
      'selected: fundo `selected` com texto `selectedText`; disabled: fundo `disabled`, texto `disabledText`, sem hover.',
      'Mensagens: success/warning/error/info com os fundos semânticos correspondentes.',
    ])}`,
  )

  out.push('## E. Componentes')
  if (spec.components.length) {
    out.push(`${spec.components.length} componente(s) aprovados. Cada instância tem configuração própria; alterar uma não altera as outras.`)
    for (const item of spec.components) out.push(renderItem(item, '###', seen))
  } else {
    out.push('Nenhum componente foi personalizado na biblioteca. Crie os componentes necessários usando os tokens e a geometria da seção D.')
  }

  if (spec.references.inspiration || spec.references.template) {
    out.push('## Referências visuais aprovadas')
    for (const item of [spec.references.inspiration, spec.references.template]) if (item) out.push(renderItem(item, '###', seen))
  }

  out.push('## F. Responsividade')
  out.push(`Valide pelo menos nas larguras: ${spec.responsive.referenceWidths.join(', ')} px, além de larguras intermediárias.`)
  out.push(
    `Breakpoints de referência:\n${bullet(spec.responsive.breakpoints.map((b) => `${b.name}: ${b.description}`))}`,
  )
  out.push(`**Regras gerais**\n${bullet(spec.responsive.globalRules)}`)
  const componentRules = Object.values(spec.responsive.componentRules).flat()
  if (componentRules.length) out.push(`**Regras por tipo de elemento presente no projeto**\n${bullet(componentRules)}`)

  out.push('## G. Regras de implementação')
  out.push(bullet(spec.implementationRules))

  const resolved = spec.conflicts.filter((c) => c.resolution)
  const open = spec.conflicts.filter((c) => !c.resolution)
  if (resolved.length || open.length || spec.resolutions.length) {
    out.push('## Decisões de prioridade')
    out.push(
      'Precedência fixa: o layout desktop define estrutura e medidas; header e sidebar definem só a aparência interna; o layout mobile define a navegação no celular; a identidade global define cores, fontes e raios, salvo exceção listada; o conteúdo do projeto substitui o conteúdo de exemplo.',
    )
    if (spec.resolutions.length) out.push(bullet(spec.resolutions.map((r) => `${r.title}: ${r.instruction}`)))
    if (resolved.length) out.push(bullet(resolved.map((c) => `${c.title}: ${c.resolution!.instruction}`)))
    if (open.length)
      out.push(
        `Contradições ainda não decididas pelo usuário (pergunte antes de implementar):\n${bullet(open.map((c) => `${c.title} — ${c.description}`))}`,
      )
  }
  if (spec.pending.length) {
    out.push('## Pendências')
    out.push(`Decisões que o usuário ainda não tomou. Não invente: pergunte ou use a opção mais neutra.\n${bullet(spec.pending.map((p) => p.message))}`)
  }

  return out.join('\n\n') + '\n'
}

/**
 * Prompt individual autossuficiente: descreve um único elemento com as regras globais
 * pertinentes (identidade e responsividade), sem depender do Master Prompt.
 */
export function renderItemPrompt(item: PromptItem, project: Project): string {
  const spec = buildProjectSpec(project)
  const t = spec.identity.tokens
  const g = spec.identity.geometry
  const out: string[] = []
  out.push(`# Prompt — ${KIND_LABEL[item.kind]}: ${item.name}`)
  out.push(
    `> Gerado pelo Atelier UI para o projeto “${spec.project.name}” (${spec.project.type}). Este prompt é autossuficiente: implemente somente este elemento, exatamente como descrito.`,
  )
  out.push(renderItem(item, '##'))
  if (item.kind !== 'palette') {
    out.push(
      `## Identidade herdada\n${bullet([
        `Paleta “${spec.identity.palette?.name ?? 'personalizada'}” (${t.mode === 'dark' ? 'escura' : 'clara'}): primária ${t.primary} (texto ${t.onPrimary}), secundária ${t.secondary}, destaque ${t.accent}.`,
        `Fundo ${t.bg}, superfície ${t.surface}, texto ${t.text}, texto secundário ${t.textMuted}, borda ${t.border}.`,
        `Estados: hover ${t.hover}, active ${t.active}, selected ${t.selected}/${t.selectedText}, disabled ${t.disabled}/${t.disabledText}, foco ${t.focusRing}.`,
        `Semânticos: success ${t.success}, warning ${t.warning}, error ${t.error}, info ${t.info}.`,
        `Tipografia: títulos ${spec.identity.typography.heading} ${spec.identity.typography.headingWeight}, textos ${spec.identity.typography.body} ${spec.identity.typography.bodyWeight}, base ${spec.identity.typography.baseSize} px.`,
        `Geometria: cantos “${g.radius}”, borda ${g.borderWidth} px, sombra “${g.shadow}”, superfícies “${g.surface}”, densidade “${g.density}”.`,
      ])}`,
    )
  }
  out.push(`## Responsividade obrigatória\nValide em ${REFERENCE_WIDTHS.join(', ')} px.\n${bullet([...GLOBAL_RESPONSIVE_RULES, ...rulesFor(item.responsiveKinds)])}`)
  out.push(`## Regras de implementação\n${bullet(IMPLEMENTATION_RULES)}`)
  return out.join('\n\n') + '\n'
}
