import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Check, Copy, ExternalLink, Layers, Palette, RotateCcw, SlidersHorizontal, Sparkles, Undo2, X } from 'lucide-react'
import { isHex, normalizeHex } from '@/core/color'
import type { PropValue } from '@/core/project'
import { studio, useProject } from '@/core/store'
import { useResolvedTheme } from '@/core/theme'
import { fontName, TOKEN_LABEL } from '@/core/tokens'
import type { TokenKey } from '@/core/types'
import { PromptButton } from '@/prompt/PromptButton'
import { Badge, Button, Callout, IconButton, Input, Modal, SearchInput, Segmented, Select, Switch, Textarea, cx, toast } from '@/ui'
import { categoryById, familyById, resolveValues, visualFamilies } from './catalog'
import { ComponentPreview } from './ComponentPreview'
import { iconByName, iconLabel, searchIcons } from './icons'
import { PARAM_GROUPS, PREVIEW_STATES, type ParamDef, type PreviewState } from './types'

/** Tokens que fazem sentido como exceção individual de um componente. */
const OVERRIDABLE: TokenKey[] = ['primary', 'onPrimary', 'accent', 'surface', 'text', 'textMuted', 'border', 'bg']

/** Rola apenas o contêiner rolável mais próximo (nunca a página) para revelar `el`. */
function revealInPanel(el: HTMLElement) {
  let box: HTMLElement | null = el.parentElement
  while (box && !(box.scrollHeight > box.clientHeight && /(auto|scroll)/.test(getComputedStyle(box).overflowY))) box = box.parentElement
  if (!box || box === document.body || box === document.documentElement) return
  const r = el.getBoundingClientRect()
  const b = box.getBoundingClientRect()
  if (r.top < b.top + 8) box.scrollTop -= b.top + 8 - r.top
  else if (r.bottom > b.bottom - 8) box.scrollTop += r.bottom - (b.bottom - 8)
}

