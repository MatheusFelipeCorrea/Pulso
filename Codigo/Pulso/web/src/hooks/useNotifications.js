import { useCallback, useEffect, useRef, useState } from 'react'
import * as notificationService from '@/services/notificationService.js'

const POLL_MS = 30_000

export function useNotificationCount({ enabled = true } = {}) {
  const [quantidade, setQuantidade] = useState(0)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async (signal) => {
    if (!enabled) return
    try {
      const data = await notificationService.contarNaoLidas({ signal })
      setQuantidade(data.quantidade ?? 0)
    } catch (err) {
      if (signal?.aborted || err.code === 'ERR_CANCELED') return
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return undefined
    const controller = new AbortController()
    reload(controller.signal)
    const timer = window.setInterval(() => reload(controller.signal), POLL_MS)
    return () => {
      controller.abort()
      window.clearInterval(timer)
    }
  }, [enabled, reload])

  return { quantidade, loading, reload, setQuantidade }
}

export function useNotificationList({ enabled = true, lida = false, limite = 10 } = {}) {
  const [notificacoes, setNotificacoes] = useState([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async (signal) => {
    if (!enabled) return
    setLoading(true)
    try {
      const data = await notificationService.listarNotificacoes({ lida, limite }, { signal })
      setNotificacoes(
        data.map((item) => ({
          id: item.id,
          type: item.tipo,
          title: item.titulo,
          description: item.mensagem ?? '',
          timestamp: item.criadoEm,
          read: item.lida,
          linkAcao: item.linkAcao,
          metadata: item.metadados,
        }))
      )
    } catch (err) {
      if (signal?.aborted || err.code === 'ERR_CANCELED') return
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [enabled, lida, limite])

  useEffect(() => {
    if (!enabled) return undefined
    const controller = new AbortController()
    reload(controller.signal)
    return () => controller.abort()
  }, [enabled, reload])

  return { notificacoes, loading, reload, setNotificacoes }
}

export function useNotificationToasts({ enabled = true, onToast } = {}) {
  const lastPollRef = useRef(new Date().toISOString())

  useEffect(() => {
    if (!enabled || !onToast) return undefined

    let cancelled = false

    const poll = async () => {
      const since = lastPollRef.current
      lastPollRef.current = new Date().toISOString()

      try {
        const data = await notificationService.listarNotificacoes({ lida: false, limite: 10 })
        for (const item of data) {
          if (new Date(item.criadoEm) < new Date(since)) continue

          if (item.tipo === 'ALERTA_ORCAMENTO') {
            onToast({ variant: 'warning', title: item.titulo, message: item.mensagem })
          } else if (item.tipo === 'ORCAMENTO_ESTOURADO') {
            onToast({ variant: 'error', title: item.titulo, message: item.mensagem })
          }
        }
      } catch {
        /* ignore polling errors */
      }
    }

    const timer = window.setInterval(() => {
      if (!cancelled) poll()
    }, POLL_MS)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [enabled, onToast])
}
