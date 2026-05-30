import { useState, useRef, useEffect, useCallback } from 'react'
import { useClickOutside } from '../../../hooks/useClickOutside.js'

/** Hook compartilhado: abrir/fechar dropdown (click outside + Esc) */
export function useSelectDropdown(disabled = false) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  const close = useCallback(() => setIsOpen(false), [])

  useClickOutside(ref, close)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [close])

  const toggle = () => {
    if (!disabled) setIsOpen((o) => !o)
  }

  return { isOpen, setIsOpen, toggle, close, ref }
}
