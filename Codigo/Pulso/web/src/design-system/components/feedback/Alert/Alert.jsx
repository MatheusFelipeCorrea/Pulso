import { useState } from 'react'
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react'
import { cn } from '../../../utils/cn.js'

/**
 * Alert - Alerta inline
 * 
 * Diferente de Toast (que é flutuante), Alert aparece no fluxo da página.
 * 
 * Conforme protótipo:
 * - 4 tipos: info, success, warning, error
 * - Barra colorida à esquerda (4px)
 * - Ícone circular colorido
 * - Título (opcional)
 * - Mensagem
 * - Botão X opcional (dismissible)
 * - Padding: 16px
 * - Border-radius: 12px
 * 
 * @component
 * @example
 * ```jsx
 * <Alert type="success" title="Sucesso" message="Operação concluída" />
 * <Alert type="error" message="Erro ao salvar dados" dismissible />
 * <Alert type="info" message="Esta é uma mensagem informativa" />
 * ```
 */
export const Alert = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(true)

  // ============================================================
  // CONFIGURAÇÕES POR TIPO
  // ============================================================
  const config = {
    info: {
      icon: Info,
      iconBg: 'bg-[#3B82F6]',
      borderColor: 'border-l-[#3B82F6]',
      bgColor: 'bg-[#3B82F6]/10',
    },
    success: {
      icon: CheckCircle,
      iconBg: 'bg-[#10B981]',
      borderColor: 'border-l-[#10B981]',
      bgColor: 'bg-[#10B981]/10',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-[#F59E0B]',
      borderColor: 'border-l-[#F59E0B]',
      bgColor: 'bg-[#F59E0B]/10',
    },
    error: {
      icon: XCircle,
      iconBg: 'bg-[#EF4444]',
      borderColor: 'border-l-[#EF4444]',
      bgColor: 'bg-[#EF4444]/10',
    },
  }

  const { icon: Icon, iconBg, borderColor, bgColor } = config[type]

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  // ============================================================
  // RENDER
  // ============================================================
  if (!isVisible) return null

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 w-full',
        'rounded-xl p-4',
        'border-l-4',
        borderColor,
        bgColor,
        className
      )}
      {...rest}
    >
      {/* Ícone */}
      <div className={cn('flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', iconBg)}>
        <Icon size={24} className="text-white" />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-base font-semibold text-[var(--ds-color-text)] mb-1">
            {title}
          </h4>
        )}
        <p className="text-sm text-[var(--ds-color-text-secondary)] leading-relaxed">
          {message}
        </p>
      </div>

      {/* Botão fechar (se dismissible) */}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text)] hover:bg-[var(--ds-color-hover)] transition-colors"
          aria-label="Fechar alerta"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}

Alert.displayName = 'Alert'
