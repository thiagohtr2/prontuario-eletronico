import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Calendar, ChevronDown, Clock, FileText, Pencil, Trash2 } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Button, IconButton } from './ui/Button'
import { PrescriptionDialog } from './PrescriptionDialog'
import { useAuth } from '../context/AuthContext'
import { getClinic, getPatient } from '../lib/api'
import { formatDate, formatTime } from '../lib/format'
import { itensPreenchidos, perfilParaReceita, temReceita } from '../lib/prescription/model'
import type { PrescriptionInput } from '../lib/prescription/model'
import type { EncounterWithRefs } from '../lib/types'

type TextKey =
  | 'queixa_principal'
  | 'historia_clinica'
  | 'exame_fisico'
  | 'evolucao'
  | 'diagnostico'
  | 'conduta'
  | 'prescricao'
  | 'exames_solicitados'
  | 'observacoes'

/** Blocos exibidos na ordem clínica de leitura. */
const sections: Array<{ key: TextKey; label: string }> = [
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
  const [prescriptionOpen, setPrescriptionOpen] = useState(false)
  const navigate = useNavigate()
  const { doctor, session } = useAuth()

  const itens = itensPreenchidos(encounter.prescricao_itens)
  const hasPrescription = temReceita(itens, encounter.prescricao)

  // A receita entra no lugar da antiga "Prescrição": primeiro os medicamentos,
  // depois as orientações. Atendimentos antigos têm só o texto.
  const filled: Array<{ id: string; label: string; content: ReactNode }> = []
  for (const { key, label } of sections) {
    const value = encounter[key]?.trim()
    if (key === 'prescricao' && itens.length > 0) {
      filled.push({
        id: 'prescricao_itens',
        label: 'Prescrição',
        content: (
          <ol className="mt-2 flex flex-col gap-3">
            {itens.map((item, index) => (
              <li key={item.id} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-primary-soft text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <span className="min-w-0 text-sm leading-6 text-ink">
                  <span className="font-semibold">{item.medicamento}</span>
                  {item.quantidade ? <span className="text-muted"> · {item.quantidade}</span> : null}
                  {item.via ? <span className="text-muted"> · {item.via}</span> : null}
                  {item.posologia ? <span className="block whitespace-pre-wrap text-muted">{item.posologia}</span> : null}
                </span>
              </li>
            ))}
          </ol>
        ),
      })
      if (value) filled.push({ id: key, label: 'Orientações da receita', content: <Paragraph text={value} /> })
      continue
    }
    if (value) filled.push({ id: key, label, content: <Paragraph text={value} /> })
  }

  const visible = expanded ? filled : filled.slice(0, PREVIEW_COUNT)
  const hidden = filled.length - visible.length

  async function prescriptionInput(): Promise<PrescriptionInput> {
    const [patient, clinic] = await Promise.all([
      getPatient(encounter.patient_id),
      encounter.clinic_id ? getClinic(encounter.clinic_id) : Promise.resolve(null),
    ])
    return {
      doctor: perfilParaReceita(doctor, session?.user.email ?? ''),
      clinic,
      patient: { nome: patient?.nome ?? encounter.patient?.nome ?? 'Paciente', data_nascimento: patient?.data_nascimento ?? null },
      dataHora: encounter.data_hora,
      itens,
      orientacoes: encounter.prescricao ?? '',
    }
  }

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

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {hasPrescription && (
              <Button
                variant="secondary"
                size="sm"
                icon={<FileText size={16} />}
                onClick={() => setPrescriptionOpen(true)}
              >
                Receita
              </Button>
            )}
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
            visible.map(({ id, label, content }) => (
              <section key={id}>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</h4>
                {content}
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

      {hasPrescription && (
        <PrescriptionDialog
          open={prescriptionOpen}
          onClose={() => setPrescriptionOpen(false)}
          getInput={prescriptionInput}
        />
      )}
    </article>
  )
}

function Paragraph({ text }: { text: string }) {
  return <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-ink">{text}</p>
}
