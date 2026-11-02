import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Braces, Check, FileCode2, Globe, Layers, RotateCcw, Sparkles, X } from 'lucide-react'
import { contrast } from '@/core/color'
import { downloadFile, downloadJson, slugify } from '@/core/download'
import type { InspirationChoice } from '@/core/project'
import { useProject, useStudio } from '@/core/store'
import { fontName, fontStack } from '@/core/tokens'
import type { Device } from '@/core/types'
import { PromptButton } from '@/prompt/PromptButton'
import { Badge, Button, DeviceToggle, EmptyState, FilterChips, IconButton, keepScroll, Modal, OptionCard, SearchInput, toast } from '@/ui'
import { inspirationSites, siteById } from './catalog'
import { buildReferenceCss, buildSiteJson } from './exporters'
import { cleanHex, cleanOverrides, PALETTE_HINTS, paletteOf, resolvePalette, sameOverrides, type OverrideKey } from './palette'
import { BrowserFrame, PhoneFrame, SiteThumbnail } from './SiteFrames'
import { SITE_BASE_CSS } from './sites/base'
import { siteComponent } from './sites/registry'
import type { InspirationCategory, InspirationSite } from './types'
import './inspiration.css'

const CATEGORY_LABEL: Record<InspirationCategory, string> = {
  produtos: 'Produtos e lojas',
  servicos: 'Serviços',
  tecnologia: 'Tecnologia',
  editorial: 'Editorial e cultura',
}

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/** Galeria de 20 sites fictícios completos + visualizador com paletas, ajustes e exportação. */
export function InspirationGallery({ guided = false }: { guided?: boolean }) {
  const approved = useProject((p) => p.inspiration)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'todos' | InspirationCategory>('todos')
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    return inspirationSites.filter((s) => {
      if (category !== 'todos' && s.category !== category) return false
      if (!q) return true
      return normalize([s.brand, s.segment, s.composition, s.description, ...(s.tags ?? [])].join(' ')).includes(q)
    })
  }, [query, category])

  const chipOptions = useMemo(
    () => [
      { id: 'todos', label: 'Todos', count: inspirationSites.length },
      ...(Object.keys(CATEGORY_LABEL) as InspirationCategory[]).map((c) => ({
        id: c,
        label: CATEGORY_LABEL[c],
        count: inspirationSites.filter((s) => s.category === c).length,
      })),
    ],
    [],
  )

  const approvedSite = approved ? siteById(approved.siteId) : undefined
  const close = useCallback(() => {
    // O modal de prompt individual abre por cima do visualizador: o Esc fecha só ele.
    if (typeof document !== 'undefined' && document.querySelector('[data-testid="prompt-modal"]')) return
    setOpenId(null)
  }, [])

  return (
    <div className="ins-gallery">
      <style>{SITE_BASE_CSS}</style>

      <div className="ins-compare">
        <div className="ins-compare__item ins-compare__item--current">
          <span className="ins-compare__icon">
            <Sparkles aria-hidden="true" />
          </span>
          <div>
            <strong>Inspiração (esta página)</strong>
            <p>
              Sites completos e fictícios para você descobrir, olhando, uma identidade que combine com o seu projeto: cores, tipografia, ritmo e
              composição. Aprove um conceito e ele entra no Master Prompt como referência visual.
            </p>
          </div>
        </div>
        <div className="ins-compare__item">
          <span className="ins-compare__icon">
            <Layers aria-hidden="true" />
          </span>
          <div>
            <strong>Templates</strong>
            <p>
              Modelos de página reutilizáveis — a estrutura de seções de uma página específica, pronta para receber o seu conteúdo.{' '}
              <a href="#/modulos/templates">Ir para Templates</a>
            </p>
          </div>
        </div>
      </div>

      <div className="ins-approved" data-testid="inspiration-approved" aria-live="polite">
        {approvedSite && approved ? (
          <>
            <span className="ins-approved__swatches" aria-hidden="true">
              {(() => {
                const pal = resolvePalette(approvedSite, approved.paletteId, approved.overrides)
                return [pal.bg, pal.text, pal.accent, pal.secondary].map((c, i) => <i key={i} style={{ background: c }} />)
              })()}
            </span>
            <span className="ins-approved__text">
              <Check aria-hidden="true" /> Conceito aprovado: <strong>{approvedSite.brand}</strong>
              <span className="u-muted"> · paleta {paletteOf(approvedSite, approved.paletteId).name}
                {Object.keys(cleanOverrides(approved.overrides)).length ? ' (ajustada)' : ''}</span>
            </span>
            <Button size="sm" variant="secondary" onClick={() => keepScroll(() => setOpenId(approvedSite.id))}>
              Abrir conceito
            </Button>
          </>
        ) : (
          <span className="ins-approved__text u-muted">
            Nenhum conceito aprovado ainda. Abra um site, escolha a paleta e clique em <strong>Aprovar conceito</strong>.
          </span>
        )}
      </div>

      <div className="ui-toolbar ins-toolbar">
        <div className="ui-toolbar__grow">
          <SearchInput label="Buscar conceitos" placeholder="Buscar por marca, tema ou estilo…" value={query} onChange={setQuery} />
        </div>
        <FilterChips label="Filtrar por tipo de site" options={chipOptions} value={category} onChange={(id) => keepScroll(() => setCategory(id as typeof category))} />
      </div>

      {guided && (
        <p className="ins-guided-hint">
          Não procure só um menu: procure um <strong>site inteiro</strong> que tenha a “cara” que você quer. Clique para ver em tamanho grande,
          rolar a página e trocar as cores.
        </p>
      )}

      <div className="ins-grid">
        {inspirationSites.map((s) => {
          const visible = filtered.includes(s)
          return (
            <div key={s.id} className="ins-grid__cell" hidden={!visible}>
              <SiteCard site={s} approved={approved} onOpen={() => setOpenId(s.id)} />
            </div>
          )
        })}
      </div>
      {filtered.length === 0 && (
        <EmptyState title="Nenhum conceito encontrado" action={<Button onClick={() => { setQuery(''); setCategory('todos') }}>Limpar busca</Button>}>
          Tente outra palavra, como “escuro”, “loja” ou “serifa”.
        </EmptyState>
      )}

      {openId && <SiteViewer siteId={openId} guided={guided} onClose={close} onNavigate={setOpenId} />}
    </div>
  )
}

