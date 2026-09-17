import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Input, Select, Textarea } from '../components/ui/Field'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { createPatient, errorMessage, updatePatient } from '../lib/api'
import { formatCPF, formatPhone } from '../lib/format'
import type { Patient } from '../lib/types'

const emptyForm = {
  nome: '',
  cpf: '',
  data_nascimento: '',
  sexo: '',
  telefone: '',
  email: '',
  convenio: '',
  alergias: '',
  observacoes: '',
}

export function PatientForm({
  open,
  patient,
  onClose,
  onSaved,
}: {
  open: boolean
  patient?: Patient | null
  onClose: () => void
  onSaved: (patient: Patient) => void
}) {
  const { session } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setError(null)
    setForm(
      patient
        ? {
            nome: patient.nome ?? '',
            cpf: patient.cpf ?? '',
            data_nascimento: patient.data_nascimento ?? '',
            sexo: patient.sexo ?? '',
            telefone: patient.telefone ?? '',
            email: patient.email ?? '',
            convenio: patient.convenio ?? '',
            alergias: patient.alergias ?? '',
            observacoes: patient.observacoes ?? '',
          }
        : emptyForm,
    )
  }, [open, patient])

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!session?.user) return
    if (!form.nome.trim()) {
      setError('Informe o nome do paciente.')
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      nome: form.nome.trim(),
      cpf: form.cpf.trim() || null,
      data_nascimento: form.data_nascimento || null,
      sexo: (form.sexo || null) as Patient['sexo'],
      telefone: form.telefone.trim() || null,
      email: form.email.trim() || null,
      convenio: form.convenio.trim() || null,
      alergias: form.alergias.trim() || null,
      observacoes: form.observacoes.trim() || null,
    }
    try {
      const saved = patient
        ? await updatePatient(patient.id, payload)
        : await createPatient(payload, session.user.id)
      toast.success(patient ? 'Paciente atualizado.' : 'Paciente cadastrado.')
      onSaved(saved)
      onClose()
    } catch (caught) {
      const message = errorMessage(caught, 'Não foi possível salvar. Tente novamente.')
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={patient ? 'Editar paciente' : 'Cadastrar paciente'}
      description={patient ? undefined : 'Apenas o nome é obrigatório. Os demais dados podem ser completados depois.'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" form="patient-form" type="submit" loading={saving}>
            {patient ? 'Salvar alterações' : 'Cadastrar paciente'}
          </Button>
        </>
      }
    >
      <form id="patient-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Nome completo"
          required
          value={form.nome}
          onChange={(event) => update('nome', event.target.value)}
          placeholder="Maria Oliveira Santos"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="CPF"
            inputMode="numeric"
            value={formatCPF(form.cpf)}
            onChange={(event) => update('cpf', event.target.value.replace(/\D/g, ''))}
            placeholder="000.000.000-00"
          />
          <Input
            label="Data de nascimento"
            type="date"
            value={form.data_nascimento}
            onChange={(event) => update('data_nascimento', event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Sexo" value={form.sexo} onChange={(event) => update('sexo', event.target.value)}>
            <option value="">Não informado</option>
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
            <option value="outro">Outro</option>
          </Select>
          <Input
            label="Telefone"
            inputMode="tel"
            value={formatPhone(form.telefone)}
            onChange={(event) => update('telefone', event.target.value.replace(/\D/g, ''))}
            placeholder="(71) 99999-0000"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="E-mail"
            type="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            placeholder="paciente@email.com"
          />
          <Input
            label="Convênio"
            value={form.convenio}
            onChange={(event) => update('convenio', event.target.value)}
            placeholder="Particular, Unimed..."
          />
        </div>
        <Textarea
          label="Alergias"
          rows={2}
          value={form.alergias}
          onChange={(event) => update('alergias', event.target.value)}
          placeholder="Ex.: dipirona, penicilina"
        />
        <Textarea
          label="Observações"
          rows={3}
          value={form.observacoes}
          onChange={(event) => update('observacoes', event.target.value)}
          placeholder="Informações relevantes sobre o paciente"
        />
        {error && (
          <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
      </form>
    </Modal>
  )
}
