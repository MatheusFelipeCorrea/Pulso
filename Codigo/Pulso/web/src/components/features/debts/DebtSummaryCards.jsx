import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'

function formatQuantidade(count) {
  const n = Number(count) || 0
  return n === 1 ? '1 empréstimo ativo' : `${n} empréstimos ativos`
}

export function DebtSummaryCards({ resumo, loading }) {
  if (loading) {
    return (
      <section className="debts-summary debts-summary--loading">
        <SpinnerDots center label="Carregando resumo..." />
      </section>
    )
  }

  const cards = [
    {
      key: 'meDevem',
      title: 'Me devem',
      subtitle: 'Total a receber',
      value: resumo?.meDevem?.total ?? 0,
      quantidade: resumo?.meDevem?.quantidade ?? 0,
      icon: ArrowDownLeft,
      tone: 'receive',
    },
    {
      key: 'euDevo',
      title: 'Eu devo',
      subtitle: 'Total a pagar',
      value: resumo?.euDevo?.total ?? 0,
      quantidade: resumo?.euDevo?.quantidade ?? 0,
      icon: ArrowUpRight,
      tone: 'pay',
    },
  ]

  return (
    <section className="debts-summary">
      {cards.map(({ key, title, subtitle, value, quantidade, icon: Icon, tone }) => (
        <article key={key} className={`debts-summary__card debts-summary__card--${tone}`}>
          <div className="debts-summary__header">
            <div className="debts-summary__content">
              <p className="debts-summary__title">{title}</p>
              <p className="debts-summary__value">{formatCurrency(value)}</p>
              <p className="debts-summary__meta">
                {formatQuantidade(quantidade)} · {subtitle}
              </p>
            </div>
            <span className="debts-summary__icon" aria-hidden>
              <Icon size={20} strokeWidth={2.25} />
            </span>
          </div>
        </article>
      ))}
    </section>
  )
}
