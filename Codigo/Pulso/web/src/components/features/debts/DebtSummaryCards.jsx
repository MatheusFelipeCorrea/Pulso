import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { DEBT_TABS } from '@/utils/debtFilters.js'

function formatQuantidade(count) {
  const n = Number(count) || 0
  return n === 1 ? '1 empréstimo ativo' : `${n} empréstimos ativos`
}

export function DebtSummaryCards({ resumo, loading, onSelectTab }) {
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
      tab: DEBT_TABS.ME_DEVEM,
      title: 'Me devem',
      subtitle: 'Saldo em aberto a receber',
      value: resumo?.meDevem?.total ?? 0,
      quantidade: resumo?.meDevem?.quantidade ?? 0,
      icon: ArrowDownLeft,
      tone: 'receive',
    },
    {
      key: 'euDevo',
      tab: DEBT_TABS.EU_DEVO,
      title: 'Eu devo',
      subtitle: 'Saldo em aberto a pagar',
      value: resumo?.euDevo?.total ?? 0,
      quantidade: resumo?.euDevo?.quantidade ?? 0,
      icon: ArrowUpRight,
      tone: 'pay',
    },
  ]

  return (
    <section className="debts-summary">
      {cards.map(({ key, tab, title, subtitle, value, quantidade, icon: Icon, tone }) => (
        <article
          key={key}
          className={`debts-summary__card debts-summary__card--${tone} debts-summary__card--clickable`}
          role="button"
          tabIndex={0}
          onClick={() => onSelectTab?.(tab)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onSelectTab?.(tab)
            }
          }}
        >
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
