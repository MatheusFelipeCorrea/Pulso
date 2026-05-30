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
 *   metadata?: object,
 * }} Notification
 */

export const NotificationItem = ({
  notification,
  onRead,
  onClick,
}) => {
  const config = getNotificationConfig(notification.type)
  const Icon = config.icon
  const title =
    notification.title ??
    NOTIFICATION_DEFAULT_TITLES[notification.type] ??
    notification.type

  const handleClick = () => {
    if (!notification.read && onRead) {
      onRead(notification.id)
    }
    onClick?.(notification)
  }

  return (
    <button
      type="button"
      className={cn(
        'pulso-notification-item',
        !notification.read && 'pulso-notification-item--unread'
      )}
      style={{ '--pulso-notification-color': `var(${config.colorVar})` }}
      onClick={handleClick}
      aria-label={`${title}. ${notification.description}`}
    >
      <div className="pulso-notification-item__icon-wrap" aria-hidden="true">
        <Icon size={20} strokeWidth={2} />
      </div>

      <div className="pulso-notification-item__body">
        <span className="pulso-notification-item__title">{title}</span>
        <span className="pulso-notification-item__description">
          {notification.description}
        </span>
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
    </button>
  )
}
