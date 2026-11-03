import { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import { ENTRY_FLOWS, type EntryFlow } from '@/core/project'
import { studio, useProject } from '@/core/store'
import { EntryFlowPicker, LandingGallery, LoginGallery, SignupGallery } from '@/modules/entry'
import { Button, Callout, keepScroll, Tabs } from '@/ui'
import { SUB_EVENT, type EntrySub } from './entrySub'

type Sub = EntrySub
const SUB_KEY = 'atelier-ui:ui:entry-subtab'
const SUB_LABEL: Record<Sub, string> = { fluxo: 'Como as pessoas entram', landing: 'Landing page', login: 'Login', cadastro: 'Cadastro' }


/** Fluxo equivalente sem landing page (“Não preciso de landing”). */
const WITHOUT_LANDING: Partial<Record<EntryFlow, EntryFlow>> = { 'landing-login': 'login-only', 'landing-only': 'app-direct', institutional: 'app-direct' }

/** Etapa 2 do guiado: fluxo de entrada → landing → login → cadastro, em sub-abas. */
export function EntryStep() {
  const flowId = useProject((p) => p.entry.flow)
  const landingId = useProject((p) => p.entry.landingId)
  const loginId = useProject((p) => p.entry.loginId)
  const signupId = useProject((p) => p.entry.signupId)
  const noSignup = useProject((p) => p.entry.noSignup)
  const flow = ENTRY_FLOWS.find((f) => f.id === flowId)
  const [sub, setSub] = useState<Sub>(() => {
    try {
      return (sessionStorage.getItem(SUB_KEY) as Sub) || 'fluxo'
    } catch {
      return 'fluxo'
    }
  })

  const available: Sub[] = ['fluxo', ...(flow?.needsLanding ? (['landing'] as Sub[]) : []), ...(flow?.needsLogin ? (['login', 'cadastro'] as Sub[]) : [])]
  const current = available.includes(sub) ? sub : 'fluxo'

  useEffect(() => {
    try {
      sessionStorage.setItem(SUB_KEY, current)
    } catch {
      /* sem armazenamento de sessão */
    }
    // No celular as abas podem ficar fora da tela: traz a aba atual para a área visível.
    document.querySelector('.gd-subtabs [aria-selected="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [current])

  useEffect(() => {
    const onSub = (e: Event) => setSub((e as CustomEvent<Sub>).detail)
    window.addEventListener(SUB_EVENT, onSub)
    return () => window.removeEventListener(SUB_EVENT, onSub)
  }, [])

  const done: Record<Sub, boolean> = { fluxo: Boolean(flow), landing: Boolean(landingId), login: Boolean(loginId), cadastro: Boolean(signupId) || noSignup }
  const position = available.indexOf(current)
  const nextSub = available.slice(position + 1).find((s) => !done[s]) ?? available[position + 1]

  const icon = (done: boolean) => (done ? <CheckCircle2 style={{ color: 'var(--s-success)' }} /> : <Circle />)
  const tabs = [
    { value: 'fluxo' as Sub, label: 'Como as pessoas entram', icon: icon(Boolean(flow)) },
    ...(flow?.needsLanding ? [{ value: 'landing' as Sub, label: 'Landing page', icon: icon(Boolean(landingId)) }] : []),
    ...(flow?.needsLogin
      ? [
          { value: 'login' as Sub, label: 'Login', icon: icon(Boolean(loginId)) },
          { value: 'cadastro' as Sub, label: 'Cadastro', icon: icon(Boolean(signupId) || noSignup) },
        ]
      : []),
  ]

  return (
    <div>
      <div className="gd-subtabs">
        <Tabs label="Partes da etapa de entrada" value={current} onChange={setSub} tabs={tabs} />
        <div className="gd-subnext" aria-live="polite">
          <span>
            Parte {position + 1} de {available.length}
            {available.length > 1 && ` · ${available.filter((s) => done[s]).length} concluída(s)`}
          </span>
          {done[current] && nextSub && (
            <Button size="sm" variant="soft" iconRight={<ArrowRight />} onClick={() => setSub(nextSub)} data-testid="entry-next-part">
              Próxima parte: {SUB_LABEL[nextSub]}
            </Button>
          )}
        </div>
      </div>
      {current === 'fluxo' && (
        <div className="u-stack">
          <EntryFlowPicker />
          {flow && (
            <Callout tone="success" title="Pronto.">
              {flow.needsLanding || flow.needsLogin
                ? `Agora escolha ${[flow.needsLanding && 'a landing page', flow.needsLogin && 'o login e o cadastro'].filter(Boolean).join(' e ')} nas abas acima.`
                : 'Este fluxo não tem landing nem login. Pode seguir para a próxima etapa.'}
            </Callout>
          )}
        </div>
      )}
      {current === 'landing' && flow && WITHOUT_LANDING[flow.id] && (
        <div className="gd-skip">
          <span>Não precisa de uma página de apresentação?</span>
          <Button size="sm" variant="ghost" onClick={() => keepScroll(() => studio().setEntryFlow(WITHOUT_LANDING[flow.id]!))} data-testid="entry-no-landing">
            Não preciso de landing
          </Button>
        </div>
      )}
      {current === 'landing' && <LandingGallery guided />}
      {current === 'login' && <LoginGallery guided />}
      {current === 'cadastro' && <SignupGallery guided />}
    </div>
  )
}
