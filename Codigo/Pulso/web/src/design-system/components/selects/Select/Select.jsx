import { useId, useState, useCallback, useEffect } from 'react'
import { useSelectDropdown } from '../shared/useSelectDropdown.js'
import { selectDropdownVariants } from '../shared/select.styles.jsx'
import { SelectOption } from '../shared/SelectOption.jsx'
import { SelectChevron } from '../shared/SelectChevron.jsx'
import { SelectFieldWrapper } from '../shared/SelectFieldWrapper.jsx'
import { SelectTrigger } from '../shared/SelectTrigger.jsx'

/** Select — dropdown single-select com chevron e opções com ícone opcional */
export const Select = ({
  options = [],
  value = null,
  onChange,
  placeholder = 'Selecione...',
  error,
  disabled = false,
  label,
  required = false,
  id: idProp,
  className,
}) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const { isOpen, toggle, close, ref } = useSelectDropdown(disabled)
  const [highlightIndex, setHighlightIndex] = useState(-1)

  const selectedOption = options.find((o) => o.value === value)
  const enabledOptions = options.filter((o) => !o.disabled)

  const handleSelect = useCallback(
    (optionValue) => {
      onChange?.(optionValue)
      close()
    },
    [onChange, close]
  )

  useEffect(() => {
    if (!isOpen) setHighlightIndex(-1)
  }, [isOpen])

  const handleKeyDown = (e) => {
    if (disabled) return

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((i) => (i + 1) % enabledOptions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((i) => (i <= 0 ? enabledOptions.length - 1 : i - 1))
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault()
      handleSelect(enabledOptions[highlightIndex].value)
    }
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
      <div ref={ref} className="relative">
        <SelectTrigger
          id={id}
          open={isOpen}
          error={Boolean(error)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? `${id}-label` : undefined}
          onClick={toggle}
          onKeyDown={handleKeyDown}
        >
          {selectedOption ? (
            <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-[var(--ds-color-text)]">
              {selectedOption.icon ? (
                <span
                  className="ds-select-option__icon"
                  style={selectedOption.iconColor ? { color: selectedOption.iconColor } : undefined}
                >
                  {selectedOption.icon}
                </span>
              ) : null}
              <span className="truncate">{selectedOption.label}</span>
            </span>
          ) : (
            <span className="flex-1 truncate text-left text-[var(--ds-color-placeholder)]">
              {placeholder}
            </span>
          )}
          <SelectChevron open={isOpen} />
        </SelectTrigger>

        {isOpen && (
          <div className={selectDropdownVariants()} role="listbox">
            <div className="ds-select-dropdown__scroll">
              {options.map((option) => {
                const enabledIdx = enabledOptions.indexOf(option)
                return (
                  <SelectOption
                    key={option.value}
                    option={option}
                    selected={option.value === value}
                    highlighted={enabledIdx === highlightIndex}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </SelectFieldWrapper>
  )
}
