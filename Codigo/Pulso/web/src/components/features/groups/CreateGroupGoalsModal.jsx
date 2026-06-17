import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  Check,
  CircleDollarSign,
  FileText,
  Info,
  Lightbulb,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { Textarea } from '@/design-system/components/inputs/Textarea/Textarea.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

const MAX_METAS = 5

const emptyMeta = () => ({
  nome: '',
  valorAlvo: 0,
  prazo: null,
  descricao: '',
})

export function CreateGroupGoalsModal({ open, onClose, onSubmit, grupo, loading, slotsRestantes = MAX_METAS }) {
  const maxNovas = Math.min(MAX_METAS, Math.max(1, slotsRestantes))
  const [metas, setMetas] = useState([emptyMeta()])
  const [error, setError] = useState('')
  const memberCount = grupo?.quantidadeMembros ?? grupo?.membros?.length ?? 0

  useEffect(() => {
    if (!open) return
    setMetas([emptyMeta()])
    setError('')
  }, [open])

  const validMetas = useMemo(
    () =>
      metas.filter(
        (meta) => meta.nome.trim() && meta.valorAlvo > 0 && meta.prazo
      ),
    [metas]
  )

  const totalMetas = useMemo(
    () => validMetas.reduce((sum, meta) => sum + Number(meta.valorAlvo || 0), 0),
    [validMetas]
  )

  const porPessoa = memberCount > 0 ? totalMetas / memberCount : 0

  const updateMeta = (index, patch) => {
    setMetas((current) => current.map((meta, i) => (i === index ? { ...meta, ...patch } : meta)))
  }

  const addMeta = () => {
    if (metas.length >= maxNovas) return
    setMetas((current) => [...current, emptyMeta()])
  }

  const removeMeta = (index) => {
    if (metas.length === 1) return
    setMetas((current) => current.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!validMetas.length) {
      setError('Preencha ao menos uma meta com nome, valor e prazo.')
      return
    }

    try {
      await onSubmit?.(
        validMetas.map((meta) => ({
          nome: meta.nome.trim(),
          valorAlvo: meta.valorAlvo,
          prazo: meta.prazo.toISOString(),
          descricao: meta.descricao.trim() || null,
        }))
      )
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível criar as metas.')
    }
  }

  if (!grupo) return null

  return (
    <Modal isOpen={open} onClose={onClose} size="lg" className="group-goals-modal">
      <form className="group-goals-modal__form" onSubmit={handleSubmit} noValidate>
        <header className="group-goals-modal__header">
          <div>
            <h2>Nova Meta do Grupo</h2>
            <p className="group-goals-modal__context">
              <Users size={14} aria-hidden />
              <span>
                {grupo.nome} • {memberCount} {memberCount === 1 ? 'membro' : 'membros'}
              </span>
            </p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="group-goals-modal__body">
          {metas.map((meta, index) => (
            <section key={`meta-${index}`} className="group-goals-modal__block">
              <div className="group-goals-modal__block-head">
                <h3>Meta {index + 1}</h3>
                {metas.length > 1 ? (
                  <button
                    type="button"
                    className="group-goals-modal__remove"
                    aria-label={`Remover meta ${index + 1}`}
                    onClick={() => removeMeta(index)}
                  >
                    <Trash2 size={16} aria-hidden />
                  </button>
                ) : null}
              </div>

              <InputText
                label={
                  <FormFieldLabel icon={Pencil} tone="purple">
                    Nome da meta
                  </FormFieldLabel>
                }
                value={meta.nome}
                onChange={(event) => updateMeta(index, { nome: event.target.value })}
                placeholder="Ex: Juntar pra hospedagem"
                maxLength={100}
              />

              <div className="group-goals-modal__row">
                <InputMoney
                  label={
                    <FormFieldLabel icon={CircleDollarSign} tone="purple">
                      Valor alvo
                    </FormFieldLabel>
                  }
                  value={meta.valorAlvo}
                  onChange={(valorAlvo) => updateMeta(index, { valorAlvo })}
                />

                <DatePicker
                  label={
                    <FormFieldLabel icon={Calendar} tone="purple">
                      Prazo
                    </FormFieldLabel>
                  }
                  value={meta.prazo}
                  onChange={(prazo) => updateMeta(index, { prazo })}
                  placeholder="Selecione a data"
                />
              </div>

              <Textarea
                label={
                  <FormFieldLabel icon={FileText} tone="purple">
                    Descrição (opcional)
                  </FormFieldLabel>
                }
                value={meta.descricao}
                onChange={(event) => updateMeta(index, { descricao: event.target.value })}
                placeholder="Detalhes sobre esta meta..."
                rows={3}
                resize="vertical"
              />
            </section>
          ))}

          {metas.length < maxNovas ? (
            <div className="group-goals-modal__add-wrap">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                className="group-goals-modal__add"
                leftIcon={<Plus size={14} />}
                onClick={addMeta}
              >
                Adicionar outra meta
              </Button>
              <p>
                Máximo de {maxNovas} meta{maxNovas === 1 ? '' : 's'} neste envio ({metas.length}/{maxNovas})
              </p>
            </div>
          ) : null}

          {validMetas.length > 0 ? (
            <div className="group-goals-modal__summary">
              <Lightbulb size={18} aria-hidden />
              <div>
                <p>
                  Valor total das metas: <strong>{formatCurrency(totalMetas)}</strong>
                </p>
                <p>
                  Dividido igualmente entre {memberCount} membros:{' '}
                  <strong>{formatCurrency(porPessoa)}/pessoa</strong>
                </p>
                <small>
                  <Info size={12} aria-hidden />
                  Cada membro faz aportes individuais no seu ritmo.
                </small>
              </div>
            </div>
          ) : null}

          {validMetas.length > 0 ? (
            <section className="group-goals-modal__preview">
              <h4>Preview das metas que serão criadas:</h4>
              <ul>
                {validMetas.map((meta, index) => (
                  <li key={`preview-${index}`}>
                    <Check size={16} aria-hidden />
                    <span>
                      “{meta.nome.trim()}” — {formatCurrency(meta.valorAlvo)}
                    </span>
                    <em>Prazo: {format(meta.prazo, 'MMM/yyyy', { locale: ptBR })}</em>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {error ? <p className="group-goals-modal__error">{error}</p> : null}
        </div>

        <footer className="group-goals-modal__footer">
          <Button type="button" variant="ghost" className="group-goals-modal__cancel" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading} disabled={!validMetas.length}>
            Criar {validMetas.length || ''} {validMetas.length === 1 ? 'Meta' : 'Metas'}
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
