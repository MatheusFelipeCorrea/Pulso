/**
 * useLocalStorage() - Hook para persistência em localStorage
 * 
 * Sincroniza estado React com localStorage.
 * Serializa/deserializa JSON automaticamente.
 * 
 * @param {string} key - Chave do localStorage
 * @param {any} initialValue - Valor inicial se não existir
 * @returns {[value, setValue]} - [valor, setter]
 * 
 * Uso:
 *   const [theme, setTheme] = useLocalStorage('theme', 'light')
 *   setTheme('dark') // salva automaticamente
 */

import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  // Estado inicial: lê do localStorage ou usa valor padrão
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`useLocalStorage: Error reading key "${key}":`, error)
      return initialValue
    }
  })

  // Setter: atualiza estado e localStorage
  const setValue = (value) => {
    try {
      // Permite usar função como no useState
      const valueToStore = value instanceof Function
        ? value(storedValue)
        : value

      setStoredValue(valueToStore)

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`useLocalStorage: Error setting key "${key}":`, error)
    }
  }

  // Sincroniza com mudanças de outras abas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.warn(`useLocalStorage: Error syncing key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}
