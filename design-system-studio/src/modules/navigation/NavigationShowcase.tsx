import { memo, useCallback, useMemo, useState, type ReactNode } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Check, Download, Maximize2, MousePointerClick, PanelLeft, PanelTop, Rows3, Trash2 } from 'lucide-react'
import { downloadJson } from '@/core/download'
import type { NavChoice } from '@/core/project'
import { studio, useProject, useStudio } from '@/core/store'
import { useResolvedTheme } from '@/core/theme'
import type { Device, ResolvedTheme } from '@/core/types'
import { detectConflicts } from '@/prompt/conflicts'
import { PromptButton } from '@/prompt/PromptButton'
import { Badge, Button, Callout, DeviceToggle, FilterChips, keepScroll, Modal, Segmented, Select, Tabs, Term, toast } from '@/ui'
import { headerById, headerLookFor, headers, sidebarById, sidebarLookFor, sidebars } from './catalog'
import { ComboStage, HeaderStage, PhoneHeader, PhoneSidebar, SidebarStage } from './stages'
import { HEADER_FILTERS, SIDEBAR_FILTERS, type HeaderModel, type SidebarModel } from './types'
import './navigation.css'

type Kind = 'header' | 'sidebar'
type Tab = 'headers' | 'sidebars' | 'combo'

const HEADER_STAGE_H = 300
const SIDEBAR_STAGE_H = 420

const GUIDED_HEADER_FILTERS = ['todos', 'minimalistas', 'corporativos', 'saas', 'editoriais', 'flutuantes', 'com-busca']
const GUIDED_SIDEBAR_FILTERS = ['todos', 'minimalistas', 'corporativos', 'saas', 'com-icones', 'compactos', 'flutuantes']

const FILTER_HINTS: Record<Kind, Record<string, string>> = {
  header: {
    todos: 'Todos os 36 headers. Cada um tem duas composições (A e B).',
    flutuantes: 'Afastados das bordas, como uma ilha por cima do conteúdo.',
    fixos: 'Continuam visíveis no topo enquanto a pessoa rola a página.',
    minimalistas: 'Poucos elementos e muito respiro.',
    tecnologicos: 'Visual técnico: fontes de código, busca de comandos, tons escuros.',
    corporativos: 'Sóbrios e completos, para empresas e instituições.',
    saas: 'Para sistemas com login: abas, busca, notificações e perfil.',
    editoriais: 'Para jornais, revistas e blogs: tipografia em destaque.',
    criativos: 'Ousados e diferentes, para marcas com personalidade.',
    'com-busca': 'Têm campo de busca à vista ou um atalho de busca.',
    'mega-menu': 'Um menu grande que mostra várias colunas de links de uma vez.',
    compactos: 'Baixinhos ou com poucos elementos, para economizar tela.',
  },
  sidebar: {
    todos: 'Todas as 36 sidebars. Cada uma tem duas composições (A e B).',
    flutuantes: 'Afastadas das bordas, como um cartão flutuando ao lado do conteúdo.',
    fixos: 'Ficam paradas enquanto o conteúdo rola.',
    minimalistas: 'Só o essencial, muitas vezes sem ícones.',
    tecnologicos: 'Visual técnico: escuras, gradientes, fontes de código.',
    corporativos: 'Organizadas para sistemas de gestão com muitas telas.',
    saas: 'Para aplicativos com login, equipes e planos.',
    'com-grupos': 'Itens separados em grupos com títulos.',
    'com-icones': 'Cada item tem um ícone para reconhecer de relance.',
    compactos: 'Estreitas ou densas, para sobrar mais espaço para o conteúdo.',
    'com-submenu': 'Itens que abrem uma lista de subitens.',
    'com-perfil': 'Mostram a pessoa logada (foto, nome, menu da conta).',
  },
}

/* -------------------------------------------------------------------------- */
/* Ações da store                                                              */
/* -------------------------------------------------------------------------- */

