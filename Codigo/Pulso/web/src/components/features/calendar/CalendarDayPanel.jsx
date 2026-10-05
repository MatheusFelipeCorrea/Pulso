import { PulsoBadge } from '@/components/badges/PulsoBadge.jsx'

import { badgeKindFromRecurso } from '@/components/badges/enumMappers'

import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'

import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'

import { formatDayTitle } from './CalendarMonthGrid.jsx'
import { ReminderDayCard } from './ReminderDayCard.jsx'



export function CalendarDayPanel({

  selectedDate,

  detalhe,

  loading,

  onEditReminder,

  onDeleteReminder,

  onMarkPaid,

}) {

  if (!selectedDate) {

    return (

      <aside className="calendar-day-panel calendar-day-panel--empty">

        <p>Selecione um dia no calendário para ver detalhes.</p>

      </aside>

    )

  }



  if (loading) {

    return (

      <aside className="calendar-day-panel calendar-day-panel--loading">

        <SpinnerDots center label="Carregando dia..." />

      </aside>

    )

  }



  const transacoes = detalhe?.transacoes ?? []

  const lembretes = detalhe?.lembretes ?? []

  const recebimentosFixos = detalhe?.recebimentosFixos ?? []

  return (

    <aside className="calendar-day-panel">

      <header className="calendar-day-panel__header">

        <h3>{formatDayTitle(selectedDate)}</h3>

      </header>

      {recebimentosFixos.length > 0 ? (
        <section className="calendar-day-panel__section calendar-day-panel__section--recebimentos">
          <h4>Recebimentos previstos</h4>
          <ul className="calendar-day-panel__list">
            {recebimentosFixos.map((item) => (
              <li key={item.tipo} className="calendar-day-panel__item calendar-day-panel__item--recebimento">
                <span className="calendar-grid__dot calendar-grid__dot--recebimento" aria-hidden />
                <div className="calendar-day-panel__item-body">
                  <strong>{item.label}</strong>
                </div>
                <span className="calendar-day-panel__item-value calendar-day-panel__item-value--income">
                  +{formatCurrency(item.valor)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="calendar-day-panel__section">

        <h4>Transações do dia</h4>

        {transacoes.length === 0 ? (

          <p className="calendar-day-panel__empty">Nenhuma transação neste dia.</p>

        ) : (

          <ul className="calendar-day-panel__list">

            {transacoes.map((tx) => {

              const isReceita = tx.tipo === 'RECEITA'

              const recursoKind = badgeKindFromRecurso(tx.recurso)

              const icon = resolveBadgeIcon(tx.categoria?.icone ?? 'Tag', { size: 16 })



              return (

                <li key={tx.id} className="calendar-day-panel__item">

                  <span

                    className="calendar-day-panel__item-icon"

                    style={{

                      color: tx.categoria?.cor,

                      background: `color-mix(in srgb, ${tx.categoria?.cor ?? '#7C3AED'} 14%, transparent)`,

                    }}

                  >

                    {icon}

                  </span>

                  <div className="calendar-day-panel__item-body">

                    <strong>{tx.descricao || tx.categoria?.nome}</strong>

                    {recursoKind ? <PulsoBadge kind={recursoKind} size="sm" /> : null}

                  </div>

                  <span

                    className={`calendar-day-panel__item-value${

                      isReceita ? ' calendar-day-panel__item-value--income' : ''

                    }`}

                  >

                    {isReceita ? '+' : '-'}

                    {formatCurrency(tx.valor)}

                  </span>

                </li>

              )

            })}

          </ul>

        )}

      </section>



      <div className="calendar-day-panel__totals">

        <span>Receitas: {formatCurrency(detalhe?.totais?.receitas ?? 0)}</span>

        <span>Despesas: {formatCurrency(detalhe?.totais?.despesas ?? 0)}</span>

        <strong>Saldo: {formatCurrency(detalhe?.totais?.saldo ?? 0)}</strong>

      </div>



      <section className="calendar-day-panel__section calendar-day-panel__section--grow">

        <h4>Lembretes / Vencimentos</h4>

        {lembretes.length === 0 ? (

          <p className="calendar-day-panel__empty">Nenhum lembrete neste dia.</p>

        ) : (

          <ul
            className={`calendar-day-panel__list calendar-day-panel__list--reminders${
              lembretes.length > 2 ? ' calendar-day-panel__list--scroll' : ''
            }`}
          >
            {lembretes.map((item) => (
              <ReminderDayCard
                key={item.id}
                item={item}
                onEdit={onEditReminder}
                onDelete={onDeleteReminder}
                onMarkPaid={onMarkPaid}
              />
            ))}
          </ul>

        )}

      </section>



    </aside>

  )

}

