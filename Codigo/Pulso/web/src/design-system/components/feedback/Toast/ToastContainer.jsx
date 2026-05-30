import { createPortal } from 'react-dom'
import { Toast } from './Toast.jsx'

/**
 * ToastContainer - Container para gerenciar toasts
 * 
 * Conforme protótipo:
 * - Posição: canto superior direito (fixed)
 * - Empilhamento: máx. 3 toasts visíveis
 * - Espaçamento: 12px entre toasts
 * - Z-index: --ds-z-toast (300)
 * 
 * @component
 * @example
 * ```jsx
 * <ToastContainer toasts={toasts} onClose={handleClose} />
 * ```
 */
export const ToastContainer = ({ toasts, onClose }) => {
  return createPortal(
    <div
      className="fixed top-4 right-4 z-[var(--ds-z-toast)] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            action={toast.action}
            onClose={onClose}
          />
        </div>
      ))}
    </div>,
    document.body
  )
}

ToastContainer.displayName = 'ToastContainer'
