import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/notificationService.js', () => ({
  contarNaoLidas: vi.fn(),
  listarNotificacoes: vi.fn(),
}))

import * as notificationService from '@/services/notificationService.js'
import {
  useNotificationCount,
  useNotificationList,
  useNotificationToasts,
} from '@/hooks/useNotifications.js'

describe('hooks/useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    notificationService.contarNaoLidas.mockReset()
    notificationService.listarNotificacoes.mockReset()
  })

  it('carrega contador e faz polling periódico', async () => {
    let intervalCallback
    vi.spyOn(window, 'setInterval').mockImplementation((callback) => {
      intervalCallback = callback
      return 1
    })
    vi.spyOn(window, 'clearInterval').mockImplementation(() => {})
    notificationService.contarNaoLidas.mockResolvedValue({ quantidade: 3 })
    const { result } = renderHook(() => useNotificationCount(), { reactStrictMode: false })
    await act(async () => {
      await result.current.reload()
    })

    await waitFor(() => {
      expect(result.current.quantidade).toBe(3)
    })

    await act(async () => {
      await intervalCallback()
    })
    expect(notificationService.contarNaoLidas).toHaveBeenCalledTimes(2)
  })

  it('mapeia lista de notificações para formato do app', async () => {
    notificationService.listarNotificacoes.mockResolvedValue([
      {
        id: 'n1',
        tipo: 'ALERTA_ORCAMENTO',
        titulo: 'Orçamento',
        mensagem: 'Quase no limite',
        criadoEm: '2026-06-12T10:00:00.000Z',
        lida: false,
        linkAcao: '/orcamentos',
        metadados: { categoriaId: 'c1' },
      },
    ])

    const { result } = renderHook(() => useNotificationList({ lida: false, limite: 5 }), {
      reactStrictMode: false,
    })
    await act(async () => {
      await result.current.reload()
    })

    await waitFor(() => {
      expect(result.current.notificacoes).toHaveLength(1)
    })

    expect(result.current.notificacoes[0]).toEqual({
      id: 'n1',
      type: 'ALERTA_ORCAMENTO',
      title: 'Orçamento',
      description: 'Quase no limite',
      timestamp: '2026-06-12T10:00:00.000Z',
      read: false,
      linkAcao: '/orcamentos',
      metadata: { categoriaId: 'c1' },
    })
  })

  it('gera toasts para tipos suportados', async () => {
    let intervalCallback
    vi.spyOn(window, 'setInterval').mockImplementation((callback) => {
      intervalCallback = callback
      return 1
    })
    vi.spyOn(window, 'clearInterval').mockImplementation(() => {})

    const onToast = vi.fn()
    const now = new Date()
    const futureIso = new Date(now.getTime() + 2000).toISOString()

    notificationService.listarNotificacoes.mockResolvedValue([
      {
        id: 'n1',
        tipo: 'ALERTA_ORCAMENTO',
        titulo: 'Alerta',
        mensagem: 'Atenção',
        criadoEm: futureIso,
      },
      {
        id: 'n2',
        tipo: 'ORCAMENTO_ESTOURADO',
        titulo: 'Estourou',
        mensagem: 'Passou do limite',
        criadoEm: futureIso,
      },
      {
        id: 'n3',
        tipo: 'OUTRO',
        titulo: 'Outro',
        mensagem: 'Sem toast',
        criadoEm: futureIso,
      },
    ])

    renderHook(() => useNotificationToasts({ onToast }), { reactStrictMode: false })
    await act(async () => {
      await intervalCallback()
    })

    expect(onToast).toHaveBeenCalledTimes(2)
    expect(onToast).toHaveBeenNthCalledWith(1, {
      variant: 'warning',
      title: 'Alerta',
      message: 'Atenção',
    })
    expect(onToast).toHaveBeenNthCalledWith(2, {
      variant: 'error',
      title: 'Estourou',
      message: 'Passou do limite',
    })
  })

  it('ignora erros cancelados no contador e na lista', async () => {
    notificationService.contarNaoLidas.mockRejectedValueOnce({ code: 'ERR_CANCELED' })
    notificationService.listarNotificacoes.mockRejectedValueOnce({ code: 'ERR_CANCELED' })

    const countHook = renderHook(() => useNotificationCount(), { reactStrictMode: false })
    const listHook = renderHook(() => useNotificationList(), { reactStrictMode: false })

    await act(async () => {
      await countHook.result.current.reload()
      await listHook.result.current.reload()
    })

    expect(countHook.result.current.quantidade).toBe(0)
    expect(listHook.result.current.notificacoes).toEqual([])
  })

  it('não carrega quando hooks estão desabilitados', async () => {
    renderHook(() => useNotificationCount({ enabled: false }), { reactStrictMode: false })
    renderHook(() => useNotificationList({ enabled: false }), { reactStrictMode: false })
    renderHook(() => useNotificationToasts({ enabled: false, onToast: vi.fn() }), {
      reactStrictMode: false,
    })

    await waitFor(() => {
      expect(notificationService.contarNaoLidas).not.toHaveBeenCalled()
      expect(notificationService.listarNotificacoes).not.toHaveBeenCalled()
    })
  })
})
