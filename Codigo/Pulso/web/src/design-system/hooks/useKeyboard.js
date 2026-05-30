/**
 * useKeyboard() - Hook para atalhos de teclado
 * 
 * Gerencia múltiplos handlers de teclado em um único lugar.
 * 
 * @param {Object} handlers - Mapa de teclas → callbacks
 * 
 * Uso:
 *   useKeyboard({
 *     Escape: () => closeModal(),
 *     Enter: () => submitForm(),
 *     'Control+s': () => saveDocument(), // com modificadores
 *   })
 */

import { useEffect } from 'react'

export function useKeyboard(handlers) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Constrói string da tecla com modificadores
      const parts = []
      if (event.ctrlKey || event.metaKey) parts.push('Control')
      if (event.altKey) parts.push('Alt')
      if (event.shiftKey) parts.push('Shift')
      parts.push(event.key)
      
      const keyCombo = parts.join('+')

      // Tenta handlers com e sem modificadores
      const handler = handlers[keyCombo] || handlers[event.key]

      if (handler) {
        // Evita comportamento padrão (ex: Ctrl+S não salva página)
        event.preventDefault()
        handler(event)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}
