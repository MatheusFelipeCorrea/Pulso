import { AlertTriangle, Bell } from 'lucide-react'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { Badge } from '@/design-system/components/data-display/Badge/Badge.jsx'
import { BudgetTruncatedLabel } from './BudgetTruncatedLabel.jsx'
import { barToneFromPercentual, formatPercentualCategoria } from '@/utils/budgetUtils.js'

export function BudgetCategoryItem({ categoria }) {
  const icon = resolveBadgeIcon(categoria.categoriaIcone ?? 'Tag', { size: 18 })
  const percentual = categoria.percentualUsado ?? 0
  const barWidth = Math.min(Math.max(percentual, 0), 100)
  const barTone = barToneFromPercentual(percentual)
  const amounts = `${formatCurrency(categoria.gastoValor)} / ${formatCurrency(categoria.limiteValor)}`

  return (
    <article
      className={`budget-category-row budget-category-row--${barTone} budget-category-row--status-${categoria.status}`}
      style={{ '--budget-cat-color': categoria.categoriaCor }}
    >
      <div className="budget-category-row__name">
        <span className="budget-category-row__icon" aria-hidden>
          {icon}
        </span>
        <BudgetTruncatedLabel
          text={categoria.categoriaNome}
          className="budget-category-row__label"
          as="strong"
        />
      </div>

      <div className="budget-category-row__bar" aria-hidden>
        <div className="budget-category-row__bar-track">
          <div className="budget-category-row__bar-fill" style={{ width: `${barWidth}%` }} />
        </div>
      </div>

      <BudgetTruncatedLabel text={amounts} className="budget-category-row__amounts" as="span" />

      <div className="budget-category-row__pct">{formatPercentualCategoria(percentual)}</div>

      <div className="budget-category-row__badge">
        {categoria.status === 'alerta' ? (
          <Badge variant="warning" size="sm" leftIcon={<Bell size={12} />}>
            80%
          </Badge>
        ) : null}
        {categoria.status === 'estourado' ? (
          <Badge variant="danger" size="sm" leftIcon={<AlertTriangle size={12} />}>
            Estourou!
          </Badge>
        ) : null}
      </div>
    </article>
  )
}
