import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ArrowDown, Eraser, RotateCcw, Sparkles, Wand2 } from 'lucide-react'
import { useStudio } from '@/core/store'
import { Button, Callout, CopyButton, EmptyState, Field, Input, Modal, PageHeader, Section, Segmented, Switch, Textarea, keepScroll, toast } from '@/ui'
import {
  CONTEXT_FIELDS,
  DEVICES,
  ENVS,
  MODULES,
  PRESETS,
  SPACING_OPTIONS,
  TASKS,
  TOUCH_OPTIONS,
  applyPreset,
  matchingPreset,
  type ContextKey,
  type DeviceId,
  type EnvId,
  type ModuleId,
  type SpacingScale,
  type TouchTarget,
} from './content'
import { filledContext, summarize } from './prompt'
import { isStale, useGuide } from './store'
import './layout-guide.css'

/**
 * Boas práticas de layout: configura e gera um prompt para outra IA criar, revisar ou corrigir o
 * layout de uma página ou de um site. Toda a lógica do texto está em `prompt.ts`; aqui só se edita
 * a configuração, se lê o resumo e se revisa/copia o resultado.
 */

const time = (iso: string | null) => (iso ? new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '')
const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item])

type Confirm = 'regenerar' | 'limpar' | 'restaurar' | null

