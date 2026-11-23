import {
  CONTEXT_FIELDS,
  DEFAULT_OPTIONS,
  DEVICES,
  ENVS,
  MODULES,
  SPACING_OPTIONS,
  TASKS,
  TOUCH_OPTIONS,
  defaultConfig,
  emptyContext,
  taskById,
  type ContextKey,
  type DeviceId,
  type EnvId,
  type GuideConfig,
  type ModuleId,
  type TaskId,
} from './content'

/*
 * Gerador do prompt de boas práticas de layout. Função pura da configuração: o mesmo conjunto de
 * opções gera sempre o mesmo texto, e seções desativadas não entram.
 */

const bullets = (lines: string[]) => lines.map((l) => `- ${l}`).join('\n')
const clean = (s: string) => s.replace(/\r\n?/g, '\n').trim()

/** Larguras de teste das telas selecionadas, em ordem crescente e sem repetição. */
export function testWidths(devices: DeviceId[]): number[] {
  return [...new Set(DEVICES.filter((d) => devices.includes(d.id)).flatMap((d) => d.widths))].sort((a, b) => a - b)
}

/** Campos de contexto preenchidos (na ordem da tela). */
export function filledContext(cfg: GuideConfig) {
  return CONTEXT_FIELDS.filter((f) => clean(cfg.context[f.key] ?? '') !== '')
}

export function buildLayoutPrompt(cfg: GuideConfig): string {
  const task = taskById(cfg.task) ?? TASKS[0]
  const devices = DEVICES.filter((d) => cfg.devices.includes(d.id))
  const envs = ENVS.filter((e) => cfg.envs.includes(e.id))
  const modules = MODULES.filter((m) => cfg.modules.includes(m.id))
  const context = filledContext(cfg)
  const ctx = (k: ContextKey) => clean(cfg.context[k] ?? '')
  const out: string[] = []

  out.push(`# Boas práticas de layout — ${task.label}`)
  out.push(
    'Você vai trabalhar no layout de um projeto de interface. Siga as instruções abaixo; elas foram escolhidas pela pessoa responsável pelo projeto.',
  )

  // Regras de trabalho: sempre presentes (evitam respostas inventadas).
  out.push('## Como trabalhar')
  out.push(
    bullets([
      'Não invente informações sobre o projeto. Se algum dado estiver ausente, examine primeiro os arquivos disponíveis (código, estilos, componentes, configuração) e declare as suposições relevantes antes de agir.',
      'Examine a implementação existente antes de propor ou fazer alterações.',
      'Use os componentes, tokens e padrões que o projeto já tem; não crie uma biblioteca paralela nem substitua estruturas sem necessidade.',
      'Trate as causas dos problemas, não só os sintomas (por exemplo, não esconda um estouro de conteúdo com overflow: hidden).',
      'Quando uma instrução abaixo não se aplicar ao projeto, diga por quê em vez de forçá-la.',
    ]),
  )

  // Contexto informado (só os campos preenchidos).
  out.push('## Contexto do projeto')
  const inline = context.filter((f) => !f.multiline)
  const blocks = context.filter((f) => f.multiline && f.key !== 'restricoes' && f.key !== 'preservar')
  if (!context.length) {
    out.push('Nenhum contexto foi informado. Descubra nos arquivos do projeto o que ele é, qual página ou tela está em questão e qual tecnologia usa, e declare essas suposições no início da resposta.')
  } else {
    if (inline.length) out.push(bullets(inline.map((f) => `${f.promptLabel}: ${ctx(f.key)}`)))
    for (const f of blocks) out.push(`**${f.promptLabel}:**\n${ctx(f.key)}`)
    const missing = CONTEXT_FIELDS.filter((f) => !f.multiline && !ctx(f.key)).map((f) => f.promptLabel.toLowerCase())
    if (missing.length) out.push(`Não informado: ${missing.join(', ')}. Descubra nos arquivos ou declare a suposição.`)
  }

  // Tarefa.
  out.push('## Tarefa')
  out.push(task.goal)
  out.push(task.steps.map((s, i) => `${i + 1}. ${s}`).join('\n'))

  // Dispositivos e ambientes.
  out.push('## Dispositivos, larguras e ambientes')
  if (devices.length) {
    out.push(bullets(devices.map((d) => `${d.label} (${d.range}): teste em ${d.widths.map((w) => `${w} px`).join(', ')} — ${d.note}.`)))
    out.push(
      `Larguras de teste: ${testWidths(cfg.devices).join(', ')} px. Teste também larguras intermediárias, redimensionando a janela aos poucos. Estas larguras são referência para os testes; os breakpoints devem ser definidos onde o conteúdo real do projeto quebra.`,
    )
  } else {
    out.push('Nenhum tamanho de tela foi selecionado: verifique pelo menos um celular (360 a 390 px), um tablet (768 px) e um desktop (1280 a 1440 px), e informe quais larguras usou.')
  }
  if (envs.length) out.push(bullets(envs.map((e) => e.attention)))

  // Módulos ativos.
  if (modules.length) {
    out.push('## Boas práticas a aplicar')
    for (const m of modules.filter((x) => x.id !== 'N')) {
      out.push(`### ${m.id}. ${m.title}`)
      out.push(bullets(m.rules(cfg.options)))
    }
  }

  // Restrições e preservação.
  const restr = ctx('restricoes')
  const keep = ctx('preservar')
  if (restr || keep) {
    out.push('## Restrições e elementos a preservar')
    if (restr) out.push(`**Restrições:**\n${restr}`)
    if (keep) out.push(`**Preserve sem alterar:**\n${keep}`)
    out.push('Se alguma boa prática acima entrar em conflito com estas restrições, as restrições prevalecem: aponte o conflito e proponha a melhor alternativa possível.')
  }

  // Checklist (módulo N).
  const n = modules.find((m) => m.id === 'N')
  if (n) {
    out.push('## Checklist de verificação')
    out.push(n.rules(cfg.options).map((s, i) => `${i + 1}. ${s}`).join('\n'))
  }

  // Entrega: sempre presente.
  out.push('## Entrega')
  out.push(
    bullets([
      'Resumo dos problemas encontrados, com onde ocorrem (arquivo/componente e largura).',
      'Resumo das alterações feitas (ou propostas, se a tarefa for só revisar) e o motivo de cada uma.',
      'Lista dos arquivos ou componentes alterados.',
      'Suposições feitas por falta de informação.',
      'O que não foi possível verificar e precisa ser conferido por uma pessoa.',
    ]),
  )

  return out.join('\n\n') + '\n'
}

