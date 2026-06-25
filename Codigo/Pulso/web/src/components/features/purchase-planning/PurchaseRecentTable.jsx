import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

export function PurchaseRecentTable({ comprados = [] }) {
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
          </tr>
        </thead>
        <tbody>
          {comprados.map((item) => (
            <tr key={item.id}>
              <td className="pp-recent__name">{item.nome}</td>
              <td>{item.categoriaLabel ?? item.categoria}</td>
              <td>{formatCurrency(item.valorEstimado)}</td>
              <td>
                {item.compradoEm
                  ? format(new Date(item.compradoEm), "dd MMM yyyy", { locale: ptBR })
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
