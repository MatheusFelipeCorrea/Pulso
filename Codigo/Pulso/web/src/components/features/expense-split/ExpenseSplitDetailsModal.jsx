import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Check,
  CheckCircle2,
  Clock,
  MessageSquare,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { getPagador } from '@/utils/expenseSplitUtils.js'
import { cn } from '@/design-system/utils/cn.js'

const TIPO_LABELS = {
  IGUAL: 'Divisão igual',
  PERSONALIZADA: 'Valores personalizados',
}

function formatTimelineDate(iso) {
  if (!iso) return '—'
  return format(parseISO(iso), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

function formatShortDate(iso) {
  if (!iso) return '—'
  return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR })
}

export function ExpenseSplitDetailsModal({ open, onClose, divisao }) {
  if (!divisao) return null

  const participantes = divisao.participantes ?? []
  const pagador = getPagador(divisao)
  const pagos = participantes.filter((p) => p.status === 'PAGO').length
  const statusLabel = divisao.status === 'QUITADA' ? 'Quitada' : 'Em aberto'
  const tipoLabel = TIPO_LABELS[divisao.tipo] ?? 'Divisão'

  return (
    <Modal isOpen={open} onClose={onClose} size="lg" className="pp-history-modal">
      <div className="pp-history">
        <header className="pp-history__header">
          <div className="pp-history__identity">
            <div
              className="pp-history__media"
              style={{
                color: divisao.cor ?? undefined,
                background: divisao.cor
                  ? `color-mix(in srgb, ${divisao.cor} 18%, #1a1d2e)`
                  : undefined,
              }}
            >
              {resolveBadgeIcon(divisao.icone ?? 'Receipt', { size: 28 })}
            </div>
            <div>
              <p className="pp-history__eyebrow">Histórico da divisão</p>
              <h2>{divisao.titulo}</h2>
              <span className="pp-history__category">{tipoLabel}</span>
            </div>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="pp-history__body">
          <section className="pp-history__summary">
            <article className="pp-history__stat">
              <span className="pp-history__stat-label">Valor total</span>
              <strong>{formatCurrency(divisao.valorTotal)}</strong>
            </article>
            <article className="pp-history__stat">
              <span className="pp-history__stat-label">Participantes</span>
              <strong>{participantes.length}</strong>
            </article>
            <article
              className={cn(
                'pp-history__stat',
                divisao.status === 'QUITADA' && 'pp-history__stat--highlight'
              )}
            >
              <span className="pp-history__stat-label">Status</span>
              <strong>{statusLabel}</strong>
            </article>
          </section>

          <section className="pp-history__info-item">
            <Wallet size={15} aria-hidden />
            <div>
              <span>Data da despesa</span>
              <strong>{formatTimelineDate(divisao.data)}</strong>
            </div>
          </section>

          {pagador ? (
            <section className="pp-history__info-item">
              <CheckCircle2 size={15} aria-hidden />
              <div>
                <span>Quem pagou a conta</span>
                <strong>{pagador.nome}</strong>
              </div>
            </section>
          ) : null}

          {divisao.observacao ? (
            <section className="pp-history__info-item">
              <MessageSquare size={15} aria-hidden />
              <div>
                <span>Observação</span>
                <p>{divisao.observacao}</p>
              </div>
            </section>
          ) : null}

          <section className="pp-history__timeline-section">
            <h3>
              <Users size={14} aria-hidden />
              Participantes ({pagos}/{participantes.length} pagos)
            </h3>

            <ol className="pp-history__timeline">
              {participantes.map((participante) => {
                const pago = participante.status === 'PAGO'
                const detalhes = [
                  participante.ehOrganizador ? 'organizador' : null,
                  participante.pagouAConta ? 'pagou a conta' : null,
                ]
                  .filter(Boolean)
                  .join(' · ')

                return (
                  <li key={participante.id} className="pp-history__timeline-item">
                    <span
                      className={cn(
                        'pp-history__timeline-marker',
                        pago ? 'pp-history__timeline-marker--success' : 'pp-history__timeline-marker--warning'
                      )}
                      aria-hidden
                    >
                      {pago ? <Check size={14} /> : <Clock size={14} />}
                    </span>
                    <div className="pp-history__timeline-content">
                      <p className="pp-history__timeline-text">
                        {participante.nome}
                        {detalhes ? (
                          <span className="pp-history__timeline-role"> — {detalhes}</span>
                        ) : null}
                      </p>
                      <p className="pp-history__timeline-note">
                        {formatCurrency(participante.valor)} · {pago ? 'Pago' : 'Pendente'}
                        {participante.dataPagamento
                          ? ` em ${formatShortDate(participante.dataPagamento)}`
                          : ''}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>

          {divisao.quitadaEm ? (
            <section className="pp-history__info-item">
              <CheckCircle2 size={15} aria-hidden />
              <div>
                <span>Quitada em</span>
                <strong>{formatTimelineDate(divisao.quitadaEm)}</strong>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}
