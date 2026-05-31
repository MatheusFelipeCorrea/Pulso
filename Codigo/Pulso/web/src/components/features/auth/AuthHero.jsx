import { TrendingUp, Target, Shield, Send, Lock, PieChart, Zap, Mail, KeyRound, CheckCircle2, Clock } from 'lucide-react'
import { AuthHeroIllustration } from './AuthHeroIllustration.jsx'
import { AuthHeroEmailIllustration } from './AuthHeroEmailIllustration.jsx'
import { AuthHeroRecoverIllustration } from './AuthHeroRecoverIllustration.jsx'
import { AuthHeroPasswordSentIllustration } from './AuthHeroPasswordSentIllustration.jsx'
import { AuthHeroResetIllustration } from './AuthHeroResetIllustration.jsx'
import { AuthHeroPasswordSuccessIllustration } from './AuthHeroPasswordSuccessIllustration.jsx'

const REGISTER_FEATURES = [
  {
    icon: TrendingUp,
    title: 'Visão completa',
    description: 'Acompanhe seus gastos e receitas em tempo real.',
  },
  {
    icon: Target,
    title: 'Metas ao seu alcance',
    description: 'Defina objetivos e conquiste cada etapa com clareza.',
  },
  {
    icon: Shield,
    title: 'Segurança garantida',
    description: 'Seus dados protegidos com tecnologia de ponta.',
  },
]

const EMAIL_SENT_FEATURES = [
  {
    icon: Shield,
    title: 'Seguro',
    description: 'Seu dados estão protegidos com tecnologia de ponta.',
  },
  {
    icon: Send,
    title: 'Rápido e simples',
    description: 'Ative sua conta em poucos cliques e comece agora.',
  },
  {
    icon: Lock,
    title: 'Privacidade garantida',
    description: 'Não compartilhamos suas informações com terceiros.',
  },
]

const LOGIN_FEATURES = [
  {
    icon: PieChart,
    title: 'Visão completa',
    description: 'Tenha uma visão clara de toda a sua vida financeira.',
  },
  {
    icon: Shield,
    title: 'Segurança de dados',
    description: 'Suas informações protegidas com criptografia de ponta.',
  },
  {
    icon: Target,
    title: 'Objetivos alcançáveis',
    description: 'Planeje, acompanhe e conquiste seus objetivos financeiros.',
  },
]

const FORGOT_PASSWORD_FEATURES = [
  {
    icon: Shield,
    title: 'Seguro',
    description: 'Seus dados estão protegidos com tecnologia de ponta.',
  },
  {
    icon: Zap,
    title: 'Rápido',
    description: 'Você recebe o link de recuperação em instantes.',
  },
  {
    icon: Lock,
    title: 'Sem complicação',
    description: 'Processo simples e intuitivo para você voltar ao que importa.',
  },
]

const FORGOT_PASSWORD_SENT_FEATURES = [
  {
    icon: Shield,
    title: 'Proteção reforçada',
    description: 'Seus dados estão sempre seguros com tecnologia de ponta.',
  },
  {
    icon: Mail,
    title: 'Processo simples e rápido',
    description: 'Receba o link de alteração e escolha uma nova senha em instantes.',
  },
  {
    icon: Lock,
    title: 'Você no controle',
    description: 'Altere sua senha quando quiser e mantenha suas informações protegidas.',
  },
]

const RESET_PASSWORD_FEATURES = [
  {
    icon: Shield,
    title: 'Proteção reforçada',
    description: 'Suas informações e dados financeiros sempre seguros.',
  },
  {
    icon: KeyRound,
    title: 'Acesso garantido',
    description: 'Recupere o acesso e continue cuidando das suas finanças.',
  },
  {
    icon: CheckCircle2,
    title: 'Simples e rápido',
    description: 'Altere sua senha e pronto! Você estará de volta.',
  },
]

const RESET_PASSWORD_SUCCESS_FEATURES = [
  {
    icon: Shield,
    title: 'Proteção reforçada',
    description: 'Suas informações estão seguras com tecnologia de ponta.',
  },
  {
    icon: CheckCircle2,
    title: 'Você no controle',
    description: 'Altere sua senha sempre que quiser e mantenha seus dados protegidos.',
  },
  {
    icon: Clock,
    title: 'Tranquilidade sempre',
    description: 'Conte com o Pulso para te ajudar a ter uma vida financeira mais saudável.',
  },
]

