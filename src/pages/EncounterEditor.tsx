import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Plus, Save } from 'lucide-react'
import { PageBody, PageHeader } from '../components/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, Select, Textarea } from '../components/ui/Field'
import { LoadingState } from '../components/ui/States'
import { ClinicForm } from '../forms/ClinicForm'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  createEncounter,
  errorMessage,
  listClinics,
  listPatients,
  getEncounter,
  updateEncounter,
} from '../lib/api'
import { formatDateTime, toDatetimeLocal } from '../lib/format'
import { TIPOS_ATENDIMENTO } from '../lib/types'
import type { Clinic, Patient } from '../lib/types'

type FormState = {
  patient_id: string
  clinic_id: string
  data_hora: string
  tipo_atendimento: string
  queixa_principal: string
  historia_clinica: string
  exame_fisico: string
  evolucao: string
  diagnostico: string
  conduta: string
  prescricao: string
  exames_solicitados: string
  observacoes: string
}

const emptyForm: FormState = {
  patient_id: '',
  clinic_id: '',
  data_hora: toDatetimeLocal(),
  tipo_atendimento: '',
  queixa_principal: '',
  historia_clinica: '',
  exame_fisico: '',
  evolucao: '',
  diagnostico: '',
  conduta: '',
  prescricao: '',
  exames_solicitados: '',
  observacoes: '',
}

