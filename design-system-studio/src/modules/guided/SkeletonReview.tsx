import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Pencil } from 'lucide-react'
import { ENTRY_FLOWS, PROJECT_TYPES } from '@/core/project'
import { useStudio } from '@/core/store'
import { useResolvedTheme } from '@/core/theme'
import { landingById, loginById, signupById } from '@/modules/entry/catalog'
import { DesktopSchematic, PhonePreview } from '@/modules/layouts'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import { detectConflicts, detectPending } from '@/prompt/conflicts'
import { Callout, Section } from '@/ui'

function ReviewCard({ kind, name, media, to, empty }: { kind: string; name?: string | null; media?: ReactNode; to: string; empty: string }) {
  return (
    <div className="rv-card">
      <div className="rv-card__media">{media ?? <span className="u-subtle u-small">Sem prévia</span>}</div>
      <div className="rv-card__body">
        <span className="rv-card__kind">{kind}</span>
        <span className={name ? 'rv-card__name' : 'rv-card__name rv-card__empty'}>{name ?? empty}</span>
        <Link to={to} className="u-small" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <Pencil width={13} height={13} aria-hidden="true" /> Alterar
        </Link>
      </div>
    </div>
  )
}

/** Etapa 5: resumo do esqueleto com acesso para alterar qualquer escolha. */
export function SkeletonReview() {
  const project = useStudio((s) => s.project)
  const theme = useResolvedTheme()
  const showLegends = project.prefs.showLegends
  const flow = ENTRY_FLOWS.find((f) => f.id === project.entry.flow)
  const type = PROJECT_TYPES.find((t) => t.id === project.meta.projectType)
  const desktop = desktopById(project.layout.desktopId)
  const mobile = mobileById(project.layout.mobileId)
  const landing = landingById(project.entry.landingId)
  const login = loginById(project.entry.loginId)
  const signup = signupById(project.entry.signupId)
  const pending = detectPending(project)
  const conflicts = detectConflicts(project)

  return (
    <div className="u-stack-lg">
      {pending.length > 0 ? (
        <Callout tone="warning" title="Ainda faltam decisões:">
          <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
            {pending.map((p) => (
              <li key={p.id}>
                {p.message} <Link to={p.route}>Resolver</Link>
              </li>
            ))}
          </ul>
        </Callout>
      ) : (
        <Callout tone="success" title="Esqueleto completo.">
          Revise abaixo e aprove para seguir para cores, navegação e componentes.
        </Callout>
      )}
      {conflicts.length > 0 && (
        <Callout tone="warning" title={`${conflicts.length} possível(is) contradição(ões).`}>
          Você poderá decidir a prioridade na <Link to="/prompt">Central de Prompts</Link>. <AlertTriangle width={14} height={14} style={{ verticalAlign: '-2px' }} aria-hidden="true" />
        </Callout>
      )}

      <Section title="Projeto">
        <dl className="ui-dl">
          <div>
            <dt>Nome</dt>
            <dd>{project.meta.name || <span className="u-subtle">Sem nome</span>} · <Link to="/guiado/objetivo">Alterar</Link></dd>
          </div>
          <div>
            <dt>Tipo</dt>
            <dd>{project.meta.projectType === 'outro' ? project.meta.projectTypeOther || 'Outro' : type?.name ?? '—'}</dd>
          </div>
          {project.meta.objective && (
            <div>
              <dt>Objetivo</dt>
              <dd>{project.meta.objective}</dd>
            </div>
          )}
          {project.meta.features.length > 0 && (
            <div>
              <dt>Funcionalidades</dt>
              <dd>{project.meta.features.join(', ')}</dd>
            </div>
          )}
          <div>
            <dt>Entrada</dt>
            <dd>{flow ? flow.name : <span className="u-subtle">Não definida</span>}</dd>
          </div>
        </dl>
      </Section>

      <Section title="Esqueleto aprovado">
        <div className="rv-grid">
          <ReviewCard
            kind="Computador"
            name={desktop?.name}
            empty="Não escolhido"
            to="/guiado/desktop"
            media={desktop ? <DesktopSchematic layout={desktop} width={300} showLegends={showLegends} /> : undefined}
          />
          <ReviewCard
            kind="Celular"
            name={mobile?.name}
            empty="Não escolhido"
            to="/guiado/mobile"
            media={
              mobile ? (
                <div style={{ transform: 'scale(0.42)', transformOrigin: 'center', pointerEvents: 'none' }}>
                  <PhonePreview layout={mobile} theme={theme} showLegends={false} width={220} />
                </div>
              ) : undefined
            }
          />
          {flow?.needsLanding && <ReviewCard kind="Landing page" name={landing?.name} empty="Não escolhida" to="/guiado/entrada" />}
          {flow?.needsLogin && <ReviewCard kind="Login" name={login?.name} empty="Não escolhido" to="/guiado/entrada" />}
          {flow?.needsLogin && <ReviewCard kind="Cadastro" name={signup?.name} empty="Sem cadastro escolhido" to="/guiado/entrada" />}
        </div>
      </Section>
    </div>
  )
}
