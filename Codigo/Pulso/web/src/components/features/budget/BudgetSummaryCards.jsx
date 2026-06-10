import { PiggyBank, TrendingDown, Wallet } from 'lucide-react'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'

function formatPercentual(value = 0) {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1).replace('.', ',')}%`
}

export function BudgetSummaryCards({ resumo, loading }) {
  if (loading) {
    return (
      <section className="budget-summary budget-summary--loading">
        <SpinnerDots center label="Carregando orçamento..." />
      </section>
    )
  }

  const percentual = resumo?.percentualUsado ?? 0
  const percentualBarra = Math.min(Math.max(percentual, 0), 100)
  const percentualTexto = formatPercentual(percentual)

  const metrics = [
    {
      key: 'total',
      label: 'Total do orçamento',
      value: formatCurrency(resumo?.orcamentoTotal ?? 0),
      icon: Wallet,
      tone: 'purple',
    },
    {
      key: 'spent',
      label: 'Total já gasto',
      value: formatCurrency(resumo?.gastoTotal ?? 0),
      icon: TrendingDown,
      tone: 'red',
    },
    {
      key: 'remaining',
      label: 'Restante disponível',
      value: formatCurrency(resumo?.restanteTotal ?? 0),
      icon: PiggyBank,
      tone: 'green',
    },
  ]

  return (
    <section className="budget-summary">
      <h2 className="budget-summary__title">Visão geral do orçamento</h2>

      <div className="budget-summary__metrics">
        {metrics.map(({ key, label, value, icon: Icon, tone }) => (
          <article key={key} className={`budget-summary__metric budget-summary__metric--${tone}`}>
            <span className="budget-summary__metric-icon" aria-hidden>
              <Icon size={18} />
            </span>
            <div className="budget-summary__metric-content">
              <p className="budget-summary__metric-label">{label}</p>
              <p className="budget-summary__metric-value">{value}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="budget-summary__progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentualBarra}>
        <div className="budget-summary__progress-track">
          <div
            className="budget-summary__progress-fill"
            style={{ width: `${percentualBarra}%` }}
          >
            {percentualBarra >= 12 ? (
              <span className="budget-summary__progress-fill-label">{percentualTexto}</span>
            ) : null}
          </div>
        </div>
        <p className="budget-summary__progress-caption">
          {percentualTexto} do orçamento utilizado
        </p>
      </div>
    </section>
  )
}
