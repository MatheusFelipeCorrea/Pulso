import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { formatPersonName } from '@/utils/personName.js'

export function ReopenDebtModal({ open, onClose, onConfirm, divida, loading }) {
  if (!divida) return null

  const nomePessoa = formatPersonName(divida.nomePessoa)

  return (
    <ConfirmModal
      isOpen={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Desfazer quitação?"
      message={`A dívida com ${nomePessoa} voltará para em aberto. Você poderá registrar novos pagamentos.`}
      confirmLabel="Desfazer"
      cancelLabel="Cancelar"
      tone="warning"
      loading={loading}
    />
  )
}
