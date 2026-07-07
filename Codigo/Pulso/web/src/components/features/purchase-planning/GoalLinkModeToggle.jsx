import { Link2, Plus } from 'lucide-react'
import { cn } from '@/design-system/utils/cn.js'

export const GOAL_LINK_TABS = {
  EXISTING: 'existing',
  CREATE: 'create',
}

export function GoalLinkModeToggle({ value, onChange }) {
  const isExisting = value === GOAL_LINK_TABS.EXISTING

  return (
    <div className="pp-goal-link-tabs" role="tablist" aria-label="Modo de vínculo">
      <button
        type="button"
        role="tab"
        aria-selected={isExisting}
        className={cn('pp-goal-link-tabs__btn', isExisting && 'is-active')}
        onClick={() => onChange(GOAL_LINK_TABS.EXISTING)}
      >
        <Link2 size={16} aria-hidden />
        Vincular existente
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={!isExisting}
        className={cn('pp-goal-link-tabs__btn', !isExisting && 'is-active')}
        onClick={() => onChange(GOAL_LINK_TABS.CREATE)}
      >
        <Plus size={16} aria-hidden />
        Criar nova meta
      </button>
    </div>
  )
}
