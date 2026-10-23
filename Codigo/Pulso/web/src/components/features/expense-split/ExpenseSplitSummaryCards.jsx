import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'

export function ExpenseSplitSummaryCards({ resumo, loading }) {
  if (loading) {
    return (
      <section className="expense-split-summary expense-split-summary--loading">
        <SpinnerDots center label="Carregando resumo..." />
      </section>
    )
  }

  const meDevem = resumo?.meDevem ?? 0
  const euDevo = resumo?.euDevo ?? 0
  const saldo = resumo?.saldo ?? 0

  const cards = [
    {
      key: 'meDevem',
      title: 'Me devem',
      caption: 'Total que vão me pagar',
      value: meDevem,
      icon: ArrowUpRight,
      tone: 'receive',
    },
    {
      key: 'euDevo',
      title: 'Eu devo',
      caption: 'Total que preciso pagar',
      value: euDevo,
      icon: ArrowDownLeft,
      tone: 'pay',
    },
    {
      key: 'saldo',
      title: 'Saldo',
      caption: saldo >= 0 ? 'a receber' : 'a pagar',
      value: saldo,
      icon: Wallet,
      tone: 'saldo',
    },
  ]

  return (
    <section className="expense-split-summary">
      {cards.map(({ key, title, caption, value, icon: Icon, tone }) => (
        <article key={key} className={`expense-split-summary__card expense-split-summary__card--${tone}`}>
          <span className="expense-split-summary__icon" aria-hidden>
            <Icon size={20} strokeWidth={2.25} />
          </span>
          <div className="expense-split-summary__content">
            <p className="expense-split-summary__title">{title}</p>
            <p className="expense-split-summary__value">
              {key === 'saldo' && value > 0 ? '+' : ''}
              {formatCurrency(value)}
            </p>
            <p className="expense-split-summary__caption">{caption}</p>
          </div>
        </article>
      ))}
    </section>
  )
}
