import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setUser, clearUser } from '@/store/slices/authSlice'
import { getMe, clearAuthTokens } from '@/services/authService'

/**
 * Restaura sessão a partir do token salvo (GET /me).
 */
export function AuthBootstrap({ children }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    let cancelled = false

    getMe()
      .then((user) => {
        if (!cancelled && user) dispatch(setUser(user))
      })
      .catch(() => {
        if (!cancelled) {
          clearAuthTokens()
          dispatch(clearUser())
        }
      })

    return () => {
      cancelled = true
    }
  }, [dispatch])

  return children
}