export function EncounterEditorPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { session } = useAuth()
  const toast = useToast()
  const isEditing = Boolean(id)

  const [form, setForm] = useState<FormState>(emptyForm)
  const [patients, setPatients] = useState<Patient[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clinicModalOpen, setClinicModalOpen] = useState(false)

  const preselectedPatient = searchParams.get('paciente') ?? ''

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const [patientList, clinicList] = await Promise.all([listPatients(), listClinics()])
        if (!active) return
        setPatients(patientList)
        setClinics(clinicList)

        if (isEditing && id) {
          const found = await getEncounter(id)
          if (!active) return
          if (!found) {
            setError('Atendimento não encontrado.')
          } else {
            setForm({
              patient_id: found.patient_id,
              clinic_id: found.clinic_id ?? '',
              data_hora: toDatetimeLocal(found.data_hora),
              tipo_atendimento: found.tipo_atendimento ?? '',
              queixa_principal: found.queixa_principal ?? '',
              historia_clinica: found.historia_clinica ?? '',
              exame_fisico: found.exame_fisico ?? '',
              evolucao: found.evolucao ?? '',
              diagnostico: found.diagnostico ?? '',
              conduta: found.conduta ?? '',
              prescricao: found.prescricao ?? '',
              exames_solicitados: found.exames_solicitados ?? '',
              observacoes: found.observacoes ?? '',
            })
          }
        } else {
          setForm((current) => ({
            ...current,
            data_hora: toDatetimeLocal(),
            patient_id: preselectedPatient || current.patient_id,
            clinic_id: clinicList.length === 1 ? clinicList[0].id : current.clinic_id,
          }))
        }
      } catch (caught) {
        if (active) setError(errorMessage(caught))
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === form.patient_id) ?? null,
    [patients, form.patient_id],
  )

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!session?.user) return
    if (!form.patient_id) {
      setError('Selecione o paciente do atendimento.')
      return
    }
    if (!form.data_hora) {
      setError('Informe a data e o horário da consulta.')
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      patient_id: form.patient_id,
      clinic_id: form.clinic_id || null,
      data_hora: new Date(form.data_hora).toISOString(),
      tipo_atendimento: form.tipo_atendimento.trim() || null,
      queixa_principal: form.queixa_principal.trim() || null,
      historia_clinica: form.historia_clinica.trim() || null,
      exame_fisico: form.exame_fisico.trim() || null,
      evolucao: form.evolucao.trim() || null,
      diagnostico: form.diagnostico.trim() || null,
      conduta: form.conduta.trim() || null,
      prescricao: form.prescricao.trim() || null,
      exames_solicitados: form.exames_solicitados.trim() || null,
      observacoes: form.observacoes.trim() || null,
    }
    try {
      if (isEditing && id) {
        await updateEncounter(id, payload)
        toast.success('Evolução atualizada.')
      } else {
        await createEncounter(payload, session.user.id)
        toast.success('Evolução salva com sucesso.')
      }
      navigate(`/pacientes/${form.patient_id}`)
    } catch (caught) {
      const message = errorMessage(caught, 'Não foi possível salvar. Tente novamente.')
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const backTo = form.patient_id ? `/pacientes/${form.patient_id}` : '/atendimentos'

  return (
    <>
      <PageHeader
        title={isEditing ? 'Editar atendimento' : 'Nova evolução'}
        description={
          selectedPatient ? selectedPatient.nome : 'Registre o atendimento e a evolução clínica do paciente.'
        }
        action={
          <Button variant="ghost" icon={<ArrowLeft size={18} />} onClick={() => navigate(backTo)}>
            Voltar
          </Button>
        }
      />

      <PageBody className="max-w-4xl">
        {loading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <Card className="space-y-4">
              <h2 className="text-md font-semibold text-ink">Dados do atendimento</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Paciente"
                  required
                  value={form.patient_id}
                  onChange={(event) => update('patient_id', event.target.value)}
                  disabled={isEditing}
                  hint={
                    patients.length === 0
                      ? 'Nenhum paciente cadastrado ainda.'
                      : undefined
                  }
                >
                  <option value="">Selecione o paciente</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.nome}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Data e horário"
                  type="datetime-local"
                  required
                  value={form.data_hora}
                  onChange={(event) => update('data_hora', event.target.value)}
                  hint={form.data_hora ? formatDateTime(new Date(form.data_hora).toISOString()) : undefined}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Select
                    label="Clínica"
                    value={form.clinic_id}
                    onChange={(event) => update('clinic_id', event.target.value)}
                  >
                    <option value="">Selecione a clínica</option>
                    {clinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.nome}
                      </option>
                    ))}
                  </Select>
                  <button
                    type="button"
                    onClick={() => setClinicModalOpen(true)}
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                  >
                    <Plus size={14} aria-hidden />
                    Cadastrar nova clínica
                  </button>
                </div>
                <Select
                  label="Tipo de atendimento"
                  value={form.tipo_atendimento}
                  onChange={(event) => update('tipo_atendimento', event.target.value)}
                >
                  <option value="">Não informado</option>
                  {TIPOS_ATENDIMENTO.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </Select>
              </div>
            </Card>

            <Card className="space-y-4">
              <h2 className="text-md font-semibold text-ink">Avaliação</h2>
              <Textarea
                label="Queixa principal"
                rows={2}
                value={form.queixa_principal}
                onChange={(event) => update('queixa_principal', event.target.value)}
                placeholder="Motivo da consulta relatado pelo paciente..."
              />
              <Textarea
                label="História clínica"
                rows={3}
                value={form.historia_clinica}
                onChange={(event) => update('historia_clinica', event.target.value)}
                placeholder="História da doença atual, antecedentes relevantes..."
              />
              <Textarea
                label="Exame físico"
                rows={3}
                value={form.exame_fisico}
                onChange={(event) => update('exame_fisico', event.target.value)}
                placeholder="Sinais vitais e achados do exame físico..."
              />
              <Textarea
                label="Evolução"
                rows={6}
                value={form.evolucao}
                onChange={(event) => update('evolucao', event.target.value)}
                placeholder="Descreva a evolução clínica do paciente..."
              />
            </Card>

            <Card className="space-y-4">
              <h2 className="text-md font-semibold text-ink">Diagnóstico e condutas</h2>
              <Textarea
                label="Diagnóstico"
                rows={2}
                value={form.diagnostico}
                onChange={(event) => update('diagnostico', event.target.value)}
                placeholder="Hipótese diagnóstica ou CID..."
              />
              <Textarea
                label="Conduta"
                rows={3}
                value={form.conduta}
                onChange={(event) => update('conduta', event.target.value)}
                placeholder="Orientações e conduta definida na consulta..."
              />
              <Textarea
                label="Prescrição"
                rows={4}
                value={form.prescricao}
                onChange={(event) => update('prescricao', event.target.value)}
                placeholder="Medicamentos, doses e duração do tratamento..."
              />
              <Textarea
                label="Solicitação de exames"
                rows={3}
                value={form.exames_solicitados}
                onChange={(event) => update('exames_solicitados', event.target.value)}
                placeholder="Exames solicitados nesta consulta..."
              />
              <Textarea
                label="Observações"
                rows={3}
                value={form.observacoes}
                onChange={(event) => update('observacoes', event.target.value)}
                placeholder="Outras informações relevantes..."
              />
            </Card>

            {error && (
              <p
                className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-danger"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" type="button" onClick={() => navigate(backTo)} disabled={saving}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" loading={saving} icon={<Save size={18} />}>
                {isEditing ? 'Salvar alterações' : 'Salvar evolução'}
              </Button>
            </div>

            {patients.length === 0 && (
              <p className="text-center text-sm text-muted">
                Você ainda não tem pacientes.{' '}
                <Link to="/pacientes" className="font-medium text-accent hover:underline">
                  Cadastrar primeiro paciente
                </Link>
              </p>
            )}
          </form>
        )}
      </PageBody>

      <ClinicForm
        open={clinicModalOpen}
        onClose={() => setClinicModalOpen(false)}
        onSaved={(clinic) => {
          setClinics((current) => [...current, clinic].sort((a, b) => a.nome.localeCompare(b.nome)))
          update('clinic_id', clinic.id)
        }}
      />
    </>
  )
}
