import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeftRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'

function tipoMetaClass(tipo) {
  if (tipo === 'RECEITA') return 'dashboard-tx-item__tipo--income'
  if (tipo === 'TRANSFERENCIA') return 'dashboard-tx-item__tipo--transfer'
  return 'dashboard-tx-item__tipo--expense'
}

function tipoLabel(tipo) {
  if (tipo === 'RECEITA') return 'Receita'
  if (tipo === 'TRANSFERENCIA') return 'Transferência'
  return 'Despesa'
}

function amountClass(tipo) {
  if (tipo === 'RECEITA') return 'dashboard-tx-item__amount--income'
  if (tipo === 'TRANSFERENCIA') return 'dashboard-tx-item__amount--transfer'
  return 'dashboard-tx-item__amount--expense'
}

function formatAmount(tipo, valor) {
  const abs = formatCurrency(Math.abs(valor))
  if (tipo === 'RECEITA') return `+${abs}`
  if (tipo === 'TRANSFERENCIA') return abs
  return `−${abs}`
}

function DashboardTxItem({ tx }) {
  const isTransferencia = tx.tipo === 'TRANSFERENCIA'
  const valor = Number(tx.valor)
  const cor = tx.categoria?.cor ?? '#7C3AED'
  const titulo =
    tx.descricao ||
    (isTransferencia ? 'Transferência entre contas' : tx.categoria?.nome) ||
    '—'

  return (
    <li className="dashboard-tx-item">
      <span
        className="dashboard-tx-item__icon"
        style={
          isTransferencia
            ? {
                color: '#3B82F6',
                background: 'color-mix(in srgb, #3B82F6 16%, transparent)',
              }
            : {
                color: cor,
                background: `color-mix(in srgb, ${cor} 16%, transparent)`,
              }
        }
        aria-hidden
      >
        {isTransferencia ? (
          <ArrowLeftRight size={16} strokeWidth={2} />
        ) : (
          resolveBadgeIcon(tx.categoria?.icone ?? 'Tag', { size: 16 })
        )}
      </span>

      <div className="dashboard-tx-item__body">
        <span className="dashboard-tx-item__title">{titulo}</span>
        <span className="dashboard-tx-item__meta">
          <time dateTime={tx.data}>
            {format(parseISO(tx.data), 'dd/MM/yyyy', { locale: ptBR })}
          </time>
          <span className="dashboard-tx-item__dot" aria-hidden>
            ·
          </span>
          <span className={`dashboard-tx-item__tipo ${tipoMetaClass(tx.tipo)}`}>
            {tipoLabel(tx.tipo)}
          </span>
          {!isTransferencia && tx.categoria?.nome ? (
            <>
              <span className="dashboard-tx-item__dot" aria-hidden>
                ·
              </span>
              <span className="dashboard-tx-item__category">{tx.categoria.nome}</span>
            </>
          ) : null}
        </span>
      </div>

      <strong className={`dashboard-tx-item__amount ${amountClass(tx.tipo)}`}>
        {formatAmount(tx.tipo, valor)}
      </strong>
    </li>
  )
}

export function DashboardRecentTransactions({ transacoes = [], loading }) {
  return (
    <section className="dashboard-card dashboard-card--table">
      <header className="dashboard-card__header">
        <h2>Últimas transações</h2>
        <Link to="/transactions" className="dashboard-card__link">
          Ver todas as transações
        </Link>
      </header>

      {loading ? (
        <SpinnerDots center label="Carregando transações..." />
      ) : transacoes.length === 0 ? (
        <p className="dashboard-empty-inline">Nenhuma transação neste mês.</p>
      ) : (
        <div className="dashboard-tx-list">
          <div className="dashboard-tx-list__head" aria-hidden>
            <span>Transação</span>
            <span>Valor</span>
          </div>

          <ul
            className="dashboard-tx-list__scroll"
            aria-label={`${transacoes.length} transações recentes`}
          >
            {transacoes.map((tx) => (
              <DashboardTxItem key={tx.id} tx={tx} />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
