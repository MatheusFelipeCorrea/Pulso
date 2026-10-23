import { Check, Plus, Target } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { GroupDetailSectionTitle } from './GroupDetailSectionTitle.jsx'
import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { ProgressBar } from '@/design-system/components/data-display/ProgressBar/ProgressBar.jsx'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { mergeMetaAportes } from '@/utils/groupDetailUtils.js'
import { formatGrupoMembroDisplayNome } from '@/utils/groupFormat.js'

function MetaBlock({ meta, membros, onContribute, concluida = false }) {
  const aportes = mergeMetaAportes(meta, membros)
  const aporteScroll = aportes.length > 4
  const valorAtual = Number(meta.valorAtual ?? 0)
  const valorAlvo = Number(meta.valorAlvo ?? 0)
  const progressoAtual = valorAlvo > 0 ? Math.min(valorAtual, valorAlvo) : 0

  return (
    <div className={`group-detail-goal__block${concluida ? ' group-detail-goal__block--done' : ''}`}>
      <div className="group-detail-goal__content">
        <div
          className={`group-detail-goal__body${aporteScroll ? ' group-detail-goal__body--scrollable' : ''}`}
        >
          <div className="group-detail-goal__summary">
            <div className="group-detail-goal__head">
              <div className="group-detail-goal__icon">
                <Target size={18} aria-hidden />
              </div>
              <span className="group-detail-goal__name">{meta.nome}</span>
              {concluida ? <span className="group-detail-goal__done-badge">Concluída</span> : null}
            </div>

            <div className="group-detail-goal__progress">
              <ProgressBar
                value={progressoAtual}
                max={valorAlvo || 1}
                variant={concluida ? 'success' : 'primary'}
                size="lg"
                showLabel
              />
              <p className="group-detail-goal__raised">
                <span className="group-detail-goal__raised-line">
                  Arrecadado: <strong>{formatCurrency(meta.valorAtual)}</strong>
                </span>
                <span className="group-detail-goal__raised-line">
                  de <strong>{formatCurrency(meta.valorAlvo)}</strong>
                </span>
              </p>
            </div>
          </div>

          <ul
            className={`group-detail-goal__aportes${aporteScroll ? ' group-detail-goal__aportes--scroll' : ''}`}
          >
            {aportes.map((aporte) => (
              <li key={aporte.usuarioId}>
                <Avatar
                  name={formatGrupoMembroDisplayNome(aporte.nome, aporte.souEu)}
                  src={aporte.urlAvatar}
                  size="sm"
                  fallback="color"
                />
                <span>{formatGrupoMembroDisplayNome(aporte.nome, aporte.souEu)}</span>
                <strong>{formatCurrency(aporte.total)}</strong>
                {aporte.completo ? (
                  <Check size={16} className="group-detail-goal__check" aria-label="Aporte registrado" />
                ) : (
                  <span className="group-detail-goal__pending" aria-hidden />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!concluida ? (
        <Button
          type="button"
          variant="secondary"
          fullWidth
          className="group-detail-goal__cta group-detail-card__outline-btn"
          leftIcon={<Plus size={14} />}
          onClick={onContribute}
        >
          Fazer meu aporte
        </Button>
      ) : null}
    </div>
  )
}

export function GroupDetailGoalCard({
  meta,
  metasLista = [],
  membros,
  onCreateGoal,
  onContribute,
  canAddMeta = true,
}) {
  const lista = metasLista.length ? metasLista : meta ? [meta] : []
  const temAtiva = lista.some((m) => m.status === 'ATIVA')

  return (
    <section className="group-detail-card group-detail-card--goal">
      <header className="group-detail-card__header">
        <GroupDetailSectionTitle icon={Target}>Meta do grupo</GroupDetailSectionTitle>
        {canAddMeta && lista.length > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={onCreateGoal}
          >
            Nova meta
          </Button>
        ) : null}
      </header>

      {!lista.length ? (
        <EmptyState
          className="group-detail-card__empty"
          size="compact"
          bordered
          icon={<Target size={20} strokeWidth={1.75} />}
          title="Nenhuma meta compartilhada"
          description="Crie metas financeiras para o grupo arrecadar em conjunto."
          action={{
            label: 'Criar meta do grupo',
            variant: 'secondary',
            onClick: onCreateGoal,
            leftIcon: <Plus size={14} aria-hidden />,
          }}
        />
      ) : (
        <div className="group-detail-goal__list">
          {lista.map((item) => (
            <MetaBlock
              key={item.id}
              meta={item}
              membros={membros}
              onContribute={() => onContribute?.(item.id)}
              concluida={item.status === 'CONCLUIDA'}
            />
          ))}
        </div>
      )}

      {lista.length > 0 && !temAtiva ? (
        <p className="group-detail-goal__all-done">Todas as metas foram concluídas.</p>
      ) : null}
    </section>
  )
}
