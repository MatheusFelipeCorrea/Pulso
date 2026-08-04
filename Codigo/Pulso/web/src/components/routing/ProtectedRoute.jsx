import { DEFAULT_AUTHENTICATED_ROUTE } from '@/config/defaultAuthenticatedRoute.js'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
export function ProtectedRoute() {
  const location = useLocation()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const sessionChecked = useAppSelector((state) => state.auth.sessionChecked)

  if (!sessionChecked) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function GuestRoute({ children }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const sessionChecked = useAppSelector((state) => state.auth.sessionChecked)

  if (!sessionChecked) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={DEFAULT_AUTHENTICATED_ROUTE} replace />
  }

  return children
}
