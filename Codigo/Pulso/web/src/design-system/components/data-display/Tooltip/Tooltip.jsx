import { useState, useRef, cloneElement, isValidElement } from 'react'
import { cn } from '../../../utils/cn.js'
import { tooltipVariants, tooltipWrapperVariants } from './Tooltip.styles.jsx'

/**
 * Tooltip - Dica contextual
 * 
 * @component
 * @example
 * ```jsx
 * <Tooltip content="Editar usuário">
 *   <IconButton icon={<Edit />} />
 * </Tooltip>
 * 
 * <Tooltip content="Salvar alterações" position="bottom">
 *   <Button>Salvar</Button>
 * </Tooltip>
 * 
 * <Tooltip content="Descrição longa aqui" position="right" disabled={false}>
 *   <span>Passe o mouse aqui</span>
 * </Tooltip>
 * ```
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Elemento que dispara o tooltip (deve aceitar onMouseEnter/Leave, onFocus/Blur)
 * @param {React.ReactNode} props.content - Conteúdo do tooltip (texto ou JSX)
 * @param {('top'|'bottom'|'left'|'right')} [props.position='top'] - Posição do tooltip
 * @param {boolean} [props.disabled=false] - Se true, não exibe o tooltip
 * @param {number} [props.delay=200] - Delay em ms antes de exibir (evita flicker)
 * @param {boolean} [props.fullWidth=false] - Se o wrapper deve ser 100% width
 * @param {string} [props.className] - Classes adicionais no tooltip
 * @param {string} [props.wrapperClassName] - Classes adicionais no wrapper
 */
export const Tooltip = ({
  children,
  content,
  position = 'top',
  disabled = false,
  delay = 200,
  fullWidth = false,
  className,
  wrapperClassName,
}) => {
  // ============================================================
  // ESTADOS
  // ============================================================
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef(null)

  // ============================================================
  // HANDLERS
  // ============================================================
  const showTooltip = () => {
    if (disabled || !content) return
    timeoutRef.current = setTimeout(() => {
      setVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setVisible(false)
  }

  // ============================================================
  // VALIDAÇÃO: children deve ser um único elemento React
  // ============================================================
  if (!isValidElement(children)) {
    console.warn('Tooltip: children deve ser um elemento React válido')
    return children
  }

  // Se disabled ou sem content, retorna apenas o children
  if (disabled || !content) {
    return children
  }

  // ============================================================
  // CLONE DO CHILDREN COM EVENT HANDLERS
  // ============================================================
  const childWithHandlers = cloneElement(children, {
    onMouseEnter: (e) => {
      showTooltip()
      children.props.onMouseEnter?.(e)
    },
    onMouseLeave: (e) => {
      hideTooltip()
      children.props.onMouseLeave?.(e)
    },
    onFocus: (e) => {
      showTooltip()
      children.props.onFocus?.(e)
    },
    onBlur: (e) => {
      hideTooltip()
      children.props.onBlur?.(e)
    },
  })

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className={cn(tooltipWrapperVariants({ fullWidth }), wrapperClassName)}>
      {childWithHandlers}

      {/* Tooltip */}
      <div
        role="tooltip"
        className={cn(
          tooltipVariants({ position, visible }),
          className
        )}
      >
        {content}
      </div>
    </div>
  )
}

Tooltip.displayName = 'Tooltip'
