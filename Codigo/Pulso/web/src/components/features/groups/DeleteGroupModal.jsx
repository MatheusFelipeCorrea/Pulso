import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { deleteGroupMessage } from '@/utils/confirmDeleteMessages.js'

export function DeleteGroupModal({ open, onClose, onConfirm, grupo, loading }) {
  if (!grupo) return null

  return (
    <ConfirmModal
      isOpen={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Excluir grupo?"
      message={deleteGroupMessage(grupo.nome)}
      confirmLabel="Excluir"
      cancelLabel="Cancelar"
      tone="danger"
      loading={loading}
    />
  )
}
