import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { LogOut, Save } from 'lucide-react'
import { PageBody, PageHeader } from '../components/PageHeader'
import { Card, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Field'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { errorMessage } from '../lib/api'
import { supabase } from '../lib/supabase'
import { formatPhone } from '../lib/format'

export function SettingsPage() {
  const { doctor, session, refreshDoctor, signOut } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ nome: '', especialidade: '', crm: '', telefone: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!doctor) return
    setForm({
      nome: doctor.nome ?? '',
      especialidade: doctor.especialidade ?? '',
      crm: doctor.crm ?? '',
      telefone: doctor.telefone ?? '',
    })
  }, [doctor])

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!session?.user) return
    setSaving(true)
    setError(null)
    try {
      const { error: updateError } = await supabase
        .from('doctors')
        .update({
          nome: form.nome.trim(),
          especialidade: form.especialidade.trim(),
          crm: form.crm.trim(),
          telefone: form.telefone.trim() || null,
        })
        .eq('id', session.user.id)
      if (updateError) throw new Error(updateError.message)
      await refreshDoctor()
      toast.success('Perfil atualizado.')
    } catch (caught) {
      const message = errorMessage(caught, 'Não foi possível salvar. Tente novamente.')
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader title="Configurações" description="Seus dados de identificação no sistema." />

      <PageBody className="max-w-2xl space-y-6">
        <Card>
          <CardHeader title="Perfil do médico" description="Aparece no menu e identifica sua conta." />
          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            <Input
              label="Nome completo"
              value={form.nome}
              onChange={(event) => update('nome', event.target.value)}
              placeholder="Dra. Ana Souza"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Especialidade"
                value={form.especialidade}
                onChange={(event) => update('especialidade', event.target.value)}
                placeholder="Ginecologia"
              />
              <Input
                label="CRM"
                value={form.crm}
                onChange={(event) => update('crm', event.target.value)}
                placeholder="12345-BA"
              />
            </div>
            <Input
              label="Telefone"
              inputMode="tel"
              value={formatPhone(form.telefone)}
              onChange={(event) => update('telefone', event.target.value.replace(/\D/g, ''))}
              placeholder="(71) 99999-0000"
            />
            <Input label="E-mail" value={session?.user.email ?? ''} disabled hint="O e-mail de acesso não pode ser alterado aqui." />

            {error && (
              <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-danger" role="alert">
                {error}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <Button variant="primary" type="submit" loading={saving} icon={<Save size={18} />}>
                Salvar alterações
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <CardHeader title="Sessão" description="Encerre o acesso neste dispositivo." />
          <div className="mt-4">
            <Button variant="secondary" icon={<LogOut size={18} />} onClick={() => void signOut()}>
              Sair da conta
            </Button>
          </div>
        </Card>
      </PageBody>
    </>
  )
}
