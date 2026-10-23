import { Tabs } from '@/design-system/components/navigation/Tabs/Tabs.jsx'
import { DEBT_TABS } from '@/utils/debtFilters.js'

const TAB_KEYS = [
  { key: DEBT_TABS.ME_DEVEM, label: 'Me devem', countKey: 'meDevem' },
  { key: DEBT_TABS.EU_DEVO, label: 'Eu devo', countKey: 'euDevo' },
  { key: DEBT_TABS.QUITADAS, label: 'Quitadas', countKey: 'quitadas' },
]

export function DebtTabs({ tabAtiva, onChangeTab, contadores }) {
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
      aria-label="Categorias de dívidas"
      className="debts-tabs"
    />
  )
}
