import { Bell, Check } from 'lucide-react'
import { cn } from '../../../../design-system/utils/cn.js'
import { EmptyState } from '../../../../design-system/components/feedback/EmptyState/EmptyState.jsx'
import { Skeleton } from '../../../../design-system/components/feedback/Skeleton/Skeleton.jsx'
import { NotificationItem } from './NotificationItem.jsx'

/**
 * NotificationPanel — lista de notificações do Pulso (13 tipos)
 *
 * @param {object} props
 * @param {import('./NotificationItem.jsx').Notification[]} [props.notifications=[]]
 * @param {function} [props.onMarkAllRead]
 * @param {(id: string) => void} [props.onRead]
 * @param {(notification: import('./NotificationItem.jsx').Notification) => void} [props.onNotificationClick]
 * @param {boolean} [props.loading]
 * @param {string} [props.className]
 */
export const NotificationPanel = ({
  notifications = [],
  onMarkAllRead,
  onRead,
  onNotificationClick,
  loading = false,
  className,
}) => {
  const hasUnread = notifications.some((n) => !n.read)
  const isEmpty = !loading && notifications.length === 0

  return (
    <section className={cn('pulso-notification-panel', className)} aria-label="Notificações">
      <header className="pulso-notification-panel__header">
        <div className="pulso-notification-panel__title">
          <Bell size={20} className="pulso-notification-panel__title-icon" aria-hidden="true" />
          <span>Notificações</span>
        </div>

        {notifications.length > 0 && (
          <button
            type="button"
            className="pulso-notification-panel__mark-all"
            onClick={onMarkAllRead}
            disabled={!hasUnread || loading}
          >
            <Check size={14} strokeWidth={2.5} aria-hidden="true" />
            Marcar todas como lidas
          </button>
        )}
      </header>

      {loading && (
        <div className="pulso-notification-panel__loading" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="text" height={64} />
          ))}
        </div>
      )}

      {!loading && isEmpty && (
        <div className="pulso-notification-panel__empty">
          <EmptyState
            icon={<Bell strokeWidth={1.5} />}
            title="Nenhuma notificação"
            description="Você está em dia com tudo!"
          />
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <div className="pulso-notification-panel__list" role="list">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={onRead}
              onClick={onNotificationClick}
            />
          ))}
        </div>
      )}
    </section>
  )
}
