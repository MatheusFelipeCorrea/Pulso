import { useId, useState, useMemo, useCallback } from 'react'
import { Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { inputHelperVariants } from '../../inputs/shared/inputField.styles.jsx'
import { SelectFieldWrapper } from '../../selects/shared/SelectFieldWrapper.jsx'
import { SelectChevron } from '../../selects/shared/SelectChevron.jsx'
import { usePickerDropdown } from '../shared/usePickerDropdown.js'
import { PickerTrigger } from '../shared/PickerTrigger.jsx'
import { pickerDropdownVariants } from '../shared/picker.styles.jsx'

function parseTime(value, format24 = true) {
  if (!value) return { hour: 0, minute: 0, period: 'AM' }
  const match24 = value.match(/^(\d{1,2}):(\d{2})$/)
  if (match24) {
    return { hour: Number(match24[1]), minute: Number(match24[2]), period: 'AM' }
  }
  const match12 = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (match12) {
    return { hour: Number(match12[1]), minute: Number(match12[2]), period: match12[3].toUpperCase() }
  }
  return { hour: 0, minute: 0, period: 'AM' }
}

function formatTime(hour, minute, format24, period) {
  const mm = String(minute).padStart(2, '0')
  if (format24) return `${String(hour).padStart(2, '0')}:${mm}`
  return `${hour}:${mm} ${period}`
}

function buildMinutes(step) {
  const items = []
  for (let m = 0; m < 60; m += step) items.push(m)
  return items
}

function buildHours(format24) {
  if (format24) return Array.from({ length: 24 }, (_, i) => i)
  return Array.from({ length: 12 }, (_, i) => i + 1)
}

const TimeColumn = ({ label, items, selected, onSelect, formatItem = (v) => String(v).padStart(2, '0') }) => (
  <div className="flex flex-1 flex-col">
    <span className="mb-1 text-center text-[10px] font-semibold uppercase tracking-wide text-[var(--ds-color-text-secondary)]">
      {label}
    </span>
    <div className="max-h-40 overflow-y-auto">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          data-selected={selected === item ? 'true' : 'false'}
          className="ds-time-option"
        >
          {formatItem(item)}
        </button>
      ))}
    </div>
  </div>
)

/** TimePicker — seleção de horário em dropdown ou inline */
export const TimePicker = ({
  value = '',
  onChange,
  format: timeFormat = '24h',
  minuteStep = 5,
  variant = 'dropdown',
  error,
  disabled = false,
  label,
  disabledLabel = 'Não disponível',
  id: idProp,
  className,
}) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const is24h = timeFormat === '24h'
  const { isOpen, toggle, ref } = usePickerDropdown(disabled)

  const parsed = parseTime(value, is24h)
  const [hour, setHour] = useState(parsed.hour)
  const [minute, setMinute] = useState(parsed.minute)
  const [period, setPeriod] = useState(parsed.period)

  const hours = useMemo(() => buildHours(is24h), [is24h])
  const minutes = useMemo(() => buildMinutes(minuteStep), [minuteStep])

  const emitChange = useCallback(
    (h, m, p) => {
      onChange?.(formatTime(h, m, is24h, p))
    },
    [onChange, is24h]
  )

  const updateTime = (h, m, p) => {
    setHour(h)
    setMinute(m)
    setPeriod(p)
    emitChange(h, m, p)
  }

  const adjust = (field, delta) => {
    if (field === 'hour') {
      const max = is24h ? 23 : 12
      const min = is24h ? 0 : 1
      const next = Math.min(max, Math.max(min, hour + delta))
      setHour(next)
      emitChange(next, minute, period)
    } else {
      const idx = minutes.indexOf(minute)
      const nextIdx = (idx + delta + minutes.length) % minutes.length
      const next = minutes[nextIdx]
      setMinute(next)
      emitChange(hour, next, period)
    }
  }

  const displayValue = value || null

  if (variant === 'inline') {
    return (
      <SelectFieldWrapper label={label} error={error} disabled={disabled} id={id} className={className}>
        <div className="inline-flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <button type="button" disabled={disabled} onClick={() => adjust('hour', 1)} className="text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text)]">
              <ChevronUp size={16} />
            </button>
            <span className="min-w-[2.5rem] rounded-[var(--ds-radius-md)] border border-[var(--ds-color-select-border)] bg-[var(--ds-color-select-bg)] px-3 py-2 text-center text-sm">
              {String(hour).padStart(2, '0')}
            </span>
            <button type="button" disabled={disabled} onClick={() => adjust('hour', -1)} className="text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text)]">
              <ChevronDown size={16} />
            </button>
          </div>
          <span className="text-lg text-[var(--ds-color-text-secondary)]">:</span>
          <div className="flex flex-col items-center gap-1">
            <button type="button" disabled={disabled} onClick={() => adjust('minute', 1)} className="text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text)]">
              <ChevronUp size={16} />
            </button>
            <span className="min-w-[2.5rem] rounded-[var(--ds-radius-md)] border border-[var(--ds-color-select-border)] bg-[var(--ds-color-select-bg)] px-3 py-2 text-center text-sm">
              {String(minute).padStart(2, '0')}
            </span>
            <button type="button" disabled={disabled} onClick={() => adjust('minute', -1)} className="text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text)]">
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
        {disabled && disabledLabel && (
          <p className={inputHelperVariants({ type: 'helper' })}>{disabledLabel}</p>
        )}
      </SelectFieldWrapper>
    )
  }

  return (
    <SelectFieldWrapper
      label={label}
      error={error}
      disabled={disabled}
      isOpen={isOpen}
      id={id}
      className={className}
    >
      <div ref={ref} className="relative w-60 max-w-full">
        <PickerTrigger
          id={id}
          open={isOpen}
          error={Boolean(error)}
          disabled={disabled}
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          leftIcon={<Clock size={20} className="text-[var(--ds-color-placeholder)]" />}
          rightIcon={<SelectChevron open={isOpen} />}
        >
          {displayValue ? (
            <span className="text-[var(--ds-color-text)]">{displayValue}</span>
          ) : (
            <span className="text-[var(--ds-color-placeholder)]">HH:MM</span>
          )}
        </PickerTrigger>

        {isOpen && (
          <div className={cn(pickerDropdownVariants(), 'w-[240px] p-3')} role="listbox">
            <div className="flex items-start gap-1">
              <TimeColumn
                label="Hora"
                items={hours}
                selected={hour}
                onSelect={(h) => updateTime(h, minute, period)}
                formatItem={(h) => String(h).padStart(2, '0')}
              />
              <span className="pt-6 text-lg text-[var(--ds-color-text-secondary)]">:</span>
              <TimeColumn
                label="Minuto"
                items={minutes}
                selected={minute}
                onSelect={(m) => updateTime(hour, m, period)}
              />
              {!is24h && (
                <TimeColumn
                  label="Período"
                  items={['AM', 'PM']}
                  selected={period}
                  onSelect={(p) => updateTime(hour, minute, p)}
                  formatItem={(p) => p}
                />
              )}
            </div>
            <p className="mt-2 flex items-center justify-center gap-1 text-xs text-[var(--ds-color-text-secondary)]">
              <Clock size={12} />
              Formato {is24h ? '24 horas' : '12 horas'}
            </p>
          </div>
        )}
      </div>

      {disabled && disabledLabel && !error && (
        <p className={inputHelperVariants({ type: 'helper' })}>{disabledLabel}</p>
      )}
    </SelectFieldWrapper>
  )
}
