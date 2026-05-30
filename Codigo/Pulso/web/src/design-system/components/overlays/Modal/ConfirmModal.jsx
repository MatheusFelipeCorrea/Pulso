import { useState, useId } from 'react'
import { Trash2, AlertTriangle, Lock } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { Button } from '../../buttons/Button/Button.jsx'
import { inputContainerVariants } from '../../inputs/shared/inputField.styles.jsx'
import { Modal } from './Modal.jsx'

/** ConfirmModal — confirmação de ação destrutiva */
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
  className,
}) => {
  const [typed, setTyped] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const confirmInputId = useId()
  const isCritical = variant === 'critical'
  const canConfirm = !isCritical || typed === confirmationText

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
      <Trash2 size={32} className="text-[var(--ds-color-danger)]" />
    ) : (
      <AlertTriangle size={32} className="text-[var(--ds-color-warning)]" />
    )

  const iconBg =
    tone === 'danger'
      ? 'bg-[color-mix(in_srgb,var(--ds-color-danger)_15%,transparent)]'
      : 'bg-[color-mix(in_srgb,var(--ds-color-warning)_15%,transparent)]'

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm" className={cn('p-8', className)}>
      <div className="flex flex-col items-center text-center">
        <div
          className={cn(
            'mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full',
            iconBg
          )}
        >
          {icon ?? defaultIcon}
        </div>

        <h2 className="mb-2 text-xl font-bold text-[var(--ds-color-text)]">{title}</h2>

        {message && (
          <p
            className={cn(
              'text-sm leading-relaxed text-[var(--ds-color-text-secondary)]',
              isCritical && confirmationText ? 'mb-4' : 'mb-6'
            )}
          >
            {message}
          </p>
        )}

        {isCritical && confirmationText && (
          <div className="mb-8 w-full space-y-3 text-left">
            <label
              htmlFor={confirmInputId}
              className="block text-sm font-medium text-[var(--ds-color-danger)]"
            >
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

            {!canConfirm && (
              <p className="flex items-center gap-1.5 text-xs text-[var(--ds-color-text-secondary)]">
                <Lock size={14} className="shrink-0" />
                Digite &apos;{confirmationText}&apos; para habilitar
              </p>
            )}
          </div>
        )}

        {!isCritical && !message && <div className="mb-6" />}

        <div className="flex w-full min-w-0 gap-3 pt-1">
          <Button
            variant="secondary"
            className="min-w-0 flex-1"
            onClick={handleClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            className="min-w-0 flex-1"
            onClick={handleConfirm}
            loading={loading}
            disabled={!canConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
