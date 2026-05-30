import { useId, useRef, useEffect } from 'react'
import { Check, Minus, AlertTriangle } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import {
  formControlRowVariants,
  formLabelVariants,
  formDescriptionVariants,
  formErrorVariants,
} from '../shared/formControl.styles.jsx'
import { checkboxIconVariants } from './Checkbox.styles.jsx'

/** Checkbox — caixa 20×20 com checked, indeterminate e error */
export const Checkbox = ({
  checked = false,
  indeterminate = false,
  onChange,
  label,
  description,
  error,
  disabled = false,
  id: idProp,
  className,
}) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  const hasError = Boolean(error)

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className={cn(
          formControlRowVariants({ align: description ? 'start' : 'center' }),
          disabled && 'cursor-not-allowed'
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
          aria-invalid={hasError || undefined}
        />
        <span
          className="ds-checkbox-box"
          data-checked={checked && !indeterminate ? 'true' : 'false'}
          data-indeterminate={indeterminate ? 'true' : 'false'}
          data-error={hasError ? 'true' : 'false'}
          data-disabled={disabled ? 'true' : 'false'}
          aria-hidden="true"
        >
          {indeterminate && <Minus size={14} strokeWidth={2.5} className={checkboxIconVariants()} />}
          {checked && !indeterminate && <Check size={14} strokeWidth={2.5} className={checkboxIconVariants()} />}
        </span>
        {(label || description) && (
          <span className="flex flex-col gap-0.5">
            {label && (
              <span
                className={cn(
                  formLabelVariants(),
                  !checked && !indeterminate && 'text-[var(--ds-color-text-secondary)]',
                  disabled && 'opacity-40'
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span className={cn(formDescriptionVariants(), disabled && 'opacity-40')}>
                {description}
              </span>
            )}
          </span>
        )}
      </label>
      {hasError && (
        <p className={cn(formErrorVariants(), 'flex items-center gap-1')} role="alert">
          <AlertTriangle size={14} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
