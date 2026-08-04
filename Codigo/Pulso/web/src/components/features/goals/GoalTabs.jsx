import { Tabs } from '@/design-system/components/navigation/Tabs/Tabs.jsx'
import { GOAL_TABS } from '@/utils/goalFilters.js'

const TAB_KEYS = [
  { key: GOAL_TABS.TODAS, label: 'Todas', countKey: 'todas' },
  { key: GOAL_TABS.ATIVAS, label: 'Ativas', countKey: 'ativas' },
  { key: GOAL_TABS.PAUSADAS, label: 'Pausadas', countKey: 'pausadas' },
  { key: GOAL_TABS.CONCLUIDAS, label: 'Concluídas', countKey: 'concluidas' },
]

export function GoalTabs({ tabAtiva, onChangeTab, contadores }) {
  const tabs = TAB_KEYS.map(({ key, label, countKey }) => ({
    key,
    label,
    count: contadores?.[countKey] ?? 0,
  }))

  return (
    <Tabs
      tabs={tabs}
      activeKey={tabAtiva}
      onChange={onChangeTab}
      variant="underline"
      aria-label="Status das metas"
      className="goals-tabs"
    />
  )
}
