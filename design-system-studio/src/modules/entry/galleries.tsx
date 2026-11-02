import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { Check, Eye, SearchX } from 'lucide-react'
import { ENTRY_FLOWS } from '@/core/project'
import { studio, useProject } from '@/core/store'
import { useResolvedTheme } from '@/core/theme'
import type { Device } from '@/core/types'
import { PromptButton } from '@/prompt/PromptButton'
import { Button, Callout, DeviceToggle, EmptyState, FilterChips, keepScroll, Modal, OptionCard, SearchInput, Segmented, Switch, toast, useMediaQuery } from '@/ui'
import { AuthPreview } from './AuthPreview'
import { landingById, landings, loginById, logins, signupById, signups } from './catalog'
import { PreviewStage, ScaledThumb } from './frames'
import { LandingPreview } from './LandingPreview'
import { architectureName, LANDING_ARCHITECTURES, LOGIN_GROUPS, type LandingModel, type LoginModel, type SignupModel } from './types'
import './entry.css'

/* ========================================================================== */
/* Utilitários                                                                 */
/* ========================================================================== */

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

function matches(query: string, ...parts: (string | undefined)[]) {
  const q = fold(query.trim())
  if (!q) return true
  return fold(parts.filter(Boolean).join(' ')).includes(q)
}

/** Mantém a altura mínima da grade ao filtrar, para a página não "pular". */
function useStableHeight() {
  const ref = useRef<HTMLDivElement>(null)
  const [minH, setMinH] = useState<number | undefined>(undefined)
  const lock = () => {
    const h = ref.current?.offsetHeight
    if (h) setMinH((prev) => Math.max(prev ?? 0, h))
  }
  return { ref, minH, lock }
}

function usePreviewDevice(): [Device, (d: Device) => void] {
  const narrow = useMediaQuery('(max-width: 720px)')
  const [device, setDevice] = useState<Device | null>(null)
  return [device ?? (narrow ? 'mobile' : 'desktop'), (d) => setDevice(d === 'tablet' ? 'desktop' : d)]
}

function SelectionSummary({ label, value, detail, onPreview }: { label: string; value?: string; detail?: string; onPreview?: () => void }) {
  // Altura constante (com ou sem seleção) para que escolher um modelo nunca desloque a galeria.
  return (
    <div className="ent-summary" aria-live="polite">
      <div className="ent-summary__text">
        <span className="ent-summary__label">{label}</span>
        <span className="ent-summary__value" title={value ? `${value}${detail ? ` · ${detail}` : ''}` : undefined}>
          {value ? (
            <>
              {value}
              {detail && <span className="u-subtle" style={{ fontWeight: 500 }}> · {detail}</span>}
            </>
          ) : (
            <span className="u-subtle" style={{ fontWeight: 500 }}>
              Nenhum modelo escolhido ainda — clique em um cartão.
            </span>
          )}
        </span>
      </div>
      <Button size="sm" icon={<Eye />} onClick={onPreview} disabled={!value}>
        Ver prévia
      </Button>
    </div>
  )
}

function SelectButton({ selected, onSelect }: { selected: boolean; onSelect: () => void }) {
  return (
    <Button variant="primary" icon={<Check />} onClick={() => keepScroll(onSelect)} disabled={selected} data-testid="select-model">
      {selected ? 'Modelo selecionado' : 'Selecionar este modelo'}
    </Button>
  )
}

function FlowWarning({ kind }: { kind: 'landing' | 'login' }) {
  const flowId = useProject((p) => p.entry.flow)
  const flow = ENTRY_FLOWS.find((f) => f.id === flowId)
  if (!flow) return null
  if (kind === 'landing' && !flow.needsLanding)
    return (
      <Callout tone="warning" title="O fluxo escolhido não tem landing page.">
        Você marcou “{flow.name}”. Pode escolher uma landing mesmo assim, mas ela só entra no projeto se você mudar o fluxo de entrada.
      </Callout>
    )
  if (kind === 'login' && !flow.needsLogin)
    return (
      <Callout tone="warning" title="O fluxo escolhido não tem login.">
        Você marcou “{flow.name}”. Escolha um fluxo com login na página Landing (ou no passo “Entrada”) para usar estas telas no projeto.
      </Callout>
    )
  return null
}

