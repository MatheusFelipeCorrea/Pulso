import {
  BarChart3,
  Home,
  MoreHorizontal,
  Plus,
  Target,
  User,
} from 'lucide-react'
import { useTheme } from '@/design-system/hooks/useTheme.js'

const SCREEN_DATA = {
  light: {
    balance: 'R$ 607,00',
    balanceTone: 'info',
    income: 'R$ 2.450,00',
    expenses: 'R$ 1.843,00',
    goalSaved: 'R$ 7.300,00',
    goalTarget: 'R$ 10.000,00',
    goalProgress: 70,
    goalMilestone: '9/12',
  },
  dark: {
    balance: 'R$ 602,00',
    balanceTone: 'primary',
    income: 'R$ 3.450,00',
    expenses: 'R$ 1.843,00',
    goalSaved: 'R$ 2.200,00',
    goalTarget: 'R$ 10.000,00',
    goalProgress: 70,
    goalMilestone: null,
  },
}

function StatusBar({ theme }) {
  return (
    <div className={`lphone-status lphone-status--${theme}`}>
      <span>9:41</span>
      <div className="lphone-status__icons" aria-hidden>
        <span className="lphone-status__signal" />
        <span className="lphone-status__wifi" />
        <span className="lphone-status__battery" />
      </div>
    </div>
  )
}

function BottomNav({ theme }) {
  return (
    <nav className={`lphone-nav lphone-nav--${theme}`} aria-hidden>
      <button type="button" className="lphone-nav__item lphone-nav__item--active">
        <Home size={18} strokeWidth={2} />
      </button>
      <button type="button" className="lphone-nav__item">
        <BarChart3 size={18} strokeWidth={2} />
      </button>
      <button type="button" className="lphone-nav__fab">
        <Plus size={22} strokeWidth={2.5} />
      </button>
      <button type="button" className="lphone-nav__item">
        <Target size={18} strokeWidth={2} />
      </button>
      <button type="button" className="lphone-nav__item">
        <User size={18} strokeWidth={2} />
      </button>
    </nav>
  )
}

function ResumoScreen({ theme }) {
  const data = SCREEN_DATA[theme]

  return (
    <div className={`lphone-screen lphone-screen--${theme}`}>
      <StatusBar theme={theme} />

      <header className="lphone-screen__header">
        <h3>Resumo</h3>
        {theme === 'light' ? (
          <button type="button" className="lphone-screen__menu" aria-hidden>
            <MoreHorizontal size={18} />
          </button>
        ) : null}
      </header>

      <div className="lphone-screen__body">
        <div className="lphone-stat">
          <span className="lphone-stat__label">Saldo atual</span>
          <strong className={`lphone-stat__value lphone-stat__value--${data.balanceTone}`}>
            {data.balance}
          </strong>
        </div>

        <div className="lphone-stat">
          <span className="lphone-stat__label">Receitas</span>
          <strong className="lphone-stat__value lphone-stat__value--income">{data.income}</strong>
        </div>

        <div className="lphone-stat">
          <span className="lphone-stat__label">Despesas</span>
          <strong className="lphone-stat__value lphone-stat__value--expense">{data.expenses}</strong>
        </div>

        <div className="lphone-goals-head">
          <h4>Metas</h4>
          <button type="button" className="lphone-goals-head__add" aria-hidden>
            <Plus size={16} />
          </button>
        </div>

        <article className="lphone-goal">
          <div className="lphone-goal__top">
            <strong>Viagem Europa</strong>
            {data.goalMilestone ? (
              <span className="lphone-goal__badge">{data.goalMilestone}</span>
            ) : null}
          </div>

          <div className="lphone-goal__progress-row">
            <span className="lphone-goal__pct">{data.goalProgress}%</span>
            <div className="lphone-goal__track" aria-hidden>
              <span
                className="lphone-goal__fill"
                style={{ width: `${data.goalProgress}%` }}
              />
            </div>
          </div>

          <p className="lphone-goal__detail">
            {data.goalSaved} de {data.goalTarget}
          </p>
        </article>
      </div>

      <BottomNav theme={theme} />
    </div>
  )
}

export function LandingPhoneHomeMockup({ theme = 'light' }) {
  return (
    <figure className={`lphone lphone--${theme}`}>
      <div className="lphone__device">
        <div className="lphone__notch" aria-hidden />
        <ResumoScreen theme={theme} />
      </div>
    </figure>
  )
}

export function LandingPhoneHomeShowcase() {
  const { theme } = useTheme()

  return (
    <div className="lphone-showcase" aria-hidden>
      <LandingPhoneHomeMockup theme={theme} />
    </div>
  )
}
