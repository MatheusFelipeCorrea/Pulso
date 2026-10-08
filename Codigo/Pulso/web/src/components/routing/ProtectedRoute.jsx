import { DEFAULT_AUTHENTICATED_ROUTE } from '@/config/defaultAuthenticatedRoute.js'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

/** Rotas autenticadas do app (dashboard, etc.). */
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

/**
 * Rotas só para visitante (PULSO-FEAT-001: /register, /register/email-sent; também /login).
 * Se já autenticado, redireciona para a home autenticada.
 */
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
