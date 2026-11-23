import { beforeEach, describe, expect, it } from 'vitest'
import {
  CONTEXT_FIELDS,
  DEVICES,
  MODULES,
  PRESETS,
  TASKS,
  applyPreset,
  defaultConfig,
  matchingPreset,
  type GuideConfig,
} from '@/modules/layout-guide/content'
import { buildLayoutPrompt, explainPlain, sanitizeConfig, summarize, testWidths } from '@/modules/layout-guide/prompt'
import { isStale, useGuide } from '@/modules/layout-guide/store'

/** Boas práticas de layout: o prompt é função pura das opções; nada desligado entra no texto. */

const cfg = (patch: Partial<GuideConfig> = {}): GuideConfig => ({ ...defaultConfig(), ...patch })

describe('Conteúdo da ferramenta', () => {
  it('tem as 8 tarefas, os 9 campos de contexto, 8 telas e os módulos A a N', () => {
    expect(TASKS).toHaveLength(8)
    expect(CONTEXT_FIELDS).toHaveLength(9)
    expect(DEVICES).toHaveLength(8)
    expect(MODULES.map((m) => m.id).join('')).toBe('ABCDEFGHIJKLMN')
  })

  it('o padrão começa sem contexto (nada de dado de exemplo) e com impressão desligada', () => {
    const c = defaultConfig()
    expect(Object.values(c.context).every((v) => v === '')).toBe(true)
    expect(c.modules).not.toContain('M')
    expect(c.modules).toContain('N')
  })
})

describe('Prompt gerado', () => {
  it('sempre pede para não inventar informações e para examinar os arquivos antes', () => {
    const text = buildLayoutPrompt(cfg())
    expect(text).toContain('Não invente informações sobre o projeto')
    expect(text).toContain('examine primeiro os arquivos disponíveis')
    expect(text).toContain('declare as suposições relevantes')
  })

  it('sem contexto, diz que nada foi informado; com contexto, usa só os campos preenchidos', () => {
    expect(buildLayoutPrompt(cfg())).toContain('Nenhum contexto foi informado')
    const c = cfg()
    c.context.nome = 'Portal da Clínica Vida'
    c.context.stack = 'React + Tailwind'
    c.context.arquivos = 'src/pages/Agenda.tsx\nsrc/components/Header.tsx'
    const text = buildLayoutPrompt(c)
    expect(text).toContain('- Projeto: Portal da Clínica Vida')
    expect(text).toContain('- Tecnologia: React + Tailwind')
    expect(text).toContain('**Componentes ou arquivos a analisar:**\nsrc/pages/Agenda.tsx\nsrc/components/Header.tsx')
    expect(text).not.toContain('Nenhum contexto foi informado')
    expect(text).toMatch(/Não informado: página ou tela, objetivo principal da página, público que usará a interface\./)
    expect(text).not.toContain('Página ou tela:')
  })

  it('inclui só os módulos ativos (seções desligadas não entram)', () => {
    const only = buildLayoutPrompt(cfg({ modules: ['C', 'D'] }))
    expect(only).toContain('### C. Botões, links e ações')
    expect(only).toContain('### D. Textos, títulos e conteúdo')
    for (const m of MODULES.filter((x) => !['C', 'D'].includes(x.id))) expect(only).not.toContain(`### ${m.id}. ${m.title}`)
    expect(only).not.toContain('## Checklist de verificação')
    const none = buildLayoutPrompt(cfg({ modules: [] }))
    expect(none).not.toContain('## Boas práticas a aplicar')
    // A entrega (resumo das alterações) existe sempre.
    expect(none).toContain('## Entrega')
    expect(none).toContain('Lista dos arquivos ou componentes alterados.')
  })

  it('o módulo N vira o checklist numerado, com o aviso sobre verificação visual real', () => {
    const text = buildLayoutPrompt(cfg({ modules: ['N'] }))
    expect(text).toContain('## Checklist de verificação\n\n1. Examine a implementação existente')
    expect(text).toContain('Se não puder fazer uma verificação visual real')
    expect(text).not.toContain('### N.')
  })

  it('impressão entra só quando ativada', () => {
    expect(buildLayoutPrompt(cfg())).not.toContain('### M. Impressão')
    expect(buildLayoutPrompt(cfg({ modules: ['M'] }))).toContain('### M. Impressão (opcional)')
  })

  it('telas viram larguras de teste ordenadas, com o aviso de que breakpoints seguem o conteúdo', () => {
    expect(testWidths(['desktop', 'cel-pequeno'])).toEqual([320, 344, 1536, 1920])
    const text = buildLayoutPrompt(cfg({ devices: ['cel-padrao', 'tablet-retrato'] }))
    expect(text).toContain('Larguras de teste: 360, 375, 390, 768, 820 px.')
    expect(text).toContain('os breakpoints devem ser definidos onde o conteúdo real do projeto quebra')
    expect(text).not.toContain('Monitor grande ou ultrawide')
    expect(buildLayoutPrompt(cfg({ devices: [] }))).toContain('Nenhum tamanho de tela foi selecionado')
  })

  it('ambientes selecionados trazem os pontos de atenção de cada um', () => {
    const text = buildLayoutPrompt(cfg({ envs: ['ios', 'windows'] }))
    expect(text).toContain('env(safe-area-inset-*)')
    expect(text).toContain('barras de rolagem ocupam espaço')
    expect(text).not.toContain('Android:')
  })

  it('opções mudam o texto: escala de espaçamento, alvo de toque e tema escuro', () => {
    const c = cfg()
    c.options = { spacing: 'base8', touch: 48, darkMode: true }
    const text = buildLayoutPrompt(c)
    expect(text).toContain('escala de base 8 px')
    expect(text).toContain('pelo menos 48 × 48 px')
    expect(text).toContain('O projeto tem tema claro e escuro: confira os dois temas')
    const def = buildLayoutPrompt(cfg())
    expect(def).toContain('Use a escala de espaçamento (tokens) que o projeto já tem')
    expect(def).toContain('pelo menos 44 × 44 px')
  })

  it('cada tarefa muda o objetivo e os passos', () => {
    const texts = TASKS.map((t) => buildLayoutPrompt(cfg({ task: t.id })))
    expect(new Set(texts).size).toBe(TASKS.length)
    for (const t of TASKS) expect(buildLayoutPrompt(cfg({ task: t.id }))).toContain(`# Boas práticas de layout — ${t.label}`)
  })

  it('restrições e elementos a preservar ganham seção própria e prevalecem sobre as práticas', () => {
    const c = cfg()
    c.context.restricoes = 'Não mudar a paleta.'
    c.context.preservar = 'O cabeçalho atual.'
    const text = buildLayoutPrompt(c)
    expect(text).toContain('## Restrições e elementos a preservar')
    expect(text).toContain('**Preserve sem alterar:**\nO cabeçalho atual.')
    expect(text).toContain('as restrições prevalecem')
    expect(buildLayoutPrompt(cfg())).not.toContain('## Restrições e elementos a preservar')
  })
})

