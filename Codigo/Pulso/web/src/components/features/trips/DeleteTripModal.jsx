import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { deleteTripMessage } from '@/utils/confirmDeleteMessages.js'
import { formatTripDestinationDisplay } from '@/utils/tripDestinationDisplay.js'

export function DeleteTripModal({ open, onClose, onConfirm, viagem, loading }) {
  if (!viagem) return null

  return (
    <ConfirmModal
      isOpen={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Excluir viagem?"
      message={deleteTripMessage(formatTripDestinationDisplay(viagem.destino, viagem.destinoMeta))}
      confirmLabel="Excluir"
      cancelLabel="Cancelar"
      tone="danger"
      loading={loading}
    />
  )
}
