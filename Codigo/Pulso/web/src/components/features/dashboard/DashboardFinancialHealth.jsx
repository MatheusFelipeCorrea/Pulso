import { AlertCircle, CheckCircle2, Target, TrendingDown, Wallet } from 'lucide-react'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'

const CHECKLIST_ICONS = {
  fluxo: Wallet,
  orcamento: TrendingDown,
  metas: Target,
}

function getScoreTier(score) {
  if (score >= 81) {
    return { key: 'excellent', color: '#22C55E', soft: 'color-mix(in srgb, #22C55E 14%, transparent)' }
  }
  if (score >= 61) {
    return { key: 'good', color: '#84CC16', soft: 'color-mix(in srgb, #84CC16 14%, transparent)' }
  }
  if (score <= 40) {
    return { key: 'attention', color: '#EF4444', soft: 'color-mix(in srgb, #EF4444 14%, transparent)' }
  }
  return { key: 'regular', color: '#F59E0B', soft: 'color-mix(in srgb, #F59E0B 14%, transparent)' }
}

function HealthGauge({ score, label, color }) {
  const radius = 68
  const halfCirc = Math.PI * radius
  const filled = (Math.max(0, Math.min(100, score)) / 100) * halfCirc

  return (
    <div className="dashboard-health__gauge" style={{ '--health-color': color }}>
      <svg viewBox="0 0 200 118" aria-hidden>
        <path
          className="dashboard-health__gauge-track"
          d="M 32 98 A 68 68 0 0 1 168 98"
          fill="none"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          className="dashboard-health__gauge-fill"
          d="M 32 98 A 68 68 0 0 1 168 98"
          fill="none"
          strokeWidth="14"
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={`${filled} ${halfCirc}`}
        />
      </svg>

      <div className="dashboard-health__score">
        <strong>{score}</strong>
        <span className="dashboard-health__score-label">{label}</span>
      </div>
    </div>
  )
}

function HealthChecklistItem({ item }) {
  const Icon = CHECKLIST_ICONS[item.id] ?? Wallet
  const ok = Boolean(item.ok)

  return (
    <li className={`dashboard-health__item${ok ? ' is-ok' : ' is-warn'}`}>
      <span className="dashboard-health__item-icon" aria-hidden>
        {ok ? <CheckCircle2 size={16} strokeWidth={2.25} /> : <AlertCircle size={16} strokeWidth={2.25} />}
      </span>
      <div className="dashboard-health__item-body">
        <span className="dashboard-health__item-kicker">
          <Icon size={12} strokeWidth={2.25} aria-hidden />
          {item.id === 'fluxo' ? 'Fluxo' : item.id === 'orcamento' ? 'Orçamento' : 'Metas'}
        </span>
        <span className="dashboard-health__item-text">{item.texto}</span>
      </div>
    </li>
  )
}

export function DashboardFinancialHealth({ saude, loading }) {
  if (loading) {
    return (
      <section className="dashboard-card dashboard-card--health">
        <SpinnerDots center label="Calculando saúde financeira..." />
      </section>
    )
  }

  const score = saude?.score ?? 0
  const label = saude?.label ?? '—'
  const checklist = saude?.checklist ?? []
  const tier = getScoreTier(score)
  const okCount = checklist.filter((item) => item.ok).length

  return (
    <section className="dashboard-card dashboard-card--health">
      <header className="dashboard-card__header dashboard-health__header">
        <div className="dashboard-health__heading">
          <h2>Saúde financeira</h2>
          <p className="dashboard-health__subtitle">
            {okCount} de {checklist.length} indicadores positivos
          </p>
        </div>
        <span
          className="dashboard-health__badge"
          style={{ color: tier.color, background: tier.soft, borderColor: `color-mix(in srgb, ${tier.color} 35%, transparent)` }}
        >
          {label}
        </span>
      </header>

      <div className="dashboard-health">
        <div className="dashboard-health__hero">
          <HealthGauge score={score} label={label} color={tier.color} />

          <div className="dashboard-health__summary">
            <p className="dashboard-health__message">{saude?.mensagem}</p>
            <div className="dashboard-health__scale" aria-hidden>
              <span>0</span>
              <div className="dashboard-health__scale-track">
                <span
                  className="dashboard-health__scale-fill"
                  style={{ width: `${score}%`, background: tier.color }}
                />
              </div>
              <span>100</span>
            </div>
          </div>
        </div>

        <ul className="dashboard-health__checklist">
          {checklist.map((item) => (
            <HealthChecklistItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  )
}
