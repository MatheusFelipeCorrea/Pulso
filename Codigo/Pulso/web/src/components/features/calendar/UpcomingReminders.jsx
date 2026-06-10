import { Bell, CheckCircle2, Cloud, Pencil, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { Badge } from '@/design-system/components/data-display/Badge/Badge.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { getReminderCategoryMeta, ReminderCategoryIcon } from '@/utils/reminderCategories.jsx'
import { getReminderMarkShortLabel, reminderHasPayment } from '@/utils/reminderUtils.js'

const ANTECEDENCIA_LABELS = {
  NO_DIA: 'No dia',
  UM_DIA: 'Lembrar: 1 dia antes',
  TRES_DIAS: 'Lembrar: 3 dias antes',
  CINCO_DIAS: 'Lembrar: 5 dias antes',
  UMA_SEMANA: 'Lembrar: 1 semana antes',
}

function countdownLabel(dias) {
  if (dias === 0) return 'Hoje'
  if (dias === 1) return 'em 1 dia'
  if (dias < 0) return `atrasado ${Math.abs(dias)}d`
  return `em ${dias} dias`
}

function countdownVariant(dias) {
  if (dias <= 3) return 'danger'
  if (dias <= 7) return 'warning'
  return 'success'
}

function PaymentStatusBadge({ item }) {
  if (!reminderHasPayment(item)) {
    return <span className="calendar-upcoming__muted">—</span>
  }

  if (item.pago) {
    return (
      <Badge variant="success" size="sm" className="calendar-upcoming__inline-badge">
        <CheckCircle2 size={12} aria-hidden />
        Pago
      </Badge>
    )
  }

  if (item.diasAteVencimento < 0) {
    return (
      <Badge variant="danger" size="sm" className="calendar-upcoming__inline-badge">
        Pendente
      </Badge>
    )
  }

  return (
    <Badge variant="warning" size="sm" className="calendar-upcoming__inline-badge">
      A pagar
    </Badge>
  )
}

function SyncStatusBadge({ sincronizado }) {
  if (sincronizado) {
    return (
      <span className="calendar-upcoming__sync-pill calendar-upcoming__sync-pill--on">
        <Cloud size={12} aria-hidden />
        Sincronizado
      </span>
    )
  }

  return (
    <span className="calendar-upcoming__sync-pill calendar-upcoming__sync-pill--off">
      Não sincronizado
    </span>
  )
}

export function UpcomingReminders({ items = [], onEdit, onDelete, onMarkPaid }) {
  return (
    <section className="calendar-upcoming">
      <header className="calendar-upcoming__header">
        <h2>
          <Bell size={18} aria-hidden />
          Próximos vencimentos
        </h2>
      </header>

      {items.length === 0 ? (
        <EmptyState
          title="Nenhum vencimento pendente"
          description="Crie um lembrete para acompanhar contas e compromissos financeiros."
        />
      ) : (
        <div className="calendar-upcoming__table-wrap">
          <table className="calendar-upcoming__table">
            <thead>
              <tr>
                <th aria-label="Ícone" />
                <th>Nome</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Prazo</th>
                <th>Pagamento</th>
                <th>Google Agenda</th>
                <th>Lembrete</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const meta = getReminderCategoryMeta(item.categoria)
                return (
                  <tr key={item.id}>
                    <td>
                      <span
                        className="calendar-upcoming__icon"
                        style={{
                          color: meta.color,
                          background: `color-mix(in srgb, ${meta.color} 14%, transparent)`,
                        }}
                      >
                        <ReminderCategoryIcon categoria={item.categoria} size={16} />
                      </span>
                    </td>
                    <td>
                      <strong className="calendar-upcoming__name">{item.titulo}</strong>
                    </td>
                    <td className="calendar-upcoming__value">
                      {item.valor != null ? formatCurrency(item.valor) : '—'}
                    </td>
                    <td>
                      {format(parseISO(item.dataVencimento), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td>
                      <Badge variant={countdownVariant(item.diasAteVencimento)} size="sm">
                        {countdownLabel(item.diasAteVencimento)}
                      </Badge>
                    </td>
                    <td>
                      <PaymentStatusBadge item={item} />
                    </td>
                    <td className="calendar-upcoming__google-col">
                      <SyncStatusBadge sincronizado={item.sincronizado} />
                    </td>
                    <td className="calendar-upcoming__reminder-col">
                      {ANTECEDENCIA_LABELS[item.antecedencia] ?? item.antecedencia}
                    </td>
                    <td>
                      <div className="calendar-upcoming__actions">
                        {!item.pago ? (
                          <button
                            type="button"
                            className="calendar-upcoming__pay-btn"
                            onClick={() => onMarkPaid?.(item)}
                          >
                            {getReminderMarkShortLabel(item)}
                          </button>
                        ) : null}
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
                          ariaLabel={`Excluir ${item.titulo}`}
                          icon={<Trash2 size={14} className="text-[var(--ds-color-danger)]" />}
                          onClick={() => onDelete?.(item)}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
