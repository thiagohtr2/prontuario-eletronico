import { useCallback, useEffect, useMemo, useState } from 'react'
import { Braces, Check, FileCode2, FileType2, MousePointerClick, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { isHex, normalizeHex } from '@/core/color'
import { downloadFile, downloadJson } from '@/core/download'
import type { TemplateChoice } from '@/core/project'
import { useProject, useStudio } from '@/core/store'
import { FONT_OPTIONS, RADIUS_VALUES } from '@/core/tokens'
import type { Device } from '@/core/types'
import { PromptButton } from '@/prompt/PromptButton'
import { Badge, Button, DeviceToggle, IconButton, Input, Modal, Select, toast } from '@/ui'
import { categoryName, templateById } from './catalog'
import { buildTemplateCss, buildTemplateSpec, templateFileBase } from './exports'
import { buildTemplateHtml } from './exportHtml'
import { PreviewFrame } from './frames'
import { COLOR_FIELDS, defaultsOf, minimalOverrides, patchOverrides, RADIUS_ORDER, RADIUS_SHORT, resolveTemplateTheme, type ColorKey, type TemplateOverrides } from './theme'
import type { TemplateModel } from './types'

interface EditorState {
  overrides: TemplateOverrides
  sections: string[]
}

/** Editor de um template: prévia ao vivo + cores, fontes, cantos, partes e exportações. */
export function TemplateEditor({ template, onClose }: { template: TemplateModel; onClose: () => void }) {
  const stored = useProject((p) => p.template)
  const setTemplate = useStudio((s) => s.setTemplate)
  const showHints = useProject((p) => p.prefs.showHints)
  const inProject = stored?.id === template.id
  const other = stored && !inProject ? templateById(stored.id) : undefined

  // Ao reabrir o template que já está no projeto, o editor parte do que foi salvo.
  const [local, setLocal] = useState<EditorState>(() =>
    stored && stored.id === template.id
      ? { overrides: minimalOverrides(template, stored.overrides), sections: stored.sections }
      : { overrides: {}, sections: [] },
  )
  const state: EditorState = inProject && stored ? { overrides: stored.overrides, sections: stored.sections } : local
  const [device, setDevice] = useState<Device>('desktop')

  const theme = useMemo(() => resolveTemplateTheme(template, state.overrides), [template, state.overrides])
  const defaults = useMemo(() => defaultsOf(template), [template])
  const order = useMemo(() => template.sections.map((s) => s.id), [template])

  /** Se o template está no projeto, as alterações vão direto para a store (fonte única da verdade). */
  const commit = useCallback(
    (next: EditorState) => {
      const choice: TemplateChoice = { id: template.id, overrides: minimalOverrides(template, next.overrides), sections: order.filter((id) => next.sections.includes(id)) }
      if (inProject) setTemplate(choice)
      else setLocal({ overrides: choice.overrides, sections: choice.sections })
    },
    [inProject, order, setTemplate, template],
  )

  const setOverride = <K extends keyof TemplateOverrides>(key: K, value: TemplateOverrides[K] | null) =>
    commit({ ...state, overrides: patchOverrides(template, state.overrides, key, value) })

  const toggleSection = useCallback(
    (id: string) => commit({ ...state, sections: state.sections.includes(id) ? state.sections.filter((s) => s !== id) : [...state.sections, id] }),
    [commit, state],
  )

  const promptOverrides = useMemo(
    () => Object.fromEntries(Object.entries(state.overrides).filter(([, v]) => typeof v === 'string' && v)) as Record<string, string>,
    [state.overrides],
  )

  const addToProject = () => {
    setTemplate({ id: template.id, overrides: minimalOverrides(template, state.overrides), sections: order.filter((id) => state.sections.includes(id)) })
    toast.success(`“${template.name}” agora faz parte do projeto e do Master Prompt.`)
  }
  const removeFromProject = () => {
    setLocal({ overrides: state.overrides, sections: state.sections })
    setTemplate(null)
    toast.info('Template removido do projeto. Suas escolhas continuam neste editor.')
  }

  // O PromptButton abre um segundo modal; o Esc desse modal não deve fechar o editor.
  const handleClose = useCallback(() => {
    if (document.querySelector('[data-testid="prompt-modal"]')) return
    onClose()
  }, [onClose])

  const hasOverrides = Object.keys(state.overrides).length > 0
  const base = templateFileBase(template)

  const exportCss = () => {
    downloadFile(`${base}.css`, buildTemplateCss(template, state.overrides, state.sections), 'text/css')
    toast.success('CSS do template baixado.')
  }
  const exportJson = () => {
    downloadJson(`${base}.json`, buildTemplateSpec(template, state.overrides, state.sections))
    toast.success('Especificação JSON baixada.')
  }
  const exportHtml = () => {
    downloadFile(`${base}.html`, buildTemplateHtml(template, state.overrides), 'text/html')
    toast.success('HTML demonstrativo baixado. Abra o arquivo no navegador.')
  }

  return (
    <Modal
      open
      onClose={handleClose}
      width={1240}
      testId="template-editor"
      title={template.name}
      subtitle={`${categoryName(template.category)} · marca fictícia “${template.brand}” · ${template.sections.length} partes`}
      footer={
        <div className="tpl-foot">
          <div className="tpl-foot__status" aria-live="polite">
            {inProject ? (
              <>
                <Badge tone="success" icon={<Check />}>
                  No projeto
                </Badge>
                <span>Alterações salvas automaticamente no Master Prompt.</span>
              </>
            ) : other ? (
              <span>Ao usar, substitui “{other.name}” no projeto.</span>
            ) : (
              <span>Ainda não está no projeto.</span>
            )}
          </div>
          <div className="tpl-foot__actions">
            {inProject && (
              <Button variant="danger" icon={<Trash2 />} onClick={removeFromProject} data-testid="template-remove">
                Remover do projeto
              </Button>
            )}
            <PromptButton target={{ kind: 'template', id: template.id, overrides: promptOverrides, sections: state.sections }} variant="secondary" size="md" label="Prompt deste template" />
            {!inProject && (
              <Button variant="primary" icon={<Plus />} onClick={addToProject} data-testid="template-use">
                Usar este template no projeto
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="tpl-editor">
        <div className="tpl-editor__preview">
          <div className="tpl-editor__bar">
            <DeviceToggle value={device} onChange={setDevice} />
            <span className="tpl-editor__hint">
              <MousePointerClick aria-hidden="true" />
              Clique em uma parte da prévia para marcá-la
            </span>
          </div>
          <PreviewFrame template={template} theme={theme} device={device === 'mobile' ? 'mobile' : 'desktop'} selected={state.sections} onToggleSection={toggleSection} />
        </div>

        <div className="tpl-editor__controls">
          <section className="tpl-group" aria-labelledby="tpl-colors">
            <div className="tpl-group__head">
              <h3 id="tpl-colors" className="tpl-group__title">
                Cores
              </h3>
              {hasOverrides && (
                <Button size="sm" variant="ghost" icon={<RotateCcw />} onClick={() => commit({ ...state, overrides: {} })}>
                  Restaurar padrão
                </Button>
              )}
            </div>
            {COLOR_FIELDS.map((f) => (
              <ColorField
                key={f.key}
                field={f.key}
                label={f.label}
                help={f.help}
                value={(state.overrides[f.key] as string | undefined) ?? defaults[f.key]}
                isDefault={!state.overrides[f.key]}
                onChange={(v) => setOverride(f.key, v)}
              />
            ))}
          </section>

          <section className="tpl-group" aria-labelledby="tpl-fonts">
            <h3 id="tpl-fonts" className="tpl-group__title">
              Fontes
            </h3>
            <div className="tpl-fonts">
              {(['headingFont', 'bodyFont'] as const).map((key) => (
                <label key={key} className="tpl-field">
                  <span className="ui-label">{key === 'headingFont' ? 'Títulos' : 'Textos'}</span>
                  <Select value={state.overrides[key] ?? defaults[key]} onChange={(e) => setOverride(key, e.target.value)} data-testid={`template-${key}`}>
                    {FONT_OPTIONS.map((fo) => (
                      <option key={fo.id} value={fo.id}>
                        {fo.name}
                        {fo.id === defaults[key] ? ' (padrão)' : ''}
                      </option>
                    ))}
                  </Select>
                </label>
              ))}
            </div>
          </section>

          <section className="tpl-group" aria-labelledby="tpl-radius">
            <h3 id="tpl-radius" className="tpl-group__title">
              Cantos <span className="tpl-count">padrão: {RADIUS_SHORT[defaults.radius].toLowerCase()}</span>
            </h3>
            <div className="tpl-radius" role="group" aria-label="Arredondamento dos cantos">
              {RADIUS_ORDER.map((r) => {
                const current = (state.overrides.radius ?? defaults.radius) === r
                return (
                  <button
                    key={r}
                    type="button"
                    className="tpl-radius__opt"
                    aria-pressed={current}
                    title={`${RADIUS_VALUES[r].label}${r === defaults.radius ? ' · padrão do template' : ''}`}
                    onClick={() => setOverride('radius', r)}
                    data-testid={`template-radius-${r}`}
                  >
                    <span className="tpl-radius__shape" style={{ borderTopLeftRadius: r === 'pill' ? 14 : RADIUS_VALUES[r].lg }} aria-hidden="true" />
                    <span>{RADIUS_SHORT[r]}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="tpl-group" aria-labelledby="tpl-parts">
            <div className="tpl-group__head">
              <h3 id="tpl-parts" className="tpl-group__title">
                Partes editáveis <span className="tpl-count">{state.sections.length}/{template.sections.length}</span>
              </h3>
              <span className="tpl-group__links">
                <button type="button" className="tpl-link" onClick={() => commit({ ...state, sections: order })} disabled={state.sections.length === order.length}>
                  Todas
                </button>
                <button type="button" className="tpl-link" onClick={() => commit({ ...state, sections: [] })} disabled={state.sections.length === 0}>
                  Nenhuma
                </button>
              </span>
            </div>
            {showHints && <p className="tpl-help">Marque as partes que você quer editar ou detalhar. Elas entram no Master Prompt como prioridade.</p>}
            <ul className="tpl-parts" data-testid="template-parts">
              {template.sections.map((s, i) => {
                const checked = state.sections.includes(s.id)
                return (
                  <li key={s.id}>
                    <label className="tpl-part" data-checked={checked || undefined}>
                      <input type="checkbox" checked={checked} onChange={() => toggleSection(s.id)} data-testid={`template-part-${s.id}`} />
                      <span className="tpl-part__num" aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className="tpl-part__text">
                        <span className="tpl-part__name">{s.name}</span>
                        <span className="tpl-part__desc">{s.description}</span>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="tpl-group" aria-labelledby="tpl-export">
            <h3 id="tpl-export" className="tpl-group__title">
              Exportar
            </h3>
            <div className="tpl-exports">
              <button type="button" className="tpl-export" onClick={exportCss} data-testid="template-export-css">
                <FileType2 aria-hidden="true" />
                <span>
                  <strong>CSS</strong>
                  <span>Variáveis de cor, fonte e cantos + regras base</span>
                </span>
              </button>
              <button type="button" className="tpl-export" onClick={exportJson} data-testid="template-export-json">
                <Braces aria-hidden="true" />
                <span>
                  <strong>Especificação JSON</strong>
                  <span>Template, personalizações e partes marcadas</span>
                </span>
              </button>
              <button type="button" className="tpl-export" onClick={exportHtml} data-testid="template-export-html">
                <FileCode2 aria-hidden="true" />
                <span>
                  <strong>HTML demonstrativo</strong>
                  <span>Página completa que abre sozinha no navegador</span>
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  )
}

function ColorField({
  field,
  label,
  help,
  value,
  isDefault,
  onChange,
}: {
  field: ColorKey
  label: string
  help: string
  value: string
  isDefault: boolean
  onChange: (value: string | null) => void
}) {
  const [text, setText] = useState(value)
  useEffect(() => setText(value), [value])
  const commitText = (raw: string) => {
    const v = raw.trim()
    if (isHex(v)) onChange(normalizeHex(v))
    else setText(value)
  }
  return (
    <div className="tpl-color">
      <label className="tpl-color__swatch" style={{ background: value }} title={`Escolher ${label.toLowerCase()}`}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label={`${label}: abrir seletor de cor`} data-testid={`template-color-${field}`} />
      </label>
      <span className="tpl-color__text">
        <span className="ui-label">{label}</span>
        <span className="tpl-color__help">{help}</span>
      </span>
      <Input
        mono
        className="tpl-color__hex"
        value={text}
        maxLength={7}
        spellCheck={false}
        aria-label={`${label} em hexadecimal`}
        data-testid={`template-hex-${field}`}
        onChange={(e) => {
          setText(e.target.value)
          if (/^#?[0-9a-f]{6}$/i.test(e.target.value.trim())) onChange(normalizeHex(e.target.value))
        }}
        onBlur={(e) => commitText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commitText((e.target as HTMLInputElement).value)
        }}
      />
      {isDefault ? (
        <span className="tpl-color__spacer" aria-hidden="true" />
      ) : (
        <IconButton label={`Restaurar ${label.toLowerCase()} padrão`} size="sm" onClick={() => onChange(null)}>
          <RotateCcw />
        </IconButton>
      )}
    </div>
  )
}
