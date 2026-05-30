import { forwardRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../../utils/cn.js'
import { Spinner } from './Spinner.jsx'

/**
 * SpinnerOverlay — overlay fullscreen com spinner centralizado
 *
 * Conforme épico: bloqueia interação durante operações críticas
 * (login, pagamento, envio de dados).
 *
 * @example
 * ```jsx
 * <SpinnerOverlay text="Carregando..." />
 * {isSaving && createPortal(<SpinnerOverlay text="Salvando..." />, document.body)}
 * ```
 */
export const SpinnerOverlay = forwardRef(
  (
    {
      text,
      label,
      variant = 'primary',
      className,
      ...rest
    },
    ref
  ) => {
    const content = (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={label || text || 'Carregando'}
        className={cn(
          'fixed inset-0',
          'z-[var(--ds-z-overlay)]',
          'flex flex-col items-center justify-center',
          'bg-[var(--ds-color-background)]/80',
          className
        )}
        {...rest}
      >
        <Spinner
          size="xl"
          variant={variant}
          label={label || text || 'Carregando'}
        />

        {text && (
          <p className="mt-6 text-base font-medium text-[var(--ds-color-text-secondary)]">
            {text}
          </p>
        )}
      </div>
    )

    return createPortal(content, document.body)
  }
)

SpinnerOverlay.displayName = 'SpinnerOverlay'

/** @deprecated Use SpinnerOverlay */
export const SpinnerFullscreen = SpinnerOverlay
