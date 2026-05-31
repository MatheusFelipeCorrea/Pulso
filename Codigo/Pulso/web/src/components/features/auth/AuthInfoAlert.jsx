import { Shield } from 'lucide-react'
import { cn } from '@/design-system/utils/cn.js'

/**
 * Callout informativo das telas de auth — estilo Pulso (roxo, ícone outline).
 */
export function AuthInfoAlert({
  title,
  message,
  icon: Icon = Shield,
  className,
}) {
  return (
    <div
      role="alert"
      className={cn('auth-info-alert', title && 'auth-info-alert--stacked', className)}
    >
      <span className="auth-info-alert__icon" aria-hidden="true">
        <Icon size={18} strokeWidth={2} />
      </span>
      <div className="auth-info-alert__content">
        {title ? <p className="auth-info-alert__title">{title}</p> : null}
        <p className={cn('auth-info-alert__message', !title && 'auth-info-alert__message--solo')}>
          {message}
        </p>
      </div>
    </div>
  )
}
