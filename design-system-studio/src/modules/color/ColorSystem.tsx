import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { Download, RotateCcw } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { contrast, isHex, normalizeHex } from '@/core/color'
import { downloadFile, slugify } from '@/core/download'
import { useProject, useStudio } from '@/core/store'
import { useResolvedTheme } from '@/core/theme'
import {
  DENSITY_SPACING,
  deriveTokens,
  FONT_OPTIONS,
  RADIUS_VALUES,
  resolveTheme,
  SHADOW_VALUES,
  SURFACE_LABEL,
  TOKEN_GROUPS,
} from '@/core/tokens'
import type { Geometry, TokenKey } from '@/core/types'
import { buildProjectCss } from '@/prompt/css'
import { PromptButton } from '@/prompt/PromptButton'
import { Badge, Button, Callout, FilterChips, OptionCard, SearchInput, Section, Segmented, Tabs, keepScroll, useMediaQuery } from '@/ui'
import { PALETTE_CATEGORIES, palettes } from './catalog'
import { IdentityPreview, PaletteSwatch } from './IdentityPreview'
import './color.css'

type Tab = 'paletas' | 'tokens' | 'tipografia' | 'formas'

function PaletteGallery({ guided }: { guided: boolean }) {
  // “Prompt” em cada cartão só no modo Avançado (UX-22): no Essencial, o prompt da identidade fica no painel.
  const advanced = useProject((p) => p.depth === 'advanced')
  const paletteId = useProject((p) => p.identity.paletteId)
  const typography = useStudio((s) => s.project.identity.typography)
  const geometry = useStudio((s) => s.project.identity.geometry)
  const selectPalette = useStudio((s) => s.selectPalette)
  const [category, setCategory] = useState('todas')
  const [query, setQuery] = useState('')
  const themes = useMemo(() => new Map(palettes.map((p) => [p.id, resolveTheme(deriveTokens(p.base), typography, geometry)])), [typography, geometry])
  const q = query.trim().toLowerCase()
  const visible = palettes.filter((p) => (category === 'todas' || p.category === category) && (!q || `${p.name} ${p.description} ${p.tags?.join(' ')}`.toLowerCase().includes(q)))

  return (
    <div className="u-stack">
      <div className="ui-toolbar" style={{ marginBottom: 0 }}>
        <div className="ui-toolbar__grow">
          <SearchInput label="Buscar paletas" value={query} onChange={setQuery} placeholder="Buscar por nome, clima ou cor…" />
        </div>
      </div>
      <FilterChips
        label="Categorias de paletas"
        value={category}
        onChange={(c) => keepScroll(() => setCategory(c))}
        options={[{ id: 'todas', label: 'Todas', count: palettes.length }, ...PALETTE_CATEGORIES.map((c) => ({ id: c.id, label: c.name, count: palettes.filter((p) => p.category === c.id).length }))]}
      />
      {guided && category !== 'todas' && <p className="u-muted u-small">{PALETTE_CATEGORIES.find((c) => c.id === category)?.description}</p>}
      <div className="ui-grid" style={{ ['--min' as string]: '220px' }}>
        {visible.map((p) => (
          <OptionCard
            key={p.id}
            testId={`palette-option-${p.id}`}
            selected={p.id === paletteId}
            onSelect={() => selectPalette(p.id)}
            media={<PaletteSwatch theme={themes.get(p.id)!} />}
            title={p.name}
            meta={`${PALETTE_CATEGORIES.find((c) => c.id === p.category)?.name} · ${themes.get(p.id)!.tokens.mode === 'dark' ? 'escura' : 'clara'}`}
            description={p.description}
            footer={advanced ? <PromptButton target={{ kind: 'palette', id: p.id }} label="Prompt" /> : undefined}
          />
        ))}
      </div>
      {visible.length === 0 && <p className="u-muted">Nenhuma paleta encontrada.</p>}
    </div>
  )
}

