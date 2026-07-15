import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, CircleDollarSign, Eye } from 'lucide-react'
import { AvatarGroup } from '@/design-system/components/data-display/Avatar/AvatarGroup.jsx'
import { Badge } from '@/design-system/components/data-display/Badge/Badge.jsx'
import { Tooltip } from '@/design-system/components/data-display/Tooltip/Tooltip.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { getPagador } from '@/utils/expenseSplitUtils.js'

function formatDate(iso) {
  if (!iso) return '—'
  return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR })
}

export function ExpenseSplitHistoryRow({ divisao, onView }) {
  const pagador = getPagador(divisao)
  const avatares = (divisao.participantes ?? []).map((p) => ({ id: p.id, name: p.nome }))

  return (
    <li className="expense-split-history__row">
      <span
        className="expense-split-history__icon"
        style={{
          color: divisao.cor ?? undefined,
          background: divisao.cor
            ? `color-mix(in srgb, ${divisao.cor} 14%, transparent)`
            : undefined,
        }}
        aria-hidden
      >
        {resolveBadgeIcon(divisao.icone ?? 'Receipt', { size: 16 })}
      </span>

      <div className="expense-split-history__info">
        <strong>{divisao.titulo}</strong>
        <span className="expense-split-history__meta">
          <CircleDollarSign size={13} aria-hidden /> {formatCurrency(divisao.valorTotal)}
          <Calendar size={13} aria-hidden /> {formatDate(divisao.data)}
        </span>
        {pagador ? <span className="expense-split-history__payer">{pagador.nome} pagou</span> : null}
      </div>

      <AvatarGroup avatars={avatares} max={4} size="sm" />

      <Badge variant="success" size="sm">
        Todos pagaram
      </Badge>

      <Tooltip content="Ver detalhes">
        <IconButton
          variant="ghost"
          size="sm"
          ariaLabel={`Ver detalhes de ${divisao.titulo}`}
          icon={<Eye size={15} />}
          onClick={() => onView?.(divisao)}
        />
      </Tooltip>
    </li>
  )
}
