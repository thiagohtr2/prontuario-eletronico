/** Formatação de datas e textos no padrão brasileiro. */

const pad = (n: number) => String(n).padStart(2, '0')

export function formatDate(value?: string | null): string {
  if (!value) return '—'
  const date = parseDate(value)
  if (!date) return '—'
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

export function formatTime(value?: string | null): string {
  if (!value) return '—'
  const date = parseDate(value)
  if (!date) return '—'
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function formatDateTime(value?: string | null): string {
  if (!value) return '—'
  return `${formatDate(value)} às ${formatTime(value)}`
}

/** Datas puras (YYYY-MM-DD) são tratadas como locais para não "voltar um dia". */
function parseDate(value: string): Date | null {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.exec(value)
  const date = dateOnly ? new Date(`${value}T12:00:00`) : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function calcAge(birth?: string | null): number | null {
  if (!birth) return null
  const date = parseDate(birth)
  if (!date) return null
  const today = new Date()
  let age = today.getFullYear() - date.getFullYear()
  const monthDiff = today.getMonth() - date.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) age--
  return age >= 0 && age < 150 ? age : null
}

export function formatAge(birth?: string | null): string {
  const age = calcAge(birth)
  return age === null ? '—' : `${age} anos`
}

/** Converte um timestamp em valor para <input type="datetime-local">. */
export function toDatetimeLocal(value?: string | null): string {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function formatCPF(value?: string | null): string {
  if (!value) return ''
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
}

export function formatPhone(value?: string | null): string {
  if (!value) return ''
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
  }
  return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
}

export function initials(name?: string | null): string {
  if (!name) return '—'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '—'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function isToday(value?: string | null): boolean {
  if (!value) return false
  const date = new Date(value)
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

/** Início e fim do dia atual em ISO, para filtrar atendimentos de hoje. */
export function todayRange(): { start: string; end: string } {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return { start: start.toISOString(), end: end.toISOString() }
}

/** Primeiro nome do médico, ignorando o título (Dr., Dra., Prof.). */
export function firstName(fullName?: string | null): string {
  if (!fullName) return ''
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  const isTitle = /^(dr|dra|drª|prof|profa|profª)\.?$/i.test(parts[0])
  return isTitle && parts.length > 1 ? `${parts[0]} ${parts[1]}` : parts[0]
}

/** Normaliza para busca sem acento e sem caixa. */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}
