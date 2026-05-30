/**
 * useTheme() - Hook para controle de tema dark/light
 * 
 * Gerencia tema (light/dark) com persistência em localStorage.
 * Aplica/remove classe .dark no <html>.
 * Sincroniza com prefers-color-scheme se não houver preferência salva.
 * 
 * @returns {object} - { theme, toggleTheme, setTheme }
 * 
 * Uso:
 *   const { theme, toggleTheme, setTheme } = useTheme()
 *   <button onClick={toggleTheme}>Toggle Theme</button>
 *   <button onClick={() => setTheme('dark')}>Dark Mode</button>
 */

import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage.js'

export function useTheme() {
  // Detecta preferência do sistema
  const getSystemTheme = () => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  // Estado persistido (usa sistema como fallback)
  const [theme, setTheme] = useLocalStorage('ds-theme', getSystemTheme())

  // Aplica classe .dark no <html>
  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // Sincroniza com mudanças na preferência do sistema (se usuário não escolheu)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      // Só atualiza se não houver preferência salva explícita
      const savedTheme = window.localStorage.getItem('ds-theme')
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    // Safari < 14
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [setTheme])

  // Toggle entre light e dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}
