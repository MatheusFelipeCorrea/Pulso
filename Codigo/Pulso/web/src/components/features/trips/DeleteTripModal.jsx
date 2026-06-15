import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { deleteTripMessage } from '@/utils/confirmDeleteMessages.js'

export function DeleteTripModal({ open, onClose, onConfirm, viagem, loading }) {
  if (!viagem) return null

  return (
    <ConfirmModal
      isOpen={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Excluir viagem?"
      message={deleteTripMessage(viagem.destino)}
      confirmLabel="Excluir"
      cancelLabel="Cancelar"
      tone="danger"
      loading={loading}
    />
  )
}
