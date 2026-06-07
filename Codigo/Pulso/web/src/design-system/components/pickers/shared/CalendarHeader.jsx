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
  <div className={cn('ds-picker-calendar-header', className)}>
    <button
      type="button"
      onClick={onPrev}
      disabled={disablePrev}
      className="ds-picker-calendar-header__nav"
      aria-label="Mês anterior"
    >
      <ChevronLeft size={18} />
    </button>

    <button
      type="button"
      onClick={onTitleClick}
      className="ds-picker-calendar-header__title"
    >
      {format(month, 'MMMM yyyy', { locale: ptBR })}
    </button>

    <button
      type="button"
      onClick={onNext}
      disabled={disableNext}
      className="ds-picker-calendar-header__nav"
      aria-label="Próximo mês"
    >
      <ChevronRight size={18} />
    </button>
  </div>
)
