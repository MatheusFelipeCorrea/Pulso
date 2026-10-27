import { Link } from 'react-router-dom'
import { Code2 } from 'lucide-react'
import { PulsoBrand } from '@/components/features/auth/PulsoBrand'
import { FOOTER_LINKS, REPO_URL } from './landingData.js'

function FooterLink({ link }) {
    if (link.external && link.href) {
        return (
            <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
            </a>
        )
    }
    if (link.to) {
        return <Link to={link.to}>{link.label}</Link>
    }
    return <a href={link.href}>{link.label}</a>
}

export function LandingFooter() {
    return (
        <footer className="landing-footer">
            <div className="landing-container landing-footer__grid">
                <div className="landing-footer__brand">
                    <PulsoBrand to="/" showTagline />
                    <p className="landing-footer__tagline">
                        Seu monitoramento financeiro, em um só lugar — em reais.
                    </p>
                    <div className="landing-footer__social">
                        <a
                            href={REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub do Pulso"
                        >
                            <Code2 size={18} />
                        </a>
                    </div>
                </div>

                <div className="landing-footer__col">
                    <h4>Navegação</h4>
                    <ul>
                        {FOOTER_LINKS.navegacao.map((link) => (
                            <li key={link.label}>
                                <FooterLink link={link} />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="landing-footer__col">
                    <h4>Recursos</h4>
                    <ul>
                        {FOOTER_LINKS.recursos.map((link) => (
                            <li key={link.label}>
                                <FooterLink link={link} />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="landing-footer__col">
                    <h4>Comunidade</h4>
                    <ul>
                        {FOOTER_LINKS.comunidade.map((link) => (
                            <li key={link.label}>
                                <FooterLink link={link} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="landing-container landing-footer__bottom">
                <p>Projeto TI5 · ICEI PUC Minas</p>
                <p>© {new Date().getFullYear()} Pulso. Todos os direitos reservados.</p>
            </div>
        </footer>
    )
}