/* -------------------------------------------------------------------------- */
/* Resumo das opções ativas (painel da tela)                                   */
/* -------------------------------------------------------------------------- */

export interface GuideSummary {
  task: string
  devices: string
  widths: string
  envs: string
  modules: string
  moduleCount: number
  context: string
}

export function summarize(cfg: GuideConfig): GuideSummary {
  const widths = testWidths(cfg.devices)
  const filled = filledContext(cfg)
  const mods = MODULES.filter((m) => cfg.modules.includes(m.id))
  return {
    task: taskById(cfg.task)?.label ?? '',
    devices: cfg.devices.length ? `${cfg.devices.length} de ${DEVICES.length} telas` : 'Nenhuma tela selecionada',
    widths: widths.length ? `${widths[0]} a ${widths[widths.length - 1]} px (${widths.length} larguras)` : '—',
    envs: ENVS.filter((e) => cfg.envs.includes(e.id)).map((e) => e.label).join(', ') || 'Nenhum',
    modules: mods.length ? mods.map((m) => m.id).join(' · ') : 'Nenhum',
    moduleCount: mods.length,
    context: filled.length ? `${filled.length} de ${CONTEXT_FIELDS.length} campos preenchidos` : 'Nenhum campo preenchido',
  }
}

/* -------------------------------------------------------------------------- */
/* Leitura segura do que foi salvo no navegador                                */
/* -------------------------------------------------------------------------- */

const pickList = <T extends string>(raw: unknown, valid: readonly T[]): T[] | null =>
  Array.isArray(raw) ? (raw.filter((x): x is T => typeof x === 'string' && (valid as readonly string[]).includes(x)) as T[]) : null

/** Converte um valor desconhecido (armazenamento local) numa configuração válida; o que não servir volta ao padrão. */
export function sanitizeConfig(raw: unknown): GuideConfig {
  const base = defaultConfig()
  if (!raw || typeof raw !== 'object') return base
  const r = raw as Record<string, unknown>
  const ctxRaw = (r.context && typeof r.context === 'object' ? r.context : {}) as Record<string, unknown>
  const context = emptyContext()
  for (const f of CONTEXT_FIELDS) if (typeof ctxRaw[f.key] === 'string') context[f.key] = (ctxRaw[f.key] as string).slice(0, 5000)
  const o = (r.options && typeof r.options === 'object' ? r.options : {}) as Record<string, unknown>
  return {
    task: TASKS.some((t) => t.id === r.task) ? (r.task as TaskId) : base.task,
    context,
    devices: pickList<DeviceId>(r.devices, DEVICES.map((d) => d.id)) ?? base.devices,
    envs: pickList<EnvId>(r.envs, ENVS.map((e) => e.id)) ?? base.envs,
    modules: pickList<ModuleId>(r.modules, MODULES.map((m) => m.id)) ?? base.modules,
    options: {
      spacing: SPACING_OPTIONS.some((s) => s.id === o.spacing) ? (o.spacing as GuideConfig['options']['spacing']) : DEFAULT_OPTIONS.spacing,
      touch: TOUCH_OPTIONS.some((t) => t.id === o.touch) ? (o.touch as GuideConfig['options']['touch']) : DEFAULT_OPTIONS.touch,
      darkMode: typeof o.darkMode === 'boolean' ? o.darkMode : DEFAULT_OPTIONS.darkMode,
    },
  }
}
