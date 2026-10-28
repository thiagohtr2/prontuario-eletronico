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

      <PageBody className="flex flex-col gap-6">
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
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
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
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
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
                  <ul className="flex flex-col gap-2 p-2">
                    {today.map((encounter) => (
                      <EncounterRow key={encounter.id} encounter={encounter} showTime />
                    ))}
                  </ul>
                )}
              </Card>

              <Card padded={false}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
                  <h2 className="text-lg font-semibold text-ink">Atendimentos recentes</h2>
                  <Link
                    to="/atendimentos"
                    className="-my-2 -mr-3 inline-flex min-h-touch items-center rounded-pill px-3 text-sm font-medium text-primary hover:bg-primary-soft"
                  >
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
                  <ul className="flex flex-col gap-2 p-2">
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

/** KPI Swiss Minimal: borda de 1 px, cantos de 6 px, sem sombra. */
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
      className="group flex min-w-0 items-center justify-between gap-4 rounded-kpi border border-line bg-surface px-4 py-3 transition-colors hover:border-line-hover sm:flex-col sm:items-stretch sm:p-5"
    >
      <div className="flex min-w-0 items-center gap-3 sm:justify-between">
        <span className="shrink-0 text-icon transition-colors group-hover:text-icon-hover sm:order-2" aria-hidden>
          {icon}
        </span>
        <p className="min-w-0 text-sm font-medium text-muted sm:order-1">{label}</p>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-12 sm:h-10 sm:w-16" />
      ) : (
        <p className="shrink-0 text-[28px] font-semibold leading-none tracking-tight text-ink tabular-nums sm:text-[40px]">
          {value ?? 0}
        </p>
      )}
    </Link>
  )
}

function EncounterRow({ encounter, showTime }: { encounter: EncounterWithRefs; showTime?: boolean }) {
  const nome = encounter.patient?.nome ?? 'Paciente'
  return (
    <li>
      <Link
        to={encounter.patient ? `/pacientes/${encounter.patient.id}` : '/atendimentos'}
        className="flex min-h-[60px] items-center gap-3 rounded-[12px] px-3 py-3 transition-colors hover:bg-surface-hover"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-primary-soft text-xs font-semibold text-primary">
          {initials(nome)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block break-words text-sm font-medium text-ink">{nome}</span>
          <span className="mt-0.5 block break-words text-xs text-muted">
            {encounter.clinic?.nome ?? 'Clínica não informada'}
            {encounter.tipo_atendimento ? ` · ${encounter.tipo_atendimento}` : ''}
          </span>
        </span>
        <span className="shrink-0 text-xs font-medium tabular-nums text-muted">
          {showTime ? formatTime(encounter.data_hora) : formatDate(encounter.data_hora)}
        </span>
      </Link>
    </li>
  )
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-5 py-5">
      {[0, 1, 2].map((index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-pill" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}
