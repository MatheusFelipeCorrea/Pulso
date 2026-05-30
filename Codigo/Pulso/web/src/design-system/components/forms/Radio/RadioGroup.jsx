import { useId } from 'react'
import { cn } from '../../../utils/cn.js'
import { Radio } from './Radio.jsx'
import { radioCardVariants } from './Radio.styles.jsx'
import { formLabelVariants, formDescriptionVariants } from '../shared/formControl.styles.jsx'

/** RadioGroup — grupo de opções exclusivas (vertical, horizontal ou card) */
export const RadioGroup = ({
  value,
  onChange,
  options = [],
  orientation = 'vertical',
  variant = 'default',
  disabled = false,
  name: nameProp,
  className,
  'aria-label': ariaLabel,
}) => {
  const generatedName = useId()
  const name = nameProp ?? generatedName

  if (variant === 'card') {
    return (
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        className={cn(
          'grid gap-3',
          orientation === 'horizontal' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1',
          className
        )}
      >
        {options.map((option) => {
          const checked = value === option.value
          const optionId = `${name}-${option.value}`
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={radioCardVariants({ checked, disabled: disabled || option.disabled })}
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                disabled={disabled || option.disabled}
                onChange={() => onChange?.(option.value)}
                className="sr-only"
              />
              <div className="flex flex-col gap-0.5 pl-1">
                <span className={formLabelVariants()}>{option.label}</span>
                {option.description && (
                  <span className={formDescriptionVariants()}>{option.description}</span>
                )}
              </div>
            </label>
          )
        })}
      </div>
    )
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-wrap gap-4' : 'flex-col gap-2',
        className
      )}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          id={`${name}-${option.value}`}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
          label={option.label}
          description={option.description}
          disabled={disabled || option.disabled}
        />
      ))}
    </div>
  )
}