function selectItem(kind: Kind, id: string, variant: 0 | 1, silent = false) {
  keepScroll(() => {
    const s = studio()
    if (kind === 'header') s.selectHeader({ id, variant })
    else s.selectSidebar({ id, variant })
    // Selecionar = aprovar e incluir no Master Prompt.
    s.setExcluded(`navigation.${kind}`, false)
  })
  if (!silent) {
    const name = kind === 'header' ? headerById(id)?.name : sidebarById(id)?.name
    toast.success(`${kind === 'header' ? 'Header' : 'Sidebar'} “${name}” (composição ${variant === 0 ? 'A' : 'B'}) selecionado e incluído no Master Prompt.`)
  }
}

function clearItem(kind: Kind) {
  keepScroll(() => {
    if (kind === 'header') studio().selectHeader(null)
    else studio().selectSidebar(null)
  })
  toast.info(kind === 'header' ? 'Header removido da seleção.' : 'Sidebar removida da seleção.')
}

function exportSpec(kind: Kind, model: HeaderModel | SidebarModel, variant: 0 | 1) {
  const comp = model.compositions[variant]
  const isHeader = kind === 'header'
  const h = model as HeaderModel
  const s = model as SidebarModel
  downloadJson(`${kind}-${model.id}-composicao-${variant === 0 ? 'a' : 'b'}.json`, {
    schema: 'atelier-ui/navigation-item',
    version: 1,
    exportedAt: new Date().toISOString(),
    kind,
    id: model.id,
    name: model.name,
    description: model.description,
    composition: {
      variant: variant === 0 ? 'A' : 'B',
      name: comp.name,
      description: comp.description,
      ...(isHeader ? { layout: h.compositions[variant].layout } : { arrangement: s.compositions[variant].arrangement }),
    },
    properties: isHeader ? { floating: h.floating, sticky: h.sticky } : { shape: s.shape, floating: s.floating, width: s.width },
    filters: model.filters,
    spec: model.specs[variant],
    design: isHeader ? headerLookFor(h, variant) : sidebarLookFor(s, variant),
  })
  toast.success('Especificação exportada em JSON.')
}

/* -------------------------------------------------------------------------- */
/* Cartão                                                                      */
/* -------------------------------------------------------------------------- */

interface CardProps {
  kind: Kind
  model: HeaderModel | SidebarModel
  variant: 0 | 1
  selected: boolean
  theme: ResolvedTheme
  showHints: boolean
  onVariant: (kind: Kind, id: string, v: 0 | 1, selected: boolean) => void
  onDetails: (kind: Kind, id: string) => void
}

