import { Plus, Target } from 'lucide-react'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { GOAL_TABS } from '@/utils/goalFilters.js'
import { GoalCard } from './GoalCard.jsx'

const EMPTY_TITLES = {
  [GOAL_TABS.TODAS]: 'Nenhuma meta cadastrada',
  [GOAL_TABS.ATIVAS]: 'Nenhuma meta ativa',
  [GOAL_TABS.PAUSADAS]: 'Nenhuma meta pausada',
  [GOAL_TABS.CONCLUIDAS]: 'Nenhuma meta concluída',
}

export function GoalList({
  metas,
  loading,
  tabAtiva,
  onNew,
  onContribution,
  onEdit,
  onPause,
  onResume,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="goals-list goals-list--loading">
        <SpinnerDots center label="Carregando metas..." />
      </div>
    )
  }

  if (!metas?.length) {
    return (
      <EmptyState
        className="goals-list__empty"
        icon={<Target size={28} />}
        title={EMPTY_TITLES[tabAtiva] ?? 'Nenhuma meta encontrada'}
        description="Crie metas financeiras para acompanhar seus sonhos e objetivos."
        action={{
          label: 'Criar meta',
          onClick: onNew,
          leftIcon: <Plus size={16} />,
        }}
      />
    )
  }

  return (
    <ul className="goals-list" role="list">
      {metas.map((meta) => (
        <GoalCard
          key={meta.id}
          meta={meta}
          onContribution={onContribution}
          onEdit={onEdit}
          onPause={onPause}
          onResume={onResume}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
