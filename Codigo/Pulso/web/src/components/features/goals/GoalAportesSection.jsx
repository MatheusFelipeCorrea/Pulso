import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

export function GoalAportesSection({
  meta,
  onDeleteAporte,
  deletingAporteId = null,
}) {
  const aportes = meta?.aportes ?? []
  if (!aportes.length) return null

  const isConcluida = meta.status === 'CONCLUIDA'

  return (
    <section className="goal-form__aportes">
      <FormFieldLabel icon={Trash2} tone="purple">
        Histórico de aportes
      </FormFieldLabel>

      {isConcluida ? (
        <p className="goal-form__aportes-hint">
          Meta concluída. Se um aporte foi lançado por engano, remova-o abaixo — a meta será
          reaberta automaticamente.
        </p>
      ) : null}

      <ul className="goal-form__aportes-list">
        {aportes.map((aporte) => (
          <li key={aporte.id} className="goal-form__aporte-item">
            <div className="goal-form__aporte-info">
              <strong>{formatCurrency(aporte.valor)}</strong>
              <span>
                {format(parseISO(aporte.data), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>
            <IconButton
              variant="ghost"
              size="sm"
              ariaLabel={`Remover aporte de ${formatCurrency(aporte.valor)}`}
              icon={<Trash2 size={16} />}
              loading={deletingAporteId === aporte.id}
              disabled={Boolean(deletingAporteId)}
              onClick={() => onDeleteAporte?.(aporte)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
