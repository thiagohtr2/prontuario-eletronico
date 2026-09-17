import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Field'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { createClinic, errorMessage, updateClinic } from '../lib/api'
import { formatPhone } from '../lib/format'
import type { Clinic } from '../lib/types'

const emptyForm = { nome: '', endereco: '', telefone: '', observacoes: '' }

export function ClinicForm({
  open,
  clinic,
  onClose,
  onSaved,
}: {
  open: boolean
  clinic?: Clinic | null
  onClose: () => void
  onSaved: (clinic: Clinic) => void
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
      clinic
        ? {
            nome: clinic.nome ?? '',
            endereco: clinic.endereco ?? '',
            telefone: clinic.telefone ?? '',
            observacoes: clinic.observacoes ?? '',
          }
        : emptyForm,
    )
  }, [open, clinic])

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!session?.user) return
    if (!form.nome.trim()) {
      setError('Informe o nome da clínica.')
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      nome: form.nome.trim(),
      endereco: form.endereco.trim() || null,
      telefone: form.telefone.trim() || null,
      observacoes: form.observacoes.trim() || null,
    }
    try {
      const saved = clinic
        ? await updateClinic(clinic.id, payload)
        : await createClinic(payload, session.user.id)
      toast.success(clinic ? 'Clínica atualizada.' : 'Clínica cadastrada.')
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
      title={clinic ? 'Editar clínica' : 'Cadastrar clínica'}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" form="clinic-form" type="submit" loading={saving}>
            {clinic ? 'Salvar alterações' : 'Cadastrar clínica'}
          </Button>
        </>
      }
    >
      <form id="clinic-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Nome da clínica"
          required
          value={form.nome}
          onChange={(event) => update('nome', event.target.value)}
          placeholder="Clínica Itaigara"
        />
        <Input
          label="Endereço"
          value={form.endereco}
          onChange={(event) => update('endereco', event.target.value)}
          placeholder="Rua Altino Seberto de Barros, 120 — Salvador/BA"
        />
        <Input
          label="Telefone"
          inputMode="tel"
          value={formatPhone(form.telefone)}
          onChange={(event) => update('telefone', event.target.value.replace(/\D/g, ''))}
          placeholder="(71) 3333-0000"
        />
        <Textarea
          label="Observações"
          rows={3}
          value={form.observacoes}
          onChange={(event) => update('observacoes', event.target.value)}
          placeholder="Dias de atendimento, sala, recepção..."
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
