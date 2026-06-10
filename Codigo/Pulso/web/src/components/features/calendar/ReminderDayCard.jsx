import { Calendar, Check, CheckCircle2, Hourglass, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { getReminderCategoryMeta, ReminderCategoryIcon } from '@/utils/reminderCategories.jsx'
import { getReminderMarkLabel, reminderHasPayment } from '@/utils/reminderUtils.js'

function ReminderStatusLine({ item }) {
  if (item.pago) {
    return (
      <span className="calendar-reminder-card__status calendar-reminder-card__status--done">
        <CheckCircle2 size={12} aria-hidden />
        {reminderHasPayment(item) ? 'Pago' : 'Concluído'}
      </span>
    )
  }

  if (item.sincronizado) {
    return (
      <span className="calendar-reminder-card__status calendar-reminder-card__status--sync">
        <Calendar size={12} aria-hidden />
        Sincronizado
      </span>
    )
  }

  return (
    <span className="calendar-reminder-card__status calendar-reminder-card__status--pending">
      <Hourglass size={12} aria-hidden />
      Pendente
    </span>
  )
}

export function ReminderDayCard({ item, onEdit, onDelete, onMarkPaid }) {
  const meta = getReminderCategoryMeta(item.categoria)
  const hasPayment = reminderHasPayment(item)

  return (
    <li className="calendar-reminder-card">
      <div className="calendar-reminder-card__top">
        <span
          className="calendar-reminder-card__icon"
          style={{
            color: meta.color,
            background: `color-mix(in srgb, ${meta.color} 14%, transparent)`,
          }}
        >
          <ReminderCategoryIcon categoria={item.categoria} size={16} />
        </span>

        <div className="calendar-reminder-card__body">
          <strong className="calendar-reminder-card__title">{item.titulo}</strong>
          <div className="calendar-reminder-card__meta">
            {hasPayment ? (
              <span className="calendar-reminder-card__value">{formatCurrency(item.valor)}</span>
            ) : null}
            <ReminderStatusLine item={item} />
          </div>
        </div>

        <div className="calendar-reminder-card__tools">
          <IconButton
            variant="ghost"
            size="sm"
            ariaLabel={`Editar ${item.titulo}`}
            icon={<Pencil size={14} />}
            onClick={() => onEdit?.(item)}
          />
          <IconButton
            variant="ghost"
            size="sm"
            className="calendar-reminder-card__delete"
            ariaLabel={`Excluir ${item.titulo}`}
            icon={<Trash2 size={14} />}
            onClick={() => onDelete?.(item)}
          />
        </div>
      </div>

      {!item.pago ? (
        <button
          type="button"
          className="calendar-reminder-card__mark-btn"
          onClick={() => onMarkPaid?.(item)}
        >
          <Check size={14} aria-hidden />
          {getReminderMarkLabel(item)}
        </button>
      ) : null}
    </li>
  )
}
