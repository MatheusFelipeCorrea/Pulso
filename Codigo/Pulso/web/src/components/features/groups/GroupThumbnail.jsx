import { useEffect, useState } from 'react'
import { Camera, Users } from 'lucide-react'
import { groupAccentFromName } from '@/utils/groupInvite.js'

export function GroupThumbnail({
  nome,
  src = null,
  className = '',
  size = 'md',
  editable = false,
  onEdit,
}) {
  const [from, to] = groupAccentFromName(nome)
  const isSm = size === 'sm'
  const isLg = size === 'lg'
  const [imgError, setImgError] = useState(false)
  const showImage = Boolean(src) && !imgError

  useEffect(() => {
    setImgError(false)
  }, [src])

  const dimensions = isSm
    ? { width: '52px', height: '52px', minHeight: '52px' }
    : isLg
      ? { width: '100%', height: '180px', minHeight: '180px' }
      : { width: '100%', height: '100%', minHeight: '96px' }

  return (
    <div
      className={`group-thumbnail${editable ? ' group-thumbnail--editable' : ''} ${className}`.trim()}
      style={{
        background: showImage ? 'var(--ds-color-surface-elevated)' : `linear-gradient(145deg, ${from}, ${to})`,
        ...dimensions,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          className="group-thumbnail__image"
          onError={() => setImgError(true)}
        />
      ) : (
        <Users
          size={isSm ? 22 : isLg ? 32 : 28}
          className={isSm ? undefined : 'group-card__media-icon'}
          aria-hidden
        />
      )}

      {editable ? (
        <button
          type="button"
          className="group-thumbnail__edit"
          aria-label="Alterar imagem do grupo"
          onClick={onEdit}
        >
          <Camera size={isSm ? 14 : 16} aria-hidden />
        </button>
      ) : null}
    </div>
  )
}
