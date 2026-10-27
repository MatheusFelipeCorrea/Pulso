import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, Star } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { LandingDashboardPreview } from './LandingDashboardPreview.jsx'

const AVATARS = ['AM', 'BC', 'CD', 'EF']

function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function LandingHero() {
    return (
        <section className="landing-hero">
            <div className="landing-container landing-hero__grid">
                <div className="landing-hero__content">
                    <span className="landing-badge">Comece grátis · Valores em reais</span>

                    <h1 className="landing-hero__title">
                        O pulso da sua{' '}
                        <span className="landing-hero__gradient">vida financeira.</span>
                    </h1>

                    <p className="landing-hero__subtitle">
                        Organize o mês em reais: saldo, benefícios (VA e VR), orçamento, metas e
                        dívidas — com grupos e viagens no Premium.
                    </p>

                    <div className="landing-hero__actions">
                        <Link to="/register">
                            <Button
                                variant="primary"
                                size="lg"
                                rightIcon={<ArrowRight size={18} />}
                            >
                                Começar Grátis
                            </Button>
                        </Link>
                        <button
                            type="button"
                            className="landing-hero__secondary"
                            onClick={() => scrollToSection('funcionalidades')}
                        >
                            Ver funcionalidades
                            <ArrowDown size={16} aria-hidden />
                        </button>
                    </div>

                    <div className="landing-hero__social">
                        <div className="landing-hero__avatars" aria-hidden>
                            {AVATARS.map((initials, i) => (
                                <span
                                    key={initials}
                                    className="landing-hero__avatar"
                                    style={{ zIndex: AVATARS.length - i }}
                                >
                                    {initials}
                                </span>
                            ))}
                        </div>
                        <div>
                            <div className="landing-hero__stars" aria-label="5 estrelas">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={14} fill="currentColor" aria-hidden />
                                ))}
                            </div>
                            <p className="landing-hero__social-text">
                                Feito por alunos da PUC Minas · TI5
                            </p>
                        </div>
                    </div>
                </div>

                <div className="landing-hero__visual">
                    <LandingDashboardPreview />
                </div>
            </div>
        </section>
    )
}
