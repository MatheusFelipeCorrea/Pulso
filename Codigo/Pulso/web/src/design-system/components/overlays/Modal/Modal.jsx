import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../../utils/cn.js'
import { useKeyboard } from '../../../hooks/useKeyboard.js'
import { modalOverlayVariants, modalContentVariants } from './Modal.styles.jsx'

/** Modal — overlay com portal, Esc e click outside */
export const Modal = ({
  isOpen,
  onClose,
  size = 'md',
  closeOnOverlay = true,
  children,
  className,
  overlayClassName,
}) => {
  const handleClose = useCallback(() => onClose?.(), [onClose])

  useKeyboard(isOpen ? { Escape: handleClose } : {})

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      className={cn(modalOverlayVariants(), overlayClassName)}
      onClick={closeOnOverlay ? handleClose : undefined}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(modalContentVariants({ size }), className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
