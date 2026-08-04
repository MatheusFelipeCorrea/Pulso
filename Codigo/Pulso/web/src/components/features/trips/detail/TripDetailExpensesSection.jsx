import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { TRIP_EXPENSE_CATEGORY_MAP } from '@/utils/tripExpenseCategories.js'
import { TripDetailCategoryBadge } from './TripDetailCategoryBadge.jsx'

export function TripDetailExpensesSection({
  despesas = [],
  totalBrl,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <section className="trip-detail-page__card trip-detail-page__expenses">
      <div className="trip-detail-page__section-head">
        <h2>Pretensões de gastos</h2>
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={onAdd}>
          Adicionar Pretensão
        </Button>
      </div>

      <div className="trip-detail-page__table-wrap">
        <table className="trip-detail-page__table">
          <colgroup>
            <col className="trip-detail-page__col-category" />
            <col className="trip-detail-page__col-description" />
            <col className="trip-detail-page__col-value" />
            <col className="trip-detail-page__col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Valor estimado (R$)</th>
              <th className="trip-detail-page__table-actions-head">Ações</th>
            </tr>
          </thead>
          <tbody>
            {despesas.length === 0 ? (
              <tr>
                <td colSpan={4} className="trip-detail-page__table-empty">
                  Nenhuma pretensão cadastrada. Adicione estimativas para planejar sua viagem.
                </td>
              </tr>
            ) : (
              despesas.map((despesa) => {
                const meta = TRIP_EXPENSE_CATEGORY_MAP[despesa.categoria]

                return (
                  <tr key={despesa.id}>
                    <td>
                      <TripDetailCategoryBadge categoria={despesa.categoria} />
                    </td>
                    <td className="trip-detail-page__table-description">
                      {despesa.descricao?.trim() || meta?.label || '—'}
                    </td>
                    <td className="trip-detail-page__table-value">
                      {formatCurrency(despesa.valorEstimado)}
                    </td>
                    <td>
                      <div className="trip-detail-page__row-actions">
                        <IconButton
                          variant="ghost"
                          size="sm"
                          ariaLabel="Editar pretensão"
                          icon={<Pencil size={14} />}
                          onClick={() => onEdit?.(despesa)}
                        />
                        <IconButton
                          variant="ghost"
                          size="sm"
                          ariaLabel="Excluir pretensão"
                          icon={<Trash2 size={14} />}
                          className="trip-detail-page__delete-btn"
                          onClick={() => onDelete?.(despesa)}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
          {despesas.length > 0 ? (
            <tfoot>
              <tr>
                <td colSpan={2} className="trip-detail-page__table-total-label">
                  Total estimado
                </td>
                <td className="trip-detail-page__table-total">{formatCurrency(totalBrl)}</td>
                <td className="trip-detail-page__table-actions-foot" />
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
    </section>
  )
}
