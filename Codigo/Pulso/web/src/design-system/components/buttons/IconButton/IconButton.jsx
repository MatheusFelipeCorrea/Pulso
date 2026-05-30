import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { iconButtonVariants } from './IconButton.styles.jsx'

/**
 * IconButton — botão com ícone (circular ou pílula com label)
 *
 * @example
 * ```jsx
 * // Circular (toolbar, cards)
 * <IconButton icon={<Edit size={20} />} aria-label="Editar" />
 *
 * // Pílula com texto
 * <IconButton icon={<Plus size={20} />} label="Criar novo" />
 *
 * // Tooltip nativo quando sem label visível
 * <IconButton icon={<X size={20} />} tooltip="Fechar" aria-label="Fechar" />
 * ```
 */
export const IconButton = forwardRef(
  (
    {
      icon,
      label,
      variant = 'ghost',
      size = 'md',
      loading = false,
      disabled = false,
      tooltip,
      ariaLabel,
      className,
      onClick,
      type = 'button',
      'aria-label': ariaLabelFromRest,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading
    const hasLabel = Boolean(label)

    const resolvedAriaLabel =
      ariaLabel ?? ariaLabelFromRest ?? (!hasLabel ? tooltip : undefined)

    const spinnerSize = { sm: 14, md: 16, lg: 18 }[size]

    const handleClick = (e) => {
      if (isDisabled) {
        e.preventDefault()
        return
      }
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        aria-label={resolvedAriaLabel}
        title={tooltip}
        className={cn(
          iconButtonVariants({ variant, size, labeled: hasLabel }),
          className
        )}
        onClick={handleClick}
        {...rest}
      >
        {loading ? (
          <>
            <span className="invisible inline-flex items-center gap-1.5">
              <span className="inline-flex shrink-0 items-center justify-center">
                {icon}
              </span>
              {label && <span>{label}</span>}
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={spinnerSize} className="animate-spin" />
            </span>
          </>
        ) : (
          <>
            <span className="inline-flex shrink-0 items-center justify-center">
              {icon}
            </span>
            {label && <span>{label}</span>}
          </>
        )}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
