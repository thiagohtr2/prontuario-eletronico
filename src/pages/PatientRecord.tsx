import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  Cake,
  ClipboardList,
  FileText,
  IdCard,
  Mail,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { PageBody, PageHeader } from '../components/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States'
import { TimelineItem } from '../components/TimelineItem'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PatientForm } from '../forms/PatientForm'
import { useToast } from '../context/ToastContext'
import {
  deleteEncounter,
  deletePatient,
  errorMessage,
  getPatient,
  listPatientEncounters,
} from '../lib/api'
import { formatAge, formatCPF, formatDate, formatPhone, initials } from '../lib/format'
import type { EncounterWithRefs, Patient } from '../lib/types'

export function PatientRecordPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const [patient, setPatient] = useState<Patient | null>(null)
  const [encounters, setEncounters] = useState<EncounterWithRefs[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [encounterToDelete, setEncounterToDelete] = useState<EncounterWithRefs | null>(null)
  const [patientDeleteOpen, setPatientDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const [patientData, encounterList] = await Promise.all([getPatient(id), listPatientEncounters(id)])
      setPatient(patientData)
      setEncounters(encounterList)
      if (!patientData) setError('Paciente não encontrado.')
    } catch (caught) {
      setError(errorMessage(caught))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  async function handleDeleteEncounter() {
    if (!encounterToDelete) return
    setDeleting(true)
    try {
      await deleteEncounter(encounterToDelete.id)
      setEncounters((current) => current.filter((item) => item.id !== encounterToDelete.id))
      toast.success('Atendimento excluído.')
      setEncounterToDelete(null)
    } catch (caught) {
      toast.error(errorMessage(caught, 'Não foi possível excluir. Tente novamente.'))
    } finally {
      setDeleting(false)
    }
  }

  async function handleDeletePatient() {
    if (!patient) return
    setDeleting(true)
    try {
      await deletePatient(patient.id)
      toast.success('Paciente excluído.')
      navigate('/pacientes')
    } catch (caught) {
      toast.error(errorMessage(caught, 'Não foi possível excluir. Tente novamente.'))
      setDeleting(false)
      setPatientDeleteOpen(false)
    }
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Prontuário" />
        <PageBody>
          <LoadingState label="Carregando prontuário..." />
        </PageBody>
      </>
    )
  }

  if (error || !patient) {
    return (
      <>
        <PageHeader title="Prontuário" />
        <PageBody>
          <Card padded={false}>
            <ErrorState
              message={error ?? 'Paciente não encontrado.'}
              action={
                <Button variant="secondary" onClick={() => navigate('/pacientes')}>
                  Voltar para pacientes
                </Button>
              }
            />
          </Card>
        </PageBody>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={patient.nome}
        description={`${formatAge(patient.data_nascimento)} · ${encounters.length} ${
          encounters.length === 1 ? 'atendimento registrado' : 'atendimentos registrados'
        }`}
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" icon={<ArrowLeft size={18} />} onClick={() => navigate('/pacientes')}>
              Pacientes
            </Button>
            <Button
              variant="primary"
              icon={<Plus size={18} />}
              onClick={() => navigate(`/atendimentos/novo?paciente=${patient.id}`)}
            >
              Nova evolução
            </Button>
          </div>
        }
      />

      <PageBody className="space-y-6">
        <Card>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-soft text-lg font-semibold text-accent">
                {initials(patient.nome)}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold text-ink">{patient.nome}</h2>
                <dl className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                  <Info icon={<Cake size={16} />} label="Nascimento">
                    {formatDate(patient.data_nascimento)}
                    {patient.data_nascimento ? ` (${formatAge(patient.data_nascimento)})` : ''}
                  </Info>
                  <Info icon={<IdCard size={16} />} label="CPF">
                    {patient.cpf ? formatCPF(patient.cpf) : '—'}
                  </Info>
                  <Info icon={<Phone size={16} />} label="Telefone">
                    {patient.telefone ? formatPhone(patient.telefone) : '—'}
                  </Info>
                  <Info icon={<Mail size={16} />} label="E-mail">
                    {patient.email || '—'}
                  </Info>
                  <Info icon={<ShieldCheck size={16} />} label="Convênio">
                    {patient.convenio || '—'}
                  </Info>
                  <Info icon={<FileText size={16} />} label="Sexo">
                    {patient.sexo ? capitalize(patient.sexo) : '—'}
                  </Info>
                </dl>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" size="sm" icon={<Pencil size={16} />} onClick={() => setEditOpen(true)}>
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<Trash2 size={16} />}
                className="hover:text-danger"
                onClick={() => setPatientDeleteOpen(true)}
                aria-label="Excluir paciente"
              >
                <span className="sr-only">Excluir paciente</span>
              </Button>
            </div>
          </div>

          {(patient.alergias || patient.observacoes) && (
            <div className="mt-5 space-y-3 border-t border-line pt-5">
              {patient.alergias && (
                <div className="flex items-start gap-2.5 rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3">
                  <AlertTriangle size={17} className="mt-0.5 shrink-0 text-warning" aria-hidden />
                  <p className="text-sm leading-6 text-ink">
                    <span className="font-semibold">Alergias: </span>
                    {patient.alergias}
                  </p>
                </div>
              )}
              {patient.observacoes && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Observações</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-ink">{patient.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </Card>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-ink">Histórico do paciente</h2>
            {encounters.length > 0 && (
              <Badge>
                {encounters.length} {encounters.length === 1 ? 'atendimento' : 'atendimentos'}
              </Badge>
            )}
          </div>

          {encounters.length === 0 ? (
            <Card padded={false}>
              <EmptyState
                icon={<ClipboardList size={22} />}
                title="Nenhum atendimento registrado"
                description="Registre a primeira evolução deste paciente para começar o histórico."
                action={
                  <Button
                    variant="primary"
                    icon={<Plus size={18} />}
                    onClick={() => navigate(`/atendimentos/novo?paciente=${patient.id}`)}
                  >
                    Nova evolução
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="pt-1">
              {encounters.map((encounter) => (
                <TimelineItem key={encounter.id} encounter={encounter} onDelete={setEncounterToDelete} />
              ))}
            </div>
          )}
        </section>
      </PageBody>

      <PatientForm
        open={editOpen}
        patient={patient}
        onClose={() => setEditOpen(false)}
        onSaved={(saved) => setPatient(saved)}
      />

      <ConfirmDialog
        open={Boolean(encounterToDelete)}
        title="Excluir atendimento"
        message={
          encounterToDelete
            ? `O atendimento de ${formatDate(encounterToDelete.data_hora)} será removido do histórico. Esta ação não pode ser desfeita.`
            : ''
        }
        loading={deleting}
        onConfirm={() => void handleDeleteEncounter()}
        onCancel={() => setEncounterToDelete(null)}
      />

      <ConfirmDialog
        open={patientDeleteOpen}
        title="Excluir paciente"
        message={`Todos os ${encounters.length} atendimentos de ${patient.nome} também serão excluídos. Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir paciente"
        loading={deleting}
        onConfirm={() => void handleDeletePatient()}
        onCancel={() => setPatientDeleteOpen(false)}
      />
    </>
  )
}

function Info({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-xs text-muted">
        <span className="text-slate-400" aria-hidden>
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-sm font-medium text-ink">{children}</dd>
    </div>
  )
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
