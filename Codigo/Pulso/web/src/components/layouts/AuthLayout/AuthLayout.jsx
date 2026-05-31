import { Link, useLocation } from 'react-router-dom'
import { PulsoBrand } from '@/components/features/auth/PulsoBrand.jsx'
import { AuthHero } from '@/components/features/auth/AuthHero.jsx'

const NAV_LINKS = [
  { label: 'Início', to: '/' },
  { label: 'O Problema', to: '/#problema' },
  { label: 'Depoimentos', to: '/#depoimentos' },
  { label: 'FAQ', to: '/#faq' },
  { label: 'Sobre', to: '/#sobre' },
]

export function AuthLayout({ children, activeAuth = 'register', heroVariant = 'register' }) {
  const location = useLocation()

  return (
    <div className="auth-page">
      <header className="auth-header">
        <PulsoBrand to="/" />

        <nav className="auth-nav" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className="auth-nav-link">
              {link.label}
            </Link>
          ))}
          {activeAuth === 'register' ? (
            <span className="auth-nav-cta">Cadastre-se</span>
          ) : (
            <Link to="/register" className="auth-nav-cta hover:opacity-80" style={{ cursor: 'pointer' }}>
              Cadastre-se
            </Link>
          )}
        </nav>
      </header>

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
