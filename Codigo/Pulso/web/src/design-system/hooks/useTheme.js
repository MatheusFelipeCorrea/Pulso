/**
 * useTheme() - Hook para controle de tema dark/light
 *
 * Estado compartilhado via ThemeProvider (evita dessincronia entre header, mockup, etc.).
 *
 * @returns {object} - { theme, preference, setTheme, setThemePreference, toggleTheme }
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from './useLocalStorage.js'

const PREFERENCE_KEY = 'ds-theme-preference'
const LEGACY_KEY = 'ds-theme'

export const ThemeContext = createContext(null)

export function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  if (typeof window.matchMedia !== 'function') return 'light'

  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function readInitialPreference() {
  if (typeof window === 'undefined') return 'system'

  try {
    const stored = window.localStorage.getItem(PREFERENCE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed === 'system' || parsed === 'light' || parsed === 'dark') {
        return parsed
      }
    }

    const legacy = window.localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const parsed = JSON.parse(legacy)
      if (parsed === 'light' || parsed === 'dark') {
        window.localStorage.setItem(PREFERENCE_KEY, JSON.stringify(parsed))
        window.localStorage.removeItem(LEGACY_KEY)
        return parsed
      }
    }
  } catch {
    // ignora erros de parse
  }

  return 'system'
}

export function applyThemeClass(theme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function useThemeState() {
  const [preference, setPreference] = useLocalStorage(PREFERENCE_KEY, readInitialPreference())
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)

  const theme = preference === 'system' ? systemTheme : preference

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (event) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  const setThemePreference = (nextPreference) => {
    if (nextPreference === 'system' || nextPreference === 'light' || nextPreference === 'dark') {
      setPreference(nextPreference)
    }
  }

  const setTheme = (nextTheme) => {
    setThemePreference(nextTheme === 'light' || nextTheme === 'dark' ? nextTheme : 'system')
  }

  const toggleTheme = () => {
    setPreference((prev) => {
      const resolved = prev === 'system' ? systemTheme : prev
      return resolved === 'light' ? 'dark' : 'light'
    })
  }

  return {
    theme,
    preference,
    setTheme,
    setThemePreference,
    toggleTheme,
  }
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider')
  }
  return context
}
