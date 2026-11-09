import { Link } from 'react-router-dom'
import {
    APP_DOWNLOADS,
    HIGHLIGHTS,
    FEATURES,
    AUDIENCE,
    BENEFITS,
    PRICING,
    TESTIMONIALS,
} from './landingData.js'
import { LandingPhoneHomeShowcase } from './LandingPhoneHomeMockup.jsx'
import {
    Apple,
    Briefcase,
    Check,
    Download,
    GraduationCap,
    Laptop,
    Star,
    UserRound,
} from 'lucide-react'

function AndroidGlyph({ size = 22 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.6 9.48l1.84-3.18a.5.5 0 10-.87-.5l-1.86 3.22A7.9 7.9 0 0012 7.75c-1.66 0-3.2.51-4.71 1.27L5.43 5.8a.5.5 0 10-.87.5l1.84 3.18C4.15 11.05 3 13.18 3 15.5v.75c0 .69.56 1.25 1.25 1.25H6v-4a1 1 0 112 0v4h8v-4a1 1 0 112 0v4h1.75c.69 0 1.25-.56 1.25-1.25V15.5c0-2.32-1.15-4.45-3.4-6.02zM9.25 13.25a.75.75 0 110-1.5.75.75 0 010 1.5zm5.5 0a.75.75 0 110-1.5.75.75 0 010 1.5z" />
        </svg>
    )
}

const AUDIENCE_ICONS = {
    graduation: GraduationCap,
    briefcase: Briefcase,
    laptop: Laptop,
    user: UserRound,
}

