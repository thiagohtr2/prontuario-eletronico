import type { Clinic, CorReceituario, Doctor, PapelReceituario, Patient, PrescriptionItem } from '../types'

/**
 * Cores que a médica pode escolher para o receituário. É a identidade dela,
 * não a do sistema: o vinho da Singulare é só o padrão. Todas passam de
 * 4,5:1 sobre o branco, porque aparecem em texto pequeno no papel.
 */
export const CORES_RECEITUARIO: Record<CorReceituario, { nome: string; hex: string }> = {
  vinho: { nome: 'Vinho', hex: '#881337' },
  rose: { nome: 'Rosé antigo', hex: '#9a4562' },
  ameixa: { nome: 'Ameixa', hex: '#5b2c4f' },
  grafite: { nome: 'Grafite', hex: '#3b3f46' },
  salvia: { nome: 'Sálvia', hex: '#456152' },
  petroleo: { nome: 'Azul-petróleo', hex: '#1f5a66' },
}

export const PAPEIS: Record<PapelReceituario, string> = {
  A4: 'A4 (210 × 297 mm)',
  A5: 'A5 (148 × 210 mm)',
}

/** Campos do perfil que vão para a receita. */
export type PrescriberProfile = Pick<
  Doctor,
  | 'nome'
  | 'especialidade'
  | 'titulo_profissional'
  | 'crm'
  | 'rqe'
  | 'telefone'
  | 'email_contato'
  | 'instagram'
  | 'site'
  | 'endereco_profissional'
  | 'rodape_receituario'
  | 'cor_receituario'
  | 'papel_receituario'
  | 'logo_url'
>

export type PrescriptionInput = {
  doctor: PrescriberProfile
  clinic: Pick<Clinic, 'nome' | 'endereco' | 'telefone' | 'cidade' | 'cnpj'> | null
  patient: Pick<Patient, 'nome' | 'data_nascimento'>
  dataHora: string
  itens: PrescriptionItem[]
  orientacoes: string
  /** Receita de exemplo (modelo nas configurações). */
  exemplo?: boolean
}

export function novoItem(via = 'Uso oral'): PrescriptionItem {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now() + Math.random())
  return { id, medicamento: '', via, quantidade: '', posologia: '' }
}

/** Remove itens vazios e espaços sobrando. */
export function itensPreenchidos(itens: PrescriptionItem[] | null | undefined): PrescriptionItem[] {
  return (itens ?? [])
    .map((item) => ({
      ...item,
      medicamento: item.medicamento.trim(),
      via: item.via.trim(),
      quantidade: item.quantidade.trim(),
      posologia: item.posologia.trim(),
    }))
    .filter((item) => item.medicamento || item.posologia)
}

/**
 * Agrupa os itens por via, na ordem em que cada via aparece pela primeira vez,
 * e numera em sequência na ordem em que ficam impressos.
 */
export function agruparPorVia(itens: PrescriptionItem[]) {
  const grupos: Array<{ via: string; itens: Array<{ numero: number; item: PrescriptionItem }> }> = []
  for (const item of itens) {
    const via = item.via || 'Uso'
    let grupo = grupos.find((g) => g.via === via)
    if (!grupo) {
      grupo = { via, itens: [] }
      grupos.push(grupo)
    }
    grupo.itens.push({ numero: 0, item })
  }
  let numero = 0
  for (const grupo of grupos) for (const entry of grupo.itens) entry.numero = ++numero
  return grupos
}

export function temReceita(itens: PrescriptionItem[] | null | undefined, orientacoes: string | null | undefined) {
  return itensPreenchidos(itens).length > 0 || Boolean(orientacoes?.trim())
}

/**
 * O que falta para a receita sair completa. A receita simples precisa
 * identificar quem prescreve (nome e CRM) e o endereço do atendimento.
 */
export function pendenciasDaReceita(input: PrescriptionInput): string[] {
  const pendencias: string[] = []
  if (!input.doctor.nome.trim()) pendencias.push('Seu nome não está preenchido no perfil.')
  if (!input.doctor.crm.trim()) pendencias.push('Seu CRM não está preenchido no perfil.')
  if (!input.clinic?.endereco?.trim() && !input.doctor.endereco_profissional?.trim()) {
    pendencias.push(
      input.clinic
        ? `A clínica "${input.clinic.nome}" está sem endereço.`
        : 'O atendimento não tem clínica e seu perfil não tem endereço profissional.',
    )
  }
  if (!temReceita(input.itens, input.orientacoes)) pendencias.push('Nenhum medicamento ou orientação foi preenchido.')
  return pendencias
}

/** Mistura a cor com o branco: amount 0.92 deixa 8% da cor. */
export function clarear(hex: string, amount: number): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const mix = (c: number) => Math.round(c + (255 - c) * amount)
  return `#${[mix(r), mix(g), mix(b)].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

/** "Dra. Ana Carolina Vasconcellos" → "AV" (sem o título). */
export function iniciaisDaProfissional(nome: string): string {
  const partes = nome
    .trim()
    .split(/\s+/)
    .filter((parte) => !/^(dr|dra|drª|prof|profa|profª)\.?$/i.test(parte))
    .filter((parte) => !/^(da|de|do|das|dos|e)$/i.test(parte))
  if (partes.length === 0) return 'S'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

export function dataPorExtenso(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export function idadeEmAnos(nascimento: string | null): number | null {
  if (!nascimento) return null
  const date = new Date(`${nascimento}T12:00:00`)
  if (Number.isNaN(date.getTime())) return null
  const hoje = new Date()
  let idade = hoje.getFullYear() - date.getFullYear()
  const mes = hoje.getMonth() - date.getMonth()
  if (mes < 0 || (mes === 0 && hoje.getDate() < date.getDate())) idade--
  return idade >= 0 && idade < 150 ? idade : null
}

/** Instagram sempre como "@perfil", aceitando link ou nome. */
export function formatarInstagram(value: string | null): string {
  if (!value?.trim()) return ''
  const handle = value
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/[/?#].*$/, '')
    .replace(/^@/, '')
  return handle ? `@${handle}` : ''
}

/** Site sem "https://" e sem barra final, como se escreve no papel. */
export function formatarSite(value: string | null): string {
  return (value ?? '').trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '')
}

/** receita-maria-eduarda-albuquerque-2026-10-29.pdf */
export function nomeDoArquivo(paciente: string, dataHora: string): string {
  const slug = paciente
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  const date = new Date(dataHora)
  const dia = Number.isNaN(date.getTime())
    ? ''
    : `-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return `receita-${slug || 'paciente'}${dia}.pdf`
}

/** Perfil da receita a partir do cadastro, com padrões para campos ausentes. */
export function perfilParaReceita(doctor: Doctor | null, nomeReserva = ''): PrescriberProfile {
  return {
    nome: doctor?.nome?.trim() || nomeReserva,
    especialidade: doctor?.especialidade ?? '',
    titulo_profissional: doctor?.titulo_profissional ?? null,
    crm: doctor?.crm ?? '',
    rqe: doctor?.rqe ?? null,
    telefone: doctor?.telefone ?? null,
    email_contato: doctor?.email_contato ?? null,
    instagram: doctor?.instagram ?? null,
    site: doctor?.site ?? null,
    endereco_profissional: doctor?.endereco_profissional ?? null,
    rodape_receituario: doctor?.rodape_receituario ?? null,
    cor_receituario: doctor?.cor_receituario ?? 'vinho',
    papel_receituario: doctor?.papel_receituario ?? 'A4',
    logo_url: doctor?.logo_url ?? null,
  }
}
