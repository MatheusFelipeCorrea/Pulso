import { useEffect, useRef, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '../../../utils/cn.js'

const TYPE_CONFIG = {
  success: {
    icon: CheckCircle,
    colorVar: '--ds-color-success',
    defaultTitle: 'Sucesso',
  },
  error: {
    icon: XCircle,
    colorVar: '--ds-color-danger',
    defaultTitle: 'Erro',
  },
  warning: {
    icon: AlertTriangle,
    colorVar: '--ds-color-warning',
    defaultTitle: 'Atenção',
  },
  info: {
    icon: Info,
    colorVar: '--ds-color-info',
    defaultTitle: 'Informação',
  },
}

/**
 * Toast - Notificação temporária flutuante
 *
 * Conforme protótipo Pulso:
 * - 4 tipos semânticos com ícone circular 48px (fundo cor/15%, ícone na cor)
 * - Título 14px bold na cor semântica + mensagem 13px secondary
 * - Barra de progresso 4px na base (auto-dismiss 4s, pausa no hover)
 * - Botão X, ação opcional, slide-in da direita
 */
export const Toast = ({
  id,
  type = 'info',
  title,
  message,
  duration = 4000,
  action,
  onClose,
  className,
}) => {
  const [progress, setProgress] = useState(100)
  const [isExiting, setIsExiting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const remainingRef = useRef(duration)
  const lastTickRef = useRef(Date.now())
  const intervalRef = useRef(null)

  const { icon: Icon, colorVar, defaultTitle } = TYPE_CONFIG[type] ?? TYPE_CONFIG.info
  const semanticColor = `var(${colorVar})`
  const iconBg = `color-mix(in srgb, ${semanticColor} 15%, transparent)`
  const progressTrack = `color-mix(in srgb, ${semanticColor} 30%, transparent)`

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      onClose?.(id)
    }, 200)
  }, [id, onClose])

  const handleActionClick = () => {
    action?.onClick?.()
    handleClose()
  }

  // Auto-dismiss com progress bar (pausa no hover)
  useEffect(() => {
    if (duration === 0) return

    lastTickRef.current = Date.now()

    intervalRef.current = setInterval(() => {
      if (isPaused) {
        lastTickRef.current = Date.now()
        return
      }

      const now = Date.now()
      const elapsed = now - lastTickRef.current
      lastTickRef.current = now

      remainingRef.current = Math.max(0, remainingRef.current - elapsed)
      setProgress((remainingRef.current / duration) * 100)

      if (remainingRef.current <= 0) {
        clearInterval(intervalRef.current)
        handleClose()
      }
    }, 50)

    return () => clearInterval(intervalRef.current)
  }, [duration, isPaused, handleClose])

  return (
    <div
      role="alert"
      className={cn(
        'relative flex items-start gap-3 w-full max-w-[360px]',
        'bg-[var(--ds-color-modal-bg)] rounded-[var(--ds-radius-lg)]',
        'shadow-[var(--ds-shadow-lg)]',
        'border-l-4 p-4 pb-5',
        'overflow-hidden',
        isExiting ? 'animate-toast-exit' : 'animate-toast-enter',
        className
      )}
      style={{ borderLeftColor: semanticColor }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ícone circular 48px */}
      <div
        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={24} style={{ color: semanticColor }} />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0 pt-0.5">
        <h4
          className="text-sm font-bold leading-tight mb-0.5"
          style={{ color: semanticColor }}
        >
          {title || defaultTitle}
        </h4>
        <p className="text-[13px] text-[var(--ds-color-text-secondary)] leading-relaxed">
          {message}
        </p>
        {action && (
          <button
            type="button"
            onClick={handleActionClick}
            className="mt-2 text-[13px] font-semibold underline-offset-2 hover:underline transition-colors"
            style={{ color: semanticColor }}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Botão fechar */}
      <button
        type="button"
        onClick={handleClose}
        className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text)] hover:bg-[var(--ds-color-hover)] transition-colors"
        aria-label="Fechar notificação"
      >
        <X size={16} />
      </button>

      {/* Barra de progresso 4px */}
      {duration > 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[var(--ds-radius-lg)] overflow-hidden"
          style={{ backgroundColor: progressTrack }}
        >
          <div
            className="h-full ease-linear"
            style={{
              width: `${progress}%`,
              backgroundColor: semanticColor,
              transition: isPaused ? 'none' : 'width 50ms linear',
            }}
          />
        </div>
      )}
    </div>
  )
}

Toast.displayName = 'Toast'