/* ========================================================================== */
/* Landing pages                                                               */
/* ========================================================================== */

function selectLandingModel(model: LandingModel) {
  const s = studio()
  const { landingId, landingUsesOriginalColors } = s.project.entry
  if (landingId === model.id) return
  s.selectLanding(model.id)
  if (landingUsesOriginalColors) {
    s.setLandingUsesOriginalColors(false)
    toast.info(`“${model.name}” selecionada. A exceção de cores do modelo anterior foi removida.`)
  } else {
    toast.success(`Landing “${model.name}” selecionada e incluída no Master Prompt.`)
  }
}

function LandingModal({ model, onClose }: { model: LandingModel; onClose: () => void }) {
  const theme = useResolvedTheme()
  const selectedId = useProject((p) => p.entry.landingId)
  const keepOriginal = useProject((p) => p.entry.landingUsesOriginalColors)
  const showHints = useProject((p) => p.prefs.showHints)
  const [device, setDevice] = usePreviewDevice()
  const [colors, setColors] = useState<'modelo' | 'identidade'>(selectedId === model.id && !keepOriginal ? 'identidade' : 'modelo')
  const selected = selectedId === model.id
  const exception = selected && keepOriginal

  const onException = (value: boolean) => {
    const s = studio()
    if (value) {
      if (!selected) s.selectLanding(model.id)
      s.setLandingUsesOriginalColors(true)
      setColors('modelo')
      toast.success(selected ? 'As cores originais deste modelo serão mantidas no projeto.' : `“${model.name}” selecionada com as cores originais.`)
    } else {
      s.setLandingUsesOriginalColors(false)
      setColors('identidade')
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      width={1100}
      title={model.name}
      subtitle={`${model.segment} · ${architectureName(model.architecture)}`}
      testId="landing-preview-modal"
      footer={
        <>
          <PromptButton target={{ kind: 'landing', id: model.id }} />
          <SelectButton selected={selected} onSelect={() => selectLandingModel(model)} />
        </>
      }
    >
      <div className="ent-preview">
        <div className="ent-preview__controls">
          <DeviceToggle value={device} onChange={setDevice} />
          <Segmented
            label="Cores da prévia"
            value={colors}
            onChange={setColors}
            options={[
              { value: 'modelo', label: 'Cores do modelo' },
              { value: 'identidade', label: 'Minha identidade' },
            ]}
          />
          <Switch
            checked={exception}
            onChange={onException}
            label="Manter as cores originais deste modelo no projeto"
            description={showHints ? 'Por padrão a landing usa a paleta global do projeto. Ative só se quiser esta exceção.' : undefined}
          />
        </div>
        <PreviewStage device={device === 'mobile' ? 'mobile' : 'desktop'} resetKey={model.id} label={`Prévia da landing ${model.name}`}>
          <LandingPreview model={model} device={device === 'mobile' ? 'mobile' : 'desktop'} theme={colors === 'modelo' ? null : theme} />
        </PreviewStage>
        <div className="ent-preview__info">
          {showHints && <p>{model.description}</p>}
          <strong style={{ color: 'var(--s-text)' }}>Ordem das seções</strong>
          <div className="ent-preview__sections">
            {model.sections.map((s, i) => (
              <span key={s}>
                {i + 1}. {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

/** Galeria de landing pages (24). `guided` simplifica a interface para iniciantes. */
export function LandingGallery({ guided = false }: { guided?: boolean }) {
  const selectedId = useProject((p) => p.entry.landingId)
  const showHints = useProject((p) => p.prefs.showHints)
  const [arch, setArch] = useState('todas')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const closeModal = useCallback(() => setOpenId(null), [])
  const grid = useStableHeight()

  const searched = useMemo(
    () => landings.filter((l) => matches(query, l.name, l.segment, l.description, architectureName(l.architecture), l.spec.summary)),
    [query],
  )
  const visible = arch === 'todas' ? searched : searched.filter((l) => l.architecture === arch)
  const chipOptions = [
    { id: 'todas', label: 'Todas', count: searched.length },
    ...LANDING_ARCHITECTURES.map((a) => ({ id: a.id, label: a.name, count: searched.filter((l) => l.architecture === a.id).length })),
  ]
  const archInfo = LANDING_ARCHITECTURES.find((a) => a.id === arch)
  const selected = landingById(selectedId)
  const open = landingById(openId)

  return (
    <div className="ent-gallery" data-testid="landing-gallery">
      <FlowWarning kind="landing" />
      {guided && showHints && (
        <Callout title="Como escolher:">
          olhe as miniaturas e clique na que mais combina com o seu produto. Use “Ver prévia” para ver a página inteira no computador e no celular.
        </Callout>
      )}
      <SelectionSummary
        label="Landing selecionada"
        value={selected?.name}
        detail={selected ? `${selected.segment} · ${architectureName(selected.architecture)}` : undefined}
        onPreview={selected ? () => setOpenId(selected.id) : undefined}
      />
      <div className="ent-toolbar">
        {!guided && (
          <div className="ent-toolbar__row">
            <SearchInput value={query} onChange={setQuery} label="Buscar landing pages" placeholder="Buscar por nome, segmento ou estrutura…" />
          </div>
        )}
        <FilterChips
          label="Filtrar por arquitetura"
          options={chipOptions}
          value={arch}
          onChange={(id) =>
            keepScroll(() => {
              grid.lock()
              setArch(id)
            })
          }
        />
        {(showHints || guided) && <p className="ent-arch-note">{archInfo ? `${archInfo.name}: ${archInfo.description}` : 'Doze arquiteturas diferentes, duas marcas fictícias em cada uma.'}</p>}
      </div>
      <div ref={grid.ref} style={{ minHeight: grid.minH }}>
        {visible.length === 0 ? (
          <EmptyState
            icon={<SearchX />}
            title="Nenhuma landing encontrada"
            action={
              <Button
                size="sm"
                onClick={() => {
                  setQuery('')
                  setArch('todas')
                }}
              >
                Limpar filtros
              </Button>
            }
          >
            Tente outro termo ou outra arquitetura.
          </EmptyState>
        ) : (
          <div className="ent-grid" style={{ ['--min' as string]: '300px' }}>
            {visible.map((l) => (
              <OptionCard
                key={l.id}
                testId={`landing-option-${l.id}`}
                selected={selectedId === l.id}
                onSelect={() => selectLandingModel(l)}
                media={
                  <ScaledThumb virtualWidth={1280} height={212}>
                    <LandingPreview model={l} device="desktop" interactive={false} compact />
                  </ScaledThumb>
                }
                title={l.name}
                meta={
                  <span className="ent-card-meta">
                    {l.segment}
                    <span className="ent-dot" aria-hidden="true" />
                    {architectureName(l.architecture)}
                  </span>
                }
                description={l.description}
                footer={
                  <>
                    <Button size="sm" variant="secondary" className="ent-card-btn" icon={<Eye />} onClick={() => setOpenId(l.id)}>
                      Ver prévia
                    </Button>
                    {!guided && <PromptButton target={{ kind: 'landing', id: l.id }} />}
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>
      {open && <LandingModal model={open} onClose={closeModal} />}
    </div>
  )
}

/* ========================================================================== */
/* Login                                                                       */
/* ========================================================================== */

function selectLoginModel(model: LoginModel) {
  const s = studio()
  if (s.project.entry.loginId === model.id) return
  s.selectLogin(model.id)
  toast.success(`Login “${model.name}” selecionado e incluído no Master Prompt.`)
}

function AuthModal({
  kind,
  login,
  signup,
  title,
  subtitle,
  selected,
  onSelect,
  onClose,
  initialView,
  note,
}: {
  kind: 'login' | 'signup'
  login: LoginModel
  signup?: SignupModel
  title: string
  subtitle: string
  selected: boolean
  onSelect: () => void
  onClose: () => void
  initialView: 'login' | 'signup'
  note?: ReactNode
}) {
  const theme = useResolvedTheme()
  const [device, setDevice] = usePreviewDevice()
  const [view, setView] = useState<'login' | 'signup'>(initialView)
  const [showErrors, setShowErrors] = useState(false)
  const id = kind === 'login' ? login.id : signup!.id
  return (
    <Modal
      open
      onClose={onClose}
      width={1100}
      title={title}
      subtitle={subtitle}
      testId={`${kind}-preview-modal`}
      footer={
        <>
          <PromptButton target={{ kind, id }} />
          <SelectButton selected={selected} onSelect={onSelect} />
        </>
      }
    >
      <div className="ent-preview">
        <div className="ent-preview__controls">
          <DeviceToggle value={device} onChange={setDevice} />
          <Segmented
            label="Tela exibida"
            value={view}
            onChange={setView}
            options={[
              { value: 'login', label: 'Entrar' },
              { value: 'signup', label: 'Criar conta' },
            ]}
          />
          <Switch checked={showErrors} onChange={setShowErrors} label="Mostrar estados de erro" />
        </div>
        <PreviewStage device={device === 'mobile' ? 'mobile' : 'desktop'} resetKey={`${id}-${view}`} label={`Prévia de ${title}`}>
          <AuthPreview login={login} signup={signup} view={view} onViewChange={setView} device={device === 'mobile' ? 'mobile' : 'desktop'} theme={theme} showErrors={showErrors} />
        </PreviewStage>
        <div className="ent-preview__info">
          {note}
          <p>Demonstração de interface: experimente digitar, mostrar a senha, enviar vazio e “Esqueci minha senha”. Nenhum dado é enviado.</p>
        </div>
      </div>
    </Modal>
  )
}

/** Galeria de logins (24). */
export function LoginGallery({ guided = false }: { guided?: boolean }) {
  const theme = useResolvedTheme()
  const selectedId = useProject((p) => p.entry.loginId)
  const signupId = useProject((p) => p.entry.signupId)
  const showHints = useProject((p) => p.prefs.showHints)
  const [group, setGroup] = useState('todos')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const closeModal = useCallback(() => setOpenId(null), [])
  const grid = useStableHeight()
  const signup = signupById(signupId)

  const searched = useMemo(() => logins.filter((l) => matches(query, l.name, l.composition, l.description)), [query])
  const visible = group === 'todos' ? searched : searched.filter((l) => l.group === group)
  const chipOptions = [{ id: 'todos', label: 'Todos', count: searched.length }, ...LOGIN_GROUPS.map((g) => ({ id: g.id, label: g.name, count: searched.filter((l) => l.group === g.id).length }))]
  const groupInfo = LOGIN_GROUPS.find((g) => g.id === group)
  const selected = loginById(selectedId)
  const open = loginById(openId)

  return (
    <div className="ent-gallery" data-testid="login-gallery">
      <FlowWarning kind="login" />
      {showHints && (
        <Callout title="Todas as telas usam a sua identidade visual.">
          Cores, fontes e cantos vêm da paleta global do projeto. O que muda aqui é a composição da tela de entrar.
        </Callout>
      )}
      <SelectionSummary
        label="Login selecionado"
        value={selected?.name}
        detail={selected?.composition}
        onPreview={selected ? () => setOpenId(selected.id) : undefined}
      />
      <div className="ent-toolbar">
        {!guided && (
          <div className="ent-toolbar__row">
            <SearchInput value={query} onChange={setQuery} label="Buscar logins" placeholder="Buscar por nome ou composição…" />
          </div>
        )}
        <FilterChips
          label="Filtrar por tipo de composição"
          options={chipOptions}
          value={group}
          onChange={(id) =>
            keepScroll(() => {
              grid.lock()
              setGroup(id)
            })
          }
        />
        {(showHints || guided) && <p className="ent-arch-note">{groupInfo ? groupInfo.description : 'Vinte e quatro composições, todas com a mesma identidade do seu projeto.'}</p>}
      </div>
      <div ref={grid.ref} style={{ minHeight: grid.minH }}>
        {visible.length === 0 ? (
          <EmptyState icon={<SearchX />} title="Nenhum login encontrado" action={<Button size="sm" onClick={() => { setQuery(''); setGroup('todos') }}>Limpar filtros</Button>}>
            Tente outro termo.
          </EmptyState>
        ) : (
          <div className="ent-grid" style={{ ['--min' as string]: '290px' }}>
            {visible.map((l) => (
              <OptionCard
                key={l.id}
                testId={`login-option-${l.id}`}
                selected={selectedId === l.id}
                onSelect={() => selectLoginModel(l)}
                media={
                  <ScaledThumb virtualWidth={1120} ratio="7 / 5">
                    <AuthPreview login={l} signup={signup} view="login" device="desktop" theme={theme} interactive={false} />
                  </ScaledThumb>
                }
                title={l.name}
                meta={l.composition}
                description={l.description}
                footer={
                  <>
                    <Button size="sm" variant="secondary" className="ent-card-btn" icon={<Eye />} onClick={() => setOpenId(l.id)}>
                      Ver prévia
                    </Button>
                    {!guided && <PromptButton target={{ kind: 'login', id: l.id }} />}
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>
      {open && (
        <AuthModal
          kind="login"
          login={open}
          signup={signup}
          title={open.name}
          subtitle={open.composition}
          selected={selectedId === open.id}
          onSelect={() => selectLoginModel(open)}
          onClose={closeModal}
          initialView="login"
          note={signup ? <p>A tela “Criar conta” usa o fluxo de cadastro escolhido: {signup.name}.</p> : <p>Escolha um fluxo na página Cadastro para ver a tela “Criar conta” correspondente.</p>}
        />
      )}
    </div>
  )
}

/* ========================================================================== */
/* Cadastro                                                                    */
/* ========================================================================== */

function selectSignupModel(model: SignupModel) {
  const s = studio()
  if (s.project.entry.signupId === model.id) return
  s.selectSignup(model.id)
  toast.success(`Cadastro “${model.name}” selecionado e incluído no Master Prompt.`)
}

/** Galeria de fluxos de cadastro (8). */
export function SignupGallery({ guided = false }: { guided?: boolean }) {
  const theme = useResolvedTheme()
  const selectedId = useProject((p) => p.entry.signupId)
  const loginId = useProject((p) => p.entry.loginId)
  const showHints = useProject((p) => p.prefs.showHints)
  const [openId, setOpenId] = useState<string | null>(null)
  const closeModal = useCallback(() => setOpenId(null), [])
  const login = loginById(loginId) ?? logins[0]
  const selected = signupById(selectedId)
  const open = signupById(openId)

  return (
    <div className="ent-gallery" data-testid="signup-gallery">
      <FlowWarning kind="login" />
      {showHints && (
        <Callout title={`As prévias usam a composição de login “${login.name}”.`}>
          {loginById(loginId) ? 'É a tela de entrar que você escolheu.' : 'Você ainda não escolheu um login; usamos o primeiro como exemplo.'} Aqui você decide como a pessoa cria a conta.
        </Callout>
      )}
      <SelectionSummary
        label="Cadastro selecionado"
        value={selected?.name}
        detail={selected ? `${selected.fields.length} campo(s)` : undefined}
        onPreview={selected ? () => setOpenId(selected.id) : undefined}
      />
      <div className="ent-grid" style={{ ['--min' as string]: '290px' }}>
        {signups.map((s) => (
          <OptionCard
            key={s.id}
            testId={`signup-option-${s.id}`}
            selected={selectedId === s.id}
            onSelect={() => selectSignupModel(s)}
            media={
              <ScaledThumb virtualWidth={430} height={236} fade>
                <AuthPreview login={login} signup={s} view="signup" device="desktop" theme={theme} interactive={false} formOnly />
              </ScaledThumb>
            }
            title={s.name}
            meta={`${s.fields.length} campo(s) · ${s.steps ? `${s.steps.length} etapas` : 'uma tela'}`}
            description={s.description}
            footer={
              <>
                <Button size="sm" variant="secondary" className="ent-card-btn" icon={<Eye />} onClick={() => setOpenId(s.id)}>
                  Ver prévia
                </Button>
                {!guided && <PromptButton target={{ kind: 'signup', id: s.id }} />}
              </>
            }
          />
        ))}
      </div>
      {open && (
        <AuthModal
          kind="signup"
          login={login}
          signup={open}
          title={open.name}
          subtitle={`Campos: ${open.fields.join(', ')}`}
          selected={selectedId === open.id}
          onSelect={() => selectSignupModel(open)}
          onClose={closeModal}
          initialView="signup"
          note={<p>Prévia montada com a composição de login “{login.name}”.</p>}
        />
      )}
    </div>
  )
}