function SiteCard({ site, approved, onOpen }: { site: InspirationSite; approved: InspirationChoice | null; onOpen: () => void }) {
  const Site = siteComponent(site.id)
  const isApproved = approved?.siteId === site.id
  const palette = isApproved && approved ? resolvePalette(site, approved.paletteId, approved.overrides) : site.palettes[0]
  return (
    <OptionCard
      selected={isApproved}
      selectedLabel="Aprovado"
      onSelect={onOpen}
      testId={`inspiration-option-${site.id}`}
      ariaLabel={`Abrir o site ${site.brand} (${site.segment})`}
      media={Site ? <SiteThumbnail Site={Site} palette={palette} /> : <div className="ins-thumb" style={{ height: 228 }} />}
      title={site.brand}
      meta={`${site.segment} · ${fontName(site.headingFont)} + ${fontName(site.bodyFont)}`}
      description={site.composition}
      footer={
        <span className="ins-card-pals" aria-label={`${site.palettes.length} propostas de paleta`}>
          {site.palettes.map((p) => (
            <i key={p.id} title={p.name} style={{ background: `linear-gradient(135deg, ${p.bg} 0 50%, ${p.accent} 50% 100%)` }} />
          ))}
          <span>8 paletas</span>
        </span>
      }
    />
  )
}

const OVERRIDE_FIELDS: { key: OverrideKey; label: string }[] = [
  { key: 'bg', label: 'Fundo' },
  { key: 'text', label: 'Texto' },
  { key: 'accent', label: 'Destaque' },
]

