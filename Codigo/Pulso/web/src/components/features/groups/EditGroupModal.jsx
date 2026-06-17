import { useEffect, useState } from 'react'
import { Pencil, Users, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { Textarea } from '@/design-system/components/inputs/Textarea/Textarea.jsx'

const DESCRIPTION_MAX = 500

export function EditGroupModal({ open, onClose, onSubmit, grupo, loading }) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !grupo) return
    setNome(grupo.nome ?? '')
    setDescricao(grupo.descricao ?? '')
    setError('')
  }, [open, grupo])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = nome.trim()
    if (!trimmed) {
      setError('Informe o nome do grupo.')
      return
    }
    setError('')
    try {
      await onSubmit?.({
        nome: trimmed,
        descricao: descricao.trim() || null,
      })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível salvar.')
    }
  }

  if (!grupo) return null

  return (
    <Modal isOpen={open} onClose={onClose} size="md" className="group-create-modal">
      <form className="group-create-modal__form" onSubmit={handleSubmit} noValidate>
        <header className="group-create-modal__header">
          <h2>Editar grupo</h2>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="group-create-modal__body">
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

          {error ? <p className="group-create-modal__error">{error}</p> : null}
        </div>

        <footer className="group-create-modal__footer">
          <Button type="button" variant="ghost" className="group-create-modal__cancel" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Salvar alterações
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