describe('Atalhos (presets)', () => {
  it('preenchem tarefa, telas, ambientes e módulos, sem tocar no contexto nem nas opções', () => {
    const c = cfg()
    c.context.nome = 'Meu projeto'
    c.options.touch = 48
    for (const p of PRESETS) {
      const out = applyPreset(c, p.id)
      expect(out.task).toBe(p.task)
      expect(out.devices).toEqual(p.devices)
      expect(out.modules).toEqual(p.modules)
      expect(out.context.nome).toBe('Meu projeto')
      expect(out.options.touch).toBe(48)
      expect(matchingPreset(out)?.id).toBe(p.id)
    }
  })

  it('o atalho deixa de valer quando a pessoa personaliza', () => {
    const out = applyPreset(cfg(), 'celular')
    expect(matchingPreset({ ...out, modules: out.modules.filter((m) => m !== 'E') })).toBeUndefined()
  })

  it('o resumo reflete as opções ativas', () => {
    const s = summarize(applyPreset(cfg(), 'celular'))
    expect(s.task).toBe('Adaptar uma tela para celular')
    expect(s.devices).toBe('4 de 8 telas')
    expect(s.widths).toBe('320 a 820 px (9 larguras)')
    expect(s.envs).toBe('Navegadores modernos, Android, iOS e iPadOS')
  })
})

