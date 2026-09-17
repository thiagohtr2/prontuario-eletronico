import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, ChevronRight, Phone, Plus, UserPlus, Users } from 'lucide-react'
import { PageBody, PageHeader } from '../components/PageHeader'
import { SearchInput } from '../components/SearchInput'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States'
import { PatientForm } from '../forms/PatientForm'
import { errorMessage, listPatientsWithSummary } from '../lib/api'
import { formatAge, formatDate, formatPhone, initials, normalize } from '../lib/format'
import type { PatientListItem } from '../lib/types'

export function PatientsPage() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState<PatientListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setPatients(await listPatientsWithSummary())
    } catch (caught) {
      setError(errorMessage(caught))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const filtered = useMemo(() => {
    const term = normalize(search)
    if (!term) return patients
    const digits = term.replace(/\D/g, '')
    return patients.filter((patient) => {
      const byName = normalize(patient.nome).includes(term)
      const byCpf = digits.length > 0 && (patient.cpf ?? '').replace(/\D/g, '').includes(digits)
      return byName || byCpf
    })
  }, [patients, search])

  return (
    <>
      <PageHeader
        title="Pacientes"
        description="Todos os pacientes que você acompanha, em qualquer clínica."
        search={
          <SearchInput
            label="Buscar paciente"
            value={search}
            onChange={setSearch}
            placeholder="Buscar paciente por nome ou CPF"
          />
        }
        action={
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => setFormOpen(true)}>
            Novo paciente
          </Button>
        }
      />

      <PageBody>
        <Card padded={false}>
          {loading ? (
            <LoadingState label="Carregando pacientes..." />
          ) : error ? (
            <ErrorState
              message={error}
              action={
                <Button variant="secondary" onClick={() => void load()}>
                  Tentar novamente
                </Button>
              }
            />
          ) : patients.length === 0 ? (
            <EmptyState
              icon={<Users size={22} />}
              title="Nenhum paciente cadastrado"
              description="Cadastre seu primeiro paciente para começar a registrar as evoluções."
              action={
                <Button variant="primary" icon={<UserPlus size={18} />} onClick={() => setFormOpen(true)}>
                  Cadastrar primeiro paciente
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Users size={22} />}
              title="Nenhum paciente encontrado"
              description={`Nada encontrado para "${search}". Verifique o nome ou o CPF digitado.`}
              action={
                <Button variant="secondary" onClick={() => setSearch('')}>
                  Limpar busca
                </Button>
              }
            />
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <p className="text-sm text-muted">
                  {filtered.length} {filtered.length === 1 ? 'paciente' : 'pacientes'}
                </p>
              </div>
              <ul className="divide-y divide-line">
                {filtered.map((patient) => (
                  <li key={patient.id}>
                    <Link
                      to={`/pacientes/${patient.id}`}
                      className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-slate-50 sm:px-5"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                        {initials(patient.nome)}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-md font-medium text-ink">{patient.nome}</span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
                          <span>{formatAge(patient.data_nascimento)}</span>
                          {patient.telefone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone size={13} aria-hidden />
                              {formatPhone(patient.telefone)}
                            </span>
                          )}
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted sm:hidden">
                          <span>
                            Última consulta:{' '}
                            <span className="font-medium text-ink">
                              {patient.ultimo_atendimento ? formatDate(patient.ultimo_atendimento) : '—'}
                            </span>
                          </span>
                          {patient.ultima_clinica && (
                            <span className="inline-flex items-center gap-1">
                              <Building2 size={13} aria-hidden />
                              {patient.ultima_clinica}
                            </span>
                          )}
                        </span>
                      </span>

                      <span className="hidden min-w-0 shrink-0 text-right sm:block">
                        <span className="block text-xs text-muted">Última consulta</span>
                        <span className="block text-sm font-medium text-ink">
                          {patient.ultimo_atendimento ? formatDate(patient.ultimo_atendimento) : '—'}
                        </span>
                        {patient.ultima_clinica && (
                          <span className="mt-0.5 flex items-center justify-end gap-1 text-xs text-muted">
                            <Building2 size={13} aria-hidden />
                            <span className="max-w-[160px] truncate">{patient.ultima_clinica}</span>
                          </span>
                        )}
                      </span>

                      <ChevronRight size={18} className="shrink-0 text-slate-300" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </PageBody>

      <PatientForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={(patient) => navigate(`/pacientes/${patient.id}`)}
      />
    </>
  )
}
