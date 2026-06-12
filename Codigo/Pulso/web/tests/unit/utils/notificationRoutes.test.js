import { describe, expect, it } from 'vitest'
import { NOTIFICATION_TYPES } from '@/components/features/dashboard/NotificationPanel/notificationConfig.js'
import { resolveNotificationRoute } from '@/utils/notificationRoutes.js'

describe('resolveNotificationRoute', () => {
  it('retorna null para payload inválido ou tipo sem rota', () => {
    expect(resolveNotificationRoute(null)).toBeNull()
    expect(resolveNotificationRoute({ type: 'DESCONHECIDO' })).toBeNull()
  })

  it('usa rota padrão por tipo e adiciona query por metadata', () => {
    expect(
      resolveNotificationRoute({
        type: NOTIFICATION_TYPES.ALERTA_ORCAMENTO,
        metadata: { mesReferencia: '2026-05-08', categoriaId: 'cat-10' },
      })
    ).toBe('/budget?mes=2026-05&categoria=cat-10')
  })

  it('preserva query existente e sobrescreve chaves com metadata', () => {
    expect(
      resolveNotificationRoute({
        type: NOTIFICATION_TYPES.ALERTA_ORCAMENTO,
        linkAcao: '/budget?mes=2025-01&foo=1',
        metadata: { mesReferencia: '2026-06-01', categoriaId: 'cat-2' },
      })
    ).toBe('/budget?mes=2026-06&foo=1&categoria=cat-2')
  })

  it('inclui data no lembrete de vencimento quando formato for válido', () => {
    expect(
      resolveNotificationRoute({
        type: NOTIFICATION_TYPES.LEMBRETE_VENCIMENTO,
        metadata: { dataVencimento: '2026-06-21T10:00:00Z' },
      })
    ).toBe('/calendar?data=2026-06-21')
  })
})
