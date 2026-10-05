import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Eye } from 'lucide-react'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { Tooltip } from '@/design-system/components/data-display/Tooltip/Tooltip.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { capitalizeNomeItem } from '@/utils/purchasePlanningUtils.js'

export function PurchaseRecentTable({ comprados = [], onViewDetails }) {
  if (!comprados.length) {
    return (
      <p className="pp-recent__empty">
        Nenhuma compra registrada ainda. Marque um item como &quot;Comprei!&quot; para vê-lo aqui.
      </p>
    )
  }

  return (
    <div className="pp-recent__table-wrap">
      <table className="pp-recent__table">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Categoria</th>
            <th scope="col">Valor</th>
            <th scope="col">Comprado em</th>
            <th scope="col" className="pp-recent__actions-head">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {comprados.map((item) => (
            <tr key={item.id}>
              <td className="pp-recent__name">{capitalizeNomeItem(item.nome)}</td>
              <td>{item.categoriaLabel ?? item.categoria}</td>
              <td>{formatCurrency(item.valorEstimado)}</td>
              <td>
                {item.compradoEm
                  ? format(new Date(item.compradoEm), "dd MMM yyyy", { locale: ptBR })
                  : '—'}
              </td>
              <td className="pp-recent__actions">
                <Tooltip
                  content="Ver histórico"
                  position="left"
                  delay={120}
                  className="pp-tooltip"
                >
                  <IconButton
                    variant="ghost"
                    size="sm"
                    ariaLabel={`Ver histórico de ${capitalizeNomeItem(item.nome)}`}
                    icon={<Eye size={15} />}
                    onClick={() => onViewDetails?.(item)}
                  />
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
