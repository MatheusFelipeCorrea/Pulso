import { cn } from '../../../utils/cn.js'
import {
  isSameDay,
  isToday,
  isSameMonth,
  isDayDisabled,
  getDayRangeState,
  WEEKDAY_LABELS,
  getCalendarDays,
} from './calendarUtils.js'

const DayCell = ({
  day,
  currentMonth,
  selected,
  rangeStart,
  rangeEnd,
  hoverDay,
  minDate,
  maxDate,
  disablePast,
  onClick,
  onHover,
}) => {
  const isOutside = !isSameMonth(day, currentMonth)
  const isDisabled = isOutside || isDayDisabled(day, { minDate, maxDate, disablePast })

  const state = getDayRangeState(day, { rangeStart, rangeEnd, hoverDay, selected })
  const today = isToday(day) && !isOutside

  let dotVariant = 'default'
  if (state.type === 'selected') dotVariant = 'selected'
  else if (state.type === 'endpoint') {
    if (state.position === 'preview-end') dotVariant = 'preview-end'
    else dotVariant = 'endpoint'
  } else if (state.type === 'in-range') dotVariant = 'in-range'

  const showRangeBand =
    state.type === 'in-range' ||
    (state.type === 'endpoint' && state.position === 'start') ||
    (state.type === 'endpoint' && state.position === 'end') ||
    (state.type === 'endpoint' && state.position === 'preview-end') ||
    (state.type === 'endpoint' &&
      state.position === 'single' &&
      !state.confirmed &&
      hoverDay &&
      rangeStart &&
      isSameDay(day, rangeStart))

  const wrapperClass = cn(
    'ds-picker-day-cell',
    showRangeBand && 'ds-picker-day-cell--range',
    state.type === 'endpoint' && state.position === 'start' && 'ds-picker-day-cell--range-start',
    state.type === 'endpoint' && state.position === 'end' && 'ds-picker-day-cell--range-end',
    state.type === 'endpoint' && state.position === 'preview-end' && 'ds-picker-day-cell--range-end',
    state.type === 'endpoint' &&
      state.position === 'single' &&
      !state.confirmed &&
      hoverDay &&
      rangeStart &&
      isSameDay(day, rangeStart) &&
      'ds-picker-day-cell--range-start'
  )

  return (
    <div className={wrapperClass}>
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => !isDisabled && onClick?.(day)}
        onMouseEnter={() => !isDisabled && onHover?.(day)}
        className="ds-picker-day-btn"
      >
        <span
          className="ds-picker-day-dot"
          data-outside={isOutside ? 'true' : 'false'}
          data-disabled={isDisabled ? 'true' : 'false'}
          data-variant={dotVariant}
          data-today={today ? 'true' : 'false'}
        >
          {day.getDate()}
        </span>
      </button>
    </div>
  )
}

/** Grade de calendário de um mês */
export const CalendarGrid = ({
  month,
  selected,
  rangeStart,
  rangeEnd,
  hoverDay,
  minDate,
  maxDate,
  disablePast,
  onDayClick,
  onDayHover,
  className,
}) => {
  const days = getCalendarDays(month)

  return (
    <div className={cn('ds-picker-calendar-body', className)}>
      <div className="ds-picker-weekdays">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={`${label}-${i}`} className="ds-picker-weekday">
            {label}
          </span>
        ))}
      </div>
      <div className="ds-picker-grid" onMouseLeave={() => onDayHover?.(null)}>
        {days.map((day) => (
          <DayCell
            key={day.toISOString()}
            day={day}
            currentMonth={month}
            selected={selected}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            hoverDay={hoverDay}
            minDate={minDate}
            maxDate={maxDate}
            disablePast={disablePast}
            onClick={onDayClick}
            onHover={onDayHover}
          />
        ))}
      </div>
    </div>
  )
}