function TokenRow({ tokenKey, label, value, changed }: { tokenKey: TokenKey; label: string; value: string; changed: boolean }) {
  const setTokenOverride = useStudio((s) => s.setTokenOverride)
  const [draft, setDraft] = useState<string | null>(null)
  const shown = draft ?? value
  const commit = (v: string) => {
    if (isHex(v)) setTokenOverride(tokenKey, normalizeHex(v))
    setDraft(null)
  }
  return (
    <li className="clr-token">
      <label className="clr-token__swatch" style={{ background: value }} title={`Escolher cor: ${label}`}>
        <input type="color" value={normalizeHex(isHex(value) ? value : '#000000')} onChange={(e) => setTokenOverride(tokenKey, e.target.value)} aria-label={`Escolher cor: ${label}`} />
      </label>
      <span className="clr-token__label">
        <span className="u-truncate">{label}</span>
        <code>{tokenKey}</code>
      </span>
      <input
        className="ui-input"
        value={shown}
        aria-label={`Hexadecimal de ${label}`}
        aria-invalid={draft !== null && !isHex(draft)}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => draft !== null && commit(draft)}
        onKeyDown={(e) => e.key === 'Enter' && draft !== null && commit(draft)}
        spellCheck={false}
      />
      {changed ? (
        <button type="button" className="ui-icon-btn ui-icon-btn--sm" aria-label={`Voltar ${label} para a paleta`} title="Voltar para o valor da paleta" onClick={() => setTokenOverride(tokenKey, null)}>
          <RotateCcw />
        </button>
      ) : (
        <span style={{ width: 36 }} aria-hidden="true" />
      )}
    </li>
  )
}

