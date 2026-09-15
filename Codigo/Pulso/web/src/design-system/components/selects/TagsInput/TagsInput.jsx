import { useId, useState, useRef, useMemo, useCallback } from 'react'
import { Tag, Plus, Info } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { useClickOutside } from '../../../hooks/useClickOutside.js'
import { inputHelperVariants } from '../../inputs/shared/inputField.styles.jsx'
import { selectDropdownVariants } from '../shared/select.styles.jsx'
import { SelectChip } from '../shared/SelectChip.jsx'
import { SelectFieldWrapper } from '../shared/SelectFieldWrapper.jsx'

/** TagsInput — input de tags com chips, sugestões e limite máximo */
export const TagsInput = ({
  tags = [],
  onAdd,
  onRemove,
  placeholder = 'Digite e aperte Enter...',
  max,
  suggestions = [],
  error,
  disabled = false,
  label,
  helperText,
  id: idProp,
  className,
}) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const atMax = max !== undefined && tags.length >= max
  const showSuggestions = suggestions.length > 0 && inputValue.length > 0 && !atMax

  const filteredSuggestions = useMemo(
    () =>
      suggestions.filter(
        (s) =>
          s.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.some((t) => t.toLowerCase() === s.toLowerCase())
      ),
    [suggestions, inputValue, tags]
  )

  const closeSuggestions = useCallback(() => setIsFocused(false), [])

  useClickOutside(wrapperRef, closeSuggestions)

  const addTag = (raw) => {
    const trimmed = raw.trim()
    if (!trimmed) return
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue('')
      return
    }
    if (atMax) return
    onAdd?.(trimmed)
    setInputValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onRemove?.(tags[tags.length - 1])
    } else if (e.key === 'Escape') {
      closeSuggestions()
    }
  }

  const labelText = max !== undefined && atMax ? `${label} (${tags.length}/${max})` : label

  const headerExtra =
    atMax && max !== undefined ? (
      <span className="flex items-center gap-1 text-xs text-[var(--ds-color-warning)]">
        <Info size={14} />
        Máximo de {max} tags
      </span>
    ) : null

  const resolvedHelper =
    atMax && max !== undefined
      ? `Você atingiu o limite máximo de ${max} tags. Remova alguma para adicionar novas.`
      : helperText ??
        (tags.length > 0
          ? 'Edite ou remova as tags quando quiser.'
          : 'Digite o nome da tag e aperte Enter para adicionar.')

  return (
    <SelectFieldWrapper
      label={labelText}
      error={error}
      disabled={disabled}
      isOpen={isFocused && showSuggestions}
      id={id}
      className={className}
      headerExtra={headerExtra}
    >
      <div ref={wrapperRef} className="relative">
        <div
          className={cn(
            'ds-select-container ds-select-container--tags',
            isFocused && !error && 'ds-select-container--open',
            error && 'ds-select-container--error',
            disabled && 'ds-select-container--disabled'
          )}
          onClick={() => !disabled && inputRef.current?.focus()}
        >
          {tags.map((tag) => (
            <SelectChip
              key={tag}
              label={tag}
              onRemove={() => onRemove?.(tag)}
              disabled={disabled}
            />
          ))}

          {tags.length > 0 ? <span className="ds-tags-input-divider" aria-hidden="true" /> : null}

          <input
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            disabled={disabled || atMax}
            placeholder={placeholder}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className="ds-tags-input-field"
          />
        </div>

        {showSuggestions && isFocused ? (
          <div className={selectDropdownVariants()} role="listbox">
            <div className="ds-select-dropdown__scroll">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    addTag(suggestion)
                    closeSuggestions()
                  }}
                  className="ds-select-option"
                >
                  <Tag size={16} className="shrink-0 text-[var(--ds-color-text-secondary)]" />
                  <span className="flex-1 truncate">{suggestion}</span>
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">Existente</span>
                </button>
              ))}

              {!tags.some((t) => t.toLowerCase() === inputValue.trim().toLowerCase()) &&
                inputValue.trim() ? (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      addTag(inputValue)
                      closeSuggestions()
                    }}
                    className="ds-select-option"
                  >
                    <Plus size={16} className="shrink-0 text-[var(--ds-color-primary)]" />
                    <span className="flex-1 truncate">
                      Criar nova tag &apos;{inputValue.trim()}&apos;
                    </span>
                    <span className="text-xs text-[var(--ds-color-text-secondary)]">
                      Pressione Enter ou ,
                    </span>
                  </button>
                ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {!error && resolvedHelper ? (
        <p
          className={cn(
            inputHelperVariants({ type: 'helper' }),
            atMax && 'text-[var(--ds-color-warning)]'
          )}
        >
          {resolvedHelper}
        </p>
      ) : null}
    </SelectFieldWrapper>
  )
}
