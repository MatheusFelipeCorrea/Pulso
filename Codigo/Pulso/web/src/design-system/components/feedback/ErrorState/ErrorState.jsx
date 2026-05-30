import { AlertTriangle, RefreshCw, ArrowLeft, Unplug, Lock, Wrench, Loader2 } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { Button } from '../../buttons/Button/Button.jsx'
import { errorStateRootVariants, errorStateIconWrapVariants } from './ErrorState.styles.jsx'

const ERROR_TYPE_ICONS = {
  generic: AlertTriangle,
  connection: Unplug,
  permission: Lock,
  server: Wrench,
}

/**
 * ErrorState — falha de requisição (fullpage, inline, card)
 */
export const ErrorState = ({
  variant = 'fullpage',
  errorType = 'generic',
  icon,
  title = 'Algo deu errado',
  message = 'Não foi possível carregar os dados. Verifique sua conexão.',
  onRetry,
  retryLabel = 'Tentar novamente',
  loading = false,
  secondaryAction,
  size = 'default',
  className,
}) => {
  const IconComponent = ERROR_TYPE_ICONS[errorType] ?? AlertTriangle
  const iconNode = icon ?? <IconComponent strokeWidth={1.75} />

  const retryButton = onRetry && (
    <Button
      variant="primary"
      size={size === 'compact' ? 'sm' : 'md'}
      onClick={onRetry}
      loading={loading}
      disabled={loading}
      leftIcon={<RefreshCw size={16} />}
    >
      {retryLabel}
    </Button>
  )

  const retryLink = onRetry && (
    <button
      type="button"
      onClick={onRetry}
      disabled={loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-[var(--ds-color-primary)]',
        'transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'inline' && 'sm:ml-auto'
      )}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
      ) : (
        <RefreshCw size={14} aria-hidden="true" />
      )}
      {retryLabel}
    </button>
  )

  const secondaryLink = secondaryAction && (
    <button
      type="button"
      onClick={secondaryAction.onClick}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ds-color-primary)] transition-opacity hover:opacity-80"
    >
      <ArrowLeft size={16} />
      {secondaryAction.label}
    </button>
  )

  if (variant === 'inline') {
    return (
      <div
        role="alert"
        className={cn(errorStateRootVariants({ variant, size }), className)}
      >
        <div className={errorStateIconWrapVariants({ variant, size })}>{iconNode}</div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-semibold text-[var(--ds-color-text)]">{title}</p>
          {message && (
            <p className="mt-0.5 text-xs text-[var(--ds-color-text-secondary)]">{message}</p>
          )}
        </div>
        {retryLink}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div
        role="alert"
        className={cn(errorStateRootVariants({ variant, size }), className)}
      >
        <div className={errorStateIconWrapVariants({ variant, size })}>{iconNode}</div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-base font-semibold text-[var(--ds-color-text)]">{title}</p>
          {message && (
            <p className="mt-1 text-sm text-[var(--ds-color-text-secondary)]">{message}</p>
          )}
          {onRetry && <div className="mt-4 sm:mt-3">{retryButton}</div>}
        </div>
      </div>
    )
  }

  return (
    <div
      role="alert"
      className={cn(errorStateRootVariants({ variant, size }), className)}
    >
      <div className={errorStateIconWrapVariants({ variant, size })}>{iconNode}</div>
      <h3 className="text-base font-semibold text-[var(--ds-color-text)] sm:text-lg">
        {title}
      </h3>
      {message && (
        <p className="max-w-sm text-sm text-[var(--ds-color-text-secondary)]">{message}</p>
      )}
      <div className="flex flex-col items-center gap-3 pt-2">
        {retryButton}
        {secondaryLink}
      </div>
    </div>
  )
}
