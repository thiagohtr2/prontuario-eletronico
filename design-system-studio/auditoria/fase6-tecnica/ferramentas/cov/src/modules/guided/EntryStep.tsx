import { useEffect, useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import { ENTRY_FLOWS } from '@/core/project'
import { useProject } from '@/core/store'
import { EntryFlowPicker, LandingGallery, LoginGallery, SignupGallery } from '@/modules/entry'
import { Callout, Tabs } from '@/ui'

type Sub = 'fluxo' | 'landing' | 'login' | 'cadastro'
const SUB_KEY = 'atelier-ui:ui:entry-subtab'

/** Etapa 2 do guiado: fluxo de entrada → landing → login → cadastro, em sub-abas. */
export function EntryStep() {
  const flowId = useProject((p) => p.entry.flow)
  const landingId = useProject((p) => p.entry.landingId)
  const loginId = useProject((p) => p.entry.loginId)
  const signupId = useProject((p) => p.entry.signupId)
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
  }, [current])

  const icon = (done: boolean) => (done ? <CheckCircle2 style={{ color: 'var(--s-success)' }} /> : <Circle />)
  const tabs = [
    { value: 'fluxo' as Sub, label: 'Como as pessoas entram', icon: icon(Boolean(flow)) },
    ...(flow?.needsLanding ? [{ value: 'landing' as Sub, label: 'Landing page', icon: icon(Boolean(landingId)) }] : []),
    ...(flow?.needsLogin
      ? [
          { value: 'login' as Sub, label: 'Login', icon: icon(Boolean(loginId)) },
          { value: 'cadastro' as Sub, label: 'Cadastro', icon: icon(Boolean(signupId)) },
        ]
      : []),
  ]

  return (
    <div>
      <div className="gd-subtabs">
        <Tabs label="Partes da etapa de entrada" value={current} onChange={setSub} tabs={tabs} />
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
      {current === 'landing' && <LandingGallery guided />}
      {current === 'login' && <LoginGallery guided />}
      {current === 'cadastro' && <SignupGallery guided />}
    </div>
  )
}
