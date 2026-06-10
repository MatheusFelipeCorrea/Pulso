import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearUser } from '@/store/slices/authSlice'
import { clearAuthTokens, logout as logoutApi } from '@/services/authService'
import { getUserDisplayName } from '@/utils/userDisplayName'

export function UserMenu({ compact = false }) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const nome = getUserDisplayName(user?.nome)
  const avatarUrl = user?.urlAvatar ?? null

  useEffect(() => {
    if (!open) return undefined

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleLogout = async () => {
    setOpen(false)
    try {
      await logoutApi()
    } catch {
      /* ignore */
    }
    clearAuthTokens()
    dispatch(clearUser())
    navigate('/login', { replace: true })
  }

  return (
    <div className="user-menu" ref={rootRef}>
      <button
        type="button"
        className="user-menu__trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar
          src={avatarUrl}
          name={nome}
          size={compact ? 'sm' : 'md'}
          fallback="color"
        />
        {!compact ? <span className="user-menu__name">{nome}</span> : null}
        <ChevronDown
          size={14}
          className={`user-menu__chevron${open ? ' user-menu__chevron--open' : ''}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="user-menu__dropdown" role="menu">
          <Link
            to="/profile"
            className="user-menu__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <User size={16} aria-hidden />
            Perfil
          </Link>

          <Link
            to="/settings"
            className="user-menu__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <Settings size={16} aria-hidden />
            Configurações
          </Link>

          <div className="user-menu__divider" aria-hidden />

          <button
            type="button"
            className="user-menu__item user-menu__item--danger"
            role="menuitem"
            onClick={handleLogout}
          >
            <LogOut size={16} aria-hidden />
            Sair
          </button>
        </div>
      ) : null}
    </div>
  )
}
