import { useEffect } from 'react'
import {
  ThemeContext,
  applyThemeClass,
  useThemeState,
} from '@/design-system/hooks/useTheme.js'

/** Estado único do tema — sincroniza header, mockup e demais consumidores de useTheme() */
export function ThemeProvider({ children }) {
  const value = useThemeState()

  useEffect(() => {
    applyThemeClass(value.theme)
  }, [value.theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
