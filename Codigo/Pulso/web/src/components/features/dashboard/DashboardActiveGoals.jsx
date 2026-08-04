import { Link } from 'react-router-dom'
import { ProgressBar } from '@/design-system/components/data-display/ProgressBar/ProgressBar.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { GoalIcon } from '@/components/features/goals/goalIcons.jsx'
import {
  formatGoalDeadlineLabel,
  getGoalProgressVariant,
} from '@/utils/goalStatusUtils.js'

function DashboardGoalCard({ meta }) {
  const status = meta.status ?? 'ATIVA'
  const percentual = Math.min(100, Math.max(0, Math.round(Number(meta.progresso ?? meta.percentual) || 0)))
  const valorAtual = Number(meta.valorAtual ?? 0)
  const valorAlvo = Number(meta.valorAlvo ?? 0)
  const prazo = formatGoalDeadlineLabel(meta)

  return (
    <Link to="/goals" className="dashboard-goal-card">
      <div className="dashboard-goal-card__head">
        <GoalIcon nome={meta.nome} status={status} className="dashboard-goal-card__icon" />
        <div className="dashboard-goal-card__title-wrap">
          <h3>{meta.nome}</h3>
          {prazo ? <span className="dashboard-goal-card__deadline">{prazo}</span> : null}
        </div>
        <span className="dashboard-goal-card__pct">{percentual}%</span>
      </div>

      <ProgressBar
        value={valorAtual}
        max={valorAlvo || 1}
        variant={getGoalProgressVariant(status)}
        size="md"
        className="dashboard-goal-card__bar"
      />

      <div className="dashboard-goal-card__values">
        <strong>{formatCurrency(valorAtual)}</strong>
        <span>de {formatCurrency(valorAlvo)}</span>
      </div>
    </Link>
  )
}

export function DashboardActiveGoals({ metas = [], loading }) {
  return (
    <section className="dashboard-card dashboard-card--goals">
      <header className="dashboard-card__header">
        <div className="dashboard-goals__heading">
          <h2>Metas ativas</h2>
          {!loading && metas.length > 0 ? (
            <p className="dashboard-goals__subtitle">
              {metas.length} {metas.length === 1 ? 'meta em andamento' : 'metas em andamento'}
            </p>
          ) : null}
        </div>
        <Link to="/goals" className="dashboard-card__link">
          Ver todas as metas
        </Link>
      </header>

      {loading ? (
        <SpinnerDots center label="Carregando metas..." />
      ) : metas.length === 0 ? (
        <p className="dashboard-empty-inline">Nenhuma meta ativa. Crie uma em Metas Financeiras.</p>
      ) : (
        <div className="dashboard-goals__scroll-wrap">
          <div className="dashboard-goals__track">
            {metas.map((meta) => (
              <DashboardGoalCard key={meta.id} meta={meta} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
