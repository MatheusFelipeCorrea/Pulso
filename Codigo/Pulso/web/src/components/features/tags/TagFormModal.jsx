import { useEffect, useState } from 'react'
import { Tag, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { REQUIRED_FIELD_ERROR, isRequiredValueEmpty } from '@/utils/formValidation.js'

export function TagFormModal({ open, onClose, onSubmit, submitting = false, tag = null }) {
  const [nome, setNome] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const isEdit = Boolean(tag)

  useEffect(() => {
    if (!open) return
    setFieldErrors({})
    setNome(tag?.nome ?? '')
  }, [open, tag])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isRequiredValueEmpty(nome)) {
      setFieldErrors({ nome: REQUIRED_FIELD_ERROR })
      return
    }
    setFieldErrors({})
    await onSubmit?.({ nome: nome.trim() })
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="md" className="category-modal category-modal--form">
      <form className="category-form" onSubmit={handleSubmit} noValidate>
        <header className="category-form__header">
          <div>
            <h2>{isEdit ? 'Editar tag' : 'Nova tag'}</h2>
            <p>Use tags para filtrar e agrupar transações rapidamente.</p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="category-form__body">
          <InputText
            label={
              <FormFieldLabel icon={Tag} tone="purple">
                Nome
              </FormFieldLabel>
            }
            value={nome}
            onChange={(e) => {
              const value = e.target.value
              setNome(value)
              if (fieldErrors.nome) {
                setFieldErrors((prev) => {
                  const next = { ...prev }
                  delete next.nome
                  return next
                })
              }
            }}
            placeholder="Ex: Viagem, Assinaturas, Mercado..."
            required
            error={fieldErrors.nome}
            maxLength={40}
            autoFocus
          />
        </div>

        <footer className="category-form__footer">
          <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" disabled={submitting || !nome.trim()}>
            {submitting ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar tag'}
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