export default function LayoutGuidePage() {
  const config = useGuide((s) => s.config)
  const text = useGuide((s) => s.text)
  const edited = useGuide((s) => s.edited)
  const generatedFrom = useGuide((s) => s.generatedFrom)
  const generatedAt = useGuide((s) => s.generatedAt)
  const { update, generate, setText, restoreDefaults, clearFields } = useGuide.getState()
  const [confirm, setConfirm] = useState<Confirm>(null)
  const [status, setStatus] = useState('')
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const summary = useMemo(() => summarize(config), [config])
  const preset = matchingPreset(config)
  const stale = isStale({ config, generatedFrom })
  const hasText = text.trim() !== ''
  const filled = filledContext(config).length

  const create = () => {
    if (edited && hasText) {
      setConfirm('regenerar')
      return
    }
    generate()
    setStatus(`Prompt criado às ${time(new Date().toISOString())}. Ele acompanha as opções enquanto você não editar o texto.`)
    // Em telas estreitas o texto aparece abaixo do botão: mostra o começo dele se ficou fora da tela.
    // Na tela larga o resultado já está visível ao lado das opções, então nada se move.
    requestAnimationFrame(() => {
      const el = editorRef.current
      if (!el || window.matchMedia('(min-width: 1180px)').matches) return
      const r = el.getBoundingClientRect()
      if (r.top > window.innerHeight - 80) el.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    })
  }

  return (
    <div className="ui-page lg" data-testid="layout-guide">
      <PageHeader
        eyebrow="Ferramenta"
        title="Boas práticas de layout"
        description="Monte um prompt com boas práticas de layout para outra IA criar, revisar ou corrigir uma página ou um site inteiro — do celular pequeno ao monitor ultrawide."
        actions={
          // Em telas estreitas o resultado fica no fim da página: atalho para ele (botão, não âncora: o roteador usa o #).
          <Button
            className="lg-jump"
            icon={<ArrowDown />}
            onClick={() => {
              const el = document.getElementById('lg-resultado')
              el?.scrollIntoView({ block: 'start', behavior: 'auto' })
              el?.querySelector<HTMLElement>('[data-testid="lg-create"]')?.focus({ preventScroll: true })
            }}
            data-testid="lg-jump"
          >
            Ir para o prompt
          </Button>
        }
      />

      <section className="lg-presets" aria-labelledby="lg-presets-title">
        <h2 id="lg-presets-title" className="lg-label">
          Atalhos
        </h2>
        <p className="lg-hint">Preenchem as seleções abaixo; você ainda pode ajustar tudo antes de criar o prompt.</p>
        <div className="lg-preset-list" role="group" aria-label="Atalhos de configuração">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="lg-preset"
              aria-pressed={preset?.id === p.id}
              data-testid={`lg-preset-${p.id}`}
              onClick={() =>
                keepScroll(() => {
                  update((c) => applyPreset(c, p.id))
                  toast.success(`Atalho aplicado: ${p.label}.`)
                })
              }
            >
              <strong>{p.label}</strong>
              <span>{p.description}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="lg-layout">
        <div className="lg-config">
          <TaskSection />
          <ContextSection />
          <DevicesSection />
          <ModulesSection />
        </div>

        <aside className="lg-result" aria-labelledby="lg-result-title" id="lg-resultado">
          <div className="lg-result__head">
            <h2 id="lg-result-title" className="ui-section__title">
              Prompt
            </h2>
            {hasText && (
              <span className="lg-pill" data-tone={stale ? 'warning' : edited ? 'accent' : 'success'} data-testid="lg-state">
                {stale ? 'Desatualizado' : edited ? 'Editado' : 'Acompanha as opções'}
              </span>
            )}
          </div>

          <dl className="lg-summary" aria-label="Resumo das opções ativas" data-testid="lg-summary">
            <div>
              <dt>Tarefa</dt>
              <dd>{summary.task}</dd>
            </div>
            <div>
              <dt>Telas</dt>
              <dd>
                {summary.devices}
                {config.devices.length > 0 && <span className="lg-sub">{summary.widths}</span>}
              </dd>
            </div>
            <div>
              <dt>Ambientes</dt>
              <dd>{summary.envs}</dd>
            </div>
            <div>
              <dt>Módulos</dt>
              <dd>
                {summary.moduleCount} de {MODULES.length}
                {summary.moduleCount > 0 && <span className="lg-sub">{summary.modules}</span>}
              </dd>
            </div>
            <div>
              <dt>Contexto</dt>
              <dd>{summary.context}</dd>
            </div>
          </dl>

          <div className="lg-actions">
            <Button variant="primary" icon={<Wand2 />} onClick={create} data-testid="lg-create">
              {hasText ? 'Criar de novo' : 'Criar prompt'}
            </Button>
            <CopyButton
              text={() => useGuide.getState().text}
              label="Copiar prompt"
              disabled={!hasText}
              testId="lg-copy"
              onCopied={() => setStatus(`Prompt copiado às ${time(new Date().toISOString())} (${text.length.toLocaleString('pt-BR')} caracteres).`)}
            />
          </div>
          <div className="lg-actions lg-actions--quiet">
            <Button size="sm" variant="ghost" icon={<RotateCcw />} onClick={() => setConfirm('restaurar')} data-testid="lg-restore">
              Restaurar padrão
            </Button>
            <Button size="sm" variant="ghost" icon={<Eraser />} onClick={() => setConfirm('limpar')} disabled={filled === 0} data-testid="lg-clear">
              Limpar campos
            </Button>
          </div>

          <p className="lg-status" role="status" aria-live="polite" data-testid="lg-status">
            {status}
          </p>

          {stale && (
            <Callout tone="warning" title="As opções mudaram.">
              O texto foi editado à mão, então não foi atualizado. Clique em “Criar de novo” para gerar com as opções atuais.
            </Callout>
          )}

          {hasText ? (
            <div className="lg-editor">
              <label className="ui-label" htmlFor="lg-editor">
                Texto do prompt <span className="lg-hint">(editável — ajuste antes de copiar)</span>
              </label>
              <Textarea
                id="lg-editor"
                ref={editorRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck={false}
                rows={18}
                data-testid="lg-editor"
              />
              <span className="lg-hint">
                {text.length.toLocaleString('pt-BR')} caracteres
                {generatedAt && ` · gerado às ${time(generatedAt)}`}
                {edited && ' · editado à mão'}
              </span>
            </div>
          ) : (
            <EmptyState icon={<Sparkles aria-hidden="true" />} title="Nenhum prompt ainda">
              Escolha as opções e clique em “Criar prompt”. O texto aparece aqui e pode ser editado antes de copiar.
            </EmptyState>
          )}
        </aside>
      </div>

      <Modal
        open={confirm === 'regenerar'}
        onClose={() => setConfirm(null)}
        title="Substituir o texto editado?"
        subtitle="Você editou o prompt à mão. Criar de novo troca o texto pelo gerado a partir das opções atuais; as suas edições se perdem."
        width={520}
        testId="lg-confirm-regenerar"
        footer={
          <>
            <Button onClick={() => setConfirm(null)}>Manter o meu texto</Button>
            <Button
              variant="danger"
              onClick={() => {
                generate()
                setConfirm(null)
                setStatus(`Prompt criado de novo às ${time(new Date().toISOString())}.`)
              }}
            >
              Substituir o texto
            </Button>
          </>
        }
      >
        <p className="u-muted u-small">Dica: copie o texto editado antes, se quiser guardar uma parte dele.</p>
      </Modal>

      <Modal
        open={confirm === 'limpar'}
        onClose={() => setConfirm(null)}
        title="Limpar os campos de contexto?"
        subtitle={`${filled} campo(s) preenchido(s) ficam vazios: projeto, página, objetivo, público, tecnologia, arquivos, restrições, elementos a preservar e referências.`}
        width={520}
        testId="lg-confirm-limpar"
        footer={
          <>
            <Button onClick={() => setConfirm(null)}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={() => {
                clearFields()
                setConfirm(null)
                setStatus('Campos de contexto limpos. Tarefa, telas e módulos continuam como estavam.')
              }}
            >
              Limpar campos
            </Button>
          </>
        }
      >
        <p className="u-muted u-small">Tarefa, telas, ambientes e módulos não mudam. {edited ? 'O texto editado à mão também fica como está.' : ''}</p>
      </Modal>

      <Modal
        open={confirm === 'restaurar'}
        onClose={() => setConfirm(null)}
        title="Restaurar as seleções padrão?"
        subtitle="Tarefa, telas, ambientes, módulos e opções voltam ao padrão (revisar um layout existente, celular a desktop, módulos A a L e N)."
        width={520}
        testId="lg-confirm-restaurar"
        footer={
          <>
            <Button onClick={() => setConfirm(null)}>Cancelar</Button>
            <Button
              variant="primary"
              onClick={() => {
                restoreDefaults()
                setConfirm(null)
                setStatus('Seleções padrão restauradas. Os campos de contexto foram mantidos.')
              }}
            >
              Restaurar padrão
            </Button>
          </>
        }
      >
        <p className="u-muted u-small">Os campos de contexto ficam como estão{edited ? ', e o texto editado à mão também' : ''}.</p>
      </Modal>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* 1. Tarefa                                                                   */
/* -------------------------------------------------------------------------- */

function TaskSection() {
  const task = useGuide((s) => s.config.task)
  const update = useGuide((s) => s.update)
  return (
    <Section id="lg-tarefa" title="1. O que você quer fazer?">
      <fieldset className="lg-fieldset">
        <legend className="sr-only">Tarefa</legend>
        <div className="lg-tasks">
          {TASKS.map((t) => (
            <label key={t.id} className="lg-choice" data-checked={task === t.id}>
              <input type="radio" name="lg-task" value={t.id} checked={task === t.id} onChange={() => keepScroll(() => update((c) => ({ ...c, task: t.id })))} data-testid={`lg-task-${t.id}`} />
              <span className="lg-choice__text">
                <strong>{t.label}</strong>
                <span>{t.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */
/* 2. Contexto                                                                 */
/* -------------------------------------------------------------------------- */

function ContextSection() {
  const context = useGuide((s) => s.config.context)
  const update = useGuide((s) => s.update)
  const meta = useStudio((s) => s.project.meta)
  const set = (key: ContextKey, value: string) => update((c) => ({ ...c, context: { ...c.context, [key]: value } }))
  const basic = CONTEXT_FIELDS.filter((f) => !f.advanced)
  const advanced = CONTEXT_FIELDS.filter((f) => f.advanced)
  const advancedFilled = advanced.filter((f) => context[f.key].trim()).length

  // Dados reais do projeto aberto no Studio (só preenchem campos vazios; nada de exemplo).
  const fromProject: Partial<Record<ContextKey, string>> = {
    nome: [meta.name.trim(), meta.description.trim()].filter(Boolean).join(' — '),
    objetivo: meta.objective.trim(),
    publico: meta.audience.trim(),
    stack: meta.tech.trim(),
  }
  const available = (Object.entries(fromProject) as [ContextKey, string][]).filter(([, v]) => v)
  const useProject = () => {
    const toFill = available.filter(([k]) => !context[k].trim())
    if (!toFill.length) {
      toast.info('Os campos que o projeto poderia preencher já têm texto; nada foi alterado.')
      return
    }
    update((c) => ({ ...c, context: { ...c.context, ...Object.fromEntries(toFill) } }))
    toast.success(`${toFill.length} campo(s) preenchido(s) com os dados do projeto aberto.`)
  }

  const field = (f: (typeof CONTEXT_FIELDS)[number]) => (
    <Field key={f.key} label={f.label} htmlFor={`lg-ctx-${f.key}`} help={f.help} full={f.multiline}>
      {f.multiline ? (
        <Textarea id={`lg-ctx-${f.key}`} rows={3} value={context[f.key]} onChange={(e) => set(f.key, e.target.value)} data-testid={`lg-ctx-${f.key}`} />
      ) : (
        <Input id={`lg-ctx-${f.key}`} value={context[f.key]} onChange={(e) => set(f.key, e.target.value)} data-testid={`lg-ctx-${f.key}`} />
      )}
    </Field>
  )

  return (
    <Section
      id="lg-contexto"
      title="2. Contexto (opcional)"
      description="Tudo aqui é opcional. O que ficar em branco, a outra IA descobre nos arquivos do projeto e declara como suposição."
      actions={
        <Button size="sm" onClick={useProject} disabled={!available.length} title={available.length ? undefined : 'O projeto aberto ainda não tem nome, objetivo, público ou tecnologia.'} data-testid="lg-from-project">
          Usar dados do projeto aberto
        </Button>
      }
    >
      <div className="ui-form-grid">{basic.map(field)}</div>
      <details className="lg-details" open={advancedFilled > 0 || undefined}>
        <summary>
          Mais detalhes: arquivos, restrições, elementos a preservar e referências
          {advancedFilled > 0 && <span className="lg-count">{advancedFilled} preenchido(s)</span>}
        </summary>
        <div className="ui-form-grid lg-details__body">{advanced.map(field)}</div>
      </details>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */
/* 3. Telas e ambientes                                                        */
/* -------------------------------------------------------------------------- */

function CheckTile({ checked, onChange, title, detail, testId }: { checked: boolean; onChange: () => void; title: string; detail?: string; testId?: string }) {
  return (
    <label className="lg-tile" data-checked={checked}>
      <input type="checkbox" checked={checked} onChange={() => keepScroll(onChange)} data-testid={testId} />
      <span className="lg-tile__text">
        <strong>{title}</strong>
        {detail && <span>{detail}</span>}
      </span>
    </label>
  )
}

function DevicesSection() {
  const devices = useGuide((s) => s.config.devices)
  const envs = useGuide((s) => s.config.envs)
  const update = useGuide((s) => s.update)
  return (
    <Section id="lg-telas" title="3. Telas e ambientes" description="Escolha onde o layout precisa funcionar. As larguras de teste entram no prompt como referência.">
      <fieldset className="lg-fieldset">
        <legend className="lg-legend">
          Tamanhos de tela <span className="lg-count">{devices.length} de {DEVICES.length}</span>
        </legend>
        <div className="lg-inline-actions">
          <Button size="sm" variant="ghost" onClick={() => keepScroll(() => update((c) => ({ ...c, devices: DEVICES.map((d) => d.id) })))} disabled={devices.length === DEVICES.length}>
            Todas as telas
          </Button>
          <Button size="sm" variant="ghost" onClick={() => keepScroll(() => update((c) => ({ ...c, devices: [] })))} disabled={devices.length === 0}>
            Nenhuma
          </Button>
        </div>
        <div className="lg-tiles">
          {DEVICES.map((d) => (
            <CheckTile key={d.id} checked={devices.includes(d.id)} onChange={() => update((c) => ({ ...c, devices: toggle<DeviceId>(c.devices, d.id) }))} title={d.label} detail={d.range} testId={`lg-device-${d.id}`} />
          ))}
        </div>
        {devices.length === 0 && <p className="lg-hint">Sem telas selecionadas, o prompt pede um celular, um tablet e um desktop como mínimo.</p>}
      </fieldset>
      <fieldset className="lg-fieldset">
        <legend className="lg-legend">
          Navegadores e sistemas <span className="lg-count">{envs.length} de {ENVS.length}</span>
        </legend>
        <div className="lg-tiles">
          {ENVS.map((e) => (
            <CheckTile key={e.id} checked={envs.includes(e.id)} onChange={() => update((c) => ({ ...c, envs: toggle<EnvId>(c.envs, e.id) }))} title={e.label} testId={`lg-env-${e.id}`} />
          ))}
        </div>
      </fieldset>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */
/* 4. Módulos                                                                  */
/* -------------------------------------------------------------------------- */

function ModulesSection() {
  const modules = useGuide((s) => s.config.modules)
  const options = useGuide((s) => s.config.options)
  const update = useGuide((s) => s.update)
  const allRef = useRef<HTMLInputElement>(null)
  const allId = useId()
  const all = modules.length === MODULES.length
  const some = modules.length > 0 && !all
  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = some
  }, [some])
  const setOpt = <K extends keyof typeof options>(k: K, v: (typeof options)[K]) => update((c) => ({ ...c, options: { ...c.options, [k]: v } }))

  return (
    <Section id="lg-modulos" title="4. Boas práticas" description="Cada módulo vira uma seção do prompt. Desligados, não entram no texto.">
      <div className="lg-modbar">
        <label className="lg-all" htmlFor={allId}>
          <input id={allId} ref={allRef} type="checkbox" checked={all} onChange={() => keepScroll(() => update((c) => ({ ...c, modules: all ? [] : MODULES.map((m) => m.id) })))} data-testid="lg-select-all" />
          <span>Selecionar tudo</span>
        </label>
        <span className="lg-count" data-testid="lg-module-count">
          {modules.length} de {MODULES.length} ativos
        </span>
      </div>
      <ul className="lg-mods">
        {MODULES.map((m) => {
          const on = modules.includes(m.id)
          const rules = m.rules(options)
          return (
            <li key={m.id} className="lg-mod" data-on={on} data-testid={`lg-module-${m.id}`}>
              <Switch
                checked={on}
                onChange={() => keepScroll(() => update((c) => ({ ...c, modules: toggle<ModuleId>(c.modules, m.id) })))}
                label={
                  <span className="lg-mod__title">
                    <span className="lg-mod__letter" aria-hidden="true">
                      {m.id}
                    </span>
                    {m.title}
                  </span>
                }
                description={m.summary}
              />
              {on && m.id === 'B' && (
                <Segmented<SpacingScale> label="Escala de espaçamento" value={options.spacing} onChange={(v) => setOpt('spacing', v)} options={SPACING_OPTIONS.map((s) => ({ value: s.id, label: s.label }))} />
              )}
              {on && (m.id === 'C' || m.id === 'G' || m.id === 'J') && (
                <Segmented<`${TouchTarget}`> label="Área mínima de toque" value={`${options.touch}`} onChange={(v) => setOpt('touch', Number(v) as TouchTarget)} options={TOUCH_OPTIONS.map((t) => ({ value: `${t.id}` as `${TouchTarget}`, label: t.label }))} />
              )}
              {on && m.id === 'F' && <Switch checked={options.darkMode} onChange={(v) => setOpt('darkMode', v)} label="O projeto tem tema claro e escuro" />}
              <details className="lg-details lg-details--rules">
                <summary>Ver as {rules.length} regras</summary>
                <ul className="lg-rules">
                  {rules.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </details>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