function HeroFeatures({ items, className = 'space-y-5' }) {
  return (
    <ul className={`auth-hero-features ${className}`}>
      {items.map(({ icon: Icon, title, description }) => (
        <li key={title} className="auth-hero-features__item">
          <span className="auth-hero-features__icon">
            <Icon size={20} strokeWidth={2} />
          </span>
          <div className="auth-hero-features__text">
            <p className="auth-hero-features__title">{title}</p>
            <p className="auth-hero-features__desc">{description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function AuthHero({ variant = 'register' }) {
  if (variant === 'reset-password-success') {
    return (
      <div className="auth-hero auth-hero--stacked auth-hero--reset-success">
        <div className="auth-hero__content">
          <h1 className="text-[1.75rem] font-bold leading-[1.25] tracking-tight text-[var(--ds-color-text)] xl:text-[2rem]">
            Sua segurança está em{' '}
            <span className="text-[#7C3AED] dark:text-[#A78BFA]">boas mãos.</span>
          </h1>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-[var(--ds-color-text-secondary)]">
            Senha alterada com sucesso. Agora você pode continuar cuidando das suas finanças com
            tranquilidade.
          </p>
        </div>

        <div className="auth-hero__illus-slot auth-hero__illus-slot--reset-success">
          <AuthHeroPasswordSuccessIllustration />
        </div>

        <div className="auth-hero__features-slot">
          <HeroFeatures items={RESET_PASSWORD_SUCCESS_FEATURES} className="space-y-4" />
        </div>
      </div>
    )
  }

  if (variant === 'reset-password') {
    return (
      <div className="auth-hero auth-hero--stacked auth-hero--reset-password">
        <div className="auth-hero__content">
          <h1 className="text-[1.75rem] font-bold leading-[1.25] tracking-tight text-[var(--ds-color-text)] xl:text-[2rem]">
            Sua segurança{' '}
            <span className="text-[#7C3AED] dark:text-[#A78BFA]">é nossa prioridade.</span>
          </h1>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-[var(--ds-color-text-secondary)]">
            Crie uma nova senha forte e única para manter suas informações protegidas.
          </p>
        </div>

        <div className="auth-hero__illus-slot auth-hero__illus-slot--reset">
          <AuthHeroResetIllustration />
        </div>

        <div className="auth-hero__features-slot">
          <HeroFeatures items={RESET_PASSWORD_FEATURES} className="space-y-4" />
        </div>
      </div>
    )
  }

  if (variant === 'forgot-password') {
    return (
      <div className="auth-hero auth-hero--stacked auth-hero--forgot-password">
        <div className="auth-hero__content">
          <h1 className="text-[1.75rem] font-bold leading-[1.25] tracking-tight text-[var(--ds-color-text)] xl:text-[2rem]">
            Recupere o acesso e retome o controle das{' '}
            <span className="text-[#7C3AED] dark:text-[#A78BFA]">suas finanças.</span>
          </h1>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-[var(--ds-color-text-secondary)]">
            É rápido, seguro e você estará de volta em poucos passos.
          </p>
        </div>

        <div className="auth-hero__illus-slot auth-hero__illus-slot--recover">
          <AuthHeroRecoverIllustration />
        </div>

        <div className="auth-hero__features-slot">
          <HeroFeatures items={FORGOT_PASSWORD_FEATURES} className="space-y-4" />
        </div>
      </div>
    )
  }

  if (variant === 'forgot-password-sent') {
    return (
      <div className="auth-hero auth-hero--stacked auth-hero--password-sent">
        <div className="auth-hero__content">
          <h1 className="text-[1.75rem] font-bold leading-[1.25] tracking-tight text-[var(--ds-color-text)] xl:text-[2rem]">
            Mais segurança para{' '}
            <span className="text-[#7C3AED] dark:text-[#A78BFA]">você, sempre.</span>
          </h1>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-[var(--ds-color-text-secondary)]">
            A alteração de senha é um cuidado essencial para manter suas informações sempre
            protegidas.
          </p>
        </div>

        <div className="auth-hero__illus-slot auth-hero__illus-slot--password-sent">
          <AuthHeroPasswordSentIllustration />
        </div>

        <div className="auth-hero__features-slot">
          <HeroFeatures items={FORGOT_PASSWORD_SENT_FEATURES} className="space-y-4" />
        </div>
      </div>
    )
  }

  if (variant === 'login') {
    return (
      <div className="auth-hero auth-hero--stacked auth-hero--login">
        <div className="auth-hero__content">
          <h1 className="text-[1.75rem] font-bold leading-[1.25] tracking-tight text-[var(--ds-color-text)] xl:text-[2rem]">
            Finanças sob controle.{' '}
            <span className="text-[#7C3AED] dark:text-[#A78BFA]">Decisões com confiança.</span>
          </h1>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-[var(--ds-color-text-secondary)]">
            Acompanhe seus gastos, organize suas finanças e alcance seus objetivos com mais clareza.
          </p>
        </div>

        <div className="auth-hero__illus-slot auth-hero__illus-slot--login">
          <AuthHeroIllustration />
        </div>

        <div className="auth-hero__features-slot">
          <HeroFeatures items={LOGIN_FEATURES} className="space-y-4" />
        </div>
      </div>
    )
  }

  if (variant === 'email-sent') {
    return (
      <div className="auth-hero auth-hero--stacked auth-hero--email-sent">
        <div className="auth-hero__content">
          <h1 className="text-[1.75rem] font-bold leading-[1.25] tracking-tight text-[var(--ds-color-text)] xl:text-[2rem]">
            Um passo a mais para cuidar do{' '}
            <span className="text-[#7C3AED] dark:text-[#A78BFA]">seu futuro.</span>
          </h1>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-[var(--ds-color-text-secondary)]">
            Verifique seu email e ative sua conta para começar a transformar suas finanças hoje mesmo.
          </p>
        </div>

        <div className="auth-hero__illus-slot auth-hero__illus-slot--email">
          <AuthHeroEmailIllustration />
        </div>

        <div className="auth-hero__features-slot">
          <HeroFeatures items={EMAIL_SENT_FEATURES} className="space-y-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="auth-hero auth-hero--register">
      <div className="auth-hero__content">
        <h1 className="text-[1.75rem] font-bold leading-[1.25] tracking-tight text-[var(--ds-color-text)] xl:text-[2rem]">
          Comece sua jornada financeira{' '}
          <span className="text-[#7C3AED] dark:text-[#A78BFA]">com o Pulso.</span>
        </h1>
        <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-[var(--ds-color-text-secondary)]">
          Organize seus gastos, alcance seus objetivos e tenha controle total das suas finanças.
        </p>

        <div className="mt-7">
          <HeroFeatures items={REGISTER_FEATURES} className="space-y-4" />
        </div>
      </div>

      <div className="auth-hero__illus-slot">
        <AuthHeroIllustration />
      </div>
    </div>
  )
}
