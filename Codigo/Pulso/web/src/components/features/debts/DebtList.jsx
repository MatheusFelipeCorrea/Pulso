import { Plus } from 'lucide-react'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { DebtCard } from './DebtCard.jsx'

export function DebtList({ dividas, loading, tabAtiva, onNew, onEdit, onSettle, onDelete }) {
  if (loading) {
    return (
      <div className="debts-list debts-list--loading">
        <SpinnerDots center label="Carregando empréstimos..." />
      </div>
    )
  }

  if (!dividas?.length) {
    const emptyTitle =
      tabAtiva === 'QUITADAS'
        ? 'Nenhuma dívida quitada'
        : tabAtiva === 'EU_DEVO'
          ? 'Ninguém te emprestou ainda'
          : 'Ninguém te deve ainda'

    return (
      <EmptyState
        className="debts-list__empty"
        title={emptyTitle}
        description="Registre empréstimos para acompanhar quem te deve e a quem você deve."
        action={
          tabAtiva !== 'QUITADAS'
            ? {
                label: 'Novo Empréstimo',
                onClick: onNew,
                leftIcon: <Plus size={16} />,
              }
            : null
        }
      />
    )
  }

  return (
    <div className="debts-list">
      <ul className="debts-list__table" role="list">
        <li className="debts-list__head" aria-hidden>
          <span>Pessoa</span>
          <span />
          <span>Valor</span>
          <span>Empréstimo em</span>
          <span>Prazo de devolução</span>
          <span>Status</span>
          <span />
        </li>
        {dividas.map((divida) => (
          <DebtCard
            key={divida.id}
            divida={divida}
            onEdit={onEdit}
            onSettle={onSettle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  )
}
