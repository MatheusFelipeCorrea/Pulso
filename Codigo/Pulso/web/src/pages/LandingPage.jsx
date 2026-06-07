import { Link, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

export default function LandingPage() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const hasToken = Boolean(localStorage.getItem('accessToken'))

  if (isAuthenticated || hasToken) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-[var(--ds-color-background)] text-[var(--ds-color-text)]">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-[var(--ds-color-primary)] mb-2">
            💜 Pulso
          </h1>
          <p className="text-[var(--ds-color-text-secondary)]">
            O pulso da sua vida financeira
          </p>
          <p className="text-sm text-[var(--ds-color-text-secondary)] mt-4 opacity-70">
            Seu monitoramento financeiro, em um só lugar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link
              to="/register"
              className="inline-block px-6 py-3 bg-[var(--ds-color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Criar conta
            </Link>
            <Link
              to="/login"
              className="inline-block px-6 py-3 border border-[var(--ds-color-border)] rounded-lg hover:bg-[var(--ds-color-hover)] transition-colors"
            >
              Entrar
            </Link>
            <Link
              to="/design-system"
              className="inline-block px-6 py-3 border border-[var(--ds-color-border)] rounded-lg hover:bg-[var(--ds-color-hover)] transition-colors"
            >
              Design System
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
