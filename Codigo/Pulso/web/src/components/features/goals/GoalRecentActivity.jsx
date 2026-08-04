import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Check, Plus } from 'lucide-react'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

function formatActivityWhen(iso) {
  if (!iso) return ''
  const date = parseISO(iso)
  if (isToday(date)) return 'Hoje'
  if (isYesterday(date)) return 'Ontem'
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

export function GoalRecentActivity({ items = [] }) {
  return (
    <>
      <div className="goals-sidebar__activity-head">
        <h2>Atividade recente</h2>
      </div>

      {items.length === 0 ? (
        <p className="goals-sidebar__empty">Nenhuma atividade recente.</p>
      ) : (
        <ul className="goals-sidebar__activity goals-sidebar__activity--scroll">
        {items.map((item) => {
          const isConcluida = item.tipo === 'meta_concluida'

          return (
            <li
              key={item.id}
              className={`goals-sidebar__activity-item${
                isConcluida ? ' goals-sidebar__activity-item--concluida' : ''
              }`}
            >
              <span
                className={`goals-sidebar__activity-icon${
                  isConcluida ? ' goals-sidebar__activity-icon--concluida' : ''
                }`}
                aria-hidden
              >
                {isConcluida ? <Check size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
              </span>

              <div className="goals-sidebar__activity-body">
                <strong>{isConcluida ? 'Meta concluída!' : 'Aporte realizado'}</strong>
                <span className="goals-sidebar__activity-meta">{item.metaNome}</span>
                <span className="goals-sidebar__activity-value">+ {formatCurrency(item.valor)}</span>
              </div>

              <time className="goals-sidebar__activity-time" dateTime={item.data}>
                {formatActivityWhen(item.data)}
              </time>
            </li>
          )
        })}
      </ul>
      )}
    </>
  )
}
