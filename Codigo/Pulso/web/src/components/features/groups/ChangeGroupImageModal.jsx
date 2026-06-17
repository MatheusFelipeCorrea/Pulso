import { useEffect, useState } from 'react'
import { ImageIcon, Link2, RotateCcw, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { GroupThumbnail } from '@/components/features/groups/GroupThumbnail.jsx'
import { getGrupoImagemExibicao, grupoUsaImagemDaViagem } from '@/utils/groupImage.js'

export function ChangeGroupImageModal({ open, onClose, grupo, onSubmit, loading }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const imagemAtual = getGrupoImagemExibicao(grupo)
  const usaViagem = grupoUsaImagemDaViagem(grupo)
  const previewUrl = url.trim() || imagemAtual

  useEffect(() => {
    if (!open) return
    setUrl(grupo?.urlImagem ?? '')
    setError('')
  }, [open, grupo?.urlImagem])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

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
            <h2>Imagem do grupo</h2>
            <p>
              {usaViagem
                ? 'Atualmente usando a foto da viagem vinculada.'
                : 'Defina uma imagem personalizada para o grupo.'}
            </p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="group-image-modal__body">
          <div className="group-image-modal__preview">
            <GroupThumbnail nome={grupo.nome} src={previewUrl} size="lg" />
          </div>

          <InputText
            label="URL da imagem"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://exemplo.com/foto.jpg"
            leftIcon={<Link2 size={16} />}
            helperText="Cole o link de uma imagem hospedada na web."
          />

          {grupo.viagem ? (
            <button
              type="button"
              className="group-image-modal__restore"
              onClick={handleRestoreTripImage}
              disabled={loading || (!grupo.urlImagem && usaViagem)}
            >
              <RotateCcw size={14} aria-hidden />
              Usar imagem da viagem vinculada
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
            Salvar imagem
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
