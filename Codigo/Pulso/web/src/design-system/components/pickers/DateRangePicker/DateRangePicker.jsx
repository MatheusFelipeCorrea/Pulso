import { useId, useState, useEffect } from 'react'
import { format, endOfMonth, isSameMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, ChevronDown, Lock, Check } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { Button } from '../../buttons/Button/Button.jsx'
import { SelectFieldWrapper } from '../../selects/shared/SelectFieldWrapper.jsx'
import { usePickerDropdown } from '../shared/usePickerDropdown.js'
import { useIsMobile } from '../../../hooks/useMediaQuery.js'
import { PickerTrigger } from '../shared/PickerTrigger.jsx'
import { pickerDropdownVariants } from '../shared/picker.styles.jsx'
import { CalendarHeader } from '../shared/CalendarHeader.jsx'
import { CalendarGrid } from '../shared/CalendarGrid.jsx'
import { addMonths, subMonths, startOfDay, isSameDay } from '../shared/calendarUtils.js'
import { DEFAULT_RANGE_PRESETS } from '../shared/dateRangePresets.js'

function formatRangeTrigger(start, end) {
  if (!start && !end) return null
  if (start && end && isSameMonth(start, end) && start.getDate() === 1) {
    const monthEnd = endOfMonth(start)
    if (isSameDay(end, monthEnd)) {
      return format(start, 'MMM yyyy', { locale: ptBR })
    }
  }
  if (start && end) {
    return `${format(start, 'dd/MM/yyyy', { locale: ptBR })} → ${format(end, 'dd/MM/yyyy', { locale: ptBR })}`
  }
  if (start) {
    return `${format(start, 'dd/MM/yyyy', { locale: ptBR })} → Data fim`
  }
  return null
}

