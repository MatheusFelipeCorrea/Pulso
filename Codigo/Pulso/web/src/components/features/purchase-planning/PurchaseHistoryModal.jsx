import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Receipt,
  ShoppingCart,
  Target,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import {
  PRIORIDADE_LABELS,
  capitalizeNomeItem,
  getCategoryIconConfig,
} from '@/utils/purchasePlanningUtils.js'

function formatDate(iso) {
  if (!iso) return '—'
  return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR })
}

function formatTimelineDate(iso) {
  if (!iso) return '—'
  return format(parseISO(iso), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function PurchaseHistoryModal({ open, onClose, item }) {
  if (!item) return null

  const categoryConfig = getCategoryIconConfig(item.categoria)
  const prioridadeLabel = PRIORIDADE_LABELS[item.prioridade]

  const timeline = [
    {
      key: 'criado',
      icon: ShoppingCart,
      data: item.criadoEm,
      texto: `Adicionado à lista com valor estimado de ${formatCurrency(item.valorEstimado)}`,
    },
    {
      key: 'comprado',
      icon: CheckCircle2,
      data: item.compradoEm,
      texto: 'Marcado como comprado',
      nota:
        item.diasNaLista != null
          ? `Ficou ${item.diasNaLista} ${item.diasNaLista === 1 ? 'dia' : 'dias'} na lista de desejos.`
          : null,
    },
    item.transacao
      ? {
          key: 'transacao',
          icon: Receipt,
          data: item.transacao.data,
          texto: `Despesa de ${formatCurrency(item.transacao.valor)} registrada em ${item.transacao.recursoLabel}`,
        }
      : null,
  ].filter(Boolean)

  return (
    <Modal isOpen={open} onClose={onClose} size="lg" className="pp-history-modal">
      <div className="pp-history">
        <header className="pp-history__header">
          <div className="pp-history__identity">
            <div
              className="pp-history__media"
              style={{
                background: `linear-gradient(160deg, color-mix(in srgb, ${categoryConfig.color} 22%, #1a1d2e), color-mix(in srgb, ${categoryConfig.color} 8%, #12141c))`,
              }}
            >
              {resolveBadgeIcon(categoryConfig.icon, { size: 28 })}
            </div>
            <div>
              <p className="pp-history__eyebrow">Histórico da compra</p>
              <h2>{capitalizeNomeItem(item.nome)}</h2>
              <span className="pp-history__category">{item.categoriaLabel}</span>
            </div>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="pp-history__body">
          <section className="pp-history__summary">
            <article className="pp-history__stat">
              <span className="pp-history__stat-label">Valor</span>
              <strong>{formatCurrency(item.valorEstimado)}</strong>
            </article>
            <article className="pp-history__stat">
              <span className="pp-history__stat-label">Prioridade</span>
              <strong>{prioridadeLabel ?? '—'}</strong>
            </article>
            <article className="pp-history__stat pp-history__stat--highlight">
              <span className="pp-history__stat-label">Comprado em</span>
              <strong>{formatDate(item.compradoEm)}</strong>
            </article>
          </section>

          {item.meta ? (
            <section className="pp-history__info-item">
              <Target size={15} aria-hidden />
              <div>
                <span>Meta vinculada</span>
                <strong>
                  {item.meta.nome} — {formatCurrency(item.meta.valorAtual)} de{' '}
                  {formatCurrency(item.meta.valorAlvo)} ({Math.round(Number(item.meta.percentual) || 0)}%)
                </strong>
              </div>
            </section>
          ) : null}

          {item.observacoes ? (
            <section className="pp-history__info-item">
              <MessageSquare size={15} aria-hidden />
              <div>
                <span>Observações</span>
                <p>{item.observacoes}</p>
              </div>
            </section>
          ) : null}

          {item.linkProduto ? (
            <a className="pp-history__link" href={item.linkProduto} target="_blank" rel="noopener noreferrer">
              Ver produto
              <ExternalLink size={13} aria-hidden />
            </a>
          ) : null}

          <section className="pp-history__timeline-section">
            <h3>
              <Calendar size={14} aria-hidden />
              Linha do tempo
            </h3>

            <ol className="pp-history__timeline">
              {timeline.map((evento) => {
                const Icon = evento.icon
                return (
                  <li key={evento.key} className="pp-history__timeline-item">
                    <span className="pp-history__timeline-marker" aria-hidden>
                      <Icon size={14} />
                    </span>
                    <div className="pp-history__timeline-content">
                      <time dateTime={evento.data ?? undefined}>{formatTimelineDate(evento.data)}</time>
                      <p className="pp-history__timeline-text">{evento.texto}</p>
                      {evento.nota ? <p className="pp-history__timeline-note">{evento.nota}</p> : null}
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>
        </div>
      </div>
    </Modal>
  )
}
