import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Check, Pencil, Trash2 } from 'lucide-react'
import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { getDebtStatusBadge } from '@/utils/debtStatusUtils.js'

function formatDate(iso) {
  if (!iso) return '—'
  return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR })
}

export function DebtCard({ divida, onEdit, onSettle, onDelete }) {
  const status = getDebtStatusBadge(divida)
  const isReceive = divida.direcao === 'ME_DEVEM'
  const valorClass = divida.quitada
    ? 'debts-card__value--settled'
    : isReceive
      ? 'debts-card__value--receive'
      : 'debts-card__value--pay'

  return (
    <li className="debts-card">
      <Avatar name={divida.nomePessoa} size="lg" fallback="color" className="debts-card__avatar" />

      <div className="debts-card__person">
        <strong>{divida.nomePessoa}</strong>
      </div>

      <div className={`debts-card__value ${valorClass}`}>{formatCurrency(divida.valor)}</div>

      <div className="debts-card__date">{formatDate(divida.dataEmprestimo)}</div>

      <div className="debts-card__deadline">
        {divida.prazoDevolucao ? formatDate(divida.prazoDevolucao) : '—'}
      </div>

      <div className={`debts-card__status debts-card__status--${status.tone}`}>
        {status.label}
      </div>

      <div className="debts-card__actions">
        {!divida.quitada ? (
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="debts-card__settle-btn"
              leftIcon={<Check size={14} />}
              onClick={() => onSettle?.(divida)}
            >
              Marcar como paga
            </Button>
            <IconButton
              variant="ghost"
              size="sm"
              ariaLabel={`Editar empréstimo de ${divida.nomePessoa}`}
              icon={<Pencil size={14} />}
              onClick={() => onEdit?.(divida)}
            />
            <IconButton
              variant="ghost"
              size="sm"
              className="debts-card__delete"
              ariaLabel={`Excluir empréstimo de ${divida.nomePessoa}`}
              icon={<Trash2 size={14} />}
              onClick={() => onDelete?.(divida)}
            />
          </>
        ) : null}
      </div>
    </li>
  )
}
