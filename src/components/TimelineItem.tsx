import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Calendar, ChevronDown, Clock, Pencil, Trash2 } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Button, IconButton } from './ui/Button'
import { formatDate, formatTime } from '../lib/format'
import type { EncounterWithRefs } from '../lib/types'

/** Blocos exibidos na ordem clínica de leitura. */
const sections: Array<{ key: keyof EncounterWithRefs; label: string }> = [
  { key: 'queixa_principal', label: 'Queixa principal' },
  { key: 'historia_clinica', label: 'História clínica' },
  { key: 'exame_fisico', label: 'Exame físico' },
  { key: 'evolucao', label: 'Evolução' },
  { key: 'diagnostico', label: 'Diagnóstico' },
  { key: 'conduta', label: 'Conduta' },
  { key: 'prescricao', label: 'Prescrição' },
  { key: 'exames_solicitados', label: 'Exames solicitados' },
  { key: 'observacoes', label: 'Observações' },
]

/** Quantidade de blocos mostrados antes de "Ver atendimento completo". */
const PREVIEW_COUNT = 4

export function TimelineItem({
  encounter,
  onDelete,
  showPatient,
}: {
  encounter: EncounterWithRefs
  onDelete?: (encounter: EncounterWithRefs) => void
  showPatient?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  const filled = sections.filter(({ key }) => {
    const value = encounter[key]
    return typeof value === 'string' && value.trim().length > 0
  })
  const visible = expanded ? filled : filled.slice(0, PREVIEW_COUNT)
  const hidden = filled.length - visible.length

  return (
    <article className="relative pl-6 sm:pl-8">
      <span className="absolute left-0 top-0 h-full w-px bg-line" aria-hidden />
      <span
        className="absolute -left-[5px] top-6 h-[11px] w-[11px] rounded-full border-2 border-surface bg-primary"
        aria-hidden
      />

      <div className="mb-4 rounded-card border border-line bg-surface shadow-card">
        <header className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-md font-semibold text-ink">
                <Calendar size={17} className="text-muted" aria-hidden />
                {formatDate(encounter.data_hora)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                <Clock size={16} aria-hidden />
                {formatTime(encounter.data_hora)}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge tone="accent" icon={<Building2 size={13} aria-hidden />}>
                {encounter.clinic?.nome ?? 'Clínica não informada'}
              </Badge>
              {encounter.tipo_atendimento && <Badge>{encounter.tipo_atendimento}</Badge>}
              {showPatient && encounter.patient && (
                <Link
                  to={`/pacientes/${encounter.patient.id}`}
                  className="inline-flex min-h-touch items-center rounded-pill px-2 text-sm font-medium text-primary hover:bg-primary-soft"
                >
                  {encounter.patient.nome}
                </Link>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<Pencil size={16} />}
              className="px-4"
              aria-label="Editar atendimento"
              onClick={() => navigate(`/atendimentos/${encounter.id}/editar`)}
            >
              <span className="hidden sm:inline">Editar</span>
            </Button>
            {onDelete && (
              <IconButton
                variant="danger"
                label="Excluir atendimento"
                icon={<Trash2 size={17} />}
                onClick={() => onDelete(encounter)}
              />
            )}
          </div>
        </header>

        <div className="flex flex-col gap-4 px-5 py-4">
          {filled.length === 0 ? (
            <p className="text-sm text-muted">Nenhuma informação registrada neste atendimento.</p>
          ) : (
            visible.map(({ key, label }) => (
              <section key={String(key)}>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</h4>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-ink">
                  {String(encounter[key])}
                </p>
              </section>
            ))
          )}

          {hidden > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="-ml-3 inline-flex min-h-touch items-center gap-2 rounded-pill px-3 text-sm font-medium text-primary hover:bg-primary-soft"
            >
              Ver atendimento completo
              <ChevronDown size={16} aria-hidden />
            </button>
          )}
          {expanded && filled.length > PREVIEW_COUNT && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="-ml-3 inline-flex min-h-touch items-center gap-2 rounded-pill px-3 text-sm font-medium text-muted hover:bg-surface-hover hover:text-ink"
            >
              Recolher
              <ChevronDown size={16} className="rotate-180" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
