import { ChevronDown } from 'lucide-react'
import { cn } from '../../../utils/cn.js'

export const SelectChevron = ({ open }) => (
  <ChevronDown
    size={20}
    className={cn(
      'ml-auto shrink-0 text-[var(--ds-color-text-secondary)]',
      'transition-transform duration-[var(--ds-transition-fast)]',
      open && 'rotate-180'
    )}
  />
)
