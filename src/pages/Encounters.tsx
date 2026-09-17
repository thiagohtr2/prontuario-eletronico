import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Plus } from 'lucide-react'
import { PageBody, PageHeader } from '../components/PageHeader'
import { SearchInput } from '../components/SearchInput'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Field'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States'
import { TimelineItem } from '../components/TimelineItem'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useToast } from '../context/ToastContext'
import { deleteEncounter, errorMessage, listClinics, listEncounters } from '../lib/api'
import { formatDate, normalize } from '../lib/format'
import type { Clinic, EncounterWithRefs } from '../lib/types'

export function EncountersPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [encounters, setEncounters] = useState<EncounterWithRefs[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [clinicFilter, setClinicFilter] = useState('')
  const [toDelete, setToDelete] = useState<EncounterWithRefs | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [encounterList, clinicList] = await Promise.all([listEncounters(), listClinics()])
      setEncounters(encounterList)
      setClinics(clinicList)
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
    return encounters.filter((encounter) => {
      const matchesClinic = !clinicFilter || encounter.clinic_id === clinicFilter
      const matchesSearch = !term || normalize(encounter.patient?.nome ?? '').includes(term)
      return matchesClinic && matchesSearch
    })
  }, [encounters, search, clinicFilter])

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)
    try {
      await deleteEncounter(toDelete.id)
      setEncounters((current) => current.filter((item) => item.id !== toDelete.id))
      toast.success('Atendimento excluído.')
      setToDelete(null)
    } catch (caught) {
      toast.error(errorMessage(caught, 'Não foi possível excluir. Tente novamente.'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Atendimentos"
        description="Todos os atendimentos registrados, em ordem cronológica."
        search={
          <SearchInput
            label="Buscar por paciente"
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nome do paciente"
          />
        }
        action={
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => navigate('/atendimentos/novo')}>
            Novo atendimento
          </Button>
        }
      />

      <PageBody className="space-y-5">
        {!loading && !error && encounters.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <Select
              label="Filtrar por clínica"
              value={clinicFilter}
              onChange={(event) => setClinicFilter(event.target.value)}
              wrapperClassName="sm:max-w-xs"
            >
              <option value="">Todas as clínicas</option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.nome}
                </option>
              ))}
            </Select>
            <p className="text-sm text-muted">
              {filtered.length} {filtered.length === 1 ? 'atendimento' : 'atendimentos'}
            </p>
          </div>
        )}

        {loading ? (
          <LoadingState label="Carregando atendimentos..." />
        ) : error ? (
          <Card padded={false}>
            <ErrorState
              message={error}
              action={
                <Button variant="secondary" onClick={() => void load()}>
                  Tentar novamente
                </Button>
              }
            />
          </Card>
        ) : encounters.length === 0 ? (
          <Card padded={false}>
            <EmptyState
              icon={<ClipboardList size={22} />}
              title="Nenhum atendimento registrado"
              description="Registre o primeiro atendimento para começar o histórico dos seus pacientes."
              action={
                <Button variant="primary" icon={<Plus size={18} />} onClick={() => navigate('/atendimentos/novo')}>
                  Registrar atendimento
                </Button>
              }
            />
          </Card>
        ) : filtered.length === 0 ? (
          <Card padded={false}>
            <EmptyState
              icon={<ClipboardList size={22} />}
              title="Nenhum atendimento encontrado"
              description="Ajuste a busca ou o filtro de clínica para ver outros atendimentos."
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch('')
                    setClinicFilter('')
                  }}
                >
                  Limpar filtros
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="pt-1">
            {filtered.map((encounter) => (
              <TimelineItem key={encounter.id} encounter={encounter} onDelete={setToDelete} showPatient />
            ))}
          </div>
        )}
      </PageBody>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Excluir atendimento"
        message={
          toDelete
            ? `O atendimento de ${formatDate(toDelete.data_hora)} será removido do histórico. Esta ação não pode ser desfeita.`
            : ''
        }
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}
