import {
  useState,
  useRef,
  cloneElement,
  isValidElement,
  useEffect,
  useCallback,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../../utils/cn.js'
import { tooltipWrapperVariants } from './Tooltip.styles.jsx'

const FLOATING_TOOLTIP_CLASS = [
  'fixed z-[var(--ds-z-tooltip)]',
  'px-3 py-2',
  'text-sm',
  'font-medium',
  'rounded-md',
  'shadow-lg',
  'pointer-events-none',
  'whitespace-nowrap',
  'bg-[var(--ds-color-tooltip-bg)]',
  'text-[var(--ds-color-tooltip-text)]',
  'transition-opacity',
  'duration-[var(--ds-transition-fast)]',
  'opacity-100',
].join(' ')

function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') ref(node)
      else if (ref != null) ref.current = node
    })
  }
}

function getFloatingCoords(rect, position) {
  const gap = 8

  switch (position) {
    case 'bottom':
      return {
        top: rect.bottom + gap,
        left: rect.left + rect.width / 2,
        transform: 'translateX(-50%)',
      }
    case 'left':
      return {
        top: rect.top + rect.height / 2,
        left: rect.left - gap,
        transform: 'translate(-100%, -50%)',
      }
    case 'right':
      return {
        top: rect.top + rect.height / 2,
        left: rect.right + gap,
        transform: 'translateY(-50%)',
      }
    default:
      return {
        top: rect.top - gap,
        left: rect.left + rect.width / 2,
        transform: 'translate(-50%, -100%)',
      }
  }
}

/**
 * Tooltip - Dica contextual
 *
 * Renderiza o conteúdo em portal (document.body) para não ser cortado
 * por containers com overflow:hidden.
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
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState(null)
  const timeoutRef = useRef(null)
  const triggerRef = useRef(null)

  const updateCoords = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setCoords(getFloatingCoords(rect, position))
  }, [position])

  const showTooltip = useCallback(() => {
    if (disabled || !content) return
    timeoutRef.current = setTimeout(() => {
      updateCoords()
      setVisible(true)
    }, delay)
  }, [disabled, content, delay, updateCoords])

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setVisible(false)
  }, [])

  useEffect(() => {
    if (!visible) return undefined

    const handleReposition = () => updateCoords()
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)

    return () => {
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [visible, updateCoords])

  if (!isValidElement(children)) {
    console.warn('Tooltip: children deve ser um elemento React válido')
    return children
  }

  const childWithHandlers = cloneElement(children, {
    ref: mergeRefs(triggerRef, children.ref),
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

  return (
    <>
      <div className={cn(tooltipWrapperVariants({ fullWidth }), wrapperClassName)}>
        {childWithHandlers}
      </div>

      {visible && coords && typeof document !== 'undefined'
        ? createPortal(
            <div
              role="tooltip"
              className={cn(FLOATING_TOOLTIP_CLASS, className)}
              style={{
                top: coords.top,
                left: coords.left,
                transform: coords.transform,
              }}
            >
              {content}
            </div>,
            document.body
          )
        : null}
    </>
  )
}

Tooltip.displayName = 'Tooltip'
