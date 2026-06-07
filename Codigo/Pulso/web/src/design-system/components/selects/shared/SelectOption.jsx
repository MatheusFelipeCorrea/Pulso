import { Check } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { selectOptionVariants } from './select.styles.jsx'

/** Item de opção no dropdown */
export const SelectOption = ({
  option,
  selected,
  highlighted,
  showCheck = true,
  onClick,
  leftSlot,
}) => (
  <button
    type="button"
    role="option"
    aria-selected={selected}
    disabled={option.disabled}
    onClick={onClick}
    data-highlighted={highlighted || undefined}
    className={cn(
      selectOptionVariants({ selected, highlighted }),
      'disabled:cursor-not-allowed disabled:opacity-50'
    )}
  >
    {leftSlot}
    {option.icon ? (
      <span
        className="ds-select-option__icon"
        style={option.iconColor ? { color: option.iconColor } : undefined}
      >
        {option.icon}
      </span>
    ) : null}
    <span className="flex-1 truncate">{option.label}</span>
    {selected && showCheck && (
      <Check size={16} className="shrink-0 text-[var(--ds-color-primary-light)]" />
    )}
  </button>
)
