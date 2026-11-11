import { describe, expect, it } from 'vitest'

import { NOTIFICATION_TYPES } from '@/components/features/dashboard/NotificationPanel/notificationConfig.js'
import { resolveNotificationRoute } from '@/utils/notificationRoutes.js'

describe('utils/notificationRoutes', () => {
    it('retorna null sem notificação', () => {
        expect(resolveNotificationRoute(null)).toBeNull()
    })

    it('usa linkAcao quando presente', () => {
        expect(
            resolveNotificationRoute({
                type: NOTIFICATION_TYPES.DESPESA_REGISTRADA,
                linkAcao: '/budget',
            })
        ).toBe('/budget')
    })

    it('usa rota padrão por tipo', () => {
        expect(
            resolveNotificationRoute({
                type: NOTIFICATION_TYPES.META_ATINGIDA,
            })
        ).toBe('/goals')
    })

    it('anexa mes e categoria em alerta de orçamento', () => {
        const route = resolveNotificationRoute({
            type: NOTIFICATION_TYPES.ALERTA_ORCAMENTO,
            linkAcao: '/budget',
            metadata: {
                mesReferencia: '2026-11-01',
                categoriaId: 'cat-1',
            },
        })
        expect(route).toContain('/budget?')
        expect(route).toContain('mes=2026-11')
        expect(route).toContain('categoria=cat-1')
    })

    it('anexa data em lembrete', () => {
        const route = resolveNotificationRoute({
            type: NOTIFICATION_TYPES.LEMBRETE_VENCIMENTO,
            metadata: { dataVencimento: '2026-11-20T12:00:00.000Z' },
        })
        expect(route).toBe('/calendar?data=2026-11-20')
    })
})
