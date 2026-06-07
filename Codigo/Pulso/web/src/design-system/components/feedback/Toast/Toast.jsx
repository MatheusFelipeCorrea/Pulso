import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '../../../utils/cn.js'

const TYPE_CONFIG = {
  success: {
    icon: CheckCircle,
    defaultTitle: 'Sucesso',
  },
  error: {
    icon: XCircle,
    defaultTitle: 'Erro',
  },
  warning: {
    icon: AlertTriangle,
    defaultTitle: 'Atenção',
  },
  info: {
    icon: Info,
    defaultTitle: 'Informação',
  },
}

/**
 * Toast — notificação flutuante (protótipo Pulso Design System).
 *
 * Estrutura: borda lateral | ícone circular sólido | título + mensagem | X
 * Barra de progresso na base com trilha neutra.
 */
export const Toast = ({
  id,
  type = 'info',
  title,
  message,
  duration = 4000,
  onClose,
  className,
}) => {
  const [progress, setProgress] = useState(100)
  const [isExiting, setIsExiting] = useState(false)

  const { icon: Icon, defaultTitle } = TYPE_CONFIG[type] ?? TYPE_CONFIG.info
  const isWarning = type === 'warning'

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      onClose?.(id)
    }, 200)
  }, [id, onClose])

  useEffect(() => {
    const tickMs = 50
    const decrement = 100 / (duration / tickMs)

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement
        if (next <= 0) {
          clearInterval(interval)
          handleClose()
          return 0
        }
        return next
      })
    }, tickMs)

    return () => clearInterval(interval)
  }, [duration, handleClose])

  return (
    <div
      role="alert"
      className={cn(
        'ds-toast',
        `ds-toast--${type}`,
        isExiting ? 'animate-toast-exit' : 'animate-toast-enter',
        className
      )}
    >
      <div className="ds-toast__body">
        <div className="ds-toast__icon" aria-hidden>
          <Icon
            size={22}
            strokeWidth={isWarning ? 2.5 : 2.25}
            fill={isWarning ? 'currentColor' : 'none'}
          />
        </div>

        <div className="ds-toast__content">
          <p className="ds-toast__title">{title || defaultTitle}</p>
          {message ? <p className="ds-toast__message">{message}</p> : null}
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="ds-toast__close"
          aria-label="Fechar notificação"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="ds-toast__progress" aria-hidden>
        <div
          className="ds-toast__progress-bar"
          style={{ width: `${Math.max(0, progress)}%` }}
        />
      </div>
    </div>
  )
}

Toast.displayName = 'Toast'
