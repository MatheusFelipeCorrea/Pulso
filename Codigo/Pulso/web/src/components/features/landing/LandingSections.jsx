import { Link } from 'react-router-dom'
import { HIGHLIGHTS, FEATURES, AUDIENCE, BENEFITS, TESTIMONIALS } from './landingData.js'
import { Briefcase, Check, GraduationCap, Laptop, Star, UserRound } from 'lucide-react'

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
          <p>Ferramentas completas para organizar, planejar e evoluir suas finanças.</p>
        </div>
        <div className="landing-features__grid">
          {FEATURES.map(({ icon: Icon, title, description, tone }) => (
            <article key={title} className={`landing-feature landing-feature--${tone}`}>
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
            Não importa como você trabalha — estagiário, CLT, PJ ou pessoa física. O Pulso se adapta
            ao seu perfil e à sua rotina financeira.
          </p>
        </div>
        <div className="landing-audience__grid">
          {AUDIENCE.map(({ title, tag, description, tone, icon }) => {
            const Icon = AUDIENCE_ICONS[icon] ?? UserRound
            return (
              <article key={title} className={`landing-audience landing-audience--${tone}`}>
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
  return (
    <section className="landing-section landing-section--muted">
      <div className="landing-container landing-mobile">
        <div className="landing-mobile__content">
          <h2>Leve o Pulso com você</h2>
          <p>
            Acesse saldo, metas e insights de qualquer lugar. Em breve nas lojas — por enquanto,
            use a Web App no navegador.
          </p>
          <div className="landing-mobile__stores">
            <button type="button" className="landing-store-btn" disabled>
              Google Play
            </button>
            <button type="button" className="landing-store-btn" disabled>
              App Store
            </button>
          </div>
          <p className="landing-mobile__note">Em breve para Web App PWA</p>
        </div>
        <div className="landing-mobile__phones" aria-hidden>
          {['Resumo', 'Gastos', 'Insights'].map((label) => (
            <div key={label} className="landing-phone">
              <div className="landing-phone__screen">
                <span className="landing-phone__label">{label}</span>
                <div className="landing-phone__bar" />
                <div className="landing-phone__bar landing-phone__bar--short" />
                <div className="landing-phone__chart" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function LandingTestimonials() {
  return (
    <section className="landing-section">
      <div className="landing-container">
        <div className="landing-section__header">
          <h2>O que nossos usuários dizem</h2>
        </div>
        <div className="landing-testimonials__grid">
          {TESTIMONIALS.map(({ name, role, quote, initials, tone }) => (
            <article key={name} className={`landing-testimonial landing-testimonial--${tone}`}>
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
    <section id="precos" className="landing-section landing-section--cta">
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
