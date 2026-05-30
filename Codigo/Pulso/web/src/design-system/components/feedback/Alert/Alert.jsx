import { useState } from 'react'
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react'
import { cn } from '../../../utils/cn.js'

const TYPE_CONFIG = {
  info: {
    icon: Info,
    colorVar: '--ds-color-info',
  },
  success: {
    icon: CheckCircle,
    colorVar: '--ds-color-success',
  },
  warning: {
    icon: AlertTriangle,
    colorVar: '--ds-color-warning',
  },
  error: {
    icon: XCircle,
    colorVar: '--ds-color-danger',
  },
}

/**
 * Alert - Alerta inline no fluxo da página
 *
 * Conforme protótipo Pulso:
 * - Fundo cor/10, borda lateral 4px sólida
 * - Ícone 20px na cor semântica
 * - Título 14px bold + mensagem 13px (cor semântica / text)
 * - Sem título: layout single-line (ícone + mensagem)
 */
export const Alert = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
  children,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  const content = message ?? children
  const { icon: Icon, colorVar } = TYPE_CONFIG[type] ?? TYPE_CONFIG.info
  const semanticColor = `var(${colorVar})`
  const bgColor = `color-mix(in srgb, ${semanticColor} 10%, transparent)`

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onDismiss?.()
    }, 150)
  }

  if (!isVisible) return null

  const isSingleLine = !title

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 w-full',
        'rounded-[var(--ds-radius-md)] p-4',
        'border-l-4',
        isSingleLine ? 'items-center' : 'items-start',
        isExiting ? 'animate-fade-out duration-fast' : 'animate-fade-in duration-fast',
        className
      )}
      style={{
        backgroundColor: bgColor,
        borderLeftColor: semanticColor,
      }}
      {...rest}
    >
      {/* Ícone 20px */}
      <Icon
        size={20}
        className="flex-shrink-0"
        style={{ color: semanticColor }}
      />

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4
            className="text-sm font-bold leading-tight mb-0.5"
            style={{ color: semanticColor }}
          >
            {title}
          </h4>
        )}
        {content && (
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: title ? semanticColor : semanticColor }}
          >
            {content}
          </p>
        )}
      </div>

      {/* Botão fechar */}
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text)] hover:bg-[var(--ds-color-hover)] transition-colors"
          aria-label="Fechar alerta"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

Alert.displayName = 'Alert'
