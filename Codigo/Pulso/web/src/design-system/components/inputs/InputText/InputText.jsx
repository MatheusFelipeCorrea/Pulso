import { forwardRef, useId, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import {
  inputWrapperVariants,
  inputLabelVariants,
  inputContainerVariants,
  inputHelperVariants,
} from '../shared/inputField.styles.jsx'

/**
 * InputText — campo de texto genérico
 *
 * Estados: default, focus, filled, error, disabled
 * Suporta leftIcon, rightIcon e botão clear (onClear)
 */
export const InputText = forwardRef(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      error,
      disabled = false,
      required = false,
      leftIcon,
      rightIcon,
      onClear,
      helperText,
      type = 'text',
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
    const showClear = Boolean(onClear && value && !disabled)

    const labelState = disabled
      ? 'disabled'
      : hasError
        ? 'error'
        : isFocused
          ? 'focused'
          : 'default'

    const iconColor = disabled
      ? 'text-[var(--ds-color-placeholder)] opacity-50'
      : hasError
        ? 'text-[var(--ds-color-danger)]'
        : 'text-[var(--ds-color-placeholder)]'

    const handleFocus = (e) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    return (
      <div className={cn(inputWrapperVariants(), className)}>
        {label && (
          <label htmlFor={inputId} className={inputLabelVariants({ state: labelState })}>
            {label}
            {required && <span className="text-[var(--ds-color-danger)] ml-0.5">*</span>}
          </label>
        )}

        <div
          className={inputContainerVariants({
            focused: isFocused && !hasError,
            error: hasError,
            disabled,
          })}
        >
          {leftIcon && (
            <span className={cn('inline-flex shrink-0 items-center justify-center', iconColor)}>
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? errorId : undefined}
            className={cn(
              'min-w-0 flex-1 bg-transparent',
              'text-sm text-[var(--ds-color-text)]',
              'placeholder:text-[var(--ds-color-placeholder)]',
              'border-0 outline-none focus:outline-none focus-visible:outline-none',
              'disabled:cursor-not-allowed'
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />

          {showClear && (
            <button
              type="button"
              onClick={() => onClear?.()}
              className={cn(
                'inline-flex shrink-0 items-center justify-center',
                'text-[var(--ds-color-placeholder)] hover:text-[var(--ds-color-text)]',
                'transition-colors duration-[var(--ds-transition-fast)]'
              )}
              aria-label="Limpar campo"
            >
              <X size={20} />
            </button>
          )}

          {!showClear && hasError && (
            <span className={cn('inline-flex shrink-0 items-center justify-center', iconColor)}>
              <AlertTriangle size={20} />
            </span>
          )}

          {!showClear && !hasError && rightIcon && (
            <span className={cn('inline-flex shrink-0 items-center justify-center', iconColor)}>
              {rightIcon}
            </span>
          )}
        </div>

        {hasError && (
          <p id={errorId} className={inputHelperVariants({ type: 'error' })} role="alert">
            {error}
          </p>
        )}

        {!hasError && helperText && (
          <p className={inputHelperVariants({ type: 'helper' })}>{helperText}</p>
        )}
      </div>
    )
  }
)

InputText.displayName = 'InputText'
