import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { PulsoBrand } from '@/components/features/auth/PulsoBrand'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { useTheme } from '@/design-system/hooks/useTheme.js'
import { NAV_LINKS } from './landingData.js'

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Header público — homepage, login e cadastro.
 * @param {'login' | 'register' | null} activeAuth — destaca a ação da tela atual
 */
export function PublicHeader({ activeAuth = null }) {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <header className="landing-header">
      <div className="landing-container landing-header__inner">
        <PulsoBrand to="/" showTagline={false} className="landing-header__brand" />

        <nav className="landing-header__nav" aria-label="Navegação principal">
          {NAV_LINKS.map((link) =>
            isLanding ? (
              <button
                key={link.id}
                type="button"
                className="landing-header__nav-link"
                onClick={() => scrollToSection(link.id)}
              >
                {link.label}
              </button>
            ) : (
              <Link key={link.id} to={`/#${link.id}`} className="landing-header__nav-link">
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="landing-header__actions">
          <button
            type="button"
            className="landing-header__theme"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {activeAuth === 'login' ? (
            <span className="landing-header__login landing-header__login--active" aria-current="page">
              Entrar
            </span>
          ) : (
            <Link to="/login" className="landing-header__login">
              Entrar
            </Link>
          )}

          {activeAuth === 'register' ? (
            <Button variant="primary" size="md" disabled aria-current="page">
              Começar Grátis
            </Button>
          ) : (
            <Link to="/register">
              <Button variant="primary" size="md">
                Começar Grátis
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
