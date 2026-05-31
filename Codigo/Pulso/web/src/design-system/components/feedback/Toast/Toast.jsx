import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '../../../utils/cn.js'

/**
 * Toast - Notificação temporária
 * 
 * Conforme protótipo:
 * - 4 tipos: success, error, warning, info
 * - Barra colorida à esquerda (4px)
 * - Ícone circular colorido (40px)
 * - Título + mensagem
 * - Botão X para fechar
 * - Barra de progresso embaixo (indica tempo restante)
 * - Auto-dismiss: 4s (default)
 * - Max-width: 360px
 * - Border-radius: 12px
 * - Padding: 16px
 * - Shadow: forte
 * 
 * @component
 * @example
 * ```jsx
 * <Toast
 *   type="success"
 *   title="Sucesso"
 *   message="Transação salva com sucesso"
 *   onClose={handleClose}
 * />
 * ```
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

  // ============================================================
  // CONFIGURAÇÕES POR TIPO
  // ============================================================
  const config = {
    success: {
      icon: CheckCircle,
      iconBg: 'bg-[#10B981]',
      borderColor: 'border-l-[#10B981]',
      progressBg: 'bg-[#10B981]',
      title: title || 'Sucesso',
    },
    error: {
      icon: XCircle,
      iconBg: 'bg-[#EF4444]',
      borderColor: 'border-l-[#EF4444]',
      progressBg: 'bg-[#EF4444]',
      title: title || 'Erro',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-[#F59E0B]',
      borderColor: 'border-l-[#F59E0B]',
      progressBg: 'bg-[#F59E0B]',
      title: title || 'Atenção',
    },
    info: {
      icon: Info,
      iconBg: 'bg-[#3B82F6]',
      borderColor: 'border-l-[#3B82F6]',
      progressBg: 'bg-[#3B82F6]',
      title: title || 'Informação',
    },
  }

  const { icon: Icon, iconBg, borderColor, progressBg, title: defaultTitle } = config[type]

  // ============================================================
  // AUTO-DISMISS COM PROGRESS BAR
  // ============================================================
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 50))
        if (newProgress <= 0) {
          clearInterval(interval)
          handleClose()
          return 0
        }
        return newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [duration])

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose?.(id)
    }, 300) // duração da animação de saída
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div
      role="alert"
      className={cn(
        'relative flex items-start gap-3 w-full max-w-[360px]',
        'bg-[var(--ds-color-modal-bg)] rounded-xl shadow-lg',
        'border-l-4 p-4',
        'overflow-hidden',
        borderColor,
        isExiting ? 'animate-toast-exit' : 'animate-toast-enter',
        className
      )}
    >
      {/* Ícone */}
      <div className={cn('flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', iconBg)}>
        <Icon size={24} className="text-white" />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-semibold text-[var(--ds-color-text)] mb-1">
          {title || defaultTitle}
        </h4>
        <p className="text-sm text-[var(--ds-color-text-secondary)] leading-relaxed">
          {message}
        </p>
      </div>

      {/* Botão fechar */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text)] hover:bg-[var(--ds-color-hover)] transition-colors"
        aria-label="Fechar notificação"
      >
        <X size={18} />
      </button>

      {/* Barra de progresso */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--ds-color-border)]">
        <div
          className={cn('h-full transition-all duration-50 ease-linear', progressBg)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

Toast.displayName = 'Toast'
