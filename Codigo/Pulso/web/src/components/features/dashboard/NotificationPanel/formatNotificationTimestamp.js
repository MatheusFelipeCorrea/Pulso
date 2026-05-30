import { formatDateRelative } from '../../../../design-system/utils/formatDate.js'

/**
 * Timestamp relativo para o painel de notificações (protótipo Pulso).
 * Ex.: "Agora", "Há 2 min", "Hoje", "Ontem"
 */
export function formatNotificationTimestamp(date) {
  if (!date) return '—'

  const dateObj =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) return '—'

  const now = new Date()
  const diffMs = now - dateObj
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfNotif = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate()
  )
  const dayDiff = Math.floor((startOfToday - startOfNotif) / (1000 * 60 * 60 * 24))

  if (diffMin < 1) return 'Agora'
  if (diffMin < 60) return `Há ${diffMin} min`
  if (dayDiff === 0 && diffHours < 24) return 'Hoje'
  if (dayDiff === 1) return 'Ontem'

  const relative = formatDateRelative(dateObj)
  if (relative === 'hoje') return 'Hoje'
  if (relative === 'ontem') return 'Ontem'

  return relative.charAt(0).toUpperCase() + relative.slice(1)
}
