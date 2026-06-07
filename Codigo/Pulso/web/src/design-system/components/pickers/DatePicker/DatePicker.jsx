import { useId, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { SelectFieldWrapper } from '../../selects/shared/SelectFieldWrapper.jsx'
import { usePickerDropdown } from '../shared/usePickerDropdown.js'
import { PickerTrigger } from '../shared/PickerTrigger.jsx'
import { pickerDropdownVariants } from '../shared/picker.styles.jsx'
import { CalendarHeader } from '../shared/CalendarHeader.jsx'
import { CalendarGrid } from '../shared/CalendarGrid.jsx'
import { addMonths, subMonths, startOfDay } from '../shared/calendarUtils.js'

/** DatePicker — seleção de data única com calendário dropdown */
export const DatePicker = ({
  value = null,
  onChange,
  placeholder = 'DD/MM/AAAA',
  minDate,
  maxDate,
  disablePast = false,
  error,
  disabled = false,
  label,
  required = false,
  format: formatStr = 'dd/MM/yyyy',
  locale = ptBR,
  id: idProp,
  className,
}) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const { isOpen, toggle, close, ref } = usePickerDropdown(disabled)

  const [viewMonth, setViewMonth] = useState(() => value ?? new Date())

  const effectiveMin = disablePast ? startOfDay(new Date()) : minDate

  const displayValue = value ? format(value, formatStr, { locale }) : null

  const handleSelect = (day) => {
    onChange?.(startOfDay(day))
    close()
  }

  const handleToday = () => {
    const today = startOfDay(new Date())
    setViewMonth(today)
    onChange?.(today)
    close()
  }

  return (
    <SelectFieldWrapper
      label={label}
      required={required}
      error={error}
      disabled={disabled}
      isOpen={isOpen}
      id={id}
      className={className}
    >
      <div ref={ref} className="relative w-full">
        <PickerTrigger
          id={id}
          open={isOpen}
          error={Boolean(error)}
          disabled={disabled}
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          rightIcon={
            <Calendar
              size={20}
              className={cn(
                isOpen ? 'text-[var(--ds-color-primary)]' : 'text-[var(--ds-color-placeholder)]'
              )}
            />
          }
        >
          {displayValue ? (
            <span className="text-[var(--ds-color-text)]">{displayValue}</span>
          ) : (
            <span className="text-[var(--ds-color-placeholder)]">{placeholder}</span>
          )}
        </PickerTrigger>

        {isOpen && (
          <div className={cn(pickerDropdownVariants(), 'ds-picker-dropdown--calendar')} role="dialog">
            <CalendarHeader
              month={viewMonth}
              onPrev={() => setViewMonth((m) => subMonths(m, 1))}
              onNext={() => setViewMonth((m) => addMonths(m, 1))}
            />
            <CalendarGrid
              month={viewMonth}
              selected={value}
              minDate={effectiveMin}
              maxDate={maxDate}
              disablePast={disablePast}
              onDayClick={handleSelect}
            />
            <div className="ds-picker-dropdown__footer">
              <button type="button" onClick={handleToday} className="ds-picker-dropdown__today">
                Hoje
              </button>
            </div>
          </div>
        )}
      </div>
    </SelectFieldWrapper>
  )
}
