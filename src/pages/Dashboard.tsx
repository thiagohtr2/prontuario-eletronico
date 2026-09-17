import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, CalendarDays, ClipboardList, Plus, Users } from 'lucide-react'
import { PageBody, PageHeader } from '../components/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState, ErrorState, Skeleton } from '../components/ui/States'
import { useAuth } from '../context/AuthContext'
import {
  countEncounters,
  countPatients,
  errorMessage,
  listClinics,
  listEncounters,
  listEncountersInRange,
} from '../lib/api'
import { firstName, formatDate, formatTime, initials, todayRange } from '../lib/format'
import type { EncounterWithRefs } from '../lib/types'

type Stats = { pacientes: number; atendimentos: number; clinicas: number }

export function DashboardPage() {
  const { doctor, session } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats | null>(null)
  const [today, setToday] = useState<EncounterWithRefs[]>([])
  const [recent, setRecent] = useState<EncounterWithRefs[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { start, end } = todayRange()
        const [pacientes, atendimentos, clinicas, todayList, recentList] = await Promise.all([
          countPatients(),
          countEncounters(),
          listClinics(),
          listEncountersInRange(start, end),
          listEncounters(6),
        ])
        if (!active) return
        setStats({ pacientes, atendimentos, clinicas: clinicas.length })
        setToday(todayList)
        setRecent(recentList)
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
  }, [])

  const primeiroNome = firstName(doctor?.nome) || session?.user.email?.split('@')[0] || ''

  return (
    <>
      <PageHeader
        title={primeiroNome ? `Olá, ${primeiroNome}` : 'Início'}
        description="Resumo dos seus atendimentos e acesso rápido ao prontuário."
        action={
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => navigate('/atendimentos/novo')}>
            Novo atendimento
          </Button>
        }
      />

      <PageBody className="space-y-6">
        {error ? (
          <Card padded={false}>
            <ErrorState
              message={error}
              action={
                <Button variant="secondary" onClick={() => window.location.reload()}>
                  Tentar novamente
                </Button>
              }
            />
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={<Users size={19} />}
                label="Pacientes cadastrados"
                value={stats?.pacientes}
                loading={loading}
                to="/pacientes"
              />
              <StatCard
                icon={<ClipboardList size={19} />}
                label="Atendimentos registrados"
                value={stats?.atendimentos}
                loading={loading}
                to="/atendimentos"
              />
              <StatCard
                icon={<Building2 size={19} />}
                label="Clínicas"
                value={stats?.clinicas}
                loading={loading}
                to="/clinicas"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card padded={false}>
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <h2 className="text-lg font-semibold text-ink">Atendimentos de hoje</h2>
                  <Badge tone={today.length > 0 ? 'accent' : 'neutral'}>
                    {today.length} {today.length === 1 ? 'consulta' : 'consultas'}
                  </Badge>
                </div>
                {loading ? (
                  <ListSkeleton />
                ) : today.length === 0 ? (
                  <EmptyState
                    icon={<CalendarDays size={22} />}
                    title="Nenhum atendimento hoje"
                    description="Os atendimentos registrados com a data de hoje aparecem aqui."
                    action={
                      <Button variant="secondary" icon={<Plus size={18} />} onClick={() => navigate('/atendimentos/novo')}>
                        Registrar atendimento
                      </Button>
                    }
                  />
                ) : (
                  <ul className="divide-y divide-line">
                    {today.map((encounter) => (
                      <EncounterRow key={encounter.id} encounter={encounter} showTime />
                    ))}
                  </ul>
                )}
              </Card>

              <Card padded={false}>
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <h2 className="text-lg font-semibold text-ink">Atendimentos recentes</h2>
                  <Link to="/atendimentos" className="text-sm font-medium text-accent hover:underline">
                    Ver todos
                  </Link>
                </div>
                {loading ? (
                  <ListSkeleton />
                ) : recent.length === 0 ? (
                  <EmptyState
                    icon={<ClipboardList size={22} />}
                    title="Nenhum atendimento registrado"
                    description="Cadastre um paciente e registre a primeira evolução."
                    action={
                      <Button variant="secondary" onClick={() => navigate('/pacientes')}>
                        Ir para pacientes
                      </Button>
                    }
                  />
                ) : (
                  <ul className="divide-y divide-line">
                    {recent.map((encounter) => (
                      <EncounterRow key={encounter.id} encounter={encounter} />
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </>
        )}
      </PageBody>
    </>
  )
}

function StatCard({
  icon,
  label,
  value,
  loading,
  to,
}: {
  icon: React.ReactNode
  label: string
  value?: number
  loading: boolean
  to: string
}) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-line bg-surface p-5 shadow-card transition-colors hover:border-slate-300"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
          {icon}
        </span>
        <div className="min-w-0">
          {loading ? (
            <Skeleton className="h-7 w-12" />
          ) : (
            <p className="text-2xl font-semibold leading-none text-ink">{value ?? 0}</p>
          )}
          <p className="mt-1.5 truncate text-sm text-muted">{label}</p>
        </div>
      </div>
    </Link>
  )
}

function EncounterRow({ encounter, showTime }: { encounter: EncounterWithRefs; showTime?: boolean }) {
  const nome = encounter.patient?.nome ?? 'Paciente'
  return (
    <li>
      <Link
        to={encounter.patient ? `/pacientes/${encounter.patient.id}` : '/atendimentos'}
        className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
          {initials(nome)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-ink">{nome}</span>
          <span className="block truncate text-xs text-muted">
            {encounter.clinic?.nome ?? 'Clínica não informada'}
            {encounter.tipo_atendimento ? ` · ${encounter.tipo_atendimento}` : ''}
          </span>
        </span>
        <span className="shrink-0 text-xs font-medium text-muted">
          {showTime ? formatTime(encounter.data_hora) : formatDate(encounter.data_hora)}
        </span>
      </Link>
    </li>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-3 px-5 py-5">
      {[0, 1, 2].map((index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}
