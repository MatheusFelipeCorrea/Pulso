import { useEffect, useRef } from 'react'
import * as syncService from '@/services/syncService.js'

const SYNC_INTERVAL_MS = 20 * 60 * 1000
const STORAGE_KEY = 'pulso:lastUserSync'

/**
 * Dispara verificações leves no backend (ex.: alertas de orçamento) quando o usuário
 * usa o app — complemento ao cron diário no plano Hobby da Vercel.
 */
export function useUserSync() {
  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    const last = Number(sessionStorage.getItem(STORAGE_KEY) || 0)
    if (Date.now() - last < SYNC_INTERVAL_MS) return

    syncService
      .syncPendingJobs()
      .then(() => {
        sessionStorage.setItem(STORAGE_KEY, String(Date.now()))
      })
      .catch(() => {
        /* silencioso — não bloqueia UX */
      })
  }, [])
}
