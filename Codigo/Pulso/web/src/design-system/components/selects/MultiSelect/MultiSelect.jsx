import { useId, useMemo, useCallback } from 'react'
import { cn } from '../../../utils/cn.js'
import { useSelectDropdown } from '../shared/useSelectDropdown.js'
import { selectDropdownVariants } from '../shared/select.styles.jsx'
import { SelectCheckbox } from '../shared/SelectCheckbox.jsx'
import { SelectChip } from '../shared/SelectChip.jsx'
import { SelectChevron } from '../shared/SelectChevron.jsx'
import { SelectFieldWrapper } from '../shared/SelectFieldWrapper.jsx'
import { SelectTrigger } from '../shared/SelectTrigger.jsx'
/** MultiSelect — multi-seleção imediata, sem busca, dropdown permanece aberto */
export const MultiSelect = ({
  options = [],
  values = [],
  onChange,
  placeholder = 'Selecione os recursos...',
  error,
  disabled = false,
  label,
  id: idProp,
  className,
  maxChipsVisible = 3,
  allSelectedLabel = 'Todos selecionados',
  noneSelectedLabel = 'Nenhum selecionado',
}) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const { isOpen, toggle, ref } = useSelectDropdown(disabled)

  const allSelected = values.length === options.length && options.length > 0
  const noneSelected = values.length === 0

  const selectedOptions = useMemo(
    () => options.filter((o) => values.includes(o.value)),
    [options, values]
  )

  const toggleValue = useCallback(
    (val) => {
      const next = values.includes(val)
        ? values.filter((v) => v !== val)
        : [...values, val]
      onChange?.(next)
    },
    [values, onChange]
  )

  const toggleAll = () => {
    onChange?.(allSelected ? [] : options.map((o) => o.value))
  }

  const removeChip = (val, e) => {
    e?.stopPropagation?.()
    onChange?.(values.filter((v) => v !== val))
  }

  const renderTriggerContent = () => {
    if (allSelected) {
      return (
        <span className="flex-1 truncate text-left text-[var(--ds-color-text)]">
          {allSelectedLabel}
        </span>
      )
    }
    if (noneSelected) {
      return (
        <span className="flex-1 truncate text-left text-[var(--ds-color-placeholder)]">
          {placeholder}
        </span>
      )
    }

    const visible = selectedOptions.slice(0, maxChipsVisible)
    const overflow = selectedOptions.length - maxChipsVisible

    return (
      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
        {visible.map((opt) => (
          <SelectChip
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            onRemove={() => removeChip(opt.value)}
            disabled={disabled}
          />
        ))}
        {overflow > 0 && (
          <span className="inline-flex items-center rounded-full bg-[var(--ds-color-hover)] px-2 py-1 text-xs text-[var(--ds-color-text-secondary)]">
            +{overflow}
          </span>
        )}
      </span>
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
      <div ref={ref} className="relative">
        <SelectTrigger
          id={id}
          open={isOpen}
          error={Boolean(error)}
          disabled={disabled}
          multiline
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={toggle}
        >
          {renderTriggerContent()}
          <SelectChevron open={isOpen} />
        </SelectTrigger>
        {isOpen && (
          <div className={selectDropdownVariants()} role="listbox">
            <div className="max-h-60 overflow-y-auto">
              <button
                type="button"
                onClick={toggleAll}
                className={cn(
                  'ds-select-option flex w-full items-center gap-3 px-4 py-3 text-left text-sm',
                  'text-[var(--ds-color-text)]',
                  'transition-colors duration-[var(--ds-transition-fast)]'
                )}
              >                <SelectCheckbox checked={allSelected} />
                <span>Selecionar todos</span>
              </button>

              {options.map((option) => {
                const checked = values.includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={checked}
                    onClick={() => toggleValue(option.value)}
                    className={cn(
                      'ds-select-option flex w-full items-center gap-3 px-4 py-3 text-left text-sm',
                      'transition-colors duration-[var(--ds-transition-fast)]',
                      checked ? 'text-[var(--ds-color-primary-light)]' : 'text-[var(--ds-color-text)]'
                    )}
                  >                    <SelectCheckbox checked={checked} />
                    {option.icon && (
                      <span className="inline-flex shrink-0" style={{ color: option.iconColor }}>
                        {option.icon}
                      </span>
                    )}
                    <span className="flex-1 truncate">{option.label}</span>
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
