import { Lightbulb, Pencil, Pause, Play, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { ProgressBar } from '@/design-system/components/data-display/ProgressBar/ProgressBar.jsx'
import { PulsoBadgeByKind } from '@/components/badges/PulsoBadge.jsx'
import { badgeKindFromMetaStatus, badgeKindFromMetaTipo } from '@/components/badges/enumMappers.js'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import {
  formatGoalDeadlineLabel,
  getGoalInsight,
  getGoalProgressVariant,
} from '@/utils/goalStatusUtils.js'
import { podeReceberAporte } from '@/utils/goalBalanceUtils.js'
import { GoalIcon } from './goalIcons.jsx'

export function GoalCard({
  meta,
  onContribution,
  onEdit,
  onPause,
  onResume,
  onDelete,
}) {
  const status = meta.status ?? 'ATIVA'
  const progressVariant = getGoalProgressVariant(status)
  const insight = getGoalInsight(meta)
  const statusKind = badgeKindFromMetaStatus(status)
  const tipoKind = badgeKindFromMetaTipo(meta.tipo)
  const percentual = Math.round(Number(meta.percentual) || 0)

  return (
    <li className={`goal-card goal-card--${status.toLowerCase()}`}>
      <div className="goal-card__body">
        <GoalIcon nome={meta.nome} status={status} className="goal-card__icon" />

        <div className="goal-card__content">
          <header className="goal-card__header">
            <div className="goal-card__heading">
              <h3>{meta.nome}</h3>
              <div className="goal-card__badges">
                {tipoKind ? <PulsoBadgeByKind kind={tipoKind} size="sm" /> : null}
                {statusKind ? <PulsoBadgeByKind kind={statusKind} size="sm" /> : null}
              </div>
            </div>
            <span className="goal-card__deadline">{formatGoalDeadlineLabel(meta)}</span>
          </header>

          <div className="goal-card__progress-block">
            <div className="goal-card__progress-head">
              <span>
                {formatCurrency(meta.valorAtual)} de {formatCurrency(meta.valorAlvo)}
              </span>
              <strong>{percentual}%</strong>
            </div>
            <ProgressBar
              value={Number(meta.valorAtual)}
              max={Number(meta.valorAlvo)}
              variant={progressVariant}
              size="lg"
              className="goal-card__progress"
            />
          </div>

          <p className="goal-card__insight">
            <Lightbulb size={14} aria-hidden />
            <span>{insight}</span>
          </p>
        </div>

        {status === 'CONCLUIDA' ? (
          <aside className="goal-card__completed-badge" aria-label="Meta concluída">
            CONCLUÍDA
          </aside>
        ) : (
          <aside className="goal-card__actions">
            {podeReceberAporte(meta) ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="goal-card__contribute-btn"
                leftIcon={<Plus size={14} />}
                onClick={() => onContribution?.(meta)}
              >
                Aporte
              </Button>
            ) : null}

            {status === 'ATIVA' ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="goal-card__pause-btn"
                leftIcon={<Pause size={14} />}
                onClick={() => onPause?.(meta)}
              >
                Pausar
              </Button>
            ) : null}

            {status === 'PAUSADA' ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="goal-card__resume-btn"
                leftIcon={<Play size={14} />}
                onClick={() => onResume?.(meta)}
              >
                Retomar
              </Button>
            ) : null}

            <div className="goal-card__toolbar" role="group" aria-label={`Ações de ${meta.nome}`}>
              <IconButton
                variant="ghost"
                size="sm"
                className="goal-card__toolbar-btn goal-card__edit"
                ariaLabel={`Editar meta ${meta.nome}`}
                icon={<Pencil size={14} />}
                onClick={() => onEdit?.(meta)}
              />
              <IconButton
                variant="ghost"
                size="sm"
                className="goal-card__toolbar-btn goal-card__delete"
                ariaLabel={`Excluir meta ${meta.nome}`}
                icon={<Trash2 size={14} />}
                onClick={() => onDelete?.(meta)}
              />
            </div>
          </aside>
        )}
      </div>
    </li>
  )
}
