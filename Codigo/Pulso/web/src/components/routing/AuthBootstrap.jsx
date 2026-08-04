import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setUser, clearUser, setSessionChecked } from '@/store/slices/authSlice'
import { getMe } from '@/services/authService'

/**
 * Restaura sessão a partir dos cookies httpOnly (GET /me).
 */
export function AuthBootstrap({ children }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    let cancelled = false

    getMe()
      .then((user) => {
        if (!cancelled && user) dispatch(setUser(user))
      })
      .catch(() => {
        if (!cancelled) dispatch(clearUser())
      })
      .finally(() => {
        if (!cancelled) dispatch(setSessionChecked())
      })

    return () => {
      cancelled = true
    }
  }, [dispatch])

  return children
}
