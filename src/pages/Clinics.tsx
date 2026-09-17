import { useEffect, useState } from 'react'
import { Building2, MapPin, Pencil, Phone, Plus, Trash2 } from 'lucide-react'
import { PageBody, PageHeader } from '../components/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ClinicForm } from '../forms/ClinicForm'
import { useToast } from '../context/ToastContext'
import { deleteClinic, errorMessage, listClinics } from '../lib/api'
import { formatPhone } from '../lib/format'
import type { Clinic } from '../lib/types'

export function ClinicsPage() {
  const toast = useToast()
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Clinic | null>(null)
  const [toDelete, setToDelete] = useState<Clinic | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setClinics(await listClinics())
    } catch (caught) {
      setError(errorMessage(caught))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)
    try {
      await deleteClinic(toDelete.id)
      setClinics((current) => current.filter((clinic) => clinic.id !== toDelete.id))
      toast.success('Clínica excluída.')
      setToDelete(null)
    } catch (caught) {
      toast.error(errorMessage(caught, 'Não foi possível excluir. Tente novamente.'))
    } finally {
      setDeleting(false)
    }
  }

  function openNew() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(clinic: Clinic) {
    setEditing(clinic)
    setFormOpen(true)
  }

  return (
    <>
      <PageHeader
        title="Clínicas"
        description="Os locais onde você atende. Cada atendimento fica vinculado a uma clínica."
        action={
          <Button variant="primary" icon={<Plus size={18} />} onClick={openNew}>
            Nova clínica
          </Button>
        }
      />

      <PageBody>
        {loading ? (
          <LoadingState label="Carregando clínicas..." />
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
        ) : clinics.length === 0 ? (
          <Card padded={false}>
            <EmptyState
              icon={<Building2 size={22} />}
              title="Nenhuma clínica cadastrada"
              description="Cadastre as clínicas onde você atende para identificar onde cada consulta aconteceu."
              action={
                <Button variant="primary" icon={<Plus size={18} />} onClick={openNew}>
                  Cadastrar primeira clínica
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clinics.map((clinic) => (
              <Card key={clinic.id} className="flex flex-col">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Building2 size={19} aria-hidden />
                  </span>
                  <h2 className="min-w-0 flex-1 text-md font-semibold leading-6 text-ink">{clinic.nome}</h2>
                </div>

                <dl className="mt-4 flex-1 space-y-2.5 text-sm">
                  {clinic.endereco && (
                    <div className="flex items-start gap-2 text-muted">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" aria-hidden />
                      <span className="leading-6 text-ink">{clinic.endereco}</span>
                    </div>
                  )}
                  {clinic.telefone && (
                    <div className="flex items-center gap-2 text-muted">
                      <Phone size={16} className="shrink-0 text-slate-400" aria-hidden />
                      <span className="text-ink">{formatPhone(clinic.telefone)}</span>
                    </div>
                  )}
                  {clinic.observacoes && (
                    <p className="whitespace-pre-wrap pt-1 text-sm leading-6 text-muted">{clinic.observacoes}</p>
                  )}
                  {!clinic.endereco && !clinic.telefone && !clinic.observacoes && (
                    <p className="text-sm text-muted">Sem informações adicionais.</p>
                  )}
                </dl>

                <div className="mt-5 flex justify-end gap-2 border-t border-line pt-4">
                  <Button variant="secondary" size="sm" icon={<Pencil size={16} />} onClick={() => openEdit(clinic)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 size={16} />}
                    className="hover:text-danger"
                    onClick={() => setToDelete(clinic)}
                    aria-label={`Excluir ${clinic.nome}`}
                  >
                    <span className="sr-only">Excluir clínica</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageBody>

      <ClinicForm
        open={formOpen}
        clinic={editing}
        onClose={() => setFormOpen(false)}
        onSaved={(saved) =>
          setClinics((current) => {
            const exists = current.some((clinic) => clinic.id === saved.id)
            const next = exists
              ? current.map((clinic) => (clinic.id === saved.id ? saved : clinic))
              : [...current, saved]
            return next.sort((a, b) => a.nome.localeCompare(b.nome))
          })
        }
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Excluir clínica"
        message={
          toDelete
            ? `A clínica "${toDelete.nome}" será excluída. Os atendimentos já registrados são mantidos, mas ficarão sem clínica vinculada.`
            : ''
        }
        confirmLabel="Excluir clínica"
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}
