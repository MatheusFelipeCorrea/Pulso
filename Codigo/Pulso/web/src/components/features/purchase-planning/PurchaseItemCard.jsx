import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Link2,
  Pencil,
  Trash2,
  XCircle,
} from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { ProgressBar } from '@/design-system/components/data-display/ProgressBar/ProgressBar.jsx'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import {
  COMPROMETIMENTO_COLORS,
  COMPROMETIMENTO_NIVEL,
  PRIORIDADE_LABELS,
  capitalizeNomeItem,
  formatComprometimentoPercentual,
  formatMesesParaComprar,
  getCategoryIconConfig,
} from '@/utils/purchasePlanningUtils.js'

const PRIORIDADE_DOT = {
  ALTA: '#EF4444',
  MEDIA: '#F59E0B',
  BAIXA: '#22C55E',
}

function SimulationStatusIcon({ nivel }) {
  if (nivel === COMPROMETIMENTO_NIVEL.ARRISCADO) {
    return <XCircle size={14} aria-hidden />
  }
  if (nivel === COMPROMETIMENTO_NIVEL.ATENCAO) {
    return <AlertTriangle size={14} aria-hidden />
  }
  return <CheckCircle2 size={14} aria-hidden />
}

function PriorityTag({ prioridade }) {
  const label = PRIORIDADE_LABELS[prioridade]
  const dot = PRIORIDADE_DOT[prioridade]
  if (!label || !dot) return null

  return (
    <span
      className="pp-item-card__priority"
      style={{ borderColor: `color-mix(in srgb, ${dot} 50%, transparent)` }}
    >
      <span className="pp-item-card__priority-dot" style={{ background: dot }} aria-hidden />
      {label}
    </span>
  )
}

export function PurchaseItemCard({
  item,
  sobraMensal = 0,
  onLinkGoal,
  onBuy,
  onEdit,
  onDelete,
  buying = false,
}) {
  const categoryConfig = getCategoryIconConfig(item.categoria)
  const meta = item.meta
  const percentualMeta = meta ? Math.round(Number(meta.percentual) || 0) : 0
  const mesesLabel = formatMesesParaComprar(item.mesesParaComprar)
  const semSobraMensal = item.mesesParaComprar == null
  const [imageError, setImageError] = useState(false)
  const showPhoto = item.imagemUrl && !imageError

  return (
    <li className="pp-item-card">
      <div className="pp-item-card__left">
        <div
          className={`pp-item-card__media${showPhoto ? ' pp-item-card__media--photo' : ''}`}
          style={
            showPhoto
              ? undefined
              : {
                  background: `linear-gradient(160deg, color-mix(in srgb, ${categoryConfig.color} 22%, var(--ds-color-surface-elevated)), color-mix(in srgb, ${categoryConfig.color} 8%, var(--ds-color-surface)))`,
                }
          }
        >
          {showPhoto ? (
            <img
              src={item.imagemUrl}
              alt=""
              onError={() => setImageError(true)}
            />
          ) : (
            resolveBadgeIcon(categoryConfig.icon, { size: 36 })
          )}
        </div>

        <div className="pp-item-card__info">
          <h3>{capitalizeNomeItem(item.nome)}</h3>
          <PriorityTag prioridade={item.prioridade} />
          <strong className="pp-item-card__value">{formatCurrency(item.valorEstimado)}</strong>
          <div className="pp-item-card__savings">
            <span className="pp-item-card__savings-line">
              Sobra atual: <strong>{formatCurrency(sobraMensal)}/mês</strong>
            </span>
            <span className="pp-item-card__savings-line">
              {semSobraMensal ? (
                <span className="pp-item-card__savings-highlight">Sem sobra mensal</span>
              ) : (
                <>
                  Compra à vista em{' '}
                  <span className="pp-item-card__savings-highlight">~{mesesLabel}</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="pp-item-card__divider" aria-hidden />

      <div className="pp-item-card__panel">
        {item.simulacoes?.length ? (
          <div className="pp-item-card__simulations">
            <span className="pp-item-card__simulations-label">Simulação de parcelamento</span>
            <div className="pp-item-card__simulations-box">
              <ul className="pp-item-card__simulations-list">
                {item.simulacoes.map((sim) => {
                  const tone = COMPROMETIMENTO_COLORS[sim.nivel] ?? '#94A3B8'
                  return (
                    <li key={`${item.id}-${sim.parcelas}`} className="pp-item-card__simulation-row">
                      <span className="pp-item-card__simulation-copy">
                        <strong>
                          {sim.parcelas}x de {formatCurrency(sim.parcela)}
                        </strong>
                        <span className="pp-item-card__simulation-arrow" aria-hidden>
                          →
                        </span>
                        <span>
                          compromete {formatComprometimentoPercentual(sim.percentual)} da renda
                        </span>
                      </span>
                      <span className="pp-item-card__simulation-icon" style={{ color: tone }}>
                        <SimulationStatusIcon nivel={sim.nivel} />
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ) : null}

        {meta ? (
          <div className="pp-item-card__goal">
            <span className="pp-item-card__goal-label">Meta vinculada: {meta.nome}</span>
            <div className="pp-item-card__goal-row">
              <ProgressBar
                value={Number(meta.valorAtual)}
                max={Number(meta.valorAlvo)}
                variant="primary"
                size="md"
                className="pp-item-card__goal-progress"
              />
              <span className="pp-item-card__goal-values">
                {formatCurrency(meta.valorAtual)} / {formatCurrency(meta.valorAlvo)}
              </span>
              <strong className="pp-item-card__goal-percent">{percentualMeta}%</strong>
            </div>
          </div>
        ) : null}

        {item.observacoes ? <p className="pp-item-card__notes">{item.observacoes}</p> : null}

        {item.linkProduto ? (
          <a
            className="pp-item-card__link"
            href={item.linkProduto}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver produto
            <ExternalLink size={13} aria-hidden />
          </a>
        ) : null}

        <div className="pp-item-card__actions" role="group" aria-label={`Ações de ${item.nome}`}>
          <div className="pp-item-card__actions-primary">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="pp-item-card__link-btn"
              leftIcon={<Link2 size={14} />}
              onClick={() => onLinkGoal?.(item)}
            >
              Vincular meta
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="pp-item-card__buy-btn"
              leftIcon={<CheckCircle2 size={14} />}
              loading={buying}
              onClick={() => onBuy?.(item)}
            >
              Comprei!
            </Button>
          </div>
          <div className="pp-item-card__actions-secondary">
            <IconButton
              variant="outline"
              size="sm"
              className="pp-item-card__icon-action"
              ariaLabel={`Editar ${item.nome}`}
              icon={<Pencil size={14} />}
              onClick={() => onEdit?.(item)}
            />
            <IconButton
              variant="outline"
              size="sm"
              className="pp-item-card__icon-action pp-item-card__icon-action--danger"
              ariaLabel={`Excluir ${item.nome}`}
              icon={<Trash2 size={14} />}
              onClick={() => onDelete?.(item)}
            />
          </div>
        </div>
      </div>
    </li>
  )
}
