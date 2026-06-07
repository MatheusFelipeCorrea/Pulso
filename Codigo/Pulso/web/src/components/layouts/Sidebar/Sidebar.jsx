import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, User } from 'lucide-react'
import { PulsoBrand, PulsoLogoMark } from '@/components/features/auth/PulsoBrand'
import { InputSearch } from '@/design-system/components/inputs/InputSearch/InputSearch.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { cn } from '@/design-system/utils/cn.js'
import { useAppDispatch } from '@/store/hooks'
import { clearUser } from '@/store/slices/authSlice'
import { clearAuthTokens, logout as logoutApi } from '@/services/authService'
import { UserInfoCard } from './UserInfoCard'
import { SidebarNavItem, SidebarFooterItem } from './SidebarNavItem'

export function Sidebar({ mobile = false, onClose, sidebarState }) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    isCollapsed,
    searchQuery,
    openGroups,
    filteredNav,
    filteredFooter,
    setSearchQuery,
    toggleCollapse,
    toggleGroup,
  } = sidebarState

  const collapsed = !mobile && isCollapsed

  const handleLogout = async () => {
    try {
      await logoutApi()
    } catch {
      /* ignore */
    }
    clearAuthTokens()
    dispatch(clearUser())
    navigate('/login', { replace: true })
  }

  const handleNavigate = () => {
    if (mobile) onClose?.()
  }

  return (
    <aside
      className={cn(
        'sidebar',
        collapsed && 'sidebar--collapsed',
        mobile && 'sidebar--mobile'
      )}
      aria-label="Navegação principal"
    >
      <div className="sidebar__inner">
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-header__brand">
            {collapsed ? (
              <PulsoLogoMark size={32} className="sidebar-header__mark" />
            ) : (
              <PulsoBrand to="/dashboard" showTagline className="sidebar-header__logo" />
            )}
          </div>
          {!mobile && (
            <IconButton
              variant="ghost"
              size="sm"
              ariaLabel={collapsed ? 'Expandir menu' : 'Recolher menu'}
              icon={collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              onClick={toggleCollapse}
              className="sidebar-header__toggle"
            />
          )}
        </div>

        {/* Busca */}
        {!collapsed && (
          <div className="sidebar-search">
            <InputSearch
              size="compact"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
        )}

        {/* User card */}
        <UserInfoCard collapsed={collapsed} />

        {/* Nav principal */}
        <nav className="sidebar-nav" aria-label="Menus">
          {filteredNav.map((item) => (
            <SidebarNavItem
              key={item.id}
              item={item}
              collapsed={collapsed}
              isOpen={Boolean(openGroups[item.id])}
              onToggle={() => toggleGroup(item.id)}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>

        {/* Rodapé — Conta */}
        <div className="sidebar-footer">
          {!collapsed && (
            <div className="sidebar-footer__heading">
              <User size={16} aria-hidden />
              <span>Conta</span>
            </div>
          )}
          <div className="sidebar-footer__items">
            {filteredFooter.map((item) => (
              <SidebarFooterItem
                key={item.id}
                item={item}
                collapsed={collapsed}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export function SidebarDrawer({ open, onClose, sidebarState }) {
  if (!open) return null

  return (
    <>
      <button
        type="button"
        className="sidebar-backdrop"
        aria-label="Fechar menu"
        onClick={onClose}
      />
      <div className="sidebar-drawer">
        <Sidebar mobile onClose={onClose} sidebarState={sidebarState} />
      </div>
    </>
  )
}
