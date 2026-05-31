import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { iconButtonVariants } from './IconButton.styles.jsx'

/**
 * IconButton - Botão circular apenas com ícone
 * 
 * @component
 * @example
 * ```jsx
 * <IconButton variant="primary" icon={<Edit />} />
 * <IconButton variant="danger" size="sm" icon={<Trash />} />
 * <IconButton variant="ghost" icon={<X />} onClick={onClose} />
 * ```
 * 
 * @param {object} props
 * @param {React.ReactNode} props.icon - Ícone a ser exibido (componente lucide-react)
 * @param {('primary'|'secondary'|'ghost'|'danger'|'success')} [props.variant='primary']
 * @param {('sm'|'md'|'lg')} [props.size='md']
 * @param {boolean} [props.loading=false] - Exibe spinner no lugar do ícone
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.ariaLabel] - Label acessível (OBRIGATÓRIO para botões sem texto)
 * @param {string} [props.className]
 * @param {function} [props.onClick]
 * @param {string} [props.type='button']
 */
export const IconButton = forwardRef(
  (
    {
      icon,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      ariaLabel,
      className,
      onClick,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    // ============================================================
    // ESTADOS
    // ============================================================
    const isDisabled = disabled || loading

    // ============================================================
    // HANDLERS
    // ============================================================
    const handleClick = (e) => {
      if (isDisabled) {
        e.preventDefault()
        return
      }
      onClick?.(e)
    }

    // ============================================================
    // TAMANHOS DOS ÍCONES
    // ============================================================
    const iconSize = {
      sm: 16,
      md: 20,
      lg: 20,
    }[size]

    // ============================================================
    // RENDER
    // ============================================================
    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-label={ariaLabel}
        className={cn(
          iconButtonVariants({ variant, size }),
          className
        )}
        onClick={handleClick}
        {...rest}
      >
        {loading ? (
          <Loader2 size={iconSize} className="animate-spin" />
        ) : (
          <span className="inline-flex items-center justify-center">
            {icon}
          </span>
        )}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
