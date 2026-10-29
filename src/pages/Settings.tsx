import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Check, FileText, ImagePlus, LogOut, Save, Trash2 } from 'lucide-react'
import { PageBody, PageHeader } from '../components/PageHeader'
import { Card, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, Textarea, FormError } from '../components/ui/Field'
import { PrescriptionDialog } from '../components/PrescriptionDialog'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { errorMessage, listClinics } from '../lib/api'
import { supabase } from '../lib/supabase'
import { formatPhone } from '../lib/format'
import { cn } from '../lib/cn'
import {
  CORES_RECEITUARIO,
  formatarInstagram,
  iniciaisDaProfissional,
  novoItem,
  PAPEIS,
} from '../lib/prescription/model'
import type { PrescriptionInput } from '../lib/prescription/model'
import { prepararLogo } from '../lib/prescription/logo'
import type { CorReceituario, PapelReceituario } from '../lib/types'

type FormState = {
  nome: string
  especialidade: string
  crm: string
  rqe: string
  telefone: string
  titulo_profissional: string
  email_contato: string
  instagram: string
  site: string
  endereco_profissional: string
  rodape_receituario: string
  cor_receituario: CorReceituario
  papel_receituario: PapelReceituario
  logo_url: string | null
}

const emptyForm: FormState = {
  nome: '',
  especialidade: '',
  crm: '',
  rqe: '',
  telefone: '',
  titulo_profissional: '',
  email_contato: '',
  instagram: '',
  site: '',
  endereco_profissional: '',
  rodape_receituario: '',
  cor_receituario: 'vinho',
  papel_receituario: 'A4',
  logo_url: null,
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function SettingsPage() {
  const { doctor, session, refreshDoctor, signOut } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [logoBusy, setLogoBusy] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!doctor) return
    setForm({
      nome: doctor.nome ?? '',
      especialidade: doctor.especialidade ?? '',
      crm: doctor.crm ?? '',
      rqe: doctor.rqe ?? '',
      telefone: doctor.telefone ?? '',
      titulo_profissional: doctor.titulo_profissional ?? '',
      email_contato: doctor.email_contato ?? '',
      instagram: doctor.instagram ?? '',
      site: doctor.site ?? '',
      endereco_profissional: doctor.endereco_profissional ?? '',
      rodape_receituario: doctor.rodape_receituario ?? '',
      cor_receituario: doctor.cor_receituario ?? 'vinho',
      papel_receituario: doctor.papel_receituario ?? 'A4',
      logo_url: doctor.logo_url ?? null,
    })
  }, [doctor])

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleLogo(file: File | undefined) {
    if (!file) return
    setLogoError(null)
    setLogoBusy(true)
    try {
      update('logo_url', await prepararLogo(file))
    } catch (caught) {
      setLogoError(errorMessage(caught, 'Não foi possível usar essa imagem.'))
    } finally {
      setLogoBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const text = (value: string) => value.trim() || null

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!session?.user) return
    if (form.email_contato.trim() && !EMAIL_PATTERN.test(form.email_contato.trim())) {
      setEmailError('Confira o e-mail: falta o @ ou o domínio.')
      document.getElementById('email-contato')?.focus()
      return
    }
    setEmailError(null)
    setSaving(true)
    setError(null)
    try {
      const { error: updateError } = await supabase
        .from('doctors')
        .update({
          nome: form.nome.trim(),
          especialidade: form.especialidade.trim(),
          crm: form.crm.trim(),
          rqe: text(form.rqe),
          telefone: text(form.telefone),
          titulo_profissional: text(form.titulo_profissional),
          email_contato: text(form.email_contato),
          instagram: formatarInstagram(form.instagram) || null,
          site: text(form.site),
          endereco_profissional: text(form.endereco_profissional),
          rodape_receituario: text(form.rodape_receituario),
          cor_receituario: form.cor_receituario,
          papel_receituario: form.papel_receituario,
          logo_url: form.logo_url,
        })
        .eq('id', session.user.id)
      if (updateError) throw new Error(updateError.message)
      await refreshDoctor()
      toast.success('Perfil e receituário atualizados.')
    } catch (caught) {
      const message = errorMessage(caught, 'Não foi possível salvar. Tente novamente.')
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  /** Receita de exemplo com o que está na tela, antes mesmo de salvar. */
  async function sampleInput(): Promise<PrescriptionInput> {
    const clinics = await listClinics().catch(() => [])
    return {
      exemplo: true,
      doctor: {
        nome: form.nome.trim() || session?.user.email || '',
        especialidade: form.especialidade,
        titulo_profissional: text(form.titulo_profissional),
        crm: form.crm,
        rqe: text(form.rqe),
        telefone: text(form.telefone),
        email_contato: text(form.email_contato),
        instagram: text(form.instagram),
        site: text(form.site),
        endereco_profissional: text(form.endereco_profissional),
        rodape_receituario: text(form.rodape_receituario),
        cor_receituario: form.cor_receituario,
        papel_receituario: form.papel_receituario,
        logo_url: form.logo_url,
      },
      clinic: clinics[0] ?? {
        nome: 'Clínica de exemplo',
        endereco: 'Rua das Flores, 120, sala 804',
        cidade: 'Salvador',
        telefone: '7133330000',
        cnpj: null,
      },
      patient: { nome: 'Paciente de exemplo', data_nascimento: '1990-05-10' },
      dataHora: new Date().toISOString(),
      itens: [
        {
          ...novoItem('Uso oral'),
          medicamento: 'Medicamento de exemplo 500 mg, comprimido',
          quantidade: '1 caixa',
          posologia: 'Tomar 1 comprimido de 8 em 8 horas, por 7 dias.',
        },
        {
          ...novoItem('Uso tópico'),
          medicamento: 'Creme de exemplo 1%',
          quantidade: '1 bisnaga',
          posologia: 'Aplicar uma fina camada na região, 2 vezes ao dia.',
        },
      ],
      orientacoes: 'Retornar em 30 dias com os exames solicitados.',
    }
  }

  return (
    <>
      <PageHeader
        title="Configurações"
        description="Seus dados profissionais e o receituário que sai nas suas receitas."
      />

      <PageBody className="flex max-w-3xl flex-col gap-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <Card>
            <CardHeader title="Seu perfil profissional" description="Identifica sua conta e assina suas receitas." />
            <div className="mt-5 flex flex-col gap-5">
              <Input
                label="Nome completo"
                autoComplete="name"
                value={form.nome}
                onChange={(event) => update('nome', event.target.value)}
                placeholder="Dra. Ana Souza"
                hint="Como você quer aparecer na receita, com o título."
              />
              <div className="grid gap-5 sm:grid-cols-2">
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
                  placeholder="123456-BA"
                  hint="Número e UF."
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="RQE"
                  inputMode="numeric"
                  value={form.rqe}
                  onChange={(event) => update('rqe', event.target.value)}
                  placeholder="12345"
                  hint="Registro de especialista, se tiver."
                />
                <Input
                  label="Telefone ou WhatsApp"
                  inputMode="tel"
                  autoComplete="tel"
                  value={formatPhone(form.telefone)}
                  onChange={(event) => update('telefone', event.target.value.replace(/\D/g, ''))}
                  placeholder="(71) 99999-0000"
                />
              </div>
              <Input
                label="E-mail de acesso"
                value={session?.user.email ?? ''}
                disabled
                hint="O e-mail de acesso não pode ser alterado aqui."
              />
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Receituário personalizado"
              description="Tudo aqui sai nas suas receitas em PDF. Campos em branco não aparecem no papel."
            />
            <div className="mt-6 flex flex-col gap-6">
              <div>
                <p className="field-label" id="logo-label">
                  Logomarca
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div
                    className="flex h-24 w-24 shrink-0 items-center justify-center rounded-brand border border-line bg-surface-alt p-2"
                    role="img"
                    aria-label={form.logo_url ? 'Sua logomarca' : 'Monograma com suas iniciais'}
                  >
                    {form.logo_url ? (
                      <img src={form.logo_url} alt="" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span
                        className="flex h-16 w-16 items-center justify-center rounded-pill border font-display text-2xl font-semibold"
                        style={{
                          borderColor: CORES_RECEITUARIO[form.cor_receituario].hex,
                          color: CORES_RECEITUARIO[form.cor_receituario].hex,
                        }}
                      >
                        {iniciaisDaProfissional(form.nome || 'S')}
                      </span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col gap-3">
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="secondary"
                        icon={<ImagePlus size={18} />}
                        loading={logoBusy}
                        onClick={() => fileRef.current?.click()}
                        aria-describedby="logo-ajuda"
                      >
                        {form.logo_url ? 'Trocar logomarca' : 'Enviar logomarca'}
                      </Button>
                      {form.logo_url && (
                        <Button variant="ghost" icon={<Trash2 size={18} />} onClick={() => update('logo_url', null)}>
                          Remover
                        </Button>
                      )}
                    </div>
                    <p id="logo-ajuda" className="text-xs leading-5 text-muted">
                      PNG, JPG, SVG ou WebP. Fundo transparente fica melhor. Sem logomarca, a receita usa um monograma
                      com suas iniciais.
                    </p>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    aria-hidden
                    tabIndex={-1}
                    onChange={(event) => void handleLogo(event.target.files?.[0])}
                  />
                </div>
                {logoError && (
                  <p className="field-error" role="alert">
                    {logoError}
                  </p>
                )}
              </div>

              <Input
                label="Linha de apresentação"
                value={form.titulo_profissional}
                onChange={(event) => update('titulo_profissional', event.target.value)}
                placeholder="Ginecologia, Obstetrícia e Reprodução Humana"
                hint="Sai abaixo do seu nome. Em branco, usamos a especialidade."
                maxLength={90}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="email-contato"
                  label="E-mail para pacientes"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email_contato}
                  onChange={(event) => update('email_contato', event.target.value)}
                  placeholder="contato@seusite.com.br"
                  error={emailError ?? undefined}
                />
                <Input
                  label="Instagram"
                  value={form.instagram}
                  onChange={(event) => update('instagram', event.target.value)}
                  placeholder="@seuperfil"
                  autoCapitalize="none"
                  spellCheck={false}
                />
              </div>

              <Input
                label="Site"
                inputMode="url"
                value={form.site}
                onChange={(event) => update('site', event.target.value)}
                placeholder="www.seusite.com.br"
                autoCapitalize="none"
                spellCheck={false}
              />

              <Textarea
                label="Endereço do consultório"
                rows={2}
                value={form.endereco_profissional}
                onChange={(event) => update('endereco_profissional', event.target.value)}
                placeholder="Av. Tancredo Neves, 1632, sala 1205 — Salvador/BA"
                hint="Usado quando o atendimento não tem clínica. Nas outras receitas sai o endereço da clínica."
              />

              <Input
                label="Mensagem no rodapé"
                value={form.rodape_receituario}
                onChange={(event) => update('rodape_receituario', event.target.value)}
                placeholder="Em caso de dúvidas, fale comigo pelo WhatsApp."
                maxLength={120}
              />

              <ChoiceGroup legend="Cor do receituário" hint="A cor dos detalhes: faixa, títulos, números e linhas.">
                <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:grid-cols-3">
                  {(Object.keys(CORES_RECEITUARIO) as CorReceituario[]).map((cor) => (
                    <Choice
                      key={cor}
                      name="cor-receituario"
                      checked={form.cor_receituario === cor}
                      onChange={() => update('cor_receituario', cor)}
                    >
                      <span
                        className="h-6 w-6 shrink-0 rounded-pill"
                        style={{ backgroundColor: CORES_RECEITUARIO[cor].hex }}
                        aria-hidden
                      />
                      <span className="min-w-0">{CORES_RECEITUARIO[cor].nome}</span>
                    </Choice>
                  ))}
                </div>
              </ChoiceGroup>

              <ChoiceGroup legend="Tamanho do papel">
                <div className="grid gap-3 sm:grid-cols-2">
                  {(Object.keys(PAPEIS) as PapelReceituario[]).map((papel) => (
                    <Choice
                      key={papel}
                      name="papel-receituario"
                      checked={form.papel_receituario === papel}
                      onChange={() => update('papel_receituario', papel)}
                    >
                      <span className="min-w-0">
                        <span className="block font-semibold">{papel}</span>
                        <span className="block text-xs text-muted">
                          {papel === 'A4' ? 'Folha inteira, 210 × 297 mm' : 'Meia folha, 148 × 210 mm'}
                        </span>
                      </span>
                    </Choice>
                  ))}
                </div>
              </ChoiceGroup>

              <div className="flex flex-col gap-3 rounded-brand bg-surface-alt p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted">Veja como fica, mesmo antes de salvar.</p>
                <Button variant="secondary" icon={<FileText size={18} />} onClick={() => setPreviewOpen(true)}>
                  Ver modelo da receita
                </Button>
              </div>
            </div>
          </Card>

          {error && <FormError>{error}</FormError>}

          <div className="flex justify-end">
            <Button variant="primary" type="submit" loading={saving} icon={<Save size={18} />}>
              Salvar alterações
            </Button>
          </div>
        </form>

        <Card>
          <CardHeader title="Sessão" description="Encerre o acesso neste dispositivo." />
          <div className="mt-4">
            <Button variant="secondary" icon={<LogOut size={18} />} onClick={() => void signOut()}>
              Sair da conta
            </Button>
          </div>
        </Card>
      </PageBody>

      <PrescriptionDialog open={previewOpen} onClose={() => setPreviewOpen(false)} getInput={sampleInput} />
    </>
  )
}

function ChoiceGroup({ legend, hint, children }: { legend: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="field-label">{legend}</legend>
      {hint && <p className="-mt-1 mb-3 text-xs text-muted">{hint}</p>}
      {children}
    </fieldset>
  )
}

/** Opção de rádio em formato de pílula; o rádio nativo continua no lugar, para teclado e leitor de tela. */
function Choice({
  name,
  checked,
  onChange,
  children,
}: {
  name: string
  checked: boolean
  onChange: () => void
  children: ReactNode
}) {
  return (
    <label
      className={cn(
        'relative flex min-h-[52px] cursor-pointer items-center gap-3 rounded-field border px-4 py-2 text-sm text-ink transition-colors',
        'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-line-focus',
        checked ? 'border-line-focus bg-primary-soft' : 'border-line-control hover:border-line-hover',
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
      {checked && <Check size={18} className="ml-auto shrink-0 text-primary" aria-hidden />}
    </label>
  )
}
