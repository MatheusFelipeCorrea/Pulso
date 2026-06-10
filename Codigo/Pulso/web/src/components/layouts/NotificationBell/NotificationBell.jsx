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
  const rootRef = useRef(null)

  const { quantidade, reload: reloadCount, setQuantidade } = useNotificationCount()
  const { notificacoes, loading, reload: reloadList } = useNotificationList({
    enabled: open,
    lida: false,
    limite: 10,
  })

  const handleNotificationToast = useCallback(({ variant, title, message }) => {
    if (variant === 'warning') toastRef.current.warning(message ?? title)
    else if (variant === 'error') toastRef.current.error(message ?? title)
  }, [])

  useNotificationToasts({ onToast: handleNotificationToast })

  useEffect(() => {
    if (!open) return undefined

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleToggle = () => {
    setOpen((value) => !value)
    if (!open) reloadList()
  }

  const handleMarkRead = async (id) => {
    if (!id || markingReadId) return
    setMarkingReadId(id)
    try {
      await notificationService.marcarComoLida(id)
      setQuantidade((prev) => Math.max(0, prev - 1))
      await reloadList()
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
      } catch (err) {
        toast.error(err.response?.data?.message ?? 'Erro ao marcar notificação')
        return
      }
    }

    setOpen(false)
    const route = resolveNotificationRoute(notification)
    if (route) navigate(route)
  }

  const handleMarkAll = async () => {
    try {
      await notificationService.marcarTodasLidas()
      setQuantidade(0)
      reloadList()
      reloadCount()
      toast.success('Todas as notificações foram marcadas como lidas')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao marcar notificações')
    }
  }

  return (
    <div className="notification-bell" ref={rootRef}>
      <div className="notification-bell__trigger">
        <IconButton
          variant="ghost"
          size="md"
          ariaLabel="Notificações"
          icon={<Bell size={20} />}
          onClick={handleToggle}
        />
        {quantidade > 0 ? (
          <span className="notification-bell__badge" aria-label={`${quantidade} não lidas`}>
            {quantidade > 9 ? '9+' : quantidade}
          </span>
        ) : null}
      </div>

      {open ? (
        <div className="notification-bell__dropdown">
          <NotificationPanel
            notifications={notificacoes}
            loading={loading}
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
