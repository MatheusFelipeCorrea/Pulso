import { useEffect, useState } from 'react'
import { Copy, Info, Link2, Lock, Pencil, Users, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { Textarea } from '@/design-system/components/inputs/Textarea/Textarea.jsx'
import { GroupImagePicker } from '@/components/features/groups/GroupImagePicker.jsx'

const DESCRIPTION_MAX = 500

export function CreateGroupModal({ open, onClose, onSubmit, loading }) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [imagemFile, setImagemFile] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setNome('')
    setDescricao('')
    setImagemFile(null)
    setError('')
  }, [open])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = nome.trim()
    if (!trimmed) {
      setError('Informe o nome do grupo.')
      return
    }
    setError('')
    await onSubmit?.({
      nome: trimmed,
      descricao: descricao.trim() || null,
      imagemFile,
    })
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="md" className="group-create-modal">
      <form className="group-create-modal__form" onSubmit={handleSubmit} noValidate>
        <header className="group-create-modal__header">
          <h2>Criar Novo Grupo</h2>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="group-create-modal__body">
          <section className="group-create-modal__photo" aria-label="Foto do grupo">
            <GroupImagePicker
              nome={nome.trim() || 'Grupo'}
              file={imagemFile}
              onFileChange={setImagemFile}
              helperText="Opcional agora. Se vincular uma viagem depois, a foto do destino aparece automaticamente."
            />
          </section>

          <InputText
            label={
              <FormFieldLabel icon={Users} tone="purple">
                Nome do grupo
              </FormFieldLabel>
            }
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Ex: Viagem Macaé 2026"
            maxLength={100}
            autoFocus
          />

          <Textarea
            className="group-create-modal__notes"
            label={
              <FormFieldLabel icon={Pencil} tone="purple">
                Descrição (opcional)
              </FormFieldLabel>
            }
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            placeholder="Descreva o propósito do grupo..."
            maxLength={DESCRIPTION_MAX}
            rows={4}
            resize="vertical"
          />

          <section className="group-create-modal__invite" aria-label="Código de convite">
            <span className="group-create-modal__invite-label">
              <Link2 size={16} aria-hidden />
              Código de convite
            </span>
            <p className="group-create-modal__invite-code">PULSO-????</p>
            <p className="group-create-modal__invite-share">Compartilhe este código para convidar membros</p>
            <Button type="button" variant="secondary" size="sm" leftIcon={<Copy size={14} />} disabled>
              Copiar código
            </Button>
            <p className="group-create-modal__invite-lock">
              <Lock size={14} aria-hidden />
              O código será gerado ao criar o grupo
            </p>
          </section>

          <div className="group-create-modal__info">
            <Info size={18} aria-hidden />
            <p>
              <strong>Você será automaticamente o administrador deste grupo.</strong>{' '}
              Os membros poderão ver viagens e metas compartilhadas, mas nunca seus dados pessoais.
            </p>
          </div>

          {error ? <p className="group-create-modal__error">{error}</p> : null}
        </div>

        <footer className="group-create-modal__footer">
          <Button
            type="button"
            variant="ghost"
            className="group-create-modal__cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Criar Grupo
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
