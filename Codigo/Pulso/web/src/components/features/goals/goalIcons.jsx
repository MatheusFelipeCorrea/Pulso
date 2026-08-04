import { getGoalIcon } from '@/utils/goalIconRules.js'

export { getGoalIcon } from '@/utils/goalIconRules.js'

export function GoalIcon({ nome, status, className = '' }) {
  const Icon = getGoalIcon(nome)
  const tone =
    status === 'CONCLUIDA' ? 'success' : status === 'PAUSADA' ? 'warning' : 'primary'

  return (
    <span className={`goal-icon goal-icon--${tone} ${className}`.trim()} aria-hidden>
      <Icon size={20} />
    </span>
  )
}
