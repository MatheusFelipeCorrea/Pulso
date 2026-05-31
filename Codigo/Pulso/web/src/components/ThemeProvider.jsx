import { useTheme } from '@/design-system/hooks/useTheme.js'

/** Aplica tema dark/light uma vez na raiz da app */
export function ThemeProvider({ children }) {
  useTheme()
  return children
}
