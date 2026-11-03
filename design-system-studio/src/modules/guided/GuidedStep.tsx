import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Lock, ShieldCheck } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { ALL_STEPS, ENTRY_FLOWS, FINISH_STEPS, SKELETON_STEPS, skeletonDone, type StepId } from '@/core/project'
import { useProject, useStudio } from '@/core/store'
import { STEP_META } from '@/shell/nav'
import { Button, toast } from '@/ui'
import { openEntrySub } from './entrySub'
import './guided.css'

// Cada etapa carrega só o próprio módulo (antes, o guiado carregava as 10 áreas de uma vez: TE-14).
const ColorSystem = lazy(() => import('@/modules/color/ColorSystem').then((m) => ({ default: m.ColorSystem })))
const ComponentLibrary = lazy(() => import('@/modules/components').then((m) => ({ default: m.ComponentLibrary })))
const DesktopGallery = lazy(() => import('@/modules/layouts/galleries').then((m) => ({ default: m.DesktopGallery })))
const MobileStudio = lazy(() => import('@/modules/layouts/galleries').then((m) => ({ default: m.MobileStudio })))
const NavigationShowcase = lazy(() => import('@/modules/navigation').then((m) => ({ default: m.NavigationShowcase })))
const LiveSitePreview = lazy(() => import('@/modules/preview/LiveSitePreview').then((m) => ({ default: m.LiveSitePreview })))
const ProjectGoalForm = lazy(() => import('@/modules/project/ProjectGoalForm').then((m) => ({ default: m.ProjectGoalForm })))
const PromptWorkspace = lazy(() => import('@/modules/prompts/PromptWorkspace').then((m) => ({ default: m.PromptWorkspace })))
const EntryStep = lazy(() => import('./EntryStep').then((m) => ({ default: m.EntryStep })))
const SkeletonReview = lazy(() => import('./SkeletonReview').then((m) => ({ default: m.SkeletonReview })))

const STEP_INTRO: Record<StepId, string> = {
  objetivo: 'Conte o que você vai construir. Isso ajuda o Studio a sugerir caminhos — você continua livre para escolher.',
  entrada: 'Decida como as pessoas chegam ao site: por uma página de apresentação, direto no login ou direto no aplicativo. Depois escolha a aparência dessas telas.',
  desktop: 'Escolha o esqueleto do site no computador: onde ficam o header (barra do topo), a sidebar (menu lateral) e o conteúdo. Ainda não é hora de cores — só estrutura.',
  mobile: 'Escolha como o site se organiza no celular. É uma decisão separada do computador: um menu lateral não precisa virar gaveta no celular.',
  revisao: 'Confira o esqueleto completo. Você pode voltar e mudar qualquer escolha. Ao aprovar, o fluxo segue para o acabamento visual.',
  preview: 'Veja todas as decisões estruturais juntas, no computador, no tablet e no celular. A prévia acompanha cada mudança.',
  identidade: 'Agora sim, as cores. Escolha uma paleta: todos os componentes herdam esses tokens. Nas abas “Tipografia” e “Formas e superfícies”, nesta mesma etapa, você ajusta fontes e cantos.',
  navegacao: 'O layout já definiu onde ficam os menus. Aqui você escolhe como eles se parecem. Etapa opcional.',
  componentes: 'Escolha e personalize as peças da interface: botões, campos, cards, tabelas… Etapa opcional.',
  entrega: 'Tudo o que você aprovou vira um Master Prompt detalhado. Copie, baixe ou exporte em JSON e CSS.',
}

interface Requirement {
  message: string
  /** Leva a pessoa até o que falta. */
  fix?: () => void
}

