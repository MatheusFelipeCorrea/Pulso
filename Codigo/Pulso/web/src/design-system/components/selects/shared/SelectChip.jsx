import { X } from 'lucide-react'
import { cn } from '../../../utils/cn.js'

/** Chip para TagsInput / MultiSelect */
export const SelectChip = ({ icon, label, onRemove, disabled, className }) => (
  <span className={cn('ds-select-chip', disabled && 'ds-select-chip--disabled', className)}>
    {icon ? <span className="inline-flex shrink-0 items-center">{icon}</span> : null}
    <span>{label}</span>
    {onRemove && !disabled ? (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="ds-select-chip__remove"
        aria-label={`Remover ${label}`}
      >
        <X size={14} />
      </button>
    ) : null}
  </span>
)