export function LandingHighlights() {
    return (
        <section className="landing-highlights">
            <div className="landing-container landing-highlights__grid">
                {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="landing-highlight">
                        <span className="landing-highlight__icon">
                            <Icon size={20} />
                        </span>
                        <div>
                            <strong>{title}</strong>
                            <p>{description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export function LandingFeatures() {
    return (
        <section id="funcionalidades" className="landing-section">
            <div className="landing-container">
                <div className="landing-section__header">
                    <h2>Tudo que você precisa num só lugar</h2>
                    <p>
                        Do dashboard às dívidas no Free — grupos e viagens no Premium, sempre em
                        reais.
                    </p>
                </div>
                <div className="landing-features__grid">
                    {FEATURES.map(({ icon: Icon, title, description, tone, badge }) => (
                        <article key={title} className={`landing-feature landing-feature--${tone}`}>
                            {badge ? <span className="landing-feature__badge">{badge}</span> : null}
                            <span className="landing-feature__icon">
                                <Icon size={22} />
                            </span>
                            <h3>{title}</h3>
                            <p>{description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function LandingAudience() {
    return (
        <section id="para-quem" className="landing-section landing-section--muted">
            <div className="landing-container">
                <div className="landing-section__header">
                    <h2>Pulso é para todo mundo</h2>
                    <p>
                        Não importa como você trabalha — estagiário, CLT, PJ ou pessoa física. O
                        Pulso se adapta ao seu perfil e à sua rotina financeira.
                    </p>
                </div>
                <div className="landing-audience__grid">
                    {AUDIENCE.map(({ title, tag, description, tone, icon }) => {
                        const Icon = AUDIENCE_ICONS[icon] ?? UserRound
                        return (
                            <article
                                key={title}
                                className={`landing-audience landing-audience--${tone}`}
                            >
                                <span className="landing-audience__icon" aria-hidden>
                                    <Icon size={22} strokeWidth={2} />
                                </span>
                                <span className="landing-audience__tag">{tag}</span>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export function LandingBenefits() {
    return (
        <section id="diferenciais" className="landing-section">
            <div className="landing-container landing-benefits">
                <div className="landing-section__header landing-section__header--left">
                    <h2>Por que o Pulso?</h2>
                    <p>Muito mais que uma planilha — uma experiência pensada para o dia a dia.</p>
                </div>
                <ul className="landing-benefits__list">
                    {BENEFITS.map((item) => (
                        <li key={item}>
                            <Check size={18} aria-hidden />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export function LandingMobile() {
    const downloads = [APP_DOWNLOADS.android, APP_DOWNLOADS.ios]

    return (
        <section id="baixar" className="landing-section landing-section--muted">
            <div className="landing-container landing-mobile">
                <div className="landing-mobile__content">
                    <p className="landing-mobile__eyebrow">App Flutter</p>
                    <h2>Leve o Pulso com você</h2>
                    <p>
                        Baixe o app nativo e use a mesma conta da web — Android e iOS, direto por
                        aqui, sem depender de loja.
                    </p>

                    <div className="landing-mobile__downloads">
                        {downloads.map((item) => {
                            const Icon = item.id === 'ios' ? Apple : AndroidGlyph
                            return (
                                <a
                                    key={item.id}
                                    className={`landing-mobile__download landing-mobile__download--${item.id}`}
                                    href={item.href}
                                    download={item.filename}
                                >
                                    <span className="landing-mobile__download-icon" aria-hidden>
                                        <Icon size={22} />
                                    </span>
                                    <span className="landing-mobile__download-copy">
                                        <span className="landing-mobile__download-platform">
                                            {item.label}
                                        </span>
                                        <strong>Baixar {item.fileLabel}</strong>
                                    </span>
                                    <span className="landing-mobile__download-action" aria-hidden>
                                        <Download size={18} />
                                    </span>
                                </a>
                            )
                        })}
                    </div>

                    <ul className="landing-mobile__notes">
                        <li>{APP_DOWNLOADS.android.hint}</li>
                        <li>{APP_DOWNLOADS.ios.hint}</li>
                    </ul>
                </div>
                <LandingPhoneHomeShowcase />
            </div>
        </section>
    )
}

export function LandingPricing() {
    return (
        <section id="precos" className="landing-section">
            <div className="landing-container">
                <div className="landing-section__header">
                    <h2>Planos simples, em reais</h2>
                    <p>Comece no Free. Premium libera grupos e viagens por R$ 50/mês.</p>
                </div>
                <div className="landing-pricing__grid">
                    {PRICING.map((plan) => (
                        <article
                            key={plan.id}
                            className={`landing-pricing-card${plan.highlighted ? ' landing-pricing-card--highlighted' : ''}`}
                        >
                            {plan.highlighted ? (
                                <span className="landing-pricing-card__badge">Recomendado</span>
                            ) : null}
                            <h3>{plan.name}</h3>
                            <div className="landing-pricing-card__price">
                                <strong>{plan.price}</strong>
                                <span>{plan.period}</span>
                            </div>
                            <p className="landing-pricing-card__desc">{plan.description}</p>
                            <ul>
                                {plan.features.map((feature) => (
                                    <li key={feature}>
                                        <Check size={16} aria-hidden />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to={plan.to}
                                className={`landing-pricing-card__cta${plan.highlighted ? ' landing-pricing-card__cta--primary' : ''}`}
                            >
                                {plan.cta}
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function LandingTestimonials() {
    return (
        <section className="landing-section landing-section--muted">
            <div className="landing-container">
                <div className="landing-section__header">
                    <h2>O que nossos usuários dizem</h2>
                </div>
                <div className="landing-testimonials__grid">
                    {TESTIMONIALS.map(({ name, role, quote, initials, tone }) => (
                        <article
                            key={name}
                            className={`landing-testimonial landing-testimonial--${tone}`}
                        >
                            <div className="landing-testimonial__stars" aria-label="5 estrelas">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={14} fill="currentColor" aria-hidden />
                                ))}
                            </div>
                            <blockquote>&ldquo;{quote}&rdquo;</blockquote>
                            <footer>
                                <span className="landing-testimonial__avatar">{initials}</span>
                                <div>
                                    <strong>{name}</strong>
                                    <span>{role}</span>
                                </div>
                            </footer>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function LandingCta() {
    return (
        <section className="landing-section landing-section--cta">
            <div className="landing-container">
                <div className="landing-cta">
                    <h2>Comece agora a ter pulso firme nas suas finanças.</h2>
                    <p>Cadastro em 30 segundos. Sem cartão. Sem complicação.</p>
                    <Link to="/register" className="landing-cta__button">
                        Criar Conta Grátis →
                    </Link>
                </div>
            </div>
        </section>
    )
}
