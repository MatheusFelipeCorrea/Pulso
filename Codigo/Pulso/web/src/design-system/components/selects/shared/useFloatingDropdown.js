import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

const DROPDOWN_GAP = 4
const DEFAULT_MAX_HEIGHT = 240

/** Posiciona dropdown em `position: fixed` para não ser cortado por overflow em modais/tabelas */
export function useFloatingDropdown(isOpen, anchorRef) {
  const [position, setPosition] = useState(null)

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current
    if (!anchor) return

    const rect = anchor.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom - DROPDOWN_GAP
    const spaceAbove = rect.top - DROPDOWN_GAP
    const openUpward = spaceBelow < 120 && spaceAbove > spaceBelow

    if (openUpward) {
      setPosition({
        top: null,
        bottom: window.innerHeight - rect.top + DROPDOWN_GAP,
        left: rect.left,
        width: rect.width,
        maxHeight: Math.min(DEFAULT_MAX_HEIGHT, spaceAbove),
      })
      return
    }

    setPosition({
      top: rect.bottom + DROPDOWN_GAP,
      bottom: null,
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(DEFAULT_MAX_HEIGHT, spaceBelow),
    })
  }, [anchorRef])

  useLayoutEffect(() => {
    if (!isOpen) {
      setPosition(null)
      return
    }
    updatePosition()
  }, [isOpen, updatePosition])

  useEffect(() => {
    if (!isOpen) return

    const onScrollOrResize = () => updatePosition()
    window.addEventListener('resize', onScrollOrResize)
    window.addEventListener('scroll', onScrollOrResize, true)
    return () => {
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('scroll', onScrollOrResize, true)
    }
  }, [isOpen, updatePosition])

  return position
}
