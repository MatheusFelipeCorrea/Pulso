import { cn } from '../../../../design-system/utils/cn.js'
import {
  getNotificationConfig,
  NOTIFICATION_DEFAULT_TITLES,
} from './notificationConfig.js'
import { formatNotificationTimestamp } from './formatNotificationTimestamp.js'

/**
 * @typedef {import('./notificationConfig.js').NotificationType} NotificationType
 * @typedef {{
 *   id: string,
 *   type: NotificationType,
 *   title?: string,
 *   description: string,
 *   timestamp: Date | string,
 *   read: boolean,
 *   linkAcao?: string | null,
 *   metadata?: object,
 * }} Notification
 */

export const NotificationItem = ({
  notification,
  onView,
  onMarkRead,
  markingRead = false,
}) => {
  const config = getNotificationConfig(notification.type)
  const Icon = config.icon
  const title =
    notification.title ??
    NOTIFICATION_DEFAULT_TITLES[notification.type] ??
    notification.type

  return (
    <article
      className={cn(
        'pulso-notification-item',
        !notification.read && 'pulso-notification-item--unread'
      )}
      style={{ '--pulso-notification-color': `var(${config.colorVar})` }}
      aria-label={`${title}. ${notification.description}`}
    >
      <div className="pulso-notification-item__icon-wrap" aria-hidden="true">
        <Icon size={20} strokeWidth={2} />
      </div>

      <div className="pulso-notification-item__content">
        <div className="pulso-notification-item__body">
          <span className="pulso-notification-item__title">{title}</span>
          <span className="pulso-notification-item__description">
            {notification.description}
          </span>
        </div>

        <div className="pulso-notification-item__footer">
          <div className="pulso-notification-item__actions">
            <button
              type="button"
              className="pulso-notification-item__action pulso-notification-item__action--primary"
              onClick={() => onView?.(notification)}
            >
              Ver
            </button>
            {!notification.read ? (
              <button
                type="button"
                className="pulso-notification-item__action"
                disabled={markingRead}
                onClick={() => onMarkRead?.(notification.id)}
              >
                Marcar como lida
              </button>
            ) : null}
          </div>

          <time
            className="pulso-notification-item__time"
            dateTime={
              notification.timestamp instanceof Date
                ? notification.timestamp.toISOString()
                : String(notification.timestamp)
            }
          >
            {formatNotificationTimestamp(notification.timestamp)}
          </time>
        </div>
      </div>
    </article>
  )
}
