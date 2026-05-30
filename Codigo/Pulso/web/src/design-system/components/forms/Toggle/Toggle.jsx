import { useId } from 'react'
import { cn } from '../../../utils/cn.js'
import { formControlRowVariants, formLabelVariants, formDescriptionVariants } from '../shared/formControl.styles.jsx'
import { toggleTrackVariants } from './Toggle.styles.jsx'

/** Toggle — switch ON/OFF acessível */
export const Toggle = ({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  size = 'default',
  id: idProp,
  className,
}) => {
  const generatedId = useId()
  const id = idProp ?? generatedId

  const handleClick = () => {
    if (!disabled) onChange?.(!checked)
  }

  const switchEl = (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={handleClick}
      className={cn(toggleTrackVariants(), className)}
      data-size={size}
    >
      <span className="ds-toggle-thumb" aria-hidden="true" />
    </button>
  )

  if (!label && !description) return switchEl

  return (
    <div className={formControlRowVariants({ align: description ? 'start' : 'center' })}>
      {switchEl}
      <div className="flex flex-col gap-0.5">
        {label && (
          <label htmlFor={id} className={cn(formLabelVariants(), disabled && 'opacity-50')}>
            {label}
          </label>
        )}
        {description && (
          <span className={cn(formDescriptionVariants(), disabled && 'opacity-50')}>
            {description}
          </span>
        )}
      </div>
    </div>
  )
}
