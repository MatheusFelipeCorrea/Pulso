import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sidebar, SidebarDrawer } from '@/components/layouts/Sidebar/Sidebar'
import { useSidebarState } from '@/components/layouts/Sidebar/useSidebarState'
import { useIsDesktop } from '@/design-system/hooks/useMediaQuery'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { useTheme } from '@/design-system/hooks/useTheme'
import { Moon, Sun } from 'lucide-react'

export function MainLayout() {
  const isDesktop = useIsDesktop()
  const sidebarState = useSidebarState()
  const { isCollapsed, mobileOpen, openMobile, closeMobile } = sidebarState
  const { theme, toggleTheme } = useTheme()

  return (
    <div
      className="main-layout"
      data-sidebar-collapsed={isDesktop && isCollapsed ? 'true' : 'false'}
    >
      {isDesktop ? (
        <Sidebar sidebarState={sidebarState} />
      ) : (
        <SidebarDrawer open={mobileOpen} onClose={closeMobile} sidebarState={sidebarState} />
      )}

      <div className="main-layout__content">
        {!isDesktop && (
          <header className="main-layout__mobile-header">
            <IconButton
              variant="ghost"
              size="md"
              ariaLabel="Abrir menu"
              icon={<Menu size={22} />}
              onClick={openMobile}
            />
            <span className="main-layout__mobile-title">Pulso</span>
            <IconButton
              variant="ghost"
              size="md"
              ariaLabel={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
              icon={theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              onClick={toggleTheme}
            />
          </header>
        )}

        <main className="main-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
