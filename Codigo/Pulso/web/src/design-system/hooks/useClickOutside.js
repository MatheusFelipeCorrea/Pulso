/**
 * useClickOutside() - Hook para detectar cliques fora de um elemento
 * 
 * Útil para fechar dropdowns, modals, tooltips, etc.
 * 
 * @param {React.RefObject} ref - Ref do elemento a monitorar
 * @param {Function} callback - Função chamada ao clicar fora
 * 
 * Uso:
 *   const dropdownRef = useRef(null)
 *   useClickOutside(dropdownRef, () => setIsOpen(false))
 */

import { useEffect } from 'react'

export function useClickOutside(ref, callback) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Se o clique foi fora do elemento (ref atual não contém o target)
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event)
      }
    }

    // Adiciona listeners para mouse e touch
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [ref, callback])
}
