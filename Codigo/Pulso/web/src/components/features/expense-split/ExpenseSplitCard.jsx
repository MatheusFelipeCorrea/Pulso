import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Bell, Calendar, Check, CircleDollarSign, Clock, Eye, Pencil, Trash2 } from 'lucide-react'
import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { Badge } from '@/design-system/components/data-display/Badge/Badge.jsx'
import { Tooltip } from '@/design-system/components/data-display/Tooltip/Tooltip.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { getParticipantesVisiveis, getPagador } from '@/utils/expenseSplitUtils.js'

function formatDate(iso) {
  if (!iso) return '—'
  return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR })
}

export function ExpenseSplitCard({
  divisao,
  onView,
  onEdit,
  onDelete,
  onMarcarPago,
  onCriarLembrete,
}) {
  const participantes = getParticipantesVisiveis(divisao)
  const pagador = getPagador(divisao)

  return (
    <li className="expense-split-card">
      <div className="expense-split-card__header">
        <span
          className="expense-split-card__icon"
          style={{
            color: divisao.cor ?? undefined,
            background: divisao.cor
              ? `color-mix(in srgb, ${divisao.cor} 14%, transparent)`
              : undefined,
          }}
          aria-hidden
        >
          {resolveBadgeIcon(divisao.icone ?? 'Receipt', { size: 18 })}
        </span>
        <h3 className="expense-split-card__title">{divisao.titulo}</h3>
      </div>

      <div className="expense-split-card__meta">
        <span>
          <CircleDollarSign size={14} aria-hidden /> {formatCurrency(divisao.valorTotal)}
        </span>
        <span>
          <Calendar size={14} aria-hidden /> {formatDate(divisao.data)}
        </span>
      </div>

      {pagador ? (
        <p className="expense-split-card__payer">{pagador.nome} pagou</p>
      ) : null}

      <ul className="expense-split-card__participants">
        {participantes.map((participante) => (
          <li key={participante.id} className="expense-split-card__participant">
            <span
              className={`expense-split-card__status-dot expense-split-card__status-dot--${participante.status === 'PAGO' ? 'pago' : 'pendente'}`}
              aria-hidden
            >
              {participante.status === 'PAGO' ? <Check size={12} /> : <Clock size={11} />}
            </span>
            <Avatar name={participante.nome} size="sm" fallback="color" />
            <span className="expense-split-card__participant-name">{participante.nome}</span>
            <strong className="expense-split-card__participant-value">
              {formatCurrency(participante.valor)}
            </strong>
            <Badge variant={participante.status === 'PAGO' ? 'success' : 'warning'} size="sm">
              {participante.status === 'PAGO' ? 'Pago' : 'Pendente'}
            </Badge>
            {participante.status === 'PENDENTE' ? (
              <div className="expense-split-card__participant-actions">
                <Tooltip content="Marcar como pago">
                  <IconButton
                    variant="ghost"
                    size="sm"
                    ariaLabel={`Marcar ${participante.nome} como pago`}
                    icon={<Check size={14} />}
                    onClick={() => onMarcarPago?.(divisao, participante)}
                  />
                </Tooltip>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <footer className="expense-split-card__footer">
        <div className="expense-split-card__toolbar" role="group" aria-label={`Ações de ${divisao.titulo}`}>
          <Tooltip content="Ver detalhes">
            <IconButton
              variant="ghost"
              size="sm"
              ariaLabel={`Ver detalhes de ${divisao.titulo}`}
              icon={<Eye size={15} />}
              onClick={() => onView?.(divisao)}
            />
          </Tooltip>
          {participantes.some((p) => p.status === 'PENDENTE') ? (
            <Tooltip content="Lembrar de cobrar">
              <IconButton
                variant="ghost"
                size="sm"
                ariaLabel={`Lembrar de cobrar — ${divisao.titulo}`}
                icon={<Bell size={14} />}
                onClick={() => onCriarLembrete?.(divisao)}
              />
            </Tooltip>
          ) : null}
          <Tooltip content="Editar divisão">
            <IconButton
              variant="ghost"
              size="sm"
              ariaLabel={`Editar ${divisao.titulo}`}
              icon={<Pencil size={14} />}
              onClick={() => onEdit?.(divisao)}
            />
          </Tooltip>
          <Tooltip content="Excluir divisão">
            <IconButton
              variant="ghost"
              size="sm"
              ariaLabel={`Excluir ${divisao.titulo}`}
              icon={<Trash2 size={14} />}
              onClick={() => onDelete?.(divisao)}
            />
          </Tooltip>
        </div>
      </footer>
    </li>
  )
}
