import { ArrowUpRight, Plus, Ticket } from 'lucide-react'
import { Table } from '@/design-system/components/data-display/Table/Table.jsx'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { formatDateBR, formatDiferenca } from '@/utils/transportUtils.js'
import { cn } from '@/design-system/utils/cn.js'

export function VtSaleHistory({ vendas = [], totais, loading, onRetry, onRegister }) {
  const columns = [
    {
      key: 'dataVenda',
      header: 'Data',
      render: (row) => formatDateBR(row.dataVenda),
    },
    {
      key: 'nomeComprador',
      header: 'Comprador',
    },
    {
      key: 'valorNominal',
      header: 'Nominal',
      align: 'right',
      render: (row) => formatCurrency(Number(row.valorNominal)),
    },
    {
      key: 'valorRecebido',
      header: 'Recebido',
      align: 'right',
      render: (row) => formatCurrency(Number(row.valorRecebido)),
    },
    {
      key: 'diferenca',
      header: 'Diferença',
      align: 'right',
      render: (row) => {
        const { text, tone } = formatDiferenca(row.diferenca)
        return <span className={cn('vt-diff', `vt-diff--${tone}`)}>{text}</span>
      },
    },
  ]

  if (loading) {
    return (
      <div className="vt-history__panel vt-history__panel--loading" aria-busy="true">
        <SpinnerDots center label="Carregando vendas..." />
      </div>
    )
  }

  if (!vendas.length) {
    return (
      <div className="vt-history__panel vt-history__panel--empty">
        <EmptyState
          icon={<ArrowUpRight strokeWidth={1.5} />}
          title="Nenhuma venda registrada ainda"
          description="Registre sua primeira venda de VT para acompanhar nominal, recebido e diferença."
          bordered
          action={
            onRegister
              ? {
                  label: 'Registrar Venda',
                  onClick: onRegister,
                  leftIcon: <Plus size={16} />,
                }
              : undefined
          }
        />
      </div>
    )
  }

  const perda = Number(totais?.perdaTotal ?? 0)
  const perdaLabel = perda < 0 ? 'Perda total' : perda > 0 ? 'Ganho total' : 'Sem diferença'

  const footer = (
    <>
      <td colSpan={2}>
        <strong>Total</strong>
      </td>
      <td className="ds-table__cell--right">
        <strong>{formatCurrency(Number(totais?.totalNominal ?? 0))}</strong>
      </td>
      <td className="ds-table__cell--right">
        <strong>{formatCurrency(Number(totais?.totalRecebido ?? 0))}</strong>
      </td>
      <td className="ds-table__cell--right">
        <strong className={cn('vt-diff', perda < 0 && 'vt-diff--negative', perda > 0 && 'vt-diff--positive')}>
          {formatDiferenca(totais?.perdaTotal).text}
        </strong>
        {perda !== 0 ? (
          <span className="vt-table-footer-note"> ({perdaLabel})</span>
        ) : null}
      </td>
    </>
  )

  return (
    <Table
      columns={columns}
      data={vendas}
      onRetry={onRetry}
      footer={footer}
      aria-label="Histórico de vendas de VT"
    />
  )
}
