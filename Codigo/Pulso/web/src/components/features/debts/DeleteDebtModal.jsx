import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'

export function DeleteDebtModal({ open, onClose, onConfirm, divida, loading }) {
  if (!divida) return null

  return (
    <ConfirmModal
      isOpen={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Excluir empréstimo?"
      message="Tem certeza que deseja excluir esta dívida? Esta ação não pode ser desfeita."
      confirmLabel="Excluir"
      cancelLabel="Cancelar"
      tone="danger"
      loading={loading}
    />
  )
}
