/**
 * useToggle() - Hook para estado boolean com controles
 * 
 * Simplifica gerenciamento de estados on/off (modals, dropdowns, etc.)
 * 
 * @param {boolean} initialValue - Valor inicial (padrão: false)
 * @returns {[isOpen, toggle, open, close]} - [estado, toggle, abrir, fechar]
 * 
 * Uso:
 *   const [isOpen, toggle, open, close] = useToggle()
 *   <button onClick={toggle}>Toggle</button>
 *   <button onClick={open}>Abrir</button>
 *   <button onClick={close}>Fechar</button>
 *   {isOpen && <Modal />}
 */

import { useState, useCallback } from 'react'

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  // Toggle: inverte o estado
  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  // Open: força estado true
  const open = useCallback(() => {
    setValue(true)
  }, [])

  // Close: força estado false
  const close = useCallback(() => {
    setValue(false)
  }, [])

  return [value, toggle, open, close]
}
