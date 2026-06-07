import { useLocation } from 'react-router-dom'
import { PublicHeader } from '@/components/features/landing/PublicHeader.jsx'
import { AuthHero } from '@/components/features/auth/AuthHero.jsx'

export function AuthLayout({ children, activeAuth = 'register', heroVariant = 'register' }) {
  const location = useLocation()

  return (
    <div className="auth-page">
      <PublicHeader activeAuth={activeAuth} />

      <div className="auth-body">
        <aside className="auth-hero-panel">
          <div key={heroVariant} className="auth-hero-transition">
            <AuthHero variant={heroVariant} />
          </div>
        </aside>

        <main className="auth-form-panel">
          <div key={location.pathname} className="auth-page-transition">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
