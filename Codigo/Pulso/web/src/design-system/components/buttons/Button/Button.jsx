import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { buttonVariants } from './Button.styles.jsx'

/**
 * Button - Componente de botão genérico
 * 
 * @component
 * @example
 * ```jsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Salvar
 * </Button>
 * 
 * <Button variant="secondary" leftIcon={<Plus />} loading>
 *   Criar novo
 * </Button>
 * ```
 * 
 * @param {object} props
 * @param {('primary'|'secondary'|'ghost'|'danger'|'success')} [props.variant='primary'] - Variante visual
 * @param {('sm'|'md'|'lg')} [props.size='md'] - Tamanho do botão
 * @param {boolean} [props.fullWidth=false] - Se deve ocupar 100% da largura
 * @param {boolean} [props.loading=false] - Exibe spinner e desabilita interação
 * @param {boolean} [props.disabled=false] - Desabilita o botão
 * @param {React.ReactNode} [props.leftIcon] - Ícone à esquerda do texto
 * @param {React.ReactNode} [props.rightIcon] - Ícone à direita do texto
 * @param {React.ReactNode} props.children - Conteúdo do botão (texto)
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {function} [props.onClick] - Callback ao clicar
 * @param {string} [props.type='button'] - Tipo do botão HTML
 */
export const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
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
    // TAMANHOS DOS ÍCONES BASEADO NO SIZE DO BOTÃO
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
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          className
        )}
        onClick={handleClick}
        {...rest}
      >
        {/* Spinner de loading (substitui leftIcon) */}
        {loading && (
          <Loader2 
            size={iconSize} 
            className="animate-spin" 
          />
        )}

        {/* Ícone esquerdo */}
        {!loading && leftIcon && (
          <span className="inline-flex items-center justify-center">
            {leftIcon}
          </span>
        )}

        {/* Texto do botão */}
        {children && (
          <span className="inline-flex shrink-0 items-center whitespace-nowrap">
            {children}
          </span>
        )}

        {/* Ícone direito */}
        {rightIcon && (
          <span className="inline-flex items-center justify-center">
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
