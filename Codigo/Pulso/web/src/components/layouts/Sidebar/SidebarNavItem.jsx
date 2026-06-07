import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/design-system/utils/cn.js'
import { SidebarIcon } from './sidebarIcons'

function NavLeaf({ item, collapsed, onNavigate }) {
  const location = useLocation()
  const isActive = item.path === location.pathname

  const link = (
    <NavLink
      to={item.path}
      end
      onClick={onNavigate}
      className={cn('sidebar-link', isActive && 'sidebar-link--active')}
      title={collapsed ? item.label : undefined}
    >
      <span className="sidebar-link__icon">
        <SidebarIcon name={item.icon} size={20} />
      </span>
      {!collapsed && <span className="sidebar-link__label">{item.label}</span>}
    </NavLink>
  )

  if (collapsed) {
    return (
      <div className="sidebar-item sidebar-item--collapsed" data-tooltip={item.label}>
        {link}
      </div>
    )
  }

  return <div className="sidebar-item">{link}</div>
}

function NavGroup({ item, collapsed, isOpen, onToggle, onNavigate }) {
  const location = useLocation()
  const hasActiveChild = item.children?.some((child) => child.path === location.pathname)

  if (collapsed) {
    return (
      <div className="sidebar-item sidebar-item--collapsed" data-tooltip={item.label}>
        <button
          type="button"
          className={cn('sidebar-link sidebar-link--button', hasActiveChild && 'sidebar-link--active')}
          onClick={onToggle}
          aria-label={item.label}
        >
          <span className="sidebar-link__icon">
            <SidebarIcon name={item.icon} size={20} />
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className={cn('sidebar-group', isOpen && 'sidebar-group--open')}>
      <button
        type="button"
        className={cn(
          'sidebar-link sidebar-link--button sidebar-link--group',
          hasActiveChild && !isOpen && 'sidebar-link--parent-active'
        )}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="sidebar-link__icon">
          <SidebarIcon name={item.icon} size={20} />
        </span>
        <span className="sidebar-link__label">{item.label}</span>
        <ChevronDown
          size={16}
          className={cn('sidebar-link__chevron', isOpen && 'sidebar-link__chevron--open')}
          aria-hidden
        />
      </button>

      <div className="sidebar-submenu" aria-hidden={!isOpen}>
        <div className="sidebar-submenu__panel">
          <div className="sidebar-submenu__rail" aria-hidden />
          <div className="sidebar-submenu__items">
            {item.children?.map((child) => {
              const isActive = child.path === location.pathname
              return (
                <NavLink
                  key={child.id}
                  to={child.path}
                  onClick={onNavigate}
                  className={cn('sidebar-sublink', isActive && 'sidebar-sublink--active')}
                  tabIndex={isOpen ? 0 : -1}
                >
                  <span className="sidebar-sublink__icon">
                    <SidebarIcon name={child.icon} size={18} />
                  </span>
                  <span className="sidebar-sublink__label">{child.label}</span>
                </NavLink>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SidebarNavItem({ item, collapsed, isOpen, onToggle, onNavigate }) {
  if (item.path) {
    return <NavLeaf item={item} collapsed={collapsed} onNavigate={onNavigate} />
  }

  return (
    <NavGroup
      item={item}
      collapsed={collapsed}
      isOpen={isOpen}
      onToggle={onToggle}
      onNavigate={onNavigate}
    />
  )
}

export function SidebarFooterItem({ item, collapsed, onLogout, onNavigate }) {
  const location = useLocation()
  const isActive = item.path && item.path === location.pathname

  if (item.action === 'logout') {
    const button = (
      <button
        type="button"
        className="sidebar-link sidebar-link--button sidebar-link--logout"
        onClick={() => {
          onLogout?.()
          onNavigate?.()
        }}
        title={collapsed ? item.label : undefined}
      >
        <span className="sidebar-link__icon">
          <SidebarIcon name={item.icon} size={20} />
        </span>
        {!collapsed && <span className="sidebar-link__label">{item.label}</span>}
      </button>
    )

    if (collapsed) {
      return (
        <div className="sidebar-item sidebar-item--collapsed" data-tooltip={item.label}>
          {button}
        </div>
      )
    }

    return <div className="sidebar-item">{button}</div>
  }

  const link = (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={cn('sidebar-link', isActive && 'sidebar-link--active')}
      title={collapsed ? item.label : undefined}
    >
      <span className="sidebar-link__icon">
        <SidebarIcon name={item.icon} size={20} />
      </span>
      {!collapsed && <span className="sidebar-link__label">{item.label}</span>}
    </NavLink>
  )

  if (collapsed) {
    return (
      <div className="sidebar-item sidebar-item--collapsed" data-tooltip={item.label}>
        {link}
      </div>
    )
  }

  return <div className="sidebar-item">{link}</div>
}
