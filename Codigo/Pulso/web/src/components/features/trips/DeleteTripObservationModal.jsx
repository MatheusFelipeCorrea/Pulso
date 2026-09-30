import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { deleteTripObservationMessage } from '@/utils/confirmDeleteMessages.js'

export function DeleteTripObservationModal({ open, onClose, onConfirm, observacao, loading }) {
  if (!observacao) return null

  return (
    <ConfirmModal
      isOpen={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Excluir observação?"
      message={deleteTripObservationMessage(observacao.titulo ?? 'Observação')}
      confirmLabel="Excluir"
      cancelLabel="Cancelar"
      tone="danger"
      loading={loading}
    />
  )
}