describe('Explicação em português simples', () => {
  it('“Vou criar uma página nova” já inclui celular, tablet, computador e monitor grande', () => {
    const p = explainPlain(applyPreset(cfg(), 'responsivo-completo'))
    expect(p.does).toBe('criar a página do zero, já funcionando em todas as telas marcadas')
    expect(p.changesCode).toBe(true)
    expect(p.screens.map((s) => [s.label, s.included])).toEqual([
      ['Celular', true],
      ['Tablet', true],
      ['Computador', true],
      ['Monitor grande', true],
    ])
    expect(p.screens[0].detail).toBe('todos os tamanhos · 320 a 430 px')
    expect(p.warnings).toEqual([])
  })

  it('situação de celular deixa claro que o computador não entra', () => {
    const p = explainPlain(applyPreset(cfg(), 'celular'))
    expect(p.screens.find((s) => s.group === 'computador')!.included).toBe(false)
    expect(p.screens.find((s) => s.group === 'tablet')!.detail).toBe('retrato · 768 a 820 px')
    expect(p.warnings).toEqual([])
  })

  it('avisa quando falta celular, quando a regra de adaptação está desligada ou quando não há regras', () => {
    expect(explainPlain(cfg({ devices: ['notebook', 'desktop'] })).warnings.join(' ')).toContain('Nenhum celular marcado')
    expect(explainPlain(cfg({ modules: ['B', 'C'] })).warnings.join(' ')).toContain('regra A')
    expect(explainPlain(cfg({ modules: [] })).warnings.join(' ')).toContain('Nenhuma regra ligada')
    expect(explainPlain(cfg({ devices: [] })).warnings.join(' ')).toContain('Nenhuma tela marcada')
  })

  it('tarefas de revisão dizem que não mexem no código', () => {
    expect(explainPlain(cfg({ task: 'revisar' })).changesCode).toBe(false)
    expect(explainPlain(cfg({ task: 'auditar-consistencia' })).changesCode).toBe(false)
    expect(explainPlain(cfg()).rulesOff).toEqual(['impressão'])
  })
})

describe('Armazenamento local', () => {
  it('valores inválidos voltam ao padrão sem quebrar', () => {
    expect(sanitizeConfig(null)).toEqual(defaultConfig())
    const s = sanitizeConfig({ task: 'xyz', devices: ['cel-padrao', 'tv'], modules: 'tudo', context: { nome: 'Ok', pagina: 42 }, options: { touch: 12, spacing: 'base4' } })
    expect(s.task).toBe(defaultConfig().task)
    expect(s.devices).toEqual(['cel-padrao'])
    expect(s.modules).toEqual(defaultConfig().modules)
    expect(s.context.nome).toBe('Ok')
    expect(s.context.pagina).toBe('')
    expect(s.options).toEqual({ spacing: 'base4', touch: 44, darkMode: false })
  })
})

describe('Estado da ferramenta (sincronia do texto)', () => {
  beforeEach(() => useGuide.getState().resetAll())

  it('depois de criado, o texto acompanha as opções enquanto não for editado', () => {
    const g = useGuide.getState()
    g.generate()
    expect(useGuide.getState().text).toContain('### A.')
    useGuide.getState().update((c) => ({ ...c, modules: c.modules.filter((m) => m !== 'A') }))
    expect(useGuide.getState().text).not.toContain('### A.')
    expect(isStale(useGuide.getState())).toBe(false)
  })

  it('texto editado à mão não é sobrescrito: fica marcado como desatualizado', () => {
    useGuide.getState().generate()
    useGuide.getState().setText('Meu texto revisado')
    useGuide.getState().update((c) => ({ ...c, task: 'criar' }))
    expect(useGuide.getState().text).toBe('Meu texto revisado')
    expect(isStale(useGuide.getState())).toBe(true)
  })

  it('limpar campos esvazia só o contexto; restaurar padrão volta só as seleções', () => {
    const g = useGuide.getState()
    g.update((c) => ({ ...applyPreset(c, 'desktop'), context: { ...c.context, nome: 'Projeto X' } }))
    useGuide.getState().clearFields()
    expect(useGuide.getState().config.context.nome).toBe('')
    expect(useGuide.getState().config.task).toBe('adaptar-desktop')
    useGuide.getState().update((c) => ({ ...c, context: { ...c.context, nome: 'Projeto Y' } }))
    useGuide.getState().restoreDefaults()
    expect(useGuide.getState().config.task).toBe(defaultConfig().task)
    expect(useGuide.getState().config.context.nome).toBe('Projeto Y')
  })
})
