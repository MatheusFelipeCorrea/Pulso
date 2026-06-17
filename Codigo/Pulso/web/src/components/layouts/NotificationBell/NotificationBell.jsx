import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { NotificationPanel } from '@/components/features/dashboard/NotificationPanel/NotificationPanel.jsx'
import {
  useNotificationCount,
  useNotificationList,
  useNotificationToasts,
} from '@/hooks/useNotifications.js'
import * as notificationService from '@/services/notificationService.js'
import { resolveNotificationRoute } from '@/utils/notificationRoutes.js'

export function NotificationBell() {
  const navigate = useNavigate()
  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast
  const [open, setOpen] = useState(false)
  const [markingReadId, setMarkingReadId] = useState(null)
  const [liveMessage, setLiveMessage] = useState('')
  const rootRef = useRef(null)
  const panelRef = useRef(null)
  const triggerRef = useRef(null)

  const { quantidade, reload: reloadCount, setQuantidade } = useNotificationCount()
  const {
    notificacoes,
    loading,
    loadingMore,
    reload: reloadList,
    loadMore,
    hasMore,
    total,
    setNotificacoes,
    reset,
  } = useNotificationList({
    enabled: open,
    lida: false,
    limite: 20,
  })

  const handleNotificationToast = useCallback(({ variant, title, message }) => {
    const text = message ?? title
    setLiveMessage(text)
    if (variant === 'warning') toastRef.current.warning(text)
    else if (variant === 'error') toastRef.current.error(text)
    else if (variant === 'success') toastRef.current.success(text)
    else toastRef.current.info(text)
  }, [])

  useNotificationToasts({ onToast: handleNotificationToast })

  useEffect(() => {
    if (!open) return undefined

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    panelRef.current?.focus()

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const handleToggle = () => {
    setOpen((value) => {
      const next = !value
      if (next) reloadList()
      else reset()
      return next
    })
  }

  const handleMarkRead = async (id) => {
    if (!id || markingReadId) return
    setMarkingReadId(id)
    try {
      await notificationService.marcarComoLida(id)
      setQuantidade((prev) => Math.max(0, prev - 1))
      setNotificacoes((prev) => prev.filter((n) => n.id !== id))
      reloadCount()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao marcar notificação')
    } finally {
      setMarkingReadId(null)
    }
  }

  const handleView = async (notification) => {
    if (!notification.read) {
      try {
        await notificationService.marcarComoLida(notification.id)
        setQuantidade((prev) => Math.max(0, prev - 1))
        setNotificacoes((prev) => prev.filter((n) => n.id !== notification.id))
      } catch (err) {
        toast.error(err.response?.data?.message ?? 'Erro ao marcar notificação')
        return
      }
    }

    setOpen(false)
    reset()
    const route = resolveNotificationRoute(notification)
    if (route) navigate(route)
  }

  const handleMarkAll = async () => {
    try {
      await notificationService.marcarTodasLidas()
      setQuantidade(0)
      setNotificacoes([])
      reset()
      reloadCount()
      toast.success('Todas as notificações foram marcadas como lidas')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao marcar notificações')
    }
  }

  return (
    <div className="notification-bell" ref={rootRef}>
      <div className="notification-bell__live" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>

      <div className="notification-bell__trigger">
        <IconButton
          ref={triggerRef}
          variant="ghost"
          size="md"
          ariaLabel={`Notificações${quantidade > 0 ? `, ${quantidade} não lidas` : ''}`}
          aria-expanded={open}
          aria-haspopup="dialog"
          icon={<Bell size={20} />}
          onClick={handleToggle}
        />
        {quantidade > 0 ? (
          <span className="notification-bell__badge" aria-hidden="true">
            {quantidade > 9 ? '9+' : quantidade}
          </span>
        ) : null}
      </div>

      {open ? (
        <div
          ref={panelRef}
          className="notification-bell__dropdown"
          role="dialog"
          aria-label="Painel de notificações"
          tabIndex={-1}
        >
          <NotificationPanel
            notifications={notificacoes}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            total={total}
            onLoadMore={loadMore}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAll}
            onView={handleView}
            markingReadId={markingReadId}
            className="notification-bell__panel"
          />
        </div>
      ) : null}
    </div>
  )
}
