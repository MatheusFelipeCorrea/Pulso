import { Tabs } from '@/design-system/components/navigation/Tabs/Tabs.jsx'
import { DEBT_TABS } from '@/utils/debtFilters.js'

const TABS = [
  { key: DEBT_TABS.ME_DEVEM, label: 'Me devem' },
  { key: DEBT_TABS.EU_DEVO, label: 'Eu devo' },
  { key: DEBT_TABS.QUITADAS, label: 'Quitadas' },
]

export function DebtTabs({ tabAtiva, onChangeTab }) {
  return (
    <Tabs
      tabs={TABS}
      activeKey={tabAtiva}
      onChange={onChangeTab}
      variant="underline"
      aria-label="Categorias de dívidas"
      className="debts-tabs"
    />
  )
}
