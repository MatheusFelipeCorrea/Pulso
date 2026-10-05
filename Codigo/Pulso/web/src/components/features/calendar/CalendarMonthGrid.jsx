import { format, getDay, isSameDay, isSameMonth } from 'date-fns'

import { ptBR } from 'date-fns/locale'

import {

  getCalendarDays,

} from '@/design-system/components/pickers/shared/calendarUtils.js'

import { cn } from '@/design-system/utils/cn.js'



const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']



function dayMarkers(marker) {

  if (!marker) return []

  const items = []

  if (marker.temReceita && marker.temDespesa) items.push('misto')

  else {

    if (marker.temReceita) items.push('receita')

    if (marker.temDespesa) items.push('despesa')

  }

  if (marker.temLembrete) items.push('lembrete')

  if (marker.temRecebimentoFixo) items.push('recebimento')

  return items

}



export function CalendarMonthGrid({ monthDate, selectedDate, dias = {}, onSelectDay }) {

  const days = getCalendarDays(monthDate)



  return (

    <div className="calendar-grid">

      <div className="calendar-grid__weekdays">

        {WEEKDAY_LABELS.map((label, index) => (

          <span

            key={label}

            className={cn(

              'calendar-grid__weekday',

              (index === 0 || index === 6) && 'calendar-grid__weekday--weekend'

            )}

          >

            {label}

          </span>

        ))}

      </div>



      <div className="calendar-grid__days">

        {days.map((day) => {

          const key = format(day, 'yyyy-MM-dd')

          const marker = dias[key]

          const markers = dayMarkers(marker)

          const inMonth = isSameMonth(day, monthDate)

          const selected = selectedDate && isSameDay(day, selectedDate)

          const today = isSameDay(day, new Date())

          const weekend = getDay(day) === 0 || getDay(day) === 6



          return (

            <button

              key={key}

              type="button"

              className={cn(

                'calendar-grid__day',

                !inMonth && 'calendar-grid__day--outside',

                selected && 'calendar-grid__day--selected',

                today && 'calendar-grid__day--today',

                weekend && inMonth && 'calendar-grid__day--weekend'

              )}

              onClick={() => onSelectDay?.(day)}

              aria-label={
                today
                  ? `Hoje, ${format(day, "d 'de' MMMM", { locale: ptBR })}`
                  : format(day, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
              }

              aria-current={today ? 'date' : undefined}

            >

              <span className="calendar-grid__day-num">{format(day, 'd')}</span>

              {markers.length > 0 ? (

                <span className="calendar-grid__dots" aria-hidden>

                  {markers.includes('misto') ? (

                    <span className="calendar-grid__dot calendar-grid__dot--misto" />

                  ) : (

                    <>

                      {markers.includes('receita') ? (

                        <span className="calendar-grid__dot calendar-grid__dot--receita" />

                      ) : null}

                      {markers.includes('despesa') ? (

                        <span className="calendar-grid__dot calendar-grid__dot--despesa" />

                      ) : null}

                    </>

                  )}

                  {markers.includes('lembrete') ? (

                    <span className="calendar-grid__dot calendar-grid__dot--lembrete" />

                  ) : null}

                  {markers.includes('recebimento') ? (

                    <span className="calendar-grid__dot calendar-grid__dot--recebimento" />

                  ) : null}

                </span>

              ) : null}

            </button>

          )

        })}

      </div>



      <div className="calendar-grid__legend">

        <span>
          <i className="calendar-grid__legend-today" aria-hidden />
          Hoje
        </span>

        <span><i className="calendar-grid__dot calendar-grid__dot--receita" /> Receita</span>

        <span><i className="calendar-grid__dot calendar-grid__dot--despesa" /> Despesa</span>

        <span><i className="calendar-grid__dot calendar-grid__dot--misto" /> Ambos</span>

        <span><i className="calendar-grid__dot calendar-grid__dot--lembrete" /> Lembrete</span>

        <span><i className="calendar-grid__dot calendar-grid__dot--recebimento" /> Recebimento</span>

      </div>

    </div>

  )

}



export function formatDayTitle(date) {

  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })

}



export function dateToApiKey(date) {

  return format(date, 'yyyy-MM-dd')

}