const NavCard = memo(function NavCard({ kind, model, variant, selected, theme, showHints, onVariant, onDetails }: CardProps) {
  const comp = model.compositions[variant]
  const meta =
    kind === 'header'
      ? [(model as HeaderModel).floating ? 'Flutuante' : 'Integral', (model as HeaderModel).sticky ? 'Fixo ao rolar' : 'Rola com a página']
      : [shapeLabel((model as SidebarModel).shape), `≈ ${(model as SidebarModel).width} px`]
  return (
    <article className="nvs-card" data-selected={selected} data-testid={`${kind}-option-${model.id}`} aria-label={model.name}>
      {selected && (
        <span className="nvs-card__badge">
          <Check aria-hidden="true" />
          Selecionado
        </span>
      )}
      <div className="nvs-card__preview" role="group" aria-label={`Prévia interativa: ${model.name}, composição ${variant === 0 ? 'A' : 'B'}`}>
        {kind === 'header' ? (
          <HeaderStage model={model as HeaderModel} variant={variant} theme={theme} height={HEADER_STAGE_H} />
        ) : (
          <SidebarStage model={model as SidebarModel} variant={variant} theme={theme} height={SIDEBAR_STAGE_H} />
        )}
        {showHints && (
          <span className={kind === 'sidebar' ? 'nvs-card__tag nvs-card__tag--end' : 'nvs-card__tag'}>
            <MousePointerClick aria-hidden="true" /> Prévia interativa
          </span>
        )}
      </div>
      <button type="button" className="nvs-card__select" data-role="select" aria-pressed={selected} onClick={() => selectItem(kind, model.id, variant)}>
        <span className="nvs-card__text">
          <span className="nvs-card__title">{model.name}</span>
          <span className="nvs-card__meta">
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </span>
          <span className="nvs-card__desc">{model.description}</span>
        </span>
        <span className="nvs-card__pill">
          {selected ? <Check aria-hidden="true" /> : null}
          {selected ? 'Selecionado' : 'Selecionar'}
        </span>
      </button>
      <div className="nvs-card__foot">
        <Segmented
          label={`Composição de ${model.name}`}
          value={String(variant) as '0' | '1'}
          onChange={(v) => onVariant(kind, model.id, v === '1' ? 1 : 0, selected)}
          options={[
            { value: '0', label: 'Composição A', title: model.compositions[0].name },
            { value: '1', label: 'Composição B', title: model.compositions[1].name },
          ]}
        />
        <p className="nvs-card__comp">
          <strong>{comp.name}.</strong> {comp.description}
        </p>
        <div className="nvs-card__actions">
          <Button size="sm" variant="secondary" icon={<Maximize2 />} onClick={() => onDetails(kind, model.id)}>
            Ver em tamanho grande
          </Button>
          <PromptButton target={{ kind, id: model.id, variant }} />
        </div>
      </div>
    </article>
  )
})

function shapeLabel(shape: SidebarModel['shape']) {
  return { integral: 'Integral', flutuante: 'Flutuante', rail: 'Trilho compacto', dupla: 'Dupla', expansivel: 'Expansível', contextual: 'Contextual' }[shape]
}

/* -------------------------------------------------------------------------- */
/* Modal de detalhes                                                           */
/* -------------------------------------------------------------------------- */

function SpecList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null
  return (
    <section>
      <h3>{title}</h3>
      <ul>
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </section>
  )
}

