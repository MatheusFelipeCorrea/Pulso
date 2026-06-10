import { NOTIFICATION_TYPES } from '@/components/features/dashboard/NotificationPanel/notificationConfig.js'

/** Rota padrão por tipo quando `linkAcao` não vier da API */
const ROUTE_BY_TYPE = {
  [NOTIFICATION_TYPES.RECEITA_REGISTRADA]: '/transactions',
  [NOTIFICATION_TYPES.DESPESA_REGISTRADA]: '/transactions',
  [NOTIFICATION_TYPES.META_ATINGIDA]: '/goals',
  [NOTIFICATION_TYPES.ALERTA_ORCAMENTO]: '/budget',
  [NOTIFICATION_TYPES.ORCAMENTO_ESTOURADO]: '/budget',
  [NOTIFICATION_TYPES.LEMBRETE_VENCIMENTO]: '/calendar',
  [NOTIFICATION_TYPES.STREAK]: '/achievements',
  [NOTIFICATION_TYPES.CONQUISTA]: '/achievements',
  [NOTIFICATION_TYPES.GRUPO_ATIVIDADE]: '/groups',
  [NOTIFICATION_TYPES.DIVIDA_COBRANCA]: '/debts',
  [NOTIFICATION_TYPES.INSIGHT_IA]: '/insights',
  [NOTIFICATION_TYPES.ACAO_CONCLUIDA]: '/dashboard',
  [NOTIFICATION_TYPES.ERRO]: '/dashboard',
}

function mesReferenciaToPeriodo(mesReferencia) {
  if (!mesReferencia || typeof mesReferencia !== 'string') return null
  const match = mesReferencia.match(/^(\d{4})-(\d{2})/)
  if (!match) return null
  return `${match[1]}-${match[2]}`
}

function buildSearchParams(notification) {
  const meta = notification.metadata ?? {}
  const params = new URLSearchParams()

  const mes = mesReferenciaToPeriodo(meta.mesReferencia)
  if (mes) params.set('mes', mes)

  if (
    (notification.type === NOTIFICATION_TYPES.ALERTA_ORCAMENTO ||
      notification.type === NOTIFICATION_TYPES.ORCAMENTO_ESTOURADO) &&
    meta.categoriaId
  ) {
    params.set('categoria', meta.categoriaId)
  }

  if (notification.type === NOTIFICATION_TYPES.LEMBRETE_VENCIMENTO && meta.dataVencimento) {
    const data = String(meta.dataVencimento).slice(0, 10)
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) params.set('data', data)
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}

/**
 * Resolve a rota de destino ao clicar em uma notificação.
 * @param {{ type?: string, linkAcao?: string | null, metadata?: object }} notification
 * @returns {string | null}
 */
export function resolveNotificationRoute(notification) {
  if (!notification) return null

  const basePath =
    notification.linkAcao?.trim() || ROUTE_BY_TYPE[notification.type] || null
  if (!basePath) return null

  const [pathname, existingQuery = ''] = basePath.split('?')
  const extraQuery = buildSearchParams(notification)

  if (!extraQuery) {
    return existingQuery ? `${pathname}?${existingQuery}` : pathname
  }

  if (!existingQuery) return `${pathname}${extraQuery}`

  const merged = new URLSearchParams(existingQuery)
  new URLSearchParams(extraQuery.slice(1)).forEach((value, key) => {
    merged.set(key, value)
  })
  return `${pathname}?${merged.toString()}`
}
