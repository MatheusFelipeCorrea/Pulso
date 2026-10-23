import { useEffect, useState } from 'react'
import { ImageIcon, Link2, RotateCcw, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { GroupImagePicker } from '@/components/features/groups/GroupImagePicker.jsx'
import { getGrupoImagemExibicao, grupoUsaImagemDaViagem } from '@/utils/groupImage.js'

export function ChangeGroupImageModal({ open, onClose, grupo, onSubmit, loading }) {
  const [url, setUrl] = useState('')
  const [imagemFile, setImagemFile] = useState(null)
  const [showUrl, setShowUrl] = useState(false)
  const [error, setError] = useState('')

  const imagemAtual = getGrupoImagemExibicao(grupo)
  const usaViagem = grupoUsaImagemDaViagem(grupo)

  useEffect(() => {
    if (!open) return
    setUrl(grupo?.urlImagem ?? '')
    setImagemFile(null)
    setShowUrl(Boolean(grupo?.urlImagem && !grupo.urlImagem.includes('/api/uploads/')))
    setError('')
  }, [open, grupo?.urlImagem])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (imagemFile) {
      try {
        await onSubmit?.({ file: imagemFile })
      } catch (err) {
        setError(err.response?.data?.message ?? 'Não foi possível enviar a imagem.')
      }
      return
    }

    const trimmed = url.trim()
    if (trimmed) {
      try {
        const parsed = new URL(trimmed)
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          setError('Informe uma URL válida (http ou https).')
          return
        }
      } catch {
        setError('Informe uma URL válida.')
        return
      }
    }

    try {
      await onSubmit?.({ urlImagem: trimmed || null })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível atualizar a imagem.')
    }
  }

  const handleRestoreTripImage = async () => {
    setError('')
    setImagemFile(null)
    try {
      await onSubmit?.({ urlImagem: null })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível restaurar a imagem.')
    }
  }

  if (!grupo) return null

  return (
    <Modal isOpen={open} onClose={onClose} size="md" className="group-image-modal">
      <form className="group-image-modal__form" onSubmit={handleSubmit} noValidate>
        <header className="group-image-modal__header">
          <div>
            <h2>Foto do grupo</h2>
            <p>
              {usaViagem
                ? 'Usando a foto da viagem vinculada. Envie uma imagem para personalizar.'
                : 'Escolha uma foto da galeria ou cole um link.'}
            </p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="group-image-modal__body">
          <GroupImagePicker
            nome={grupo.nome}
            previewUrl={imagemAtual}
            file={imagemFile}
            onFileChange={setImagemFile}
            helperText={
              grupo.viagem
                ? 'Sem foto personalizada, usamos automaticamente a capa do destino da viagem.'
                : 'Vincule uma viagem depois para usar a foto do destino como capa.'
            }
          />

          <button
            type="button"
            className="group-image-modal__toggle-url"
            onClick={() => setShowUrl((prev) => !prev)}
          >
            <Link2 size={14} aria-hidden />
            {showUrl ? 'Ocultar link da web' : 'Ou colar link de uma imagem'}
          </button>

          {showUrl ? (
            <InputText
              label="URL da imagem"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
              leftIcon={<Link2 size={16} />}
              disabled={Boolean(imagemFile)}
            />
          ) : null}

          {grupo.viagem ? (
            <button
              type="button"
              className="group-image-modal__restore"
              onClick={handleRestoreTripImage}
              disabled={loading || (!grupo.urlImagem && usaViagem)}
            >
              <RotateCcw size={14} aria-hidden />
              Usar foto da viagem vinculada
            </button>
          ) : (
            <p className="group-image-modal__hint">
              <ImageIcon size={14} aria-hidden />
              Vincule uma viagem ao grupo para usar automaticamente a foto do destino.
            </p>
          )}

          {error ? <p className="group-image-modal__error">{error}</p> : null}
        </div>

        <footer className="group-image-modal__footer">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Salvar foto
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
