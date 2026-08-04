import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { deleteTripExpenseMessage } from '@/utils/confirmDeleteMessages.js'
import { TRIP_EXPENSE_CATEGORY_MAP } from '@/utils/tripExpenseCategories.js'

function getExpenseLabel(despesa) {
  const category = TRIP_EXPENSE_CATEGORY_MAP[despesa?.categoria]
  if (despesa?.descricao?.trim()) return despesa.descricao.trim()
  return category?.label ?? despesa?.categoria ?? 'Pretensão de gasto'
}

export function DeleteTripExpenseModal({ open, onClose, onConfirm, despesa, loading }) {
  if (!despesa) return null

  return (
    <ConfirmModal
      isOpen={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Excluir pretensão?"
      message={deleteTripExpenseMessage(getExpenseLabel(despesa))}
      confirmLabel="Excluir"
      cancelLabel="Cancelar"
      tone="danger"
      loading={loading}
    />
  )
}