/** DateRangePicker — seleção de intervalo com presets e confirmar "Aplicar" */
export const DateRangePicker = ({
  startDate = null,
  endDate = null,
  onChange,
  presets = DEFAULT_RANGE_PRESETS,
  minDate,
  maxDate,
  error,
  disabled = false,
  label,
  id: idProp,
  className,
  fullWidth = false,
}) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const isMobile = useIsMobile()
  const { isOpen, toggle, close, ref } = usePickerDropdown(disabled)

  const [viewMonth, setViewMonth] = useState(() => startDate ?? new Date())
  const [pendingStart, setPendingStart] = useState(startDate)
  const [pendingEnd, setPendingEnd] = useState(endDate)
  const [hoverDay, setHoverDay] = useState(null)
  const [activePreset, setActivePreset] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setPendingStart(startDate)
      setPendingEnd(endDate)
      setHoverDay(null)
      setActivePreset(null)
    }
  }, [isOpen, startDate, endDate])

  const validationError =
    error ??
    (pendingStart && pendingEnd && pendingStart > pendingEnd
      ? 'A data final deve ser igual ou posterior à inicial.'
      : undefined)

  const displayValue = formatRangeTrigger(startDate, endDate)
  const isMonthLabel = displayValue && !displayValue.includes('→')

  const handleDayClick = (day) => {
    const d = startOfDay(day)
    setActivePreset(null)
    if (!pendingStart || (pendingStart && pendingEnd)) {
      setPendingStart(d)
      setPendingEnd(null)
    } else {
      if (d < pendingStart) {
        setPendingEnd(pendingStart)
        setPendingStart(d)
      } else {
        setPendingEnd(d)
      }
    }
    setHoverDay(null)
  }

  const handlePreset = (preset) => {
    const { start, end } = preset.getValue()
    setPendingStart(startOfDay(start))
    setPendingEnd(startOfDay(end))
    setActivePreset(preset.id)
  }

  const handleApply = () => {
    if (pendingStart && pendingEnd && pendingStart <= pendingEnd) {
      onChange?.({ start: pendingStart, end: pendingEnd })
      close()
    }
  }

  const handleClear = () => {
    setPendingStart(null)
    setPendingEnd(null)
    setActivePreset(null)
    setHoverDay(null)
  }

  const secondMonth = addMonths(viewMonth, 1)

  return (
    <SelectFieldWrapper
      label={label}
      error={validationError}
      disabled={disabled}
      isOpen={isOpen}
      id={id}
      className={className}
    >
      <div ref={ref} className={cn('relative w-full', !fullWidth && 'max-w-md')}>
        <PickerTrigger
          id={id}
          open={isOpen}
          error={Boolean(validationError)}
          disabled={disabled}
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          leftIcon={
            disabled ? (
              <Lock size={20} className="text-[var(--ds-color-placeholder)]" />
            ) : (
              <Calendar size={20} className="text-[var(--ds-color-placeholder)]" />
            )
          }
          rightIcon={
            isMonthLabel ? (
              <ChevronDown
                size={20}
                className={cn(
                  'text-[var(--ds-color-placeholder)] transition-transform duration-[var(--ds-transition-fast)]',
                  isOpen && 'rotate-180'
                )}
              />
            ) : null
          }
        >
          {displayValue ? (
            <span className="text-[var(--ds-color-text)] capitalize">{displayValue}</span>
          ) : (
            <span className="text-[var(--ds-color-placeholder)]">Data início → Data fim</span>
          )}
        </PickerTrigger>

        {isOpen && (
          <div
            className={cn(
              pickerDropdownVariants(),
              'ds-picker-dropdown--range left-0 right-auto flex w-auto min-w-[320px] flex-col sm:min-w-[640px]'
            )}
            role="dialog"
          >
            <div className={cn('ds-range-picker__body', isMobile ? 'flex-col' : 'flex-row')}>
              {!isMobile && (
                <aside className="ds-range-picker__presets">
                  <p className="ds-range-picker__presets-title">Atalhos</p>
                  <div className="ds-range-picker__presets-list">
                    {presets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePreset(preset)}
                        data-active={activePreset === preset.id ? 'true' : 'false'}
                        className="ds-range-preset"
                      >
                        <span>{preset.label}</span>
                        {activePreset === preset.id && <Check size={14} aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </aside>
              )}

              <div className={cn('ds-range-picker__calendars', isMobile ? 'flex-col' : 'flex-row')}>
                <div className="ds-range-picker__month">
                  <CalendarHeader
                    month={viewMonth}
                    onPrev={() => setViewMonth((m) => subMonths(m, 1))}
                    onNext={() => setViewMonth((m) => addMonths(m, 1))}
                  />
                  <CalendarGrid
                    month={viewMonth}
                    rangeStart={pendingStart}
                    rangeEnd={pendingEnd}
                    hoverDay={hoverDay}
                    minDate={minDate}
                    maxDate={maxDate}
                    onDayClick={handleDayClick}
                    onDayHover={setHoverDay}
                  />
                </div>
                {!isMobile && (
                  <div className="ds-range-picker__month ds-range-picker__month--next">
                    <CalendarHeader
                      month={secondMonth}
                      onPrev={() => setViewMonth((m) => subMonths(m, 1))}
                      onNext={() => setViewMonth((m) => addMonths(m, 1))}
                    />
                    <CalendarGrid
                      month={secondMonth}
                      rangeStart={pendingStart}
                      rangeEnd={pendingEnd}
                      hoverDay={hoverDay}
                      minDate={minDate}
                      maxDate={maxDate}
                      onDayClick={handleDayClick}
                      onDayHover={setHoverDay}
                    />
                  </div>
                )}
              </div>
            </div>

            <footer className="ds-range-picker__footer">
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Limpar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApply}
                disabled={!pendingStart || !pendingEnd || pendingStart > pendingEnd}
              >
                Aplicar
              </Button>
            </footer>
          </div>
        )}
      </div>
    </SelectFieldWrapper>
  )
}