function DetailModal({
  kind,
  model,
  variant,
  selected,
  theme,
  guided,
  onVariant,
  onClose,
}: {
  kind: Kind
  model: HeaderModel | SidebarModel
  variant: 0 | 1
  selected: boolean
  theme: ResolvedTheme
  guided: boolean
  onVariant: (kind: Kind, id: string, v: 0 | 1, selected: boolean) => void
  onClose: () => void
}) {
  const [device, setDevice] = useState<Device>('desktop')
  const [technical, setTechnical] = useState(!guided)
  const comp = model.compositions[variant]
  const spec = model.specs[variant]
  const measurements = Object.entries(spec.measurements ?? {}).map(([k, v]) => `${k}: ${v}`)
  return (
    <Modal
      open
      onClose={onClose}
      width={1180}
      title={model.name}
      subtitle={model.description}
      testId="nav-detail-modal"
      footer={
        <>
          {selected && (
            <Button variant="ghost" icon={<Trash2 />} onClick={() => clearItem(kind)}>
              Remover seleção
            </Button>
          )}
          <Button icon={<Download />} onClick={() => exportSpec(kind, model, variant)}>
            Exportar especificação
          </Button>
          <Button variant="primary" icon={<Check />} onClick={() => (selected ? onClose() : (selectItem(kind, model.id, variant), onClose()))}>
            {selected ? 'Selecionado — fechar' : `Selecionar composição ${variant === 0 ? 'A' : 'B'}`}
          </Button>
        </>
      }
    >
      <div className="nvs-detail">
        <div className="nvs-detail__controls">
          <Segmented
            label="Composição"
            value={String(variant) as '0' | '1'}
            onChange={(v) => onVariant(kind, model.id, v === '1' ? 1 : 0, selected)}
            options={[
              { value: '0', label: `A · ${model.compositions[0].name}` },
              { value: '1', label: `B · ${model.compositions[1].name}` },
            ]}
          />
          <DeviceToggle value={device} onChange={setDevice} />
        </div>
        <div className={device === 'mobile' ? 'nvs-detail__stage nvs-detail__stage--phone' : 'nvs-detail__stage'}>
          {kind === 'header' ? (
            device === 'mobile' ? (
              <PhoneHeader model={model as HeaderModel} variant={variant} theme={theme} height={640} />
            ) : (
              <HeaderStage model={model as HeaderModel} variant={variant} theme={theme} height={460} device="desktop" scrollable />
            )
          ) : device === 'mobile' ? (
            <PhoneSidebar model={model as SidebarModel} variant={variant} theme={theme} height={640} />
          ) : (
            <SidebarStage model={model as SidebarModel} variant={variant} theme={theme} height={540} device="desktop" />
          )}
        </div>
        <p className="nvs-detail__note">
          <strong>Composição {variant === 0 ? 'A' : 'B'} — {comp.name}:</strong> {comp.description}{' '}
          {kind === 'header' && device === 'desktop' && 'Role a página de exemplo para ver o comportamento ao rolar.'}
          {device === 'mobile' && (kind === 'header' ? 'Toque no ☰ para abrir o menu do celular.' : 'No celular a sidebar vira um menu deslizante (drawer).')}
        </p>
        <div className="nvs-spec">
          <SpecList title="Resumo" items={[spec.summary]} />
          <SpecList title="No celular" items={spec.responsive} />
          {technical && <SpecList title="Como é organizado" items={spec.structure} />}
          {technical && <SpecList title="Como se comporta" items={spec.behavior ?? []} />}
          {technical && <SpecList title="Medidas recomendadas" items={measurements} />}
        </div>
        {guided && (
          <div>
            <Button variant="ghost" size="sm" onClick={() => setTechnical((t) => !t)}>
              {technical ? 'Ocultar detalhes técnicos' : 'Ver detalhes técnicos'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

/* -------------------------------------------------------------------------- */
/* Combinação                                                                  */
/* -------------------------------------------------------------------------- */

function ComboView({
  theme,
  headerChoice,
  sidebarChoice,
  showHints,
  goTo,
}: {
  theme: ResolvedTheme
  headerChoice: NavChoice | null
  sidebarChoice: NavChoice | null
  showHints: boolean
  goTo: (tab: Tab) => void
}) {
  const [arrangement, setArrangement] = useState<'header-top' | 'sidebar-full'>('header-top')
  const project = useStudio((s) => s.project)
  const header = headerById(headerChoice?.id)
  const sidebar = sidebarById(sidebarChoice?.id)
  const h = header ?? headers[0]
  const hv: 0 | 1 = headerChoice?.variant ?? 0
  const s = sidebar ?? sidebars[0]
  const sv: 0 | 1 = sidebarChoice?.variant ?? 0
  const look = headerLookFor(h, hv)
  const layout = h.compositions[hv].layout

  const engineConflicts = useMemo(() => detectConflicts(project).filter((c) => /^(header|sidebar)-/.test(c.id)), [project])

  const notes: { tone: 'info' | 'warning'; title: string; text: ReactNode }[] = []
  if (!header || !sidebar)
    notes.push({
      tone: 'info',
      title: 'Exemplo.',
      text: (
        <>
          {!header && !sidebar ? 'Você ainda não escolheu header nem sidebar' : !header ? 'Você ainda não escolheu um header' : 'Você ainda não escolheu uma sidebar'} — a prévia usa{' '}
          {!header && `“${h.name}”`}
          {!header && !sidebar && ' e '}
          {!sidebar && `“${s.name}”`} como exemplo. Escolha abaixo ou nas abas{' '}
          <button type="button" className="ui-term" style={{ all: 'unset', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => goTo(!header ? 'headers' : 'sidebars')}>
            {!header ? 'Headers' : 'Sidebars'}
          </button>
          .
        </>
      ),
    })
  if (h.floating)
    notes.push({
      tone: 'warning',
      title: 'Header flutuante.',
      text: `“${h.name}” fica por cima do conteúdo, afastado das bordas. Junto com uma sidebar, o conteúdo precisa de um espaço livre no topo (já aplicado na prévia) para nada ficar escondido atrás dele.`,
    })
  if (look.surface === 'transparent')
    notes.push({
      tone: 'warning',
      title: 'Header transparente.',
      text: `“${h.name}” foi pensado para ficar sobre uma imagem de destaque. Em telas de sistema ele aparece com fundo sólido, como nesta prévia.`,
    })
  if (s.floating && arrangement === 'header-top' && !h.floating)
    notes.push({
      tone: 'info',
      title: 'Sidebar flutuante sob header integral.',
      text: 'Mantenha o mesmo afastamento (12 px) em volta da sidebar para os dois parecerem do mesmo sistema.',
    })
  if (look.nav.length > 0 && !['search-center', 'menu-only', 'menu-left'].includes(layout))
    notes.push({
      tone: 'info',
      title: 'Navegação nos dois lugares.',
      text: `O header “${h.name}” tem links próprios e a sidebar também. Em sistemas, deixe a navegação principal na sidebar e use os links do header para outras áreas (ou só ações como busca e perfil).`,
    })
  if (arrangement === 'header-top')
    notes.push({ tone: 'info', title: 'Logo uma vez só.', text: 'Com o header por cima, a marca aparece só no header — a sidebar esconde o próprio logo.' })

  const headerOptions = headers.map((x) => ({ value: x.id, label: x.name }))
  const sidebarOptions = sidebars.map((x) => ({ value: x.id, label: x.name }))

  return (
    <div className="nvs-combo-ui">
      {showHints && (
        <Callout title="Combinação:">
          aqui o header e a sidebar escolhidos aparecem juntos em uma tela de aplicativo. A posição real de cada um é decidida nas etapas de arquitetura do computador e do celular — esta prévia serve para conferir se os dois combinam.
        </Callout>
      )}
      <div className="nvs-combo-ui__controls">
        <div className="nvs-combo-ui__pick">
          <label className="ui-label" htmlFor="nvs-combo-header">
            Header
          </label>
          <Select
            id="nvs-combo-header"
            value={header?.id ?? ''}
            onChange={(e) => e.target.value && selectItem('header', e.target.value, 0)}
          >
            {!header && <option value="">Escolha um header…</option>}
            {headerOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          {header && (
            <Segmented
              label="Composição do header"
              value={String(hv) as '0' | '1'}
              onChange={(v) => selectItem('header', header.id, v === '1' ? 1 : 0, true)}
              options={[
                { value: '0', label: 'Composição A' },
                { value: '1', label: 'Composição B' },
              ]}
            />
          )}
        </div>
        <div className="nvs-combo-ui__pick">
          <label className="ui-label" htmlFor="nvs-combo-sidebar">
            Sidebar
          </label>
          <Select
            id="nvs-combo-sidebar"
            value={sidebar?.id ?? ''}
            onChange={(e) => e.target.value && selectItem('sidebar', e.target.value, 0)}
          >
            {!sidebar && <option value="">Escolha uma sidebar…</option>}
            {sidebarOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          {sidebar && (
            <Segmented
              label="Composição da sidebar"
              value={String(sv) as '0' | '1'}
              onChange={(v) => selectItem('sidebar', sidebar.id, v === '1' ? 1 : 0, true)}
              options={[
                { value: '0', label: 'Composição A' },
                { value: '1', label: 'Composição B' },
              ]}
            />
          )}
        </div>
        <div className="nvs-combo-ui__pick">
          <span className="ui-label">Arranjo da prévia</span>
          <Segmented
            label="Arranjo da prévia"
            value={arrangement}
            onChange={(v) => keepScroll(() => setArrangement(v))}
            options={[
              { value: 'header-top', label: 'Header por cima', icon: <PanelTop /> },
              { value: 'sidebar-full', label: 'Sidebar inteira', icon: <PanelLeft /> },
            ]}
          />
        </div>
      </div>
      <div className="nvs-combo-ui__frame" data-testid="nav-combo-frame">
        <ComboStage header={h} headerVariant={hv} sidebar={s} sidebarVariant={sv} theme={theme} arrangement={arrangement} height={560} />
      </div>
      <div className="nvs-combo-ui__notes">
        {engineConflicts.map((c) => (
          <Callout key={c.id} tone="warning" title={c.title}>
            {c.description} Você decide como resolver na Central de prompts.
          </Callout>
        ))}
        {notes.map((n) => (
          <Callout key={n.title} tone={n.tone} title={n.title}>
            {n.text}
          </Callout>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Galeria                                                                     */
/* -------------------------------------------------------------------------- */

/** Navigation Showcase PRO: 36 headers + 36 sidebars, 2 composições cada (144 desenhos). */
export function NavigationShowcase({ guided = false }: { guided?: boolean }) {
  const theme = useResolvedTheme()
  const showHints = useProject((p) => p.prefs.showHints)
  const headerChoice = useStudio(useShallow((s) => s.project.navigation.header))
  const sidebarChoice = useStudio(useShallow((s) => s.project.navigation.sidebar))
  const [tab, setTab] = useState<Tab>('headers')
  const [filters, setFilters] = useState<Record<Kind, string>>({ header: 'todos', sidebar: 'todos' })
  const [variants, setVariants] = useState<Record<string, 0 | 1>>({})
  const [detail, setDetail] = useState<{ kind: Kind; id: string } | null>(null)

  const variantOf = (kind: Kind, id: string): 0 | 1 => {
    const choice = kind === 'header' ? headerChoice : sidebarChoice
    return variants[`${kind}:${id}`] ?? (choice?.id === id ? choice.variant : 0)
  }

  const onVariant = useCallback((kind: Kind, id: string, v: 0 | 1, selected: boolean) => {
    keepScroll(() => {
      setVariants((prev) => ({ ...prev, [`${kind}:${id}`]: v }))
      // O cartão selecionado mostra sempre a composição aprovada: trocar a composição atualiza a seleção.
      if (selected) {
        const s = studio()
        if (kind === 'header') s.selectHeader({ id, variant: v })
        else s.selectSidebar({ id, variant: v })
      }
    })
  }, [])
  const onDetails = useCallback((kind: Kind, id: string) => setDetail({ kind, id }), [])
  const closeDetail = useCallback(() => setDetail(null), [])
  const goTo = useCallback((t: Tab) => keepScroll(() => setTab(t)), [])

  const kind: Kind = tab === 'sidebars' ? 'sidebar' : 'header'
  const list: (HeaderModel | SidebarModel)[] = kind === 'header' ? headers : sidebars
  const filterDefs = (kind === 'header' ? HEADER_FILTERS : SIDEBAR_FILTERS).filter((f) => !guided || (kind === 'header' ? GUIDED_HEADER_FILTERS : GUIDED_SIDEBAR_FILTERS).includes(f.id))
  const filterId = filters[kind]
  const filterOptions = filterDefs.map((f) => ({ id: f.id, label: f.label, count: f.id === 'todos' ? list.length : list.filter((m) => m.filters.includes(f.id)).length }))
  const visible = filterId === 'todos' ? list : list.filter((m) => m.filters.includes(filterId))

  const headerSel = headerById(headerChoice?.id)
  const sidebarSel = sidebarById(sidebarChoice?.id)
  const detailModel = detail ? (detail.kind === 'header' ? headerById(detail.id) : sidebarById(detail.id)) : undefined

  return (
    <div className="nvs-root">
      <div className="nvs-intro">
        <p className="nvs-intro__lead">
          A <strong>arquitetura do computador</strong> decide <strong>onde</strong> ficam o <Term id="header" /> (a barra do topo) e a <Term id="sidebar" /> (o menu lateral). Aqui você decide{' '}
          <strong>como a navegação se parece</strong>: o estilo dos links, a altura, a busca, os menus que se abrem e o perfil. Tudo herda a identidade visual do projeto — cores,
          fontes e cantos.
        </p>
        {showHints && (
          <Callout title="Como escolher:">
            as prévias funcionam de verdade — abra os menus, clique nos itens, recolha as sidebars. Cada modelo tem duas composições (A e B) com arrumações diferentes. Quando gostar,
            clique em <strong>Selecionar</strong>, logo abaixo da prévia: a escolha entra no Master Prompt.
          </Callout>
        )}
        <div className="nvs-status-row" aria-live="polite">
          <Badge tone={headerSel ? 'accent' : undefined} icon={<PanelTop />}>
            {headerSel ? `Header: ${headerSel.name} · ${headerChoice!.variant === 0 ? 'A' : 'B'}` : 'Header: nenhum ainda'}
          </Badge>
          <Badge tone={sidebarSel ? 'accent' : undefined} icon={<PanelLeft />}>
            {sidebarSel ? `Sidebar: ${sidebarSel.name} · ${sidebarChoice!.variant === 0 ? 'A' : 'B'}` : 'Sidebar: nenhuma ainda'}
          </Badge>
        </div>
      </div>

      <Tabs
        label="Tipo de navegação"
        value={tab}
        onChange={(t) => keepScroll(() => setTab(t))}
        tabs={[
          { value: 'headers', label: `Headers (${headers.length})`, icon: <PanelTop /> },
          { value: 'sidebars', label: `Sidebars (${sidebars.length})`, icon: <PanelLeft /> },
          { value: 'combo', label: 'Combinação', icon: <Rows3 /> },
        ]}
      />

      {tab === 'combo' ? (
        <ComboView theme={theme} headerChoice={headerChoice} sidebarChoice={sidebarChoice} showHints={showHints} goTo={goTo} />
      ) : (
        <>
          <div className="nvs-toolbar">
            <FilterChips
              label={kind === 'header' ? 'Filtrar headers' : 'Filtrar sidebars'}
              options={filterOptions}
              value={filterId}
              onChange={(id) => keepScroll(() => setFilters((f) => ({ ...f, [kind]: id })))}
            />
            {showHints && <p className="nvs-filter-hint">{FILTER_HINTS[kind][filterId]}</p>}
          </div>
          <div className={kind === 'header' ? 'nvs-grid' : 'nvs-grid nvs-grid--side'} data-testid={`${kind}-grid`} style={{ minHeight: '100vh', alignContent: 'start' }}>
            {visible.map((m) => (
              <NavCard
                key={`${kind}:${m.id}`}
                kind={kind}
                model={m}
                variant={variantOf(kind, m.id)}
                selected={(kind === 'header' ? headerChoice?.id : sidebarChoice?.id) === m.id}
                theme={theme}
                showHints={showHints}
                onVariant={onVariant}
                onDetails={onDetails}
              />
            ))}
          </div>
        </>
      )}

      {detail && detailModel && (
        <DetailModal
          kind={detail.kind}
          model={detailModel}
          variant={variantOf(detail.kind, detail.id)}
          selected={(detail.kind === 'header' ? headerChoice?.id : sidebarChoice?.id) === detail.id}
          theme={theme}
          guided={guided}
          onVariant={onVariant}
          onClose={closeDetail}
        />
      )}
    </div>
  )
}
