import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, ImagePlus, Loader2, Search, X } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { getCategoryIconConfig } from '@/utils/purchasePlanningUtils.js'
import {
  GROUP_IMAGE_ACCEPT,
  GROUP_IMAGE_MAX_BYTES,
  validateImageFile,
} from '@/components/features/groups/GroupImagePicker.jsx'

export { GROUP_IMAGE_ACCEPT as PURCHASE_IMAGE_ACCEPT, GROUP_IMAGE_MAX_BYTES as PURCHASE_IMAGE_MAX_BYTES }

export function PurchaseItemImagePicker({
  nome = 'Item',
  categoria = 'OUTROS',
  imagemUrl = '',
  onImagemUrlChange,
  file = null,
  onFileChange,
  onBuscarImagem,
  buscando = false,
  fonte = null,
  className = '',
}) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [objectUrl, setObjectUrl] = useState(null)
  const [previewError, setPreviewError] = useState(false)
  const categoryConfig = getCategoryIconConfig(categoria)

  useEffect(() => {
    if (!file) {
      setObjectUrl(null)
      return undefined
    }
    const url = URL.createObjectURL(file)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    setPreviewError(false)
  }, [imagemUrl, objectUrl])

  const displayUrl = objectUrl || (previewError ? null : imagemUrl?.trim() || null)

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
      onImagemUrlChange?.('')
    },
    [onFileChange, onImagemUrlChange]
  )

  const handleInputChange = (event) => {
    const selected = event.target.files?.[0] ?? null
    handleSelect(selected)
    event.target.value = ''
  }

  const handleClear = () => {
    setError('')
    onFileChange?.(null)
    onImagemUrlChange?.('')
  }

  const fonteLabel =
    fonte === 'link_produto'
      ? 'Imagem encontrada no link da loja'
      : fonte === 'url_direta'
        ? 'URL de imagem'
        : fonte === 'pagina_imagem'
          ? 'Imagem extraída da página'
          : fonte === 'busca_internet'
            ? 'Imagem sugerida da internet'
            : null

  return (
    <div className={`pp-image-picker ${className}`.trim()}>
      <div className="pp-image-picker__preview-wrap">
        <div
          className="pp-image-picker__preview"
          style={{
            background: displayUrl
              ? 'var(--ds-color-surface)'
              : `linear-gradient(160deg, color-mix(in srgb, ${categoryConfig.color} 22%, var(--ds-color-surface-elevated)), color-mix(in srgb, ${categoryConfig.color} 8%, var(--ds-color-surface)))`,
          }}
        >
          {displayUrl ? (
            <img
              src={displayUrl}
              alt=""
              onError={() => setPreviewError(true)}
            />
          ) : (
            resolveBadgeIcon(categoryConfig.icon, { size: 36 })
          )}
        </div>
        {(file || imagemUrl) && !buscando ? (
          <button
            type="button"
            className="pp-image-picker__clear"
            aria-label="Remover imagem"
            onClick={handleClear}
          >
            <X size={14} aria-hidden />
          </button>
        ) : null}
        {buscando ? (
          <span className="pp-image-picker__loading" aria-live="polite">
            <Loader2 size={18} className="pp-image-picker__spinner" aria-hidden />
          </span>
        ) : null}
      </div>

      <div className="pp-image-picker__fields">
        <InputText
          label="URL da imagem (opcional)"
          value={imagemUrl}
          onChange={(event) => {
            onFileChange?.(null)
            onImagemUrlChange?.(event.target.value)
          }}
          placeholder="https://.../foto.jpg"
          type="url"
        />

        <div className="pp-image-picker__actions">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<Search size={14} />}
            loading={buscando}
            onClick={() => onBuscarImagem?.()}
          >
            Buscar imagem
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<ImagePlus size={14} />}
            onClick={() => inputRef.current?.click()}
          >
            Galeria
          </Button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={GROUP_IMAGE_ACCEPT}
          className="pp-image-picker__input"
          onChange={handleInputChange}
          aria-hidden
          tabIndex={-1}
        />

        <p className="pp-image-picker__hint">
          <Camera size={14} aria-hidden />
          Cole um link de imagem, use o link da loja ou busque pelo nome do produto na internet.
        </p>

        {fonteLabel ? <p className="pp-image-picker__source">{fonteLabel}</p> : null}
        {error ? <p className="pp-image-picker__error">{error}</p> : null}
      </div>
    </div>
  )
}
