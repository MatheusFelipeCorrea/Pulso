import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Banknote,
  Check,
  Circle,
  Eye,
  Hourglass,
  Pencil,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { Tooltip } from '@/design-system/components/data-display/Tooltip/Tooltip.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { getDebtStatusBadge } from '@/utils/debtStatusUtils.js'
import { formatPersonName } from '@/utils/personName.js'
import { calcSaldoDivida } from '@/utils/debtBalanceUtils.js'

function formatDate(iso) {
  if (!iso) return '—'
  return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR })
}

function DebtStatusIcon({ icon }) {
  if (icon === 'check') {
    return <Check size={15} className="debts-card__status-icon" aria-hidden />
  }
  if (icon === 'hourglass') {
    return <Hourglass size={15} className="debts-card__status-icon" aria-hidden />
  }
  if (icon === 'dot') {
    return <Circle size={9} fill="currentColor" className="debts-card__status-dot" aria-hidden />
  }
  return null
}

function DebtTooltip({ content, position = 'bottom', children }) {
  return (
    <Tooltip
      content={content}
      position={position}
      delay={120}
      className={`debts-tooltip debts-tooltip--${position}`}
    >
      {children}
    </Tooltip>
  )
}

export function DebtCard({
  divida,
  onView,
  onEdit,
  onSettle,
  onDelete,
  onPayment,
  onReopen,
}) {
  const status = getDebtStatusBadge(divida)
  const nomePessoa = formatPersonName(divida.nomePessoa)
  const isReceive = divida.direcao === 'ME_DEVEM'
  const saldo = calcSaldoDivida(divida)
  const qtdPagamentos = divida.quantidadePagamentos ?? divida.pagamentos?.length ?? 0
  const temPagamentos = qtdPagamentos > 0
  const podeReabrir =
    divida.quitada && !(saldo.valorPago >= saldo.valorTotal && temPagamentos)

  const tone = divida.quitada ? 'settled' : isReceive ? 'receive' : 'pay'
  const valorExibido =
    temPagamentos && !divida.quitada ? saldo.valorRestante : Number(divida.valor)

  const showStatus =
    divida.quitada || Boolean(divida.prazoDevolucao) || (temPagamentos && !divida.quitada)

  const prazoLabel = divida.prazoDevolucao ? formatDate(divida.prazoDevolucao) : 'Sem prazo'

  return (
    <li className={`debts-card${divida.quitada ? ' debts-card--settled' : ''}`}>
      <div className={`debts-card__content${showStatus ? '' : ' debts-card__content--no-status'}`}>
        <div className="debts-card__person">
          <Avatar name={nomePessoa} size="md" fallback="color" className="debts-card__avatar" />
          <div className="debts-card__person-info">
            <strong>{nomePessoa}</strong>
            {divida.observacao ? (
              <p className="debts-card__note" title={divida.observacao}>
                {divida.observacao}
              </p>
            ) : null}
          </div>
        </div>

        <div className="debts-card__field debts-card__field--value">
          <span className="debts-card__label">Valor</span>
          <span className={`debts-card__value debts-card__value--${tone}`}>
            {formatCurrency(valorExibido)}
          </span>
          {temPagamentos && !divida.quitada ? (
            <span className="debts-card__balance-meta">
              {formatCurrency(saldo.valorPago)} de {formatCurrency(saldo.valorTotal)}
            </span>
          ) : null}
        </div>

        <div className="debts-card__field debts-card__field--loan">
          <span className="debts-card__label">Empréstimo em</span>
          <span className="debts-card__date">{formatDate(divida.dataEmprestimo)}</span>
        </div>

        <div className="debts-card__field debts-card__field--deadline">
          <span className="debts-card__label">Prazo de devolução</span>
          <span className="debts-card__deadline">{prazoLabel}</span>
        </div>

        {showStatus ? (
          <div className={`debts-card__status debts-card__status--${status.tone}`}>
            <DebtStatusIcon icon={status.icon} />
            <span>{status.label}</span>
          </div>
        ) : null}
      </div>

      <footer
        className={`debts-card__footer${temPagamentos ? '' : ' debts-card__footer--compact'}`}
      >
        {temPagamentos ? (
          <button type="button" className="debts-card__history-link" onClick={() => onView?.(divida)}>
            {qtdPagamentos} pagamento{qtdPagamentos === 1 ? '' : 's'} · ver histórico
          </button>
        ) : null}

        <div className="debts-card__footer-actions">
          {!divida.quitada ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="debts-card__settle-btn"
              leftIcon={<Check size={14} />}
              onClick={() => onSettle?.(divida)}
            >
              Marcar como paga
            </Button>
          ) : podeReabrir ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="debts-card__reopen-btn"
              leftIcon={<RotateCcw size={14} />}
              onClick={() => onReopen?.(divida)}
            >
              Desfazer quitação
            </Button>
          ) : null}

          <div className="debts-card__toolbar" role="group" aria-label={`Ações de ${nomePessoa}`}>
            <DebtTooltip content="Ver detalhes e histórico">
              <IconButton
                variant="ghost"
                size="sm"
                className="debts-card__toolbar-btn debts-card__view"
                ariaLabel={`Ver detalhes de ${nomePessoa}`}
                icon={<Eye size={15} />}
                onClick={() => onView?.(divida)}
              />
            </DebtTooltip>
            {!divida.quitada ? (
              <>
                <DebtTooltip content="Registrar pagamento">
                  <IconButton
                    variant="ghost"
                    size="sm"
                    className="debts-card__toolbar-btn debts-card__pay-btn"
                    ariaLabel={`Registrar pagamento de ${nomePessoa}`}
                    icon={<Banknote size={15} />}
                    onClick={() => onPayment?.(divida)}
                  />
                </DebtTooltip>
                <DebtTooltip content="Editar empréstimo">
                  <IconButton
                    variant="ghost"
                    size="sm"
                    className="debts-card__toolbar-btn debts-card__edit"
                    ariaLabel={`Editar empréstimo de ${nomePessoa}`}
                    icon={<Pencil size={14} />}
                    onClick={() => onEdit?.(divida)}
                  />
                </DebtTooltip>
                <DebtTooltip content="Excluir empréstimo">
                  <IconButton
                    variant="ghost"
                    size="sm"
                    className="debts-card__toolbar-btn debts-card__delete"
                    ariaLabel={`Excluir empréstimo de ${nomePessoa}`}
                    icon={<Trash2 size={14} />}
                    onClick={() => onDelete?.(divida)}
                  />
                </DebtTooltip>
              </>
            ) : null}
          </div>
        </div>
      </footer>
    </li>
  )
}
