import { useCallback, useEffect, useRef, useState } from 'react'
import * as notificationService from '@/services/notificationService.js'

const POLL_MS = 30_000
const PAGE_SIZE = 20

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

export function useNotificationList({ enabled = true, lida = false, limite = PAGE_SIZE } = {}) {
  const [notificacoes, setNotificacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [pagina, setPagina] = useState(1)
  const [paginas, setPaginas] = useState(1)
  const [total, setTotal] = useState(0)

  const reload = useCallback(
    async (signal, { page = 1, append = false } = {}) => {
      if (!enabled) return
      if (append) setLoadingMore(true)
      else setLoading(true)

      try {
        const data = await notificationService.listarNotificacoes(
          { lida, limite, pagina: page },
          { signal }
        )

        setPagina(data.pagina)
        setPaginas(data.paginas)
        setTotal(data.total)

        setNotificacoes((prev) =>
          append ? [...prev, ...data.notificacoes] : data.notificacoes
        )
      } catch (err) {
        if (signal?.aborted || err.code === 'ERR_CANCELED') return
      } finally {
        if (!signal?.aborted) {
          setLoading(false)
          setLoadingMore(false)
        }
      }
    },
    [enabled, lida, limite]
  )

  const loadMore = useCallback(() => {
    if (loadingMore || pagina >= paginas) return
    reload(undefined, { page: pagina + 1, append: true })
  }, [loadingMore, pagina, paginas, reload])

  const reset = useCallback(() => {
    setPagina(1)
    setPaginas(1)
    setTotal(0)
    setNotificacoes([])
  }, [])

  useEffect(() => {
    if (!enabled) return undefined
    const controller = new AbortController()
    reset()
    reload(controller.signal, { page: 1, append: false })
    return () => controller.abort()
  }, [enabled, lida, limite, reload, reset])

  const hasMore = pagina < paginas

  return {
    notificacoes,
    loading,
    loadingMore,
    reload,
    loadMore,
    hasMore,
    total,
    setNotificacoes,
    reset,
  }
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
        const { notificacoes } = await notificationService.listarNotificacoes({
          lida: false,
          limite: PAGE_SIZE,
          pagina: 1,
        })

        for (const item of notificacoes) {
          if (new Date(item.timestamp) < new Date(since)) continue

          if (item.type === 'ALERTA_ORCAMENTO') {
            onToast({ variant: 'warning', title: item.title, message: item.description })
          } else if (item.type === 'ORCAMENTO_ESTOURADO') {
            onToast({ variant: 'error', title: item.title, message: item.description })
          } else if (item.type === 'RECEITA_REGISTRADA') {
            onToast({ variant: 'success', title: item.title, message: item.description })
          } else if (item.type === 'DESPESA_REGISTRADA') {
            onToast({ variant: 'info', title: item.title, message: item.description })
          } else if (item.type === 'META_ATINGIDA' || item.type === 'CONQUISTA') {
            onToast({ variant: 'success', title: item.title, message: item.description })
          } else if (item.type === 'STREAK' || item.type === 'INSIGHT_IA') {
            onToast({ variant: 'info', title: item.title, message: item.description })
          } else if (item.type === 'GRUPO_ATIVIDADE') {
            onToast({ variant: 'info', title: item.title, message: item.description })
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
