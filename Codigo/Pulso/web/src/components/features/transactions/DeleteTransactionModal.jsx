import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import {
  deleteRecurringTransactionMessage,
  deleteTransactionMessage,
} from '@/utils/confirmDeleteMessages.js'

function transactionLabel(transacao) {
  return transacao?.descricao?.trim() || transacao?.categoria?.nome || 'esta transação'
}

export function DeleteTransactionModal({
  open,
  transacao,
  onClose,
  onConfirm,
  loading,
}) {
  const label = transactionLabel(transacao)
  const isRecorrente = transacao?.recorrente || transacao?.paiId

  if (isRecorrente) {
    return (
      <ConfirmModal
        isOpen={open}
        onClose={onClose}
        message={deleteRecurringTransactionMessage(label)}
        loading={loading}
        actions={[
          {
            label: 'Excluir só esta',
            variant: 'secondary',
            onClick: () => onConfirm?.({ excluirFuturas: false }),
          },
          {
            label: 'Excluir esta e futuras',
            variant: 'danger',
            onClick: () =>
              onConfirm?.({
                excluirFuturas: true,
                transacaoId: transacao.paiId || transacao.id,
              }),
          },
        ]}
      />
    )
  }

  return (
    <ConfirmModal
      isOpen={open}
      onClose={onClose}
      onConfirm={() => onConfirm?.({ excluirFuturas: false })}
      message={deleteTransactionMessage(label)}
      loading={loading}
    />
  )
}
