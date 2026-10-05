import { Radio } from '@/design-system/components/forms/Radio/Radio.jsx'

export const GOAL_LINK_TABS = {
  EXISTING: 'existing',
  CREATE: 'create',
}

export function GoalLinkModeToggle({ value, onChange, existingSlot }) {
  const isExisting = value === GOAL_LINK_TABS.EXISTING

  return (
    <div className="pp-goal-link-radio" role="radiogroup" aria-label="Modo de vínculo">
      <div className="pp-goal-link-radio__option">
        <Radio
          name="goal-link-mode"
          value={GOAL_LINK_TABS.EXISTING}
          checked={isExisting}
          onChange={onChange}
          label="Vincular a meta existente"
        />
        {isExisting && existingSlot ? (
          <div className="pp-goal-link-radio__content">{existingSlot}</div>
        ) : null}
      </div>

      <Radio
        name="goal-link-mode"
        value={GOAL_LINK_TABS.CREATE}
        checked={!isExisting}
        onChange={onChange}
        label="Criar nova meta"
        description="Defina nome, valor e prazo para a nova meta."
      />
    </div>
  )
}
