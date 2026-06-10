import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sidebar, SidebarDrawer } from '@/components/layouts/Sidebar/Sidebar'
import { useSidebarState } from '@/components/layouts/Sidebar/useSidebarState'
import { useIsDesktop } from '@/design-system/hooks/useMediaQuery'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { NotificationBell } from '@/components/layouts/NotificationBell/NotificationBell.jsx'
import { UserMenu } from '@/components/layouts/UserMenu/UserMenu.jsx'

export function MainLayout() {
  const isDesktop = useIsDesktop()
  const sidebarState = useSidebarState()
  const { isCollapsed, mobileOpen, openMobile, closeMobile } = sidebarState

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
            <NotificationBell />
            <UserMenu compact />
          </header>
        )}

        {isDesktop ? (
          <header className="main-layout__toolbar">
            <NotificationBell />
            <UserMenu />
          </header>
        ) : null}

        <main className="main-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
