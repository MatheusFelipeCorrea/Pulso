import { useState, useRef, useEffect, useCallback } from 'react'

/** Hook compartilhado: abrir/fechar dropdown (click outside + Esc) */
export function useSelectDropdown(disabled = false) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  const dropdownRef = useRef(null)

  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event) => {
      if (ref.current?.contains(event.target)) return
      if (dropdownRef.current?.contains(event.target)) return
      close()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen, close])

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

  return { isOpen, setIsOpen, toggle, close, ref, dropdownRef }
}
