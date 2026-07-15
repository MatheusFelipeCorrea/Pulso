import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Check, Clock, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { Badge } from '@/design-system/components/data-display/Badge/Badge.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

// Modal temporário — será substituído pelo design definitivo fornecido depois.

function formatDate(iso) {
  if (!iso) return '—'
  return format(parseISO(iso), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function ExpenseSplitDetailsModal({ open, onClose, divisao }) {
  if (!divisao) return null

  const participantes = divisao.participantes ?? []

  return (
    <Modal isOpen={open} onClose={onClose} size="lg" className="expense-split-details-modal">
      <div className="expense-split-details">
        <header className="expense-split-details__header">
          <div>
            <h2>{divisao.titulo}</h2>
            <p className="expense-split-details__meta">
              <Calendar size={14} aria-hidden /> {formatDate(divisao.data)} · {formatCurrency(divisao.valorTotal)}
            </p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="expense-split-details__body">
          {divisao.observacao ? <p className="expense-split-details__note">{divisao.observacao}</p> : null}

          <ul className="expense-split-details__list">
            {participantes.map((participante) => (
              <li key={participante.id} className="expense-split-details__row">
                <Avatar name={participante.nome} size="sm" fallback="color" />
                <span className="expense-split-details__name">
                  {participante.nome}
                  {participante.ehOrganizador ? ' (organizador)' : ''}
                  {participante.pagouAConta ? ' — pagou a conta' : ''}
                </span>
                <strong>{formatCurrency(participante.valor)}</strong>
                <Badge
                  variant={participante.status === 'PAGO' ? 'success' : 'warning'}
                  size="sm"
                  leftIcon={participante.status === 'PAGO' ? <Check size={12} /> : <Clock size={12} />}
                >
                  {participante.status === 'PAGO' ? 'Pago' : 'Pendente'}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  )
}