export function ComponentEditor({ instanceId, onClose }: { instanceId: string; onClose: () => void }) {
  const instance = useProject((p) => p.components.find((c) => c.id === instanceId))
  const showHints = useProject((p) => p.prefs.showHints)
  const globalTheme = useResolvedTheme()
  const theme = useResolvedTheme(instance?.tokenOverrides)
  const [state, setState] = useState<PreviewState>('normal')
  const [activePart, setActivePart] = useState<string | null>(null)
  const [focusKey, setFocusKey] = useState<string | null>(null)
  const [pickerFor, setPickerFor] = useState<string | null>(null)
  const [quickKey, setQuickKey] = useState<string | null>(null)
  const [moreTokens, setMoreTokens] = useState(false)
  const quickRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  const category = categoryById(instance?.categoryId)
  const family = familyById(instance?.familyId)
  const values = useMemo(() => resolveValues(category, instance?.props), [category, instance?.props])

  const setProp = useCallback((key: string, value: PropValue | null) => studio().setComponentProp(instanceId, key, value), [instanceId])

  const onPart = useCallback(
    (part: string) => {
      setActivePart(part)
      const param = category?.params.find((p) => p.part === part)
      if (!param) {
        setFocusKey(null)
        setQuickKey(null)
        return
      }
      setFocusKey(param.key)
      setQuickKey(param.type === 'text' || param.type === 'textarea' ? param.key : null)
      if (param.type === 'icon') setPickerFor(param.key)
      requestAnimationFrame(() => {
        const el = document.getElementById(`cmp-ctl-${param.key}`)
        if (!el) return
        revealInPanel(el)
        if (param.type !== 'text' && param.type !== 'textarea' && param.type !== 'icon') el.querySelector<HTMLElement>('input, select, textarea, button')?.focus({ preventScroll: true })
      })
    },
    [category],
  )

  useEffect(() => {
    if (quickKey) requestAnimationFrame(() => quickRef.current?.focus({ preventScroll: true }))
  }, [quickKey])

  if (!instance || !category || !family) {
    return (
      <Modal open onClose={onClose} title="Componente não encontrado" testId="component-editor">
        <Callout tone="warning">Este componente foi removido do projeto.</Callout>
      </Modal>
    )
  }

  const quickParam = category.params.find((p) => p.key === quickKey)
  const overrides = instance.tokenOverrides
  const overrideCount = Object.keys(overrides).length
  const name = instance.label || category.name

  const stopEsc = (e: KeyboardEvent, fn: () => void) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      fn()
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      width={1240}
      testId="component-editor"
      title={`Personalizar: ${name}`}
      subtitle={`${category.name} · família ${family.name}. Tudo é salvo na hora e vai para o Master Prompt.`}
      footer={
        <>
          <PromptButton target={{ kind: 'component', instanceId }} variant="secondary" />
          <Button
            icon={<Copy />}
            onClick={() => {
              studio().duplicateComponent(instanceId)
              toast.success('Cópia criada. Ela aparece na lista “No projeto”.')
            }}
          >
            Duplicar
          </Button>
          <Button variant="primary" icon={<Check />} onClick={onClose}>
            Concluir
          </Button>
        </>
      }
    >
      <div className="cmp-ed">
        {/* ------------------------------ Prévia ------------------------------ */}
        <div className="cmp-ed__stage">
          <div className="cmp-ed__stagebar">
            <Segmented label="Estado da prévia" value={state} onChange={setState} options={PREVIEW_STATES.map((s) => ({ value: s.id, label: s.label }))} />
          </div>
          <ComponentPreview
            categoryId={category.id}
            familyId={family.id}
            theme={theme}
            props={instance.props}
            state={state}
            onPartClick={onPart}
            activePart={activePart}
            large
            height={420}
            className="cmp-ed__preview"
          />
          {quickParam ? (
            <div className="cmp-quick" data-testid="component-quick-edit">
              <label className="cmp-quick__label" htmlFor="cmp-quick-input">
                Editando: <strong>{quickParam.label}</strong>
              </label>
              <div className="cmp-quick__row">
                {quickParam.type === 'textarea' ? (
                  <Textarea
                    id="cmp-quick-input"
                    ref={(el) => {
                      quickRef.current = el
                    }}
                    rows={3}
                    value={String(values[quickParam.key] ?? '')}
                    onChange={(e) => setProp(quickParam.key, e.target.value)}
                    onKeyDown={(e) => stopEsc(e, () => setQuickKey(null))}
                  />
                ) : (
                  <Input
                    id="cmp-quick-input"
                    ref={(el) => {
                      quickRef.current = el
                    }}
                    value={String(values[quickParam.key] ?? '')}
                    onChange={(e) => setProp(quickParam.key, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setQuickKey(null)
                      stopEsc(e, () => setQuickKey(null))
                    }}
                  />
                )}
                <Button size="sm" variant="secondary" onClick={() => setQuickKey(null)}>
                  Pronto
                </Button>
              </div>
            </div>
          ) : (
            <p className="cmp-ed__hint">
              <Sparkles aria-hidden="true" /> Clique em qualquer parte da prévia (texto, ícone, botão) para editá-la.
            </p>
          )}
        </div>

        {/* ------------------------------ Controles ------------------------------ */}
        <div className="cmp-ed__controls">
          <div className="cmp-ctl">
            <label className="ui-label" htmlFor="cmp-instance-label">
              Nome no projeto
            </label>
            <Input id="cmp-instance-label" value={instance.label} placeholder={category.name} onChange={(e) => studio().updateComponent(instanceId, { label: e.target.value })} />
            <span className="ui-help">Ex.: “Botão principal do checkout”. Ajuda a IA a saber onde usar.</span>
          </div>

          {/* Camada 1 */}
          <section className="cmp-layer" aria-labelledby="cmp-layer-1">
            <header className="cmp-layer__head">
              <span className="cmp-layer__num">1</span>
              <div>
                <h3 id="cmp-layer-1" className="cmp-layer__title">
                  Token global <Badge>somente leitura</Badge>
                </h3>
                {showHints && <p className="cmp-layer__desc">A paleta aprovada vale para o projeto inteiro. Este componente a herda por padrão.</p>}
              </div>
            </header>
            <div className="cmp-tokens">
              {(['primary', 'accent', 'surface', 'text', 'border'] as TokenKey[]).map((k) => (
                <span key={k} className="cmp-token" title={`${TOKEN_LABEL[k]}: ${globalTheme.tokens[k]}`}>
                  <span className="cmp-token__sw" style={{ background: String(globalTheme.tokens[k]) }} />
                  <span className="cmp-token__name">{TOKEN_LABEL[k]}</span>
                </span>
              ))}
              <span className="cmp-token cmp-token--font">
                Aa <span className="cmp-token__name">{fontName(globalTheme.typography.heading)}</span>
              </span>
            </div>
            <a className="cmp-link" href="#/modulos/cores">
              <Palette aria-hidden="true" /> Alterar em Cores e identidade <ExternalLink aria-hidden="true" />
            </a>
          </section>

          {/* Camada 2 */}
          <section className="cmp-layer" aria-labelledby="cmp-layer-2">
            <header className="cmp-layer__head">
              <span className="cmp-layer__num">2</span>
              <div>
                <h3 id="cmp-layer-2" className="cmp-layer__title">
                  Estilo do componente <span className="cmp-layer__sub">(variação / família)</span>
                </h3>
                {showHints && <p className="cmp-layer__desc">A família define formato, bordas, sombras, fonte e densidade. Trocar aqui muda só este componente.</p>}
              </div>
            </header>
            <Select aria-label="Família visual" value={family.id} onChange={(e) => studio().updateComponent(instanceId, { familyId: e.target.value })}>
              {visualFamilies.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.number}. {f.name}
                </option>
              ))}
            </Select>
            <p className="ui-help">{family.description}</p>
          </section>

          {/* Camada 3 */}
          <section className="cmp-layer" aria-labelledby="cmp-layer-3">
            <header className="cmp-layer__head">
              <span className="cmp-layer__num">3</span>
              <div>
                <h3 id="cmp-layer-3" className="cmp-layer__title">
                  Configuração da instância
                </h3>
                {showHints && <p className="cmp-layer__desc">Textos, ícones, tamanhos e opções deste componente. Não afeta outros componentes.</p>}
              </div>
            </header>
            {PARAM_GROUPS.map((group) => {
              const params = category.params.filter((p) => p.group === group)
              if (!params.length) return null
              return (
                <fieldset key={group} className="cmp-group">
                  <legend className="cmp-group__title">{group}</legend>
                  {params.map((p) => (
                    <ParamControl
                      key={p.key}
                      param={p}
                      value={values[p.key]}
                      changed={Object.prototype.hasOwnProperty.call(instance.props, p.key)}
                      highlighted={focusKey === p.key}
                      pickerOpen={pickerFor === p.key}
                      onPicker={(open) => setPickerFor(open ? p.key : null)}
                      onChange={(val) => setProp(p.key, val)}
                      onFocus={() => {
                        setFocusKey(p.key)
                        setActivePart(p.part ?? null)
                      }}
                      stopEsc={stopEsc}
                      inheritedColor={String(theme.tokens.primary)}
                    />
                  ))}
                </fieldset>
              )
            })}
          </section>

          {/* Camada 4 */}
          <section className="cmp-layer cmp-layer--exception" aria-labelledby="cmp-layer-4">
            <header className="cmp-layer__head">
              <span className="cmp-layer__num">4</span>
              <div>
                <h3 id="cmp-layer-4" className="cmp-layer__title">
                  Exceção individual {overrideCount > 0 && <Badge tone="warning">{overrideCount} ativa(s)</Badge>}
                </h3>
                <p className="cmp-layer__desc">Use só quando este componente precisar fugir da paleta global. A exceção aparece destacada no Master Prompt.</p>
              </div>
            </header>
            {OVERRIDABLE.filter((k, i) => moreTokens || i < 4 || overrides[k]).map((k) => (
              <div key={k} className={cx('cmp-ctl', overrides[k] && 'cmp-ctl--exception')}>
                <div className="cmp-ctl__top">
                  <span className="cmp-ctl__label">
                    {TOKEN_LABEL[k]} {overrides[k] && <Badge tone="warning">Exceção</Badge>}
                  </span>
                  {overrides[k] && (
                    <button type="button" className="cmp-reset" onClick={() => studio().setComponentTokenOverride(instanceId, k, null)}>
                      <RotateCcw aria-hidden="true" /> Herdar da paleta global
                    </button>
                  )}
                </div>
                <ColorControl label={TOKEN_LABEL[k]} value={overrides[k] ?? ''} inherited={String(globalTheme.tokens[k])} inheritText={String(globalTheme.tokens[k])} hideReset onChange={(val) => studio().setComponentTokenOverride(instanceId, k, val)} />
              </div>
            ))}
            <div className="u-row">
              <Button size="sm" variant="ghost" onClick={() => setMoreTokens((m) => !m)} aria-expanded={moreTokens}>
                {moreTokens ? 'Mostrar menos cores' : `Mostrar mais cores (${OVERRIDABLE.length - 4})`}
              </Button>
            {overrideCount > 0 && (
              <Button size="sm" variant="ghost" icon={<Undo2 />} onClick={() => OVERRIDABLE.forEach((k) => studio().setComponentTokenOverride(instanceId, k, null))}>
                Remover todas as exceções
              </Button>
            )}
            </div>
          </section>
        </div>
      </div>
    </Modal>
  )
}

