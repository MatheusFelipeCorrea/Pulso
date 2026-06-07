import { Link } from 'react-router-dom'
import { Globe, Share2, Users } from 'lucide-react'
import { PulsoBrand } from '@/components/features/auth/PulsoBrand'
import { FOOTER_LINKS } from './landingData.js'

const SOCIAL = [
  { icon: Share2, href: 'https://github.com', label: 'GitHub' },
  { icon: Users, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Globe, href: 'https://linkedin.com', label: 'LinkedIn' },
]

export function LandingFooter() {
  return (
    <footer id="roadmap" className="landing-footer">
      <div className="landing-container landing-footer__grid">
        <div className="landing-footer__brand">
          <PulsoBrand to="/" showTagline />
          <p className="landing-footer__tagline">
            Seu monitoramento financeiro, em um só lugar.
          </p>
          <div className="landing-footer__social">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="landing-footer__col">
          <h4>Navegação</h4>
          <ul>
            {FOOTER_LINKS.navegacao.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="landing-footer__col">
          <h4>Recursos</h4>
          <ul>
            {FOOTER_LINKS.recursos.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="landing-footer__col">
          <h4>Comunidade</h4>
          <ul>
            {FOOTER_LINKS.comunidade.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="landing-container landing-footer__bottom">
        <p>Feito com 💜 por Matheus Felipe</p>
        <p>© {new Date().getFullYear()} Pulso. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
