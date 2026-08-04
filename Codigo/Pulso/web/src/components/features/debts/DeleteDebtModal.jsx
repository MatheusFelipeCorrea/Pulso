import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { formatPersonName } from '@/utils/personName.js'

export function DeleteDebtModal({ open, onClose, onConfirm, divida, loading }) {
  if (!divida) return null

  const nomePessoa = formatPersonName(divida.nomePessoa)

  return (
    <ConfirmModal
      isOpen={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Excluir empréstimo?"
      message={`Tem certeza que deseja excluir a dívida com ${nomePessoa}? Esta ação não pode ser desfeita.`}
      confirmLabel="Excluir"
      cancelLabel="Cancelar"
      tone="danger"
      loading={loading}
    />
  )
}