/* -------------------------------------------------------------------------- */
/* Controles                                                                   */
/* -------------------------------------------------------------------------- */

function ParamControl({
  param,
  value,
  changed,
  highlighted,
  pickerOpen,
  onPicker,
  onChange,
  onFocus,
  stopEsc,
  inheritedColor,
}: {
  inheritedColor: string
  param: ParamDef
  value: PropValue | undefined
  changed: boolean
  highlighted: boolean
  pickerOpen: boolean
  onPicker: (open: boolean) => void
  onChange: (v: PropValue | null) => void
  onFocus: () => void
  stopEsc: (e: KeyboardEvent, fn: () => void) => void
}) {
  const id = `cmp-in-${param.key}`
  const v = value ?? param.default
  let control: JSX.Element
  switch (param.type) {
    case 'text':
      control = <Input id={id} value={String(v)} onChange={(e) => onChange(e.target.value)} />
      break
    case 'textarea':
      control = <Textarea id={id} rows={Math.min(5, Math.max(3, String(v).split('\n').length))} value={String(v)} onChange={(e) => onChange(e.target.value)} />
      break
    case 'number':
      control = (
        <div className="cmp-range">
          <input id={id} type="range" min={param.min} max={param.max} step={param.step ?? 1} value={Number(v)} onChange={(e) => onChange(Number(e.target.value))} />
          <Input type="number" aria-label={`${param.label} (valor)`} min={param.min} max={param.max} step={param.step ?? 1} value={Number(v)} onChange={(e) => e.target.value !== '' && onChange(Number(e.target.value))} />
          {param.unit && <span className="cmp-range__unit">{param.unit}</span>}
        </div>
      )
      break
    case 'select':
      control =
        (param.options?.length ?? 0) <= 4 ? (
          <Segmented label={param.label} value={String(v)} onChange={(val) => onChange(val)} options={(param.options ?? []).map((o) => ({ value: o.value, label: o.label }))} />
        ) : (
          <Select id={id} value={String(v)} onChange={(e) => onChange(e.target.value)}>
            {param.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        )
      break
    case 'boolean':
      control = <Switch id={id} checked={Boolean(v)} onChange={(c) => onChange(c)} label={v ? 'Sim' : 'Não'} />
      break
    case 'color':
      control = <ColorControl label={param.label} value={String(v ?? '')} inherited={inheritedColor} inheritText="paleta global" onChange={(val) => onChange(val)} />
      break
    case 'icon': {
      const I = iconByName(String(v))
      control = (
        <div className="cmp-iconctl">
          <span className="cmp-iconctl__current" aria-hidden="true">
            <I />
          </span>
          <span className="cmp-iconctl__name">{iconLabel(String(v))}</span>
          <Button variant="primary" size="sm" icon={<Layers />} onClick={() => onPicker(!pickerOpen)} aria-expanded={pickerOpen} data-testid={`icon-swap-${param.key}`}>
            Trocar ícone
          </Button>
        </div>
      )
      break
    }
  }
  const isColor = param.type === 'color'
  return (
    <div id={`cmp-ctl-${param.key}`} className={cx('cmp-ctl', highlighted && 'cmp-ctl--hl')} onFocus={onFocus}>
      <div className="cmp-ctl__top">
        {param.type === 'select' || param.type === 'boolean' || isColor || param.type === 'icon' ? (
          <span className="cmp-ctl__label">{param.label}</span>
        ) : (
          <label className="cmp-ctl__label" htmlFor={id}>
            {param.label}
          </label>
        )}
        {changed && (
          <button type="button" className="cmp-reset" onClick={() => onChange(null)} title="Voltar ao padrão da categoria">
            <RotateCcw aria-hidden="true" /> Padrão
          </button>
        )}
      </div>
      {control}
      {param.help && !isColor && <span className="ui-help">{param.help}</span>}
      {param.type === 'textarea' && <span className="ui-help">Um item por linha.</span>}
      {param.type === 'icon' && pickerOpen && (
        <IconPicker
          value={String(v)}
          onPick={(name) => {
            onChange(name)
            onPicker(false)
          }}
          onClose={() => onPicker(false)}
          stopEsc={stopEsc}
        />
      )}
    </div>
  )
}

/** Hexadecimal + seletor nativo + "Herdar da paleta global". */
export function ColorControl({ label, value, inherited, inheritText, onChange, hideReset }: { label: string; value: string; inherited: string; inheritText: string; onChange: (v: string | null) => void; hideReset?: boolean }) {
  const [draft, setDraft] = useState(value)
  useEffect(() => setDraft(value), [value])
  const valid = isHex(value)
  const shown = valid ? normalizeHex(value) : isHex(inherited) ? normalizeHex(inherited) : '#888888'
  return (
    <div className="cmp-color">
      <input type="color" className="cmp-color__picker" value={shown} aria-label={`${label}: seletor de cor`} onChange={(e) => onChange(e.target.value)} />
      <Input
        mono
        value={draft}
        placeholder={valid ? '' : `Herda: ${inheritText}`}
        aria-label={`${label}: código hexadecimal`}
        onChange={(e) => {
          setDraft(e.target.value)
          if (isHex(e.target.value)) onChange(normalizeHex(e.target.value))
          if (e.target.value.trim() === '') onChange(null)
        }}
      />
      {!hideReset && (
        <Button size="sm" variant="ghost" icon={<SlidersHorizontal />} disabled={!value} onClick={() => onChange(null)}>
          Herdar da paleta global
        </Button>
      )}
    </div>
  )
}

function IconPicker({ value, onPick, onClose, stopEsc }: { value: string; onPick: (name: string) => void; onClose: () => void; stopEsc: (e: KeyboardEvent, fn: () => void) => void }) {
  const [q, setQ] = useState('')
  const list = useMemo(() => searchIcons(q), [q])
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    requestAnimationFrame(() => {
      if (ref.current) revealInPanel(ref.current)
      ref.current?.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true })
    })
  }, [])
  return (
    <div ref={ref} className="cmp-icons" role="group" aria-label="Biblioteca de ícones" data-testid="icon-picker" onKeyDown={(e) => stopEsc(e, onClose)}>
      <div className="cmp-icons__head">
        <SearchInput value={q} onChange={setQ} label="Buscar ícone" placeholder="Buscar: casa, carrinho, alerta…" />
        <IconButton label="Fechar biblioteca de ícones" onClick={onClose}>
          <X />
        </IconButton>
      </div>
      <div className="cmp-icons__grid">
        {list.map((e) => (
          <button key={e.name} type="button" className="cmp-icons__item" aria-label={e.label} title={e.label} aria-pressed={e.name === value} data-icon={e.name} onClick={() => onPick(e.name)}>
            <e.Icon aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="ui-help">{list.length ? `${list.length} ícones` : 'Nenhum ícone encontrado. Tente outra palavra.'}</p>
    </div>
  )
}
