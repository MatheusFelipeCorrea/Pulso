import { ArrowDown, ArrowUp, Wallet } from 'lucide-react'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'

const CARD_CONFIG = {
  receitas: {
    label: 'Receitas',
    icon: ArrowUp,
    className: 'tx-summary-card--income',
    valueClassName: 'tx-summary-card__value--default',
  },
  despesas: {
    label: 'Despesas',
    icon: ArrowDown,
    className: 'tx-summary-card--expense',
    valueClassName: 'tx-summary-card__value--default',
  },
  saldo: {
    label: 'Saldo',
    icon: Wallet,
    className: 'tx-summary-card--balance',
    valueClassName: 'tx-summary-card__value--balance',
  },
}

function SummaryCard({ tipo, total, quantidade, loading }) {
  const config = CARD_CONFIG[tipo]
  const Icon = config.icon

  if (loading) {
    return (
      <div className={`tx-summary-card ${config.className} tx-summary-card--loading`}>
        <SpinnerDots center label={`Carregando ${config.label.toLowerCase()}...`} />
      </div>
    )
  }

  return (
    <div className={`tx-summary-card ${config.className}`}>
      <div className="tx-summary-card__header">
        <div className="tx-summary-card__content">
          <p className="tx-summary-card__label">{config.label}</p>
          <p className={`tx-summary-card__value ${config.valueClassName}`}>
            {formatCurrency(Number(total))}
          </p>
          {quantidade != null ? (
            <p className="tx-summary-card__meta">{quantidade} lançamentos</p>
          ) : (
            <p className="tx-summary-card__meta">no período</p>
          )}
        </div>
        <div className="tx-summary-card__icon" aria-hidden>
          <Icon size={20} strokeWidth={2.25} />
        </div>
      </div>
    </div>
  )
}

export function TransactionSummaryCards({ resumo, loading }) {
  return (
    <div className="tx-summary-grid">
      <SummaryCard
        tipo="receitas"
        total={resumo?.receitas?.total ?? 0}
        quantidade={resumo?.receitas?.quantidade ?? 0}
        loading={loading}
      />
      <SummaryCard
        tipo="despesas"
        total={resumo?.despesas?.total ?? 0}
        quantidade={resumo?.despesas?.quantidade ?? 0}
        loading={loading}
      />
      <SummaryCard
        tipo="saldo"
        total={resumo?.saldo ?? 0}
        loading={loading}
      />
    </div>
  )
}
