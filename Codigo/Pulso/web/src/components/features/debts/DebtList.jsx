import { Plus } from 'lucide-react'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { DebtCard } from './DebtCard.jsx'

export function DebtList({
  dividas,
  loading,
  tabAtiva,
  onNew,
  onEdit,
  onSettle,
  onDelete,
  onPayment,
  onReopen,
  onView,
}) {
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
    <ul className="debts-list" role="list">
      {dividas.map((divida) => (
        <DebtCard
          key={divida.id}
          divida={divida}
          onView={onView}
          onEdit={onEdit}
          onSettle={onSettle}
          onDelete={onDelete}
          onPayment={onPayment}
          onReopen={onReopen}
        />
      ))}
    </ul>
  )
}
