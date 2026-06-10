import { addMonths, parseISO, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MonthPicker } from '@/design-system/components/pickers/MonthPicker/MonthPicker.jsx'
import {
  monthPickerParaPeriodo,
  periodoParaMonthPicker,
} from '@/utils/transactionRecurrence.js'

export function CalendarMonthNav({ periodo, onChangePeriodo }) {
  const monthDate = parseISO(`${periodo}-01T12:00:00`)

  const goPrev = () => {
    const prev = subMonths(monthDate, 1)
    onChangePeriodo?.(
      monthPickerParaPeriodo({ year: prev.getFullYear(), month: prev.getMonth() + 1 })
    )
  }

  const goNext = () => {
    const next = addMonths(monthDate, 1)
    onChangePeriodo?.(
      monthPickerParaPeriodo({ year: next.getFullYear(), month: next.getMonth() + 1 })
    )
  }

  return (
    <nav className="calendar-month-nav" aria-label="Navegação do mês">
      <div className="calendar-month-nav__bar">
        <button
          type="button"
          className="calendar-month-nav__arrow"
          onClick={goPrev}
          aria-label="Mês anterior"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>

        <MonthPicker
          className="calendar-month-nav__picker"
          value={periodoParaMonthPicker(periodo)}
          onChange={(value) => onChangePeriodo?.(monthPickerParaPeriodo(value))}
          monthDisplay="compact"
        />

        <button
          type="button"
          className="calendar-month-nav__arrow"
          onClick={goNext}
          aria-label="Próximo mês"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>
      </div>
    </nav>
  )
}
