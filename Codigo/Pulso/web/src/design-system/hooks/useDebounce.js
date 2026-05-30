/**
 * useDebounce() - Hook para debounce de valores
 * 
 * Atrasa a atualização de um valor até que ele pare de mudar por X ms.
 * Útil para inputs de busca, filtros, etc.
 * 
 * @param {any} value - Valor a ser debounced
 * @param {number} delay - Delay em ms (padrão: 300)
 * @returns {any} - Valor debounced
 * 
 * Uso:
 *   const [searchTerm, setSearchTerm] = useState('')
 *   const debouncedSearch = useDebounce(searchTerm, 500)
 *   // debouncedSearch só atualiza 500ms após última digitação
 */

import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Cria timeout para atualizar após delay
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Limpa timeout anterior se value mudar antes do delay
    return () => {
      clearTimeout(timeoutId)
    }
  }, [value, delay])

  return debouncedValue
}
