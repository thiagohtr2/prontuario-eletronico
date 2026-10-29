import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Input, Textarea, FormError } from '../components/ui/Field'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { createClinic, errorMessage, updateClinic } from '../lib/api'
import { formatCNPJ, formatPhone } from '../lib/format'
import type { Clinic } from '../lib/types'

const emptyForm = { nome: '', endereco: '', cidade: '', telefone: '', cnpj: '', observacoes: '' }

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
            cidade: clinic.cidade ?? '',
            telefone: clinic.telefone ?? '',
            cnpj: clinic.cnpj ?? '',
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
      cidade: form.cidade.trim() || null,
      telefone: form.telefone.trim() || null,
      cnpj: form.cnpj.trim() || null,
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
      <form id="clinic-form" onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
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
          placeholder="Rua Altino Seberto de Barros, 120, sala 804"
          hint="Sai no rodapé das receitas emitidas nesta clínica."
        />
        <Input
          label="Cidade"
          value={form.cidade}
          onChange={(event) => update('cidade', event.target.value)}
          placeholder="Salvador"
          autoComplete="address-level2"
          hint="Usada na data da receita: Salvador, 29 de outubro de 2026."
        />
        <Input
          label="Telefone"
          inputMode="tel"
          value={formatPhone(form.telefone)}
          onChange={(event) => update('telefone', event.target.value.replace(/\D/g, ''))}
          placeholder="(71) 3333-0000"
        />
        <Input
          label="CNPJ"
          inputMode="numeric"
          value={formatCNPJ(form.cnpj)}
          onChange={(event) => update('cnpj', event.target.value.replace(/\D/g, '').slice(0, 14))}
          placeholder="00.000.000/0000-00"
          hint="Opcional."
        />
        <Textarea
          label="Observações"
          rows={3}
          value={form.observacoes}
          onChange={(event) => update('observacoes', event.target.value)}
          placeholder="Dias de atendimento, sala, recepção..."
        />
        {error && (
          <FormError>{error}</FormError>
        )}
      </form>
    </Modal>
  )
}