function TokenEditor() {
  const theme = useResolvedTheme()
  const overrides = useStudio(useShallow((s) => s.project.identity.overrides))
  const resetTokenOverrides = useStudio((s) => s.resetTokenOverrides)
  const t = theme.tokens
  const count = Object.keys(overrides).length
  const pairs: { label: string; fg: string; bg: string; min: number }[] = [
    { label: 'Texto sobre fundo', fg: t.text, bg: t.bg, min: 4.5 },
    { label: 'Texto secundário sobre fundo', fg: t.textMuted, bg: t.bg, min: 4.5 },
    { label: 'Texto sobre primária', fg: t.onPrimary, bg: t.primary, min: 4.5 },
    { label: 'Link sobre superfície', fg: t.link, bg: t.surface, min: 4.5 },
    { label: 'Navegação', fg: t.navText, bg: t.navBg, min: 4.5 },
    { label: 'Selecionado', fg: t.selectedText, bg: t.selected, min: 4.5 },
    { label: 'Anel de foco sobre fundo', fg: t.focusRing, bg: t.bg, min: 3 },
  ]
  return (
    <div className="u-stack-lg">
      <Callout title="Herança global.">
        Estes {TOKEN_GROUPS.reduce((n, g) => n + g.keys.length, 0)} tokens valem para todos os componentes (botões, campos, menus, cards, tabelas, modais, login, landing e templates). Exceções para um componente específico são feitas no editor de componentes e ficam registradas como exceção explícita.
      </Callout>
      <div className="u-row" style={{ justifyContent: 'space-between' }}>
        <span className="u-muted u-small">{count ? `${count} token(s) alterado(s) manualmente.` : 'Todos os tokens seguem a paleta escolhida.'}</span>
        {count > 0 && (
          <Button size="sm" icon={<RotateCcw />} onClick={resetTokenOverrides}>
            Restaurar todos
          </Button>
        )}
      </div>
      <Section title="Contraste (WCAG)" description="Pares importantes conferidos automaticamente.">
        <ul className="clr-contrast">
          {pairs.map((p) => {
            const ratio = contrast(p.fg, p.bg)
            const ok = ratio >= p.min
            return (
              <li key={p.label}>
                <span className="clr-contrast__pair">
                  <span className="clr-contrast__chip" style={{ background: p.bg, color: p.fg }}>Aa</span>
                  {p.label}
                </span>
                <Badge tone={ok ? 'success' : 'warning'}>
                  {ratio.toFixed(1)}:1 {ok ? 'AA' : `abaixo de ${p.min}:1`}
                </Badge>
              </li>
            )
          })}
        </ul>
      </Section>
      <div className="clr-tokens">
        {TOKEN_GROUPS.map((g) => (
          <div key={g.title} className="clr-token-group">
            <h3>{g.title}</h3>
            <ul className="clr-token-list">
              {g.keys.map((k) => (
                <TokenRow key={k.key} tokenKey={k.key} label={k.label} value={String(t[k.key])} changed={k.key in overrides} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function TypographyEditor() {
  const typography = useStudio((s) => s.project.identity.typography)
  const setTypography = useStudio((s) => s.setTypography)
  const fontPicker = (role: 'heading' | 'body') => (
    <div className="clr-options" role="group" aria-label={role === 'heading' ? 'Fonte dos títulos' : 'Fonte dos textos'}>
      {FONT_OPTIONS.map((f) => (
        <button key={f.id} type="button" className="clr-choice" aria-pressed={typography[role] === f.id} onClick={() => keepScroll(() => setTypography({ [role]: f.id }))}>
          <span className="clr-choice__demo">
            <span className="clr-font" style={{ fontFamily: f.stack, fontWeight: role === 'heading' ? 650 : 400 }}>
              Ag
            </span>
          </span>
          <span className="clr-choice__name">{f.name}</span>
          <span className="u-subtle">{f.description}</span>
        </button>
      ))}
    </div>
  )
  return (
    <div className="u-stack-lg">
      <Section title="Fonte dos títulos">{fontPicker('heading')}</Section>
      <Section title="Fonte dos textos">{fontPicker('body')}</Section>
      <Section title="Tamanho e peso">
        <div className="u-stack">
          <div className="u-stack-sm">
            <span className="ui-label">Tamanho base do texto</span>
            <Segmented
              label="Tamanho base"
              value={String(typography.baseSize)}
              onChange={(v) => setTypography({ baseSize: Number(v) })}
              options={['14', '15', '16', '17', '18'].map((v) => ({ value: v, label: `${v} px` }))}
            />
          </div>
          <div className="u-stack-sm">
            <span className="ui-label">Peso dos títulos</span>
            <Segmented
              label="Peso dos títulos"
              value={String(typography.headingWeight)}
              onChange={(v) => setTypography({ headingWeight: Number(v) })}
              options={[
                { value: '500', label: 'Médio' },
                { value: '600', label: 'Semi-negrito' },
                { value: '650', label: 'Forte' },
                { value: '700', label: 'Negrito' },
                { value: '800', label: 'Extra' },
              ]}
            />
          </div>
          <div className="u-stack-sm">
            <span className="ui-label">Peso dos textos</span>
            <Segmented
              label="Peso dos textos"
              value={String(typography.bodyWeight)}
              onChange={(v) => setTypography({ bodyWeight: Number(v) })}
              options={[
                { value: '400', label: 'Regular' },
                { value: '450', label: 'Leve reforço' },
                { value: '500', label: 'Médio' },
              ]}
            />
          </div>
        </div>
      </Section>
    </div>
  )
}

function ShapeEditor() {
  const geometry = useStudio((s) => s.project.identity.geometry)
  const setGeometry = useStudio((s) => s.setGeometry)
  const choice = <K extends keyof Geometry>(key: K, value: Geometry[K], name: string, demo: ReactNode) => (
    <button key={String(value)} type="button" className="clr-choice" aria-pressed={geometry[key] === value} onClick={() => keepScroll(() => setGeometry({ [key]: value } as Partial<Geometry>))}>
      <span className="clr-choice__demo">{demo}</span>
      <span className="clr-choice__name">{name}</span>
    </button>
  )
  const box = (style: CSSProperties) => <span style={{ width: 64, height: 34, background: '#fff', border: '1px solid #c9c9d1', ...style }} />
  return (
    <div className="u-stack-lg">
      <Callout>Nada aqui é obrigatório: cantos quadrados, superfícies planas e nenhuma sombra são escolhas tão válidas quanto vidro fosco e cantos arredondados.</Callout>
      <Section title="Cantos">
        <div className="clr-options">
          {(Object.keys(RADIUS_VALUES) as Geometry['radius'][]).map((r) => choice('radius', r, RADIUS_VALUES[r].label, box({ borderRadius: RADIUS_VALUES[r].md })))}
        </div>
      </Section>
      <Section title="Superfícies">
        <div className="clr-options">
          {(Object.keys(SURFACE_LABEL) as Geometry['surface'][]).map((s) =>
            choice(
              'surface',
              s,
              SURFACE_LABEL[s],
              box(
                s === 'flat'
                  ? { border: 0, background: '#efeff3' }
                  : s === 'elevated'
                    ? { border: 0, boxShadow: SHADOW_VALUES.medium.css }
                    : s === 'glass'
                      ? { background: 'rgba(255,255,255,.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,.8)', boxShadow: '0 0 0 40px rgba(124,58,237,.08) inset' }
                      : {},
              ),
            ),
          )}
        </div>
      </Section>
      <Section title="Sombras">
        <div className="clr-options">
          {(Object.keys(SHADOW_VALUES) as Geometry['shadow'][]).map((s) => choice('shadow', s, SHADOW_VALUES[s].label, box({ border: 0, boxShadow: SHADOW_VALUES[s].css === 'none' ? 'inset 0 0 0 1px #d9d9e0' : SHADOW_VALUES[s].css })))}
        </div>
      </Section>
      <Section title="Bordas">
        <div className="clr-options">
          {([0, 1, 2] as const).map((w) => choice('borderWidth', w, w === 0 ? 'Sem borda' : `${w} px`, box({ border: w ? `${w}px solid #8a8a94` : '0', background: w ? '#fff' : '#efeff3' })))}
        </div>
      </Section>
      <Section title="Densidade">
        <div className="clr-options">
          {(Object.keys(DENSITY_SPACING) as Geometry['density'][]).map((d) =>
            choice(
              'density',
              d,
              DENSITY_SPACING[d].label,
              <span style={{ display: 'grid', gap: DENSITY_SPACING[d].unit / 2 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: 64, height: 6, borderRadius: 3, background: '#c9c9d1' }} />
                ))}
              </span>,
            ),
          )}
        </div>
      </Section>
      <Section title="Estilo dos ícones">
        <div className="clr-options">
          {choice('iconStyle', 'outline', 'Contorno', <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#15151a" strokeWidth="2"><path d="M3 10.5 12 3l9 7.5V21H3z" /></svg>)}
          {choice('iconStyle', 'filled', 'Preenchido', <svg width="28" height="28" viewBox="0 0 24 24" fill="#15151a"><path d="M3 10.5 12 3l9 7.5V21H3z" /></svg>)}
          {choice('iconStyle', 'duotone', 'Duotone', <svg width="28" height="28" viewBox="0 0 24 24" fill="#c9c6f6" stroke="#4c46dc" strokeWidth="2"><path d="M3 10.5 12 3l9 7.5V21H3z" /></svg>)}
        </div>
      </Section>
    </div>
  )
}

/** Color System: identidade global do projeto (paleta, tokens, tipografia e geometria). */
export function ColorSystem({ guided = false }: { guided?: boolean }) {
  const theme = useResolvedTheme()
  const depth = useProject((p) => p.depth)
  const name = useProject((p) => p.meta.name)
  const project = useStudio((s) => s.project)
  const [tab, setTab] = useState<Tab>('paletas')
  const narrow = useMediaQuery('(max-width: 720px)')
  const tabs: { value: Tab; label: string }[] = [
    { value: 'paletas', label: 'Paletas' },
    { value: 'tokens', label: guided && depth === 'essential' ? 'Ajustar cores' : 'Tokens e cores' },
    { value: 'tipografia', label: 'Tipografia' },
    { value: 'formas', label: 'Formas e superfícies' },
  ]
  return (
    <div className="clr-layout">
      <div style={{ minWidth: 0 }}>
        <Tabs label="Partes da identidade visual" value={tab} onChange={setTab} tabs={tabs} />
        {tab === 'paletas' && <PaletteGallery guided={guided} />}
        {tab === 'tokens' && <TokenEditor />}
        {tab === 'tipografia' && <TypographyEditor />}
        {tab === 'formas' && <ShapeEditor />}
      </div>
      <aside className="clr-aside" aria-label="Prévia da identidade">
        <div className="u-row" style={{ justifyContent: 'space-between' }}>
          <strong>Prévia da identidade</strong>
          <Badge tone="accent">{theme.tokens.mode === 'dark' ? 'Escura' : 'Clara'}</Badge>
        </div>
        {/* Ações logo abaixo do título: sempre visíveis, nunca sob o rodapé fixo do guiado. */}
        <div className="ui-actions">
          <PromptButton target={{ kind: 'identity' }} label="Prompt da identidade" variant="secondary" />
          <Button size="sm" variant="ghost" icon={<Download />} onClick={() => downloadFile(`${slugify(name || 'projeto')}-tokens.css`, buildProjectCss(project), 'text/css')}>
            CSS dos tokens
          </Button>
        </div>
        <IdentityPreview theme={theme} compact={narrow} />
      </aside>
    </div>
  )
}
