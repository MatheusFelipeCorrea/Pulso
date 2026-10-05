import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, ImagePlus, X } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { GroupThumbnail } from '@/components/features/groups/GroupThumbnail.jsx'

const ACCEPT = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'
const MAX_BYTES = 2 * 1024 * 1024

function validateImageFile(file) {
  if (!file) return 'Selecione uma imagem.'
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    return 'Use JPG, PNG ou WEBP.'
  }
  if (file.size > MAX_BYTES) {
    return 'A imagem deve ter no máximo 2 MB.'
  }
  return null
}

export function GroupImagePicker({
  nome = 'Grupo',
  previewUrl = null,
  file = null,
  onFileChange,
  helperText,
  size = 'lg',
  className = '',
}) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [objectUrl, setObjectUrl] = useState(null)

  useEffect(() => {
    if (!file) {
      setObjectUrl(null)
      return undefined
    }
    const url = URL.createObjectURL(file)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const displayUrl = objectUrl || previewUrl

  const handleSelect = useCallback(
    (selected) => {
      const validationError = validateImageFile(selected)
      if (validationError) {
        setError(validationError)
        onFileChange?.(null)
        return
      }
      setError('')
      onFileChange?.(selected)
    },
    [onFileChange]
  )

  const handleInputChange = (event) => {
    const selected = event.target.files?.[0] ?? null
    handleSelect(selected)
    event.target.value = ''
  }

  const handleClear = () => {
    setError('')
    onFileChange?.(null)
  }

  return (
    <div className={`group-image-picker ${className}`.trim()}>
      <div className="group-image-picker__preview-wrap">
        <GroupThumbnail nome={nome} src={displayUrl} size={size} className="group-image-picker__preview" />
        {file ? (
          <button
            type="button"
            className="group-image-picker__clear"
            aria-label="Remover imagem selecionada"
            onClick={handleClear}
          >
            <X size={14} aria-hidden />
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="group-image-picker__input"
        onChange={handleInputChange}
        aria-hidden
        tabIndex={-1}
      />

      <div className="group-image-picker__actions">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          leftIcon={<ImagePlus size={14} aria-hidden />}
          onClick={() => inputRef.current?.click()}
        >
          Escolher da galeria
        </Button>
        {file ? (
          <span className="group-image-picker__filename">{file.name}</span>
        ) : (
          <span className="group-image-picker__hint-inline">
            <Camera size={14} aria-hidden />
            JPG, PNG ou WEBP · até 2 MB
          </span>
        )}
      </div>

      {helperText ? <p className="group-image-picker__helper">{helperText}</p> : null}
      {error ? <p className="group-image-picker__error">{error}</p> : null}
    </div>
  )
}

export { validateImageFile, ACCEPT as GROUP_IMAGE_ACCEPT, MAX_BYTES as GROUP_IMAGE_MAX_BYTES }
