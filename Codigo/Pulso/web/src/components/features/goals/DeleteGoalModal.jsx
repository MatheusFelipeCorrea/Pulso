import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { deleteGoalMessage } from '@/utils/confirmDeleteMessages.js'

export function DeleteGoalModal({ open, onClose, onConfirm, meta, loading }) {
  if (!meta) return null

  return (
    <ConfirmModal
      isOpen={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Excluir meta?"
      message={deleteGoalMessage(meta.nome)}
      confirmLabel="Excluir"
      cancelLabel="Cancelar"
      tone="danger"
      loading={loading}
    />
  )
}
