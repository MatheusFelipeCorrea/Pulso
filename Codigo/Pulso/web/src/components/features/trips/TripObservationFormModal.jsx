import { useEffect, useState } from 'react'
import {
  FileText,
  Globe,
  Info,
  Link2,
  ListChecks,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { Textarea } from '@/design-system/components/inputs/Textarea/Textarea.jsx'
import { Checkbox } from '@/design-system/components/forms/Checkbox/Checkbox.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { inferObservationTipo } from '@/utils/tripObservationTypes.js'
import { REQUIRED_FIELD_ERROR, isRequiredValueEmpty } from '@/utils/formValidation.js'
import { formatTripDetailDate } from '@/utils/tripDetailUtils.js'
import { formatTripDestinationDisplay } from '@/utils/tripDestinationDisplay.js'

const CONTENT_MAX = 1000
const TITLE_MAX = 120

const createChecklistItem = (texto = '') => ({
  id: crypto.randomUUID(),
  texto,
  concluido: false,
})

const emptyForm = () => ({
  titulo: '',
  conteudo: '',
  linkUrl: '',
  checklist: [],
})

export function TripObservationFormModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  viagem = null,
  observacao = null,
  submitting = false,
}) {
  const [form, setForm] = useState(emptyForm)
  const [newItemText, setNewItemText] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const isEdit = Boolean(observacao)

  useEffect(() => {
    if (!open) return
    setError('')
    setFieldErrors({})
    setNewItemText('')

    if (observacao) {
      setForm({
        titulo: observacao.titulo ?? '',
        conteudo: observacao.conteudo ?? '',
        linkUrl: observacao.linkUrl ?? '',
        checklist: (observacao.checklist ?? []).map((item) => ({
          id: item.id ?? crypto.randomUUID(),
          texto: item.texto ?? '',
          concluido: Boolean(item.concluido),
        })),
      })
    } else {
      setForm(emptyForm())
    }
  }, [open, observacao])

  const addChecklistItem = () => {
    const texto = newItemText.trim()
    if (!texto) return

    setForm((prev) => ({
      ...prev,
      checklist: [...prev.checklist, createChecklistItem(texto.slice(0, 200))],
    }))
    setNewItemText('')
  }

  const removeChecklistItem = (itemId) => {
    setForm((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((item) => item.id !== itemId),
    }))
  }

  const toggleChecklistItem = (itemId, concluido) => {
    setForm((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === itemId ? { ...item, concluido } : item
      ),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const titulo = form.titulo.trim()
    const nextFieldErrors = {}

    if (isRequiredValueEmpty(titulo)) {
      nextFieldErrors.titulo = REQUIRED_FIELD_ERROR
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors)
      return
    }

    setFieldErrors({})

    const linkUrl = form.linkUrl.trim()
    if (linkUrl) {
      try {
        // eslint-disable-next-line no-new
        new URL(linkUrl)
      } catch {
        setError('Informe uma URL válida para o link.')
        return
      }
    }

    const checklist = form.checklist
      .map((item) => ({
        id: item.id,
        texto: item.texto.trim(),
        concluido: item.concluido,
      }))
      .filter((item) => item.texto)

    try {
      await onSubmit?.({
        titulo: titulo.slice(0, TITLE_MAX),
        conteudo: form.conteudo.trim().slice(0, CONTENT_MAX) || null,
        tipo: inferObservationTipo({ checklist, linkUrl }) ?? 'GERAL',
        linkUrl: linkUrl || null,
        checklist,
      })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível salvar a observação.')
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="md" className="trip-observation-modal">
      <form className="trip-observation-form" onSubmit={handleSubmit} noValidate>
        <header className="trip-observation-form__header">
          <h2>{isEdit ? 'Editar Observação' : 'Adicionar Observação'}</h2>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="trip-observation-form__body">
          {viagem ? (
            <div className="trip-observation-form__context">
              <Globe size={14} aria-hidden />
              <span>
                {formatTripDestinationDisplay(viagem.destino, viagem.destinoMeta)} · {formatTripDetailDate(viagem.dataPrevista)}
              </span>
            </div>
          ) : null}

          <InputText
            label={
              <FormFieldLabel icon={Pencil} tone="purple">
                Título
              </FormFieldLabel>
            }
            value={form.titulo}
            onChange={(event) => {
              const titulo = event.target.value.slice(0, TITLE_MAX)
              setForm((prev) => ({ ...prev, titulo }))
              if (fieldErrors.titulo) {
                setFieldErrors((prev) => {
                  const next = { ...prev }
                  delete next.titulo
                  return next
                })
              }
            }}
            placeholder="Ex: Documentos necessários"
            required
            error={fieldErrors.titulo}
          />

          <Textarea
            className="trip-observation-form__content"
            label={
              <FormFieldLabel icon={FileText} tone="purple">
                Conteúdo
              </FormFieldLabel>
            }
            value={form.conteudo}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                conteudo: event.target.value.slice(0, CONTENT_MAX),
              }))
            }
            placeholder="Escreva sua observação, dica ou informação..."
            maxLength={CONTENT_MAX}
            resize="vertical"
          />

          <div className="trip-observation-form__info">
            <Info size={16} aria-hidden />
            <p>
              O checklist e o link são opcionais. Use o que fizer sentido para sua observação.
            </p>
          </div>

          <section className="trip-observation-form__panel">
            <FormFieldLabel icon={ListChecks} tone="purple">
              Checklist (itens)
            </FormFieldLabel>

            {form.checklist.length > 0 ? (
              <ul className="trip-observation-form__checklist">
                {form.checklist.map((item) => (
                  <li key={item.id} className="trip-observation-form__checklist-item">
                    <div className="trip-observation-form__checklist-main">
                      <Checkbox
                        checked={item.concluido}
                        onChange={(concluido) => toggleChecklistItem(item.id, concluido)}
                        className="trip-observation-form__checklist-check"
                      />
                      <span
                        className={`trip-observation-form__checklist-text${item.concluido ? ' is-done' : ''}`}
                      >
                        {item.texto}
                      </span>
                    </div>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      ariaLabel="Remover item"
                      icon={<Trash2 size={14} />}
                      className="trip-observation-form__checklist-remove"
                      onClick={() => removeChecklistItem(item.id)}
                    />
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="trip-observation-form__checklist-add">
              <InputText
                className="trip-observation-form__checklist-add-input"
                value={newItemText}
                onChange={(event) => setNewItemText(event.target.value.slice(0, 200))}
                placeholder="Novo item do checklist..."
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addChecklistItem()
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={addChecklistItem}
              >
                Adicionar
              </Button>
            </div>
          </section>

          <section className="trip-observation-form__panel">
            <FormFieldLabel icon={Link2} tone="purple">
              Link útil
            </FormFieldLabel>
            <InputText
              value={form.linkUrl}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, linkUrl: event.target.value }))
              }
              placeholder="https://..."
              type="url"
            />
            <p className="trip-observation-form__helper">
              Adicione um link relacionado à sua observação.
            </p>
          </section>

          {error ? <p className="trip-observation-form__error">{error}</p> : null}
        </div>

        <footer
          className={`trip-observation-form__footer${isEdit ? ' trip-observation-form__footer--edit' : ''}`}
        >
          <Button
            type="button"
            variant="secondary"
            className="trip-observation-form__footer-cancel"
            onClick={onClose}
          >
            Cancelar
          </Button>
          {isEdit ? (
            <Button
              type="button"
              variant="secondary"
              className="trip-observation-form__delete-btn trip-observation-form__footer-delete"
              leftIcon={<Trash2 size={14} />}
              onClick={() => onDelete?.()}
            >
              Excluir
            </Button>
          ) : null}
          <Button
            type="submit"
            variant="primary"
            className="trip-observation-form__footer-save"
            loading={submitting}
          >
            Salvar Observação
          </Button>
        </footer>
      </form>
    </Modal>
  )
}

