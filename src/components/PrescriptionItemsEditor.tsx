import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { Button, IconButton } from './ui/Button'
import { Input, Select, Textarea } from './ui/Field'
import { novoItem } from '../lib/prescription/model'
import { VIAS_ADMINISTRACAO } from '../lib/types'
import type { PrescriptionItem } from '../lib/types'

/**
 * Lista editável de medicamentos da receita. Cada item tem medicamento,
 * via, quantidade e modo de usar; a ordem aqui é a ordem impressa.
 */
export function PrescriptionItemsEditor({
  items,
  onChange,
}: {
  items: PrescriptionItem[]
  onChange: (items: PrescriptionItem[]) => void
}) {
  const [focusId, setFocusId] = useState<string | null>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!focusId) return
    document.getElementById(`medicamento-${focusId}`)?.focus()
    setFocusId(null)
  }, [focusId])

  function update(id: string, field: keyof PrescriptionItem, value: string) {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  function add() {
    // O novo item herda a via do anterior: receitas costumam agrupar por via.
    const item = novoItem(items[items.length - 1]?.via || 'Uso oral')
    onChange([...items, item])
    setFocusId(item.id)
  }

  function remove(id: string) {
    onChange(items.filter((item) => item.id !== id))
    addButtonRef.current?.focus()
  }

  function move(index: number, step: -1 | 1) {
    const next = [...items]
    const [item] = next.splice(index, 1)
    next.splice(index + step, 0, item)
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 && (
        <p className="rounded-brand bg-surface-alt px-4 py-3 text-sm text-muted">
          Nenhum medicamento ainda. Adicione um por vez: cada um sai numerado na receita, agrupado pela via.
        </p>
      )}

      {items.map((item, index) => {
        const vias: string[] = [...VIAS_ADMINISTRACAO]
        if (item.via && !vias.includes(item.via)) vias.push(item.via)
        return (
          <fieldset key={item.id} className="min-w-0 rounded-brand border border-line p-4 sm:p-5">
            <legend className="sr-only">Medicamento {index + 1}</legend>
            <div className="flex items-center justify-between gap-3">
              <p className="flex min-w-0 items-center gap-3 text-sm font-semibold text-ink" aria-hidden>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-primary-soft text-xs font-bold text-primary">
                  {index + 1}
                </span>
                Medicamento
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <IconButton
                  label={`Subir o medicamento ${index + 1}`}
                  icon={<ArrowUp size={17} />}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                />
                <IconButton
                  label={`Descer o medicamento ${index + 1}`}
                  icon={<ArrowDown size={17} />}
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                />
                <IconButton
                  variant="danger"
                  label={`Remover o medicamento ${index + 1}`}
                  icon={<Trash2 size={17} />}
                  onClick={() => remove(item.id)}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <Input
                id={`medicamento-${item.id}`}
                label="Medicamento e concentração"
                value={item.medicamento}
                onChange={(event) => update(item.id, 'medicamento', event.target.value)}
                placeholder="Ibuprofeno 600 mg, comprimido"
                autoComplete="off"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Select label="Via" value={item.via} onChange={(event) => update(item.id, 'via', event.target.value)}>
                  {vias.map((via) => (
                    <option key={via} value={via}>
                      {via}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Quantidade"
                  value={item.quantidade}
                  onChange={(event) => update(item.id, 'quantidade', event.target.value)}
                  placeholder="1 caixa"
                  autoComplete="off"
                />
              </div>
              <Textarea
                label="Como usar"
                rows={2}
                value={item.posologia}
                onChange={(event) => update(item.id, 'posologia', event.target.value)}
                placeholder="Tomar 1 comprimido de 8 em 8 horas, por 5 dias, se houver dor."
              />
            </div>
          </fieldset>
        )
      })}

      <div>
        <Button ref={addButtonRef} variant="secondary" icon={<Plus size={18} />} onClick={add}>
          Adicionar medicamento
        </Button>
      </div>
    </div>
  )
}
