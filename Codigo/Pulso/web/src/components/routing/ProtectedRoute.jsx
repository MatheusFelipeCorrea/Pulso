import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

export function ProtectedRoute() {
  const location = useLocation()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const hasToken = Boolean(localStorage.getItem('accessToken'))

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function GuestRoute({ children }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const hasToken = Boolean(localStorage.getItem('accessToken'))

  if (isAuthenticated || hasToken) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
