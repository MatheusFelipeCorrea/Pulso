/**
 * useMediaQuery() - Hook para media queries responsivas
 * 
 * Monitora media query e retorna boolean.
 * 
 * @param {string} query - Media query CSS (ex: "(min-width: 768px)")
 * @returns {boolean} - true se a media query corresponde
 * 
 * Uso:
 *   const isMobile = useMediaQuery('(max-width: 768px)')
 *   const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
 * 
 * Exports de conveniência:
 *   const isMobile = useIsMobile()   // < 768px
 *   const isTablet = useIsTablet()   // < 1024px
 *   const isDesktop = useIsDesktop() // >= 1024px
 */

import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    
    // Handler de mudança
    const handleChange = (e) => {
      setMatches(e.matches)
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
  }, [query])

  return matches
}

/**
 * Exports de conveniência para breakpoints comuns
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)')
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)')
}
