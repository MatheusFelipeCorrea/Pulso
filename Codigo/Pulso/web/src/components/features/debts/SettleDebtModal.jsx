import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

export function SettleDebtModal({ open, onClose, onConfirm, divida, loading }) {
  if (!divida) return null

  return (
    <ConfirmModal
      isOpen={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Marcar como quitada?"
      message={`Tem certeza que deseja marcar esta dívida como quitada? ${divida.nomePessoa} — ${formatCurrency(divida.valor)}. Esta ação não pode ser desfeita.`}
      confirmLabel="Confirmar"
      cancelLabel="Cancelar"
      tone="warning"
      loading={loading}
    />
  )
}
