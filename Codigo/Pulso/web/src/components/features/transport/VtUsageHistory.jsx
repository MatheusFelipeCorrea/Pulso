import { Plus, Ticket } from 'lucide-react'
import { Table } from '@/design-system/components/data-display/Table/Table.jsx'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { formatDateBR } from '@/utils/transportUtils.js'

export function VtUsageHistory({ usos = [], totais, loading, onRetry, onRegister }) {
  const columns = [
    {
      key: 'data',
      header: 'Data',
      render: (row) => formatDateBR(row.data),
    },
    {
      key: 'quantidade',
      header: 'Quantidade',
      align: 'right',
      render: (row) => `${row.quantidade} passagen${row.quantidade === 1 ? '' : 's'}`,
    },
    {
      key: 'valorPorPassagem',
      header: 'Valor por passagem',
      align: 'right',
      render: (row) => formatCurrency(Number(row.valorPorPassagem)),
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      render: (row) => (
        <span className="vt-diff vt-diff--negative">
          - {formatCurrency(Number(row.total))}
        </span>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="vt-history__panel vt-history__panel--loading" aria-busy="true">
        <SpinnerDots center label="Carregando usos..." />
      </div>
    )
  }

  if (!usos.length) {
    return (
      <div className="vt-history__panel vt-history__panel--empty">
        <EmptyState
          icon={<Ticket strokeWidth={1.5} />}
          title="Nenhum uso registrado ainda"
          description="Informe quantas passagens você utilizou e o valor unitário para descontar do saldo."
          bordered
          action={
            onRegister
              ? {
                  label: 'Registrar Uso',
                  onClick: onRegister,
                  leftIcon: <Plus size={16} />,
                }
              : undefined
          }
        />
      </div>
    )
  }

  const footer = (
    <>
      <td colSpan={2}>
        <strong>Total</strong>
      </td>
      <td className="ds-table__cell--right">
        <strong>{totais?.totalPassagens ?? 0} passagens</strong>
      </td>
      <td className="ds-table__cell--right">
        <strong className="vt-diff vt-diff--negative">
          - {formatCurrency(Number(totais?.totalGasto ?? 0))}
        </strong>
      </td>
    </>
  )

  return (
    <Table
      columns={columns}
      data={usos}
      onRetry={onRetry}
      footer={footer}
      aria-label="Histórico de usos de VT"
    />
  )
}
