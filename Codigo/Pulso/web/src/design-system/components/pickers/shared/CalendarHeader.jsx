import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '../../../utils/cn.js'

/** Cabeçalho do calendário com navegação de mês */
export const CalendarHeader = ({
  month,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
  onTitleClick,
  className,
}) => (
  <div className={cn('flex items-center justify-between px-3 py-2', className)}>
    <button
      type="button"
      onClick={onPrev}
      disabled={disablePrev}
      className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--ds-radius-md)] text-[var(--ds-color-text-secondary)] hover:bg-[var(--ds-color-hover)] disabled:cursor-not-allowed disabled:opacity-30"
      aria-label="Mês anterior"
    >
      <ChevronLeft size={18} />
    </button>

    <button
      type="button"
      onClick={onTitleClick}
      className="text-sm font-semibold capitalize text-[var(--ds-color-text)] hover:text-[var(--ds-color-primary)]"
    >
      {format(month, 'MMMM yyyy', { locale: ptBR })}
    </button>

    <button
      type="button"
      onClick={onNext}
      disabled={disableNext}
      className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--ds-radius-md)] text-[var(--ds-color-text-secondary)] hover:bg-[var(--ds-color-hover)] disabled:cursor-not-allowed disabled:opacity-30"
      aria-label="Próximo mês"
    >
      <ChevronRight size={18} />
    </button>
  </div>
)
