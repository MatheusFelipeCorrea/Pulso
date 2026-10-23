import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { leaveGroupMessage } from '@/utils/confirmDeleteMessages.js'

export function LeaveGroupModal({ open, onClose, onConfirm, grupo, loading }) {
  if (!grupo) return null

  return (
    <ConfirmModal
      isOpen={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Sair do grupo?"
      message={leaveGroupMessage(grupo.nome)}
      confirmLabel="Sair do grupo"
      cancelLabel="Cancelar"
      tone="warning"
      loading={loading}
    />
  )
}
