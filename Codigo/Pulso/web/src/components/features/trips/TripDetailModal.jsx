import { useState } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { TRIP_EXPENSE_CATEGORY_MAP } from '@/utils/tripExpenseCategories.js'
import { TripExpenseFormModal } from './TripExpenseFormModal.jsx'

export function TripDetailModal({
  open,
  onClose,
  viagem,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
}) {
  const [expenseOpen, setExpenseOpen] = useState(false)
  const [expenseTarget, setExpenseTarget] = useState(null)

  if (!viagem) return null

  const openNewExpense = () => {
    setExpenseTarget(null)
    setExpenseOpen(true)
  }

  const openEditExpense = (despesa) => {
    setExpenseTarget(despesa)
    setExpenseOpen(true)
  }

  const handleExpenseSubmit = async (payload) => {
    if (expenseTarget) {
      await onEditExpense?.(viagem, expenseTarget, payload)
    } else {
      await onAddExpense?.(viagem, payload)
    }
    setExpenseOpen(false)
    setExpenseTarget(null)
  }

  return (
    <>
      <Modal isOpen={open} onClose={onClose} size="lg" className="trip-detail-modal">
        <div className="trip-detail">
          <header className="trip-detail__header">
            <div>
              <h2>{viagem.destino}</h2>
              <p>Pretensões de gastos e progresso da viagem</p>
            </div>
            <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
          </header>

          <div className="trip-detail__summary">
            <div>
              <span>Total planejado</span>
              <strong>{formatCurrency(viagem.totalBrl)}</strong>
            </div>
            {viagem.meta ? (
              <div>
                <span>Meta vinculada</span>
                <strong>{viagem.meta.nome}</strong>
              </div>
            ) : null}
          </div>

          <div className="trip-detail__actions">
            <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={openNewExpense}>
              Nova pretensão
            </Button>
          </div>

          <ul className="trip-detail__list">
            {viagem.despesas?.length ? (
              viagem.despesas.map((despesa) => {
                const meta = TRIP_EXPENSE_CATEGORY_MAP[despesa.categoria]
                return (
                  <li key={despesa.id}>
                    <div>
                      <strong>{meta?.label ?? despesa.categoria}</strong>
                      {despesa.descricao ? <span>{despesa.descricao}</span> : null}
                    </div>
                    <strong>{formatCurrency(despesa.valorEstimado)}</strong>
                    <div className="trip-detail__item-actions">
                      <IconButton
                        variant="ghost"
                        size="sm"
                        ariaLabel="Editar pretensão"
                        icon={<Pencil size={14} />}
                        onClick={() => openEditExpense(despesa)}
                      />
                      <IconButton
                        variant="ghost"
                        size="sm"
                        ariaLabel="Excluir pretensão"
                        icon={<Trash2 size={14} />}
                        onClick={() => onDeleteExpense?.(viagem, despesa)}
                      />
                    </div>
                  </li>
                )
              })
            ) : (
              <li className="trip-detail__empty">Nenhuma pretensão cadastrada.</li>
            )}
          </ul>
        </div>
      </Modal>

      <TripExpenseFormModal
        open={expenseOpen}
        onClose={() => {
          setExpenseOpen(false)
          setExpenseTarget(null)
        }}
        despesa={expenseTarget}
        onSubmit={handleExpenseSubmit}
      />
    </>
  )
}