function SiteViewer({
  siteId,
  guided,
  onClose,
  onNavigate,
}: {
  siteId: string
  guided: boolean
  onClose: () => void
  onNavigate: (id: string) => void
}) {
  const site = siteById(siteId)!
  const Site = siteComponent(siteId)
  const approved = useProject((p) => p.inspiration)
  const setInspiration = useStudio((s) => s.setInspiration)
  const isThisApproved = approved?.siteId === siteId
  const [device, setDevice] = useState<Device>('desktop')
  const [paletteId, setPaletteId] = useState<string>(isThisApproved && approved ? approved.paletteId : 'original')
  const [overrides, setOverrides] = useState<InspirationChoice['overrides']>(isThisApproved && approved ? cleanOverrides(approved.overrides) : {})
  const [drafts, setDrafts] = useState<Partial<Record<OverrideKey, string>>>({})
  const scrollRef = useRef<HTMLDivElement>(null)
  const [lastSite, setLastSite] = useState(siteId)

  // Ao navegar para outro conceito, recomeça com a paleta aprovada (se houver) ou a original.
  if (lastSite !== siteId) {
    setLastSite(siteId)
    const ok = approved?.siteId === siteId
    setPaletteId(ok && approved ? approved.paletteId : 'original')
    setOverrides(ok && approved ? cleanOverrides(approved.overrides) : {})
    setDrafts({})
  }
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [siteId])

  const base = paletteOf(site, paletteId)
  const palette = useMemo(() => resolvePalette(site, paletteId, overrides), [site, paletteId, overrides])
  const clean = cleanOverrides(overrides)
  const sameAsApproved = isThisApproved && approved ? approved.paletteId === base.id && sameOverrides(approved.overrides, clean) : false
  const index = inspirationSites.findIndex((s) => s.id === siteId)
  const prev = inspirationSites[(index - 1 + inspirationSites.length) % inspirationSites.length]
  const next = inspirationSites[(index + 1) % inspirationSites.length]
  const ratio = contrast(palette.text, palette.bg)

  const approve = () => {
    setInspiration({ siteId, paletteId: base.id, overrides: clean })
    toast.success(`${site.brand} aprovado e incluído no Master Prompt.`)
  }
  const unapprove = () => {
    setInspiration(null)
    toast.info('Aprovação removida. O conceito saiu do Master Prompt.')
  }

  const setOverride = (key: OverrideKey, value: string | undefined) => {
    setOverrides((o) => {
      const nextO = { ...o }
      const v = cleanHex(value)
      if (v && v !== base[key]) nextO[key] = v
      else delete nextO[key]
      return nextO
    })
  }

  const fileBase = `${slugify(site.brand)}-${base.id}`
  const exportCss = () => {
    downloadFile(`${fileBase}.css`, buildReferenceCss(site, { paletteId: base.id, overrides: clean }), 'text/css')
    toast.success('CSS de referência baixado.')
  }
  const exportJson = () => {
    downloadJson(`${fileBase}.json`, buildSiteJson(site, { paletteId: base.id, overrides: clean }))
    toast.success('Especificação JSON baixada.')
  }
  const exportHtml = async () => {
    try {
      const { buildDemoHtml } = await import('./exportHtml')
      downloadFile(`${fileBase}.html`, buildDemoHtml(site, palette), 'text/html')
      toast.success('HTML demonstrativo baixado.')
    } catch {
      toast.error('Não foi possível gerar o HTML. Tente novamente.')
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      width={1260}
      testId="inspiration-viewer"
      title={
        <span className="ins-viewer__title">
          {site.brand}
          {isThisApproved && (
            <Badge tone="success" icon={<Check />}>
              Aprovado
            </Badge>
          )}
        </span>
      }
      subtitle={`${site.segment} — ${site.composition}`}
      footer={
        <div className="ins-foot">
          <div className="ins-foot__group" role="group" aria-label="Exportar">
            <span className="ins-foot__label">Exportar</span>
            <Button size="sm" variant="secondary" icon={<FileCode2 />} onClick={exportCss} title="Variáveis CSS da paleta escolhida + fontes">
              CSS de referência
            </Button>
            <Button size="sm" variant="secondary" icon={<Braces />} onClick={exportJson} title="Especificação do site + paleta + ajustes">
              JSON
            </Button>
            <Button size="sm" variant="secondary" icon={<Globe />} onClick={exportHtml} title="Página demonstrativa que abre direto no navegador">
              HTML demonstrativo
            </Button>
          </div>
          <div className="ins-foot__group ins-foot__group--main">
            <PromptButton target={{ kind: 'inspiration', siteId, paletteId: base.id, overrides: clean }} label="Prompt deste conceito" />
            {isThisApproved && (
              <Button variant="ghost" icon={<X />} onClick={unapprove} data-testid="inspiration-unapprove">
                Remover aprovação
              </Button>
            )}
            {sameAsApproved ? (
              <Button variant="soft" icon={<Check />} aria-disabled="true" data-testid="inspiration-approved-state" onClick={() => toast.info('Este conceito já está no Master Prompt.')}>
                Aprovado
              </Button>
            ) : (
              <Button variant="primary" icon={<Check />} onClick={approve} data-testid="inspiration-approve">
                {isThisApproved ? 'Atualizar aprovação' : 'Aprovar conceito'}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="ins-viewer">
        <div className="ins-viewer__stage">
          <div className="ins-viewer__bar">
            <DeviceToggle value={device} onChange={setDevice} />
            <span className="ins-viewer__nav">
              <IconButton label={`Conceito anterior: ${prev.brand}`} outlined size="sm" onClick={() => onNavigate(prev.id)}>
                <ArrowLeft />
              </IconButton>
              <span className="ins-viewer__count">
                {index + 1} / {inspirationSites.length}
              </span>
              <IconButton label={`Próximo conceito: ${next.brand}`} outlined size="sm" onClick={() => onNavigate(next.id)}>
                <ArrowRight />
              </IconButton>
            </span>
          </div>
          <div className="ins-viewer__frame" data-device={device}>
            {Site ? (
              device === 'mobile' ? (
                <PhoneFrame Site={Site} palette={palette} scrollRef={scrollRef} />
              ) : (
                <BrowserFrame Site={Site} palette={palette} domain={site.domain} scrollRef={scrollRef} />
              )
            ) : null}
          </div>
        </div>

        <aside className="ins-panel" aria-label="Personalizar conceito">
          <section className="ins-panel__sec">
            <div className="ins-panel__head">
              <h3>Paleta</h3>
              <span className="u-muted">{base.name}</span>
            </div>
            <p className="ins-panel__hint">{PALETTE_HINTS[base.id]}</p>
            <div className="ins-pals" role="group" aria-label="Propostas de paleta">
              {site.palettes.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="ins-pal"
                  aria-pressed={p.id === base.id}
                  data-testid={`inspiration-palette-${p.id}`}
                  title={`${p.name}: ${PALETTE_HINTS[p.id]}`}
                  onClick={() => keepScroll(() => setPaletteId(p.id))}
                >
                  <span className="ins-pal__chip" style={{ background: p.bg }}>
                    <i style={{ background: p.text }} />
                    <i style={{ background: p.accent }} />
                    <i style={{ background: p.secondary }} />
                  </span>
                  <span className="ins-pal__name">{p.name}</span>
                </button>
              ))}
            </div>
          </section>

          {!guided && (
            <section className="ins-panel__sec">
              <div className="ins-panel__head">
                <h3>Ajustar cores</h3>
                {Object.keys(clean).length > 0 && (
                  <button type="button" className="ins-link" onClick={() => { setOverrides({}); setDrafts({}) }}>
                    Restaurar todas
                  </button>
                )}
              </div>
              <div className="ins-ovr">
                {OVERRIDE_FIELDS.map(({ key, label }) => {
                  const value = palette[key]
                  const overridden = clean[key] !== undefined
                  const draft = drafts[key]
                  return (
                    <div key={key} className="ins-ovr__row">
                      <label className="ins-ovr__label" htmlFor={`ins-ovr-${key}`}>
                        {label}
                        {overridden && <span className="ins-ovr__dot" title="Ajustado" />}
                      </label>
                      <input
                        type="color"
                        className="ins-ovr__picker"
                        aria-label={`Escolher cor de ${label.toLowerCase()}`}
                        value={value}
                        onChange={(e) => {
                          setOverride(key, e.target.value)
                          setDrafts((d) => ({ ...d, [key]: undefined }))
                        }}
                      />
                      <input
                        id={`ins-ovr-${key}`}
                        className="ui-input ui-input--mono ins-ovr__hex"
                        value={draft ?? value}
                        spellCheck={false}
                        maxLength={7}
                        aria-invalid={draft !== undefined && !cleanHex(draft)}
                        onChange={(e) => {
                          const v = e.target.value
                          setDrafts((d) => ({ ...d, [key]: v }))
                          if (cleanHex(v) && /^#?[0-9a-f]{6}$/i.test(v.trim())) setOverride(key, v)
                        }}
                        onBlur={() => setDrafts((d) => ({ ...d, [key]: undefined }))}
                      />
                      <IconButton
                        label={`Restaurar ${label.toLowerCase()} da paleta`}
                        size="sm"
                        disabled={!overridden}
                        onClick={() => {
                          setOverride(key, undefined)
                          setDrafts((d) => ({ ...d, [key]: undefined }))
                        }}
                      >
                        <RotateCcw />
                      </IconButton>
                    </div>
                  )
                })}
              </div>
              <p className={ratio >= 4.5 ? 'ins-panel__hint' : 'ins-panel__hint ins-panel__hint--warn'}>
                Contraste texto/fundo: <strong>{ratio.toFixed(1)}:1</strong> {ratio >= 4.5 ? '— boa leitura.' : '— baixo; escolha cores mais diferentes.'}
              </p>
            </section>
          )}

          <section className="ins-panel__sec">
            <div className="ins-panel__head">
              <h3>Tipografia</h3>
            </div>
            <div className="ins-type">
              <span style={{ fontFamily: fontStack(site.headingFont) }} className="ins-type__big">
                Aa
              </span>
              <span className="ins-type__meta">
                Títulos em <strong>{fontName(site.headingFont)}</strong>
                <br />
                Textos em <strong>{fontName(site.bodyFont)}</strong>
              </span>
            </div>
          </section>

          <section className="ins-panel__sec">
            <div className="ins-panel__head">
              <h3>Seções da página</h3>
              <span className="u-muted">{site.sections.length}</span>
            </div>
            <ol className="ins-sections">
              {site.sections.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </Modal>
  )
}
