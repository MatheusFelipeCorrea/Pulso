import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  CircleDollarSign,
  MessageSquare,
  Trash2,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { Tooltip } from '@/design-system/components/data-display/Tooltip/Tooltip.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { calcSaldoDivida } from '@/utils/debtBalanceUtils.js'
import { getDebtStatusBadge } from '@/utils/debtStatusUtils.js'
import { formatPersonName } from '@/utils/personName.js'

function formatDate(iso) {
  if (!iso) return '—'
  return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR })
}

function formatTimelineDate(iso) {
  if (!iso) return '—'
  return format(parseISO(iso), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function getPaymentHistoryText(divida, pagamento) {
  const nome = formatPersonName(divida.nomePessoa)
  const valor = formatCurrency(pagamento.valor)

  if (divida.direcao === 'ME_DEVEM') {
    return `${nome} pagou ${valor}`
  }

  return `Você pagou ${valor} para ${nome}`
}

export function DebtDetailsModal({
  open,
  onClose,
  divida,
  onDeletePayment,
  deletingPaymentId = null,
}) {
  if (!divida) return null

  const nomePessoa = formatPersonName(divida.nomePessoa)
  const isReceive = divida.direcao === 'ME_DEVEM'
  const saldo = calcSaldoDivida(divida)
  const status = getDebtStatusBadge(divida)
  const pagamentos = [...(divida.pagamentos ?? [])].sort(
    (a, b) => new Date(a.dataPagamento) - new Date(b.dataPagamento)
  )

  const directionLabel = isReceive ? 'Me devem' : 'Eu devo'
  const tone = isReceive ? 'receive' : 'pay'

  return (
    <Modal isOpen={open} onClose={onClose} size="lg" className="debt-details-modal">
      <div className="debt-details">
        <header className={`debt-details__header debt-details__header--${tone}`}>
          <div className="debt-details__identity">
            <Avatar name={nomePessoa} size="lg" fallback="color" />
            <div>
              <p className="debt-details__direction">
                {isReceive ? (
                  <ArrowDownLeft size={14} aria-hidden />
                ) : (
                  <ArrowUpRight size={14} aria-hidden />
                )}
                {directionLabel}
              </p>
              <h2>{nomePessoa}</h2>
              <span className={`debt-details__status debt-details__status--${status.tone}`}>
                {status.label}
              </span>
            </div>
          </div>
          <Tooltip content="Fechar" position="left" delay={120} className="debts-tooltip debts-tooltip--left">
            <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
          </Tooltip>
        </header>

        <div className="debt-details__body">
          <section className="debt-details__summary">
            <article className="debt-details__stat">
              <span className="debt-details__stat-label">Valor total</span>
              <strong>{formatCurrency(saldo.valorTotal)}</strong>
            </article>
            <article className="debt-details__stat">
              <span className="debt-details__stat-label">Já pago</span>
              <strong>{formatCurrency(saldo.valorPago)}</strong>
            </article>
            <article className={`debt-details__stat debt-details__stat--highlight debt-details__stat--${tone}`}>
              <span className="debt-details__stat-label">Saldo restante</span>
              <strong>{formatCurrency(saldo.valorRestante)}</strong>
            </article>
          </section>

          <section className="debt-details__info">
            <div className="debt-details__info-item">
              <Calendar size={15} aria-hidden />
              <div>
                <span>Empréstimo em</span>
                <strong>{formatDate(divida.dataEmprestimo)}</strong>
              </div>
            </div>
            <div className="debt-details__info-item">
              <CircleDollarSign size={15} aria-hidden />
              <div>
                <span>Prazo de devolução</span>
                <strong>{divida.prazoDevolucao ? formatDate(divida.prazoDevolucao) : 'Sem prazo definido'}</strong>
              </div>
            </div>
            {divida.quitada && divida.dataQuitacao ? (
              <div className="debt-details__info-item">
                <Calendar size={15} aria-hidden />
                <div>
                  <span>Quitada em</span>
                  <strong>{formatDate(divida.dataQuitacao)}</strong>
                </div>
              </div>
            ) : null}
          </section>

          {divida.observacao ? (
            <section className="debt-details__note">
              <MessageSquare size={15} aria-hidden />
              <div>
                <span>Observação</span>
                <p>{divida.observacao}</p>
              </div>
            </section>
          ) : null}

          <section className="debt-details__history">
            <h3>Histórico de pagamentos</h3>

            {pagamentos.length === 0 ? (
              <EmptyState
                className="debt-details__history-empty"
                title="Nenhum pagamento registrado"
                description={
                  divida.quitada
                    ? 'Esta dívida foi quitada sem parcelas registradas.'
                    : 'Os pagamentos parciais aparecerão aqui conforme forem registrados.'
                }
              />
            ) : (
              <ol className="debt-details__timeline">
                {pagamentos.map((pagamento, index) => (
                  <li key={pagamento.id} className="debt-details__timeline-item">
                    <span className="debt-details__timeline-marker" aria-hidden>
                      {index + 1}
                    </span>
                    <div className="debt-details__timeline-content">
                      <time dateTime={pagamento.dataPagamento}>
                        {formatTimelineDate(pagamento.dataPagamento)}
                      </time>
                      <p className="debt-details__timeline-text">
                        {getPaymentHistoryText(divida, pagamento)}
                      </p>
                      {pagamento.observacao ? (
                        <p className="debt-details__timeline-note">{pagamento.observacao}</p>
                      ) : null}
                    </div>
                    {onDeletePayment ? (
                      <Tooltip
                        content="Remover pagamento"
                        position="left"
                        delay={120}
                        className="debts-tooltip debts-tooltip--left"
                      >
                        <IconButton
                          variant="ghost"
                          size="sm"
                          className="debt-details__timeline-remove"
                          ariaLabel="Remover pagamento"
                          icon={<Trash2 size={14} />}
                          loading={deletingPaymentId === pagamento.id}
                          onClick={() => onDeletePayment(divida, pagamento)}
                        />
                      </Tooltip>
                    ) : null}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </Modal>
  )
}
