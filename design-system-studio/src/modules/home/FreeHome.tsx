import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle } from 'lucide-react'
import { useStudio } from '@/core/store'
import { MODULE_GROUPS } from '@/shell/nav'
import { PageHeader } from '@/ui'
import { moduleStatus } from './status'
import './home.css'

export default function FreeHome() {
  const project = useStudio((s) => s.project)
  const setMode = useStudio((s) => s.setMode)
  // Abrir #/livre pela URL também troca o seletor de modo (UX-43).
  useEffect(() => {
    if (project.mode !== 'free') setMode('free')
  }, [project.mode, setMode])
  const status = moduleStatus(project)
  return (
    <div className="ui-page">
      <PageHeader
        eyebrow="Modo livre"
        title="Todos os módulos"
        description="Acesse qualquer parte do Studio diretamente. As escolhas são as mesmas do modo guiado e chegam ao Master Prompt."
      />
      {MODULE_GROUPS.map((g) => (
        <section key={g.id} className="free-group" aria-labelledby={`free-${g.id}`}>
          <h2 id={`free-${g.id}`}>{g.label}</h2>
          <div className="ui-grid" style={{ ['--min' as string]: '300px' }}>
            {g.entries.map((e) => {
              const Icon = e.icon
              const st = status[e.id]
              return (
                <Link key={e.id} to={e.path} className="free-card" data-testid={`module-${e.id}`}>
                  <span className="free-card__icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span className="free-card__title">{e.label}</span>
                    <br />
                    <span className="free-card__desc">{e.description}</span>
                    {st && (
                      <span className="free-card__status" data-done={st.done}>
                        {st.done ? <CheckCircle2 aria-hidden="true" /> : <Circle aria-hidden="true" />}
                        <span className="u-truncate">{st.text}</span>
                      </span>
                    )}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
