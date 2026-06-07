import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Pencil, Trash2 } from 'lucide-react'
import { PulsoBadge } from '@/components/badges/PulsoBadge.jsx'
import { badgeKindFromRecurso } from '@/components/badges/enumMappers'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { cn } from '@/design-system/utils/cn.js'

function groupByDate(transacoes) {
  const groups = new Map()

  for (const tx of transacoes) {
    const key = format(parseISO(tx.data), 'yyyy-MM-dd')
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(tx)
  }

  return [...groups.entries()].map(([key, items]) => ({
    key,
    label: format(parseISO(`${key}T12:00:00`), "d 'de' MMMM 'de' yyyy", { locale: ptBR }),
    items,
  }))
}

function TransactionRow({ transacao, onEdit, onDelete }) {
  const isReceita = transacao.tipo === 'RECEITA'
  const recursoKind = badgeKindFromRecurso(transacao.recurso)
  const categoriaIcon = resolveBadgeIcon(transacao.categoria?.icone ?? 'Tag', { size: 18 })

  return (
    <div className="tx-item">
      <div
        className="tx-item__icon"
        style={{
          backgroundColor: `color-mix(in srgb, ${transacao.categoria?.cor ?? '#7C3AED'} 18%, transparent)`,
          color: transacao.categoria?.cor ?? '#7C3AED',
        }}
      >
        {categoriaIcon}
      </div>

      <div className="tx-item__body">
        <div className="tx-item__main">
          <p className="tx-item__title">{transacao.descricao || transacao.categoria?.nome}</p>
          {recursoKind ? (
            <div className="tx-item__badge">
              <PulsoBadge kind={recursoKind} size="sm" />
            </div>
          ) : null}
        </div>
      </div>

      <div className="tx-item__aside">
        <p className={cn('tx-item__amount', isReceita ? 'tx-item__amount--income' : 'tx-item__amount--expense')}>
          {isReceita ? '+' : '-'} {formatCurrency(Number(transacao.valor))}
        </p>

        <div className="tx-item__actions">
          <IconButton
            variant="ghost"
            size="sm"
            ariaLabel="Editar transação"
            icon={<Pencil size={16} />}
            onClick={() => onEdit?.(transacao)}
          />
          <IconButton
            variant="ghost"
            size="sm"
            ariaLabel="Excluir transação"
            icon={<Trash2 size={16} className="text-[var(--ds-color-danger)]" />}
            onClick={() => onDelete?.(transacao)}
          />
        </div>
      </div>
    </div>
  )
}

export function TransactionList({ transacoes = [], loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="tx-list__loading" aria-busy="true">
        <SpinnerDots center label="Carregando transações..." />
      </div>
    )
  }

  if (!transacoes.length) {
    return (
      <EmptyState
        title="Nenhuma transação encontrada"
        description="Comece registrando uma!"
        className="tx-list__empty"
      />
    )
  }

  const groups = groupByDate(transacoes)

  return (
    <div className="tx-list">
      {groups.map((group) => (
        <section key={group.key} className="tx-list__group">
          <h3 className="tx-list__date">{group.label}</h3>
          <div className="tx-list__items">
            {group.items.map((tx) => (
              <TransactionRow
                key={tx.id}
                transacao={tx}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
