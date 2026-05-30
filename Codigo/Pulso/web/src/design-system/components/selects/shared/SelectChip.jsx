import { X } from 'lucide-react'
import { cn } from '../../../utils/cn.js'

/** Chip para MultiSelect / MultiSelectSearch */
export const SelectChip = ({ icon, label, onRemove, disabled, className }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium',
      'bg-[color-mix(in_srgb,var(--ds-color-primary)_20%,transparent)]',
      'text-[var(--ds-color-primary-light)]',
      'transition-colors duration-[var(--ds-transition-fast)]',
      'hover:bg-[color-mix(in_srgb,var(--ds-color-primary)_30%,transparent)]',
      disabled && 'opacity-50',
      className
    )}
  >
    {icon && <span className="inline-flex shrink-0 items-center">{icon}</span>}
    <span>{label}</span>
    {onRemove && !disabled && (
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        className="inline-flex items-center text-[var(--ds-color-primary-light)] hover:text-[var(--ds-color-text)]"
        aria-label={`Remover ${label}`}
      >
        <X size={14} />
      </button>
    )}
  </span>
)
