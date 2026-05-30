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
    'relative flex h-9 w-full items-center justify-center',
    showRangeBand && 'ds-picker-range-band',
    state.type === 'endpoint' && state.position === 'start' && 'rounded-l-full',
    state.type === 'endpoint' && state.position === 'end' && 'rounded-r-full',
    state.type === 'endpoint' && state.position === 'preview-end' && 'rounded-r-full',
    state.type === 'endpoint' &&
      state.position === 'single' &&
      !state.confirmed &&
      hoverDay &&
      rangeStart &&
      isSameDay(day, rangeStart) &&
      'rounded-l-full'
  )

  return (
    <div className={wrapperClass}>
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => !isDisabled && onClick?.(day)}
        onMouseEnter={() => !isDisabled && onHover?.(day)}
        className="flex h-9 w-full items-center justify-center border-0 bg-transparent p-0"
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
    <div className={cn('px-3 pb-3', className)}>
      <div className="mb-1 grid grid-cols-7">
        {WEEKDAY_LABELS.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="flex h-8 items-center justify-center text-xs font-medium text-[var(--ds-color-text-secondary)]"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 ds-picker-grid" onMouseLeave={() => onDayHover?.(null)}>
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
