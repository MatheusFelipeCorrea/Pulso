import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'

export function DeleteTransactionModal({
  open,
  transacao,
  onClose,
  onConfirm,
  loading,
}) {
  const isRecorrente = transacao?.recorrente || transacao?.paiId

  if (!open) return null

  if (isRecorrente) {
    return (
      <Modal isOpen={open} onClose={onClose} size="sm">
        <div className="tx-delete-modal">
          <h3 className="tx-delete-modal__title">Excluir transação recorrente</h3>
          <p className="tx-delete-modal__text">Como deseja excluir esta transação?</p>
          <div className="tx-delete-modal__actions">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant="secondary"
              onClick={() => onConfirm?.({ excluirFuturas: false })}
              loading={loading}
            >
              Excluir só esta
            </Button>
            <Button
              variant="danger"
              onClick={() => onConfirm?.({ excluirFuturas: true, transacaoId: transacao.paiId || transacao.id })}
              loading={loading}
            >
              Excluir esta e futuras
            </Button>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="sm">
      <div className="tx-delete-modal">
        <h3 className="tx-delete-modal__title">Excluir transação</h3>
        <p className="tx-delete-modal__text">Tem certeza que deseja excluir esta transação?</p>
        <div className="tx-delete-modal__actions">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => onConfirm?.({ excluirFuturas: false })}
            loading={loading}
          >
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  )
}
