import { useId } from 'react'
import { cn } from '../../../utils/cn.js'
import {
  formControlRowVariants,
  formLabelVariants,
  formDescriptionVariants,
} from '../shared/formControl.styles.jsx'
import { radioDotVariants } from './Radio.styles.jsx'

/** Radio — opção individual (usar dentro de RadioGroup) */
export const Radio = ({
  value,
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  name,
  id: idProp,
  className,
}) => {
  const generatedId = useId()
  const id = idProp ?? generatedId

  return (
    <label
      htmlFor={id}
      className={cn(
        formControlRowVariants({ align: description ? 'start' : 'center' }),
        disabled && 'cursor-not-allowed',
        className
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange?.(value)}
        className="sr-only"
      />
      <span
        className="ds-radio-circle"
        data-checked={checked ? 'true' : 'false'}
        data-disabled={disabled ? 'true' : 'false'}
        aria-hidden="true"
      >
        {checked && <span className={radioDotVariants()} />}
      </span>
      {(label || description) && (
        <span className="flex flex-col gap-0.5">
          {label && (
            <span
              className={cn(
                formLabelVariants(),
                !checked && 'text-[var(--ds-color-text-secondary)]',
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
  )
}
