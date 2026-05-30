import { forwardRef, useId, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { inputWrapperVariants, inputHelperVariants } from '../shared/inputField.styles.jsx'
import {
  textareaContainerVariants,
  textareaFieldVariants,
  textareaLabelVariants,
} from './Textarea.styles.jsx'

/** Textarea — área de texto com contador de caracteres */
export const Textarea = forwardRef(
  (
    {
      label,
      value = '',
      onChange,
      error,
      disabled = false,
      required = false,
      maxLength,
      resize = 'vertical',
      placeholder = 'Escreva sua observação, dica ou informação...',
      helperText,
      id: idProp,
      className,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = idProp ?? generatedId
    const errorId = `${inputId}-error`
    const [isFocused, setIsFocused] = useState(false)

    const hasError = Boolean(error)
    const length = value?.length ?? 0

    const labelState = disabled
      ? 'disabled'
      : hasError
        ? 'error'
        : isFocused
          ? 'focused'
          : 'default'

    const counterRatio = maxLength ? length / maxLength : 0
    const counterColor =
      hasError || counterRatio >= 1
        ? 'text-[var(--ds-color-danger)]'
        : counterRatio >= 0.9
          ? 'text-[var(--ds-color-warning)]'
          : 'text-[var(--ds-color-text-secondary)]'

    return (
      <div className={cn(inputWrapperVariants(), className)}>
        {label && (
          <label htmlFor={inputId} className={textareaLabelVariants({ state: labelState })}>
            {label}
            {required && <span className="text-[var(--ds-color-danger)] ml-0.5">*</span>}
          </label>
        )}

        <div
          className={textareaContainerVariants({
            focused: isFocused && !hasError,
            error: hasError,
            disabled,
            hoverable: !isFocused && !hasError && !disabled,
          })}
        >
          <textarea
            ref={ref}
            id={inputId}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            placeholder={placeholder}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? errorId : undefined}
            className={textareaFieldVariants({ resize, hasCounter: Boolean(maxLength) })}
            onFocus={(e) => { setIsFocused(true); onFocus?.(e) }}
            onBlur={(e) => { setIsFocused(false); onBlur?.(e) }}
            {...rest}
          />

          {maxLength && (
            <span
              className={cn('pointer-events-none absolute bottom-3 right-3 text-xs', counterColor)}
              aria-hidden="true"
            >
              {length}/{maxLength}
            </span>
          )}
        </div>

        {hasError && (
          <p id={errorId} className={cn(inputHelperVariants({ type: 'error' }), 'flex items-center gap-1')} role="alert">
            <AlertTriangle size={14} className="shrink-0" />
            {error}
          </p>
        )}

        {!hasError && helperText && (
          <p className={inputHelperVariants({ type: 'helper' })}>{helperText}</p>
        )}

        {!hasError && !helperText && maxLength && (
          <p className={inputHelperVariants({ type: 'helper' })}>
            Mínimo: 100px de altura | Máximo: {maxLength} caracteres
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
