import { useState } from 'react'
import { Camera } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import { getInitials, stringToHue } from '../../../utils/stringToHue.js'
import { avatarVariants, avatarStatusVariants } from './Avatar.styles.jsx'

/**
 * Avatar — foto circular com fallback de iniciais, status e edição
 */
export const Avatar = ({
  src,
  name = '',
  size = 'md',
  status,
  fallback = 'primary',
  editable = false,
  onEdit,
  onEditClick,
  className,
  alt,
}) => {
  const [imgError, setImgError] = useState(false)
  const initials = getInitials(name)
  const showImage = src && !imgError

  const fallbackStyle =
    fallback === 'color' && name
      ? { backgroundColor: `hsl(${stringToHue(name)}, 55%, 42%)` }
      : undefined

  return (
    <div
      className={cn(avatarVariants({ size }), 'group', className)}
      title={name || undefined}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? name}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className={cn(
            'flex h-full w-full items-center justify-center font-semibold',
            fallback === 'primary'
              ? 'bg-[var(--ds-color-primary)] text-white'
              : 'text-white'
          )}
          style={fallbackStyle}
          aria-hidden={!name}
        >
          {initials || '?'}
        </span>
      )}

      {status && (
        <span
          className={avatarStatusVariants({ status, size })}
          aria-label={`Status: ${status}`}
        />
      )}

      {editable && (
        <button
          type="button"
          onClick={onEdit ?? onEditClick}
          className={cn(
            'ds-avatar-edit absolute flex items-center justify-center rounded-full',
            'bg-[var(--ds-color-primary)] text-white opacity-0 transition-opacity',
            'group-hover:opacity-100 focus-visible:opacity-100',
            size === 'xl' ? 'bottom-1 right-1 h-8 w-8' : 'bottom-0 right-0 h-6 w-6'
          )}
          aria-label="Editar foto"
        >
          <Camera size={size === 'xl' ? 16 : 12} />
        </button>
      )}
    </div>
  )
}
