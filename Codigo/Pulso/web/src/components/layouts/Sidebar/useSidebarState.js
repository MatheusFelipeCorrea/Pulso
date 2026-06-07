import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SIDEBAR_NAV, SIDEBAR_NAV_FOOTER } from '@/config/sidebarNavigation'
import { useAppSelector } from '@/store/hooks'
import { filterSidebarNavForUser } from '@/utils/transportUtils.js'

const STORAGE_KEY = 'sidebar_collapsed'

export function flattenNavItems(items = SIDEBAR_NAV) {
  const flat = []

  for (const item of items) {
    if (item.path) {
      flat.push({ ...item, parentLabel: null })
    }
    if (item.children) {
      for (const child of item.children) {
        flat.push({ ...child, parentLabel: item.label })
      }
    }
  }

  return flat
}

export function useSidebarState() {
  const location = useLocation()
  const user = useAppSelector((state) => state.auth.user)
  const navForUser = useMemo(() => filterSidebarNavForUser(SIDEBAR_NAV, user), [user])
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [openGroups, setOpenGroups] = useState({})

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isCollapsed))
    } catch {
      /* ignore */
    }
  }, [isCollapsed])

  // Abre o grupo do item ativo ao navegar
  useEffect(() => {
    const path = location.pathname
    for (const item of navForUser) {
      if (item.children?.some((child) => child.path === path)) {
        setOpenGroups((prev) => ({ ...prev, [item.id]: true }))
      }
    }
    setMobileOpen(false)
  }, [location.pathname, navForUser])

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev)
  }, [])

  const toggleGroup = useCallback((groupId) => {
    setOpenGroups((prev) => {
      const isOpen = prev[groupId]
      return isOpen ? {} : { [groupId]: true }
    })
  }, [])

  const filteredNav = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return navForUser

    return navForUser.map((item) => {
      if (item.path) {
        return item.label.toLowerCase().includes(query) ? item : null
      }

      const matchingChildren = item.children?.filter(
        (child) =>
          child.label.toLowerCase().includes(query) ||
          item.label.toLowerCase().includes(query)
      )

      if (matchingChildren?.length) {
        return { ...item, children: matchingChildren }
      }

      return item.label.toLowerCase().includes(query) ? item : null
    }).filter(Boolean)
  }, [searchQuery, navForUser])

  const filteredFooter = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return SIDEBAR_NAV_FOOTER

    return SIDEBAR_NAV_FOOTER.filter((item) => item.label.toLowerCase().includes(query))
  }, [searchQuery])

  const allFlatItems = useMemo(() => {
    const main = flattenNavItems(filteredNav)
    const footer = filteredFooter
      .filter((item) => item.path)
      .map((item) => ({ ...item, parentLabel: 'Conta' }))
    return [...main, ...footer]
  }, [filteredNav, filteredFooter])

  return {
    isCollapsed,
    mobileOpen,
    searchQuery,
    openGroups,
    filteredNav,
    filteredFooter,
    allFlatItems,
    setSearchQuery,
    toggleCollapse,
    toggleGroup,
    setMobileOpen,
    openMobile: () => setMobileOpen(true),
    closeMobile: () => setMobileOpen(false),
  }
}
