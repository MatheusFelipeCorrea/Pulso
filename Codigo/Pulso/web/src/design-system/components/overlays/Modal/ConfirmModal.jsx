import { useEffect, useId, useState } from 'react'
import { Trash2, AlertTriangle, Lock } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { inputContainerVariants } from '../../inputs/shared/inputField.styles.jsx'
import { Modal } from './Modal.jsx'

const BTN_CLASS = {
  cancel: 'ds-confirm-modal__btn ds-confirm-modal__btn--cancel',
  muted: 'ds-confirm-modal__btn ds-confirm-modal__btn--muted',
  danger: 'ds-confirm-modal__btn ds-confirm-modal__btn--danger',
  primary: 'ds-confirm-modal__btn ds-confirm-modal__btn--primary',
}

/**
 * ConfirmModal — confirmação de ação destrutiva (protótipo DS).
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Tem certeza?',
  message,
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
  variant = 'default',
  tone = 'danger',
  loading = false,
  icon,
  confirmationText,
  actions,
  className,
}) => {
  const [typed, setTyped] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const confirmInputId = useId()
  const isCritical = variant === 'critical'
  const canConfirm = !isCritical || typed === confirmationText
  const hasCustomActions = Array.isArray(actions) && actions.length > 0
  const isWarning = tone === 'warning'

  useEffect(() => {
    if (!isOpen) return
    setTyped('')
    setInputFocused(false)
  }, [isOpen])

  const handleClose = () => {
    setTyped('')
    setInputFocused(false)
    onClose?.()
  }

  const handleConfirm = () => {
    if (canConfirm && !loading) onConfirm?.()
  }

  const defaultIcon =
    tone === 'danger' ? (
      <Trash2 size={24} strokeWidth={1.75} aria-hidden />
    ) : (
      <AlertTriangle size={24} strokeWidth={1.75} aria-hidden />
    )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="sm"
      className={cn('ds-confirm-modal', className)}
    >
      <div className="ds-confirm-modal__body">
        <div
          className={cn(
            'ds-confirm-modal__icon-wrap',
            isWarning && 'ds-confirm-modal__icon-wrap--warning'
          )}
        >
          {icon ?? defaultIcon}
        </div>

        <h2 className="ds-confirm-modal__title">{title}</h2>

        {message ? (
          <p
            className={cn(
              'ds-confirm-modal__message',
              isCritical && confirmationText && 'ds-confirm-modal__message--critical'
            )}
          >
            {message}
          </p>
        ) : null}

        {isCritical && confirmationText ? (
          <div className="ds-confirm-modal__critical">
            <label htmlFor={confirmInputId}>
              Digite &apos;{confirmationText}&apos; para confirmar
            </label>

            <div
              className={cn(
                inputContainerVariants({ error: true, focused: false }),
                inputFocused &&
                  'ring-2 ring-[color-mix(in_srgb,var(--ds-color-danger)_20%,transparent)]'
              )}
            >
              <input
                id={confirmInputId}
                type="text"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Digite aqui"
                autoComplete="off"
                spellCheck={false}
                className={cn(
                  'min-w-0 flex-1 bg-transparent',
                  'text-sm text-[var(--ds-color-text)]',
                  'placeholder:text-[var(--ds-color-placeholder)]',
                  'border-0 outline-none focus:outline-none focus-visible:outline-none'
                )}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>

            {!canConfirm ? (
              <p className="ds-confirm-modal__critical-hint">
                <Lock size={14} aria-hidden />
                Digite &apos;{confirmationText}&apos; para habilitar
              </p>
            ) : null}
          </div>
        ) : null}

        {hasCustomActions ? (
          <div className="ds-confirm-modal__footer ds-confirm-modal__footer--stacked">
            <div className="ds-confirm-modal__actions-row">
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className={BTN_CLASS[action.variant === 'danger' ? 'danger' : 'muted']}
                  onClick={action.onClick}
                  disabled={loading || action.disabled}
                >
                  {action.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={cn(BTN_CLASS.cancel, 'ds-confirm-modal__btn--full')}
              onClick={handleClose}
              disabled={loading}
            >
              {cancelLabel}
            </button>
          </div>
        ) : (
          <div className="ds-confirm-modal__footer">
            <button
              type="button"
              className={BTN_CLASS.cancel}
              onClick={handleClose}
              disabled={loading}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className={tone === 'danger' ? BTN_CLASS.danger : BTN_CLASS.primary}
              onClick={handleConfirm}
              disabled={!canConfirm || loading}
            >
              {loading ? 'Aguarde...' : confirmLabel}
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}
