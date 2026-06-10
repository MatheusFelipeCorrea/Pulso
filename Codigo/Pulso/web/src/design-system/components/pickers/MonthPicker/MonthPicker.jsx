import { useEffect, useId, useState } from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { SelectFieldWrapper } from '../../selects/shared/SelectFieldWrapper.jsx'
import { SelectChevron } from '../../selects/shared/SelectChevron.jsx'
import { usePickerDropdown } from '../shared/usePickerDropdown.js'
import { PickerTrigger } from '../shared/PickerTrigger.jsx'
import { pickerDropdownVariants } from '../shared/picker.styles.jsx'
import { MONTH_SHORT_LABELS, MONTH_LONG_LABELS } from '../shared/calendarUtils.js'

/** MonthPicker — seleção de mês/ano em grid 4×3 */
export const MonthPicker = ({
  value = null,
  onChange,
  minYear,
  maxYear,
  disableFuture = false,
  placeholder = 'Selecione um mês...',
  error,
  disabled = false,
  label,
  required = false,
  monthDisplay = 'short',
  id: idProp,
  className,
}) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const { isOpen, toggle, close, ref } = usePickerDropdown(disabled)

  const now = new Date()
  const [viewYear, setViewYear] = useState(() => value?.year ?? now.getFullYear())
  const [slideDir, setSlideDir] = useState(0)

  useEffect(() => {
    if (value?.year != null) {
      setViewYear(value.year)
    }
  }, [value?.year])

  const displayValue = value
    ? monthDisplay === 'long'
      ? `${MONTH_LONG_LABELS[value.month - 1]} de ${value.year}`
      : monthDisplay === 'compact'
        ? `${MONTH_LONG_LABELS[value.month - 1]} ${value.year}`
        : `${MONTH_SHORT_LABELS[value.month - 1]}/${value.year}`
    : null

  const isMonthDisabled = (monthIndex) => {
    const year = viewYear
    if (minYear && year < minYear) return true
    if (maxYear && year > maxYear) return true
    if (!disableFuture) return false
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    if (year > currentYear) return true
    if (year === currentYear && monthIndex > currentMonth) return true
    return false
  }

  const canGoNext = !disableFuture || viewYear < now.getFullYear()
  const canGoPrev = minYear ? viewYear > minYear : true

  const handleSelect = (monthIndex) => {
    if (isMonthDisabled(monthIndex)) return
    onChange?.({ month: monthIndex + 1, year: viewYear })
    close()
  }

  const changeYear = (delta) => {
    setSlideDir(delta)
    setViewYear((y) => y + delta)
  }

  const isCurrentMonth = (monthIndex) =>
    viewYear === now.getFullYear() && monthIndex === now.getMonth()

  const isSelected = (monthIndex) =>
    value?.year === viewYear && value?.month === monthIndex + 1

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
          leftIcon={<Calendar size={20} className="text-[var(--ds-color-placeholder)]" />}
          rightIcon={<SelectChevron open={isOpen} />}
        >
          {displayValue ? (
            <span className="text-[var(--ds-color-text)]">{displayValue}</span>
          ) : (
            <span className="text-[var(--ds-color-placeholder)]">{placeholder}</span>
          )}
        </PickerTrigger>

        {isOpen && (
          <div className={cn(pickerDropdownVariants(), 'p-3')} role="dialog">
            <div className="ds-picker-dropdown__header">
              <button
                type="button"
                onClick={() => changeYear(-1)}
                disabled={!canGoPrev}
                className="ds-picker-dropdown__nav"
                aria-label="Ano anterior"
              >
                ‹
              </button>
              <span
                key={viewYear}
                className={cn(
                  'ds-picker-dropdown__year',
                  slideDir !== 0 && 'animate-[ds-picker-slide_200ms_ease]'
                )}
              >
                {viewYear}
              </span>
              <button
                type="button"
                onClick={() => changeYear(1)}
                disabled={!canGoNext}
                className="ds-picker-dropdown__nav"
                aria-label="Próximo ano"
              >
                ›
              </button>
            </div>

            <div className="ds-picker-dropdown__grid">
              {MONTH_SHORT_LABELS.map((label, index) => {
                const disabledMonth = isMonthDisabled(index)
                const selected = isSelected(index)
                const current = isCurrentMonth(index) && !selected

                let variant = 'default'
                if (disabledMonth) variant = 'disabled'
                else if (selected) variant = 'selected'
                else if (current) variant = 'current'

                return (
                  <button
                    key={label}
                    type="button"
                    disabled={disabledMonth}
                    onClick={() => handleSelect(index)}
                    className="ds-month-cell"
                    data-variant={variant}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </SelectFieldWrapper>
  )
}
