import { Search, X } from 'lucide-react'
import { cn } from '../../../utils/cn.js'

/** Campo de busca fixo no topo do dropdown de selects */
export const SelectSearchBox = ({ value, onChange, placeholder = 'Buscar...', onClear }) => (
  <div className="flex items-center gap-2 border-b border-[var(--ds-color-border)] px-3 py-2">
    <Search size={16} className="shrink-0 text-[var(--ds-color-placeholder)]" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        'min-w-0 flex-1 bg-transparent text-sm text-[var(--ds-color-text)]',
        'placeholder:text-[var(--ds-color-placeholder)]',
        'border-0 outline-none focus:outline-none focus-visible:outline-none'
      )}
      onClick={(e) => e.stopPropagation()}
    />
    {value && (
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClear?.() }}
        className="shrink-0 text-[var(--ds-color-placeholder)] hover:text-[var(--ds-color-text)]"
        aria-label="Limpar busca"
      >
        <X size={16} />
      </button>
    )}
  </div>
)