const scrollToMain = () => document.getElementById('conteudo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

function useStepRequirement(step: StepId): Requirement | null {
  const projectType = useProject((p) => p.meta.projectType)
  const flowId = useProject((p) => p.entry.flow)
  const landingId = useProject((p) => p.entry.landingId)
  const loginId = useProject((p) => p.entry.loginId)
  const desktopId = useProject((p) => p.layout.desktopId)
  const mobileId = useProject((p) => p.layout.mobileId)
  const flow = ENTRY_FLOWS.find((f) => f.id === flowId)
  switch (step) {
    case 'objetivo':
      return projectType ? null : { message: 'Escolha o tipo de projeto para continuar.', fix: () => document.getElementById('tipo')?.scrollIntoView({ behavior: 'smooth' }) }
    case 'entrada':
      if (!flow) return { message: 'Escolha como as pessoas entram no site.', fix: () => openEntrySub('fluxo') }
      if (flow.needsLanding && !landingId) return { message: 'Escolha um modelo de landing page (ou “Não preciso de landing”).', fix: () => openEntrySub('landing') }
      if (flow.needsLogin && !loginId) return { message: 'Escolha um modelo de login.', fix: () => openEntrySub('login') }
      return null
    case 'desktop':
      return desktopId ? null : { message: 'Escolha uma arquitetura para o computador.', fix: scrollToMain }
    case 'mobile':
      return mobileId ? null : { message: 'Escolha uma arquitetura para o celular.', fix: scrollToMain }
    default:
      return null
  }
}

function Stepper({ current }: { current: StepId }) {
  const navigate = useNavigate()
  const completed = useProject((p) => p.guided.completed)
  const approved = useProject((p) => p.guided.skeletonApproved)
  // Etapas do esqueleto: concluídas pelas escolhas reais (mesma regra do contador “Esqueleto x/5”).
  const skeleton = useStudio(useShallow((s) => skeletonDone(s.project)))
  const hasNavChoice = useProject((p) => Boolean(p.navigation.header || p.navigation.sidebar))
  const hasComponents = useProject((p) => p.components.length > 0)
  const phases: { label: string; steps: StepId[]; locked: boolean }[] = [
    { label: 'Esqueleto', steps: SKELETON_STEPS, locked: false },
    { label: 'Acabamento', steps: FINISH_STEPS, locked: !approved },
  ]
  return (
    <nav className="gd-stepper" aria-label="Etapas do construtor guiado">
      {phases.map((phase) => (
        <div key={phase.label}>
          <div className="gd-phase__label">
            {phase.locked ? <Lock aria-hidden="true" /> : <ShieldCheck aria-hidden="true" />}
            {phase.label}
            {phase.locked && <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>· libera após aprovar o esqueleto</span>}
          </div>
          <ol className="gd-steps">
            {phase.steps.map((s) => {
              const idx = ALL_STEPS.indexOf(s)
              const isDone = SKELETON_STEPS.includes(s) ? skeleton.includes(s) : completed.includes(s)
              // Etapas opcionais puladas sem nenhuma escolha aparecem como “pulada”, não como concluídas (UX-44).
              const skipped = isDone && ((s === 'navegacao' && !hasNavChoice) || (s === 'componentes' && !hasComponents))
              const state = s === current ? 'current' : skipped ? 'skipped' : isDone ? 'done' : 'todo'
              return (
                <li key={s}>
                  <button
                    type="button"
                    className="gd-step"
                    data-state={state}
                    data-locked={phase.locked}
                    aria-current={s === current ? 'step' : undefined}
                    aria-disabled={phase.locked}
                    title={phase.locked ? 'Aprove o esqueleto na etapa de revisão para liberar' : STEP_META[s].label}
                    onClick={() => {
                      if (phase.locked) {
                        toast.info('Primeiro o esqueleto: aprove a revisão para liberar o acabamento.')
                        return
                      }
                      navigate(`/guiado/${s}`)
                    }}
                  >
                    <span className="gd-step__bar" aria-hidden="true" />
                    <span className="gd-step__text">
                      {state === 'done' && <Check width={12} height={12} style={{ verticalAlign: '-1px', marginRight: 3 }} aria-hidden="true" />}
                      {idx + 1}. {STEP_META[s].short}
                      {state === 'skipped' && <span className="gd-step__skip"> (pulada)</span>}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </nav>
  )
}

export default function GuidedStep() {
  const { step: param } = useParams()
  const navigate = useNavigate()
  const goToStep = useStudio((s) => s.goToStep)
  const completeStep = useStudio((s) => s.completeStep)
  const setMode = useStudio((s) => s.setMode)
  const setSkeletonApproved = useStudio((s) => s.setSkeletonApproved)
  const approved = useProject((p) => p.guided.skeletonApproved)
  const mode = useProject((p) => p.mode)
  const storedStep = useProject((p) => p.guided.step)
  const step = (ALL_STEPS as string[]).includes(param ?? '') ? (param as StepId) : null
  const requirement = useStepRequirement(step ?? 'objetivo')

  useEffect(() => {
    if (step && step !== storedStep) goToStep(step)
    if (mode !== 'guided') setMode('guided')
  }, [step, storedStep, goToStep, mode, setMode])

  if (!step) return <Navigate to="/guiado/objetivo" replace />
  if (FINISH_STEPS.includes(step) && !approved) return <Navigate to="/guiado/revisao" replace />

  const index = ALL_STEPS.indexOf(step)
  const prev = ALL_STEPS[index - 1]
  const next = ALL_STEPS[index + 1]
  const meta = STEP_META[step]

  const advance = () => {
    // “Continuar” nunca fica mudo: explica o que falta e leva até lá.
    if (requirement) {
      toast.info(requirement.message)
      requirement.fix?.()
      return
    }
    completeStep(step)
    if (step === 'revisao') {
      setSkeletonApproved(true)
      toast.success('Esqueleto aprovado. Agora vamos ao acabamento.')
    }
    if (next) navigate(`/guiado/${next}`)
    else navigate('/prompt')
  }

  let body: ReactNode
  switch (step) {
    case 'objetivo':
      body = <ProjectGoalForm guided />
      break
    case 'entrada':
      body = <EntryStep />
      break
    case 'desktop':
      body = <DesktopGallery guided />
      break
    case 'mobile':
      body = <MobileStudio guided />
      break
    case 'revisao':
      body = <SkeletonReview />
      break
    case 'preview':
      body = <LiveSitePreview />
      break
    case 'identidade':
      body = <ColorSystem guided />
      break
    case 'navegacao':
      body = <NavigationShowcase guided />
      break
    case 'componentes':
      body = <ComponentLibrary guided />
      break
    case 'entrega':
      body = <PromptWorkspace />
      break
  }

  const nextLabel =
    step === 'revisao' ? (approved ? 'Continuar para o acabamento' : 'Aprovar esqueleto e continuar') : next ? `Continuar: ${STEP_META[next].short}` : 'Abrir Central de Prompts'

  return (
    <div className="ui-page gd-page">
      <Stepper current={step} />
      <header className="gd-head">
        <span className="gd-head__count">
          Etapa {index + 1} de {ALL_STEPS.length} · {SKELETON_STEPS.includes(step) ? 'Esqueleto' : 'Acabamento'}
        </span>
        <h1>{meta.label}</h1>
        <p>{STEP_INTRO[step]}</p>
      </header>

      <Suspense fallback={<div className="u-muted" style={{ minHeight: 320 }}>Carregando…</div>}>{body}</Suspense>

      <div className="gd-footer">
        <div>
          {prev ? (
            <Button icon={<ArrowLeft />} onClick={() => navigate(`/guiado/${prev}`)}>
              Voltar
            </Button>
          ) : (
            <Button icon={<ArrowLeft />} onClick={() => navigate('/')}>
              Início
            </Button>
          )}
        </div>
        <div className="u-row" style={{ justifyContent: 'flex-end' }}>
          {requirement && (
            <span className="gd-footer__hint" id="guided-next-hint">
              {requirement.message}
            </span>
          )}
          <Button
            variant="primary"
            iconRight={<ArrowRight />}
            aria-disabled={requirement ? true : undefined}
            aria-describedby={requirement ? 'guided-next-hint' : undefined}
            data-pending={requirement ? 'true' : undefined}
            onClick={advance}
            data-testid="guided-next"
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
