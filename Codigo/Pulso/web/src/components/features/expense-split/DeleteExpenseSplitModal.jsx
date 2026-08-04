import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'

export function DeleteExpenseSplitModal({ open, onClose, onConfirm, divisao, loading }) {
  if (!divisao) return null

  return (
    <ConfirmModal
      isOpen={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Excluir divisão?"
      message={`Tem certeza que deseja excluir "${divisao.titulo}"? Esta ação não pode ser desfeita.`}
      confirmLabel="Excluir"
      cancelLabel="Cancelar"
      tone="danger"
      loading={loading}
    />
  )
}
