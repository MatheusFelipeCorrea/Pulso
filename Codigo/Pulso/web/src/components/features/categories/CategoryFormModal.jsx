import { useEffect, useState } from 'react'
import { ArrowDownCircle, ArrowUpCircle, Tag, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { CategoryIconPicker } from './CategoryIconPicker.jsx'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { cn } from '@/design-system/utils/cn.js'

const emptyForm = (tipo = 'DESPESA') => ({
  nome: '',
  tipo,
  icone: 'Tag',
  cor: '#7C3AED',
})

function FieldLabel({ icon: Icon, tone = 'purple', children }) {
  return (
    <span className={`category-form__field-label category-form__field-label--${tone}`}>
      {Icon ? <Icon size={16} strokeWidth={2} aria-hidden /> : null}
      <span>{children}</span>
    </span>
  )
}

export function CategoryFormModal({
  open,
  onClose,
  onSubmit,
  submitting = false,
  categoria = null,
  tipoPadrao = 'DESPESA',
  icones = [],
  cores = [],
}) {
  const [form, setForm] = useState(() => emptyForm(tipoPadrao))
  const isEdit = Boolean(categoria)
  const isReceita = form.tipo === 'RECEITA'
  const previewNome = form.nome.trim() || 'Minha categoria'

  useEffect(() => {
    if (!open) return
    if (categoria) {
      setForm({
        nome: categoria.nome ?? '',
        tipo: categoria.tipo ?? 'DESPESA',
        icone: categoria.icone ?? 'Tag',
        cor: categoria.cor ?? '#7C3AED',
      })
    } else {
      setForm(emptyForm(tipoPadrao))
    }
  }, [open, categoria, tipoPadrao])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.nome.trim()) return
    await onSubmit?.({
      nome: form.nome.trim(),
      tipo: form.tipo,
      icone: form.icone,
      cor: form.cor,
    })
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="xl" className="category-modal category-modal--form">
      <form className="category-form" onSubmit={handleSubmit}>
        <header className="category-form__header">
          <div>
            <h2>{isEdit ? 'Editar categoria' : 'Nova categoria'}</h2>
            <p>Escolha ícone e cor — o mesmo visual das categorias padrão do Pulso.</p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="category-form__body">
          <div
            className="category-form__preview-card"
            style={{
              borderColor: `color-mix(in srgb, ${form.cor} 35%, var(--ds-color-border))`,
              background: `color-mix(in srgb, ${form.cor} 8%, transparent)`,
            }}
          >
            <span
              className="category-form__preview-icon"
              style={{
                color: form.cor,
                background: `color-mix(in srgb, ${form.cor} 20%, transparent)`,
              }}
            >
              {resolveBadgeIcon(form.icone, { size: 22 })}
            </span>
            <div className="category-form__preview-text">
              <strong>{previewNome}</strong>
              <span>{isReceita ? 'Receita' : 'Despesa'}</span>
            </div>
          </div>

          <InputText
            label={
              <FieldLabel icon={Tag} tone="purple">
                Nome
              </FieldLabel>
            }
            value={form.nome}
            onChange={(e) => setForm((prev) => ({ ...prev, nome: e.target.value }))}
            placeholder="Ex: Assinaturas, Freelance extra..."
            required
            maxLength={60}
          />

          {!isEdit ? (
            <div className="category-form__tipo">
              <span className="category-form__tipo-label">Tipo</span>
              <div className="category-form__tipo-toggle">
                <button
                  type="button"
                  className={cn(
                    'category-form__tipo-btn',
                    !isReceita && 'category-form__tipo-btn--active category-form__tipo-btn--expense'
                  )}
                  onClick={() => setForm((prev) => ({ ...prev, tipo: 'DESPESA' }))}
                >
                  <ArrowDownCircle size={18} />
                  Despesa
                </button>
                <button
                  type="button"
                  className={cn(
                    'category-form__tipo-btn',
                    isReceita && 'category-form__tipo-btn--active category-form__tipo-btn--income'
                  )}
                  onClick={() => setForm((prev) => ({ ...prev, tipo: 'RECEITA' }))}
                >
                  <ArrowUpCircle size={18} />
                  Receita
                </button>
              </div>
            </div>
          ) : null}

          <CategoryIconPicker
            icones={icones}
            cores={cores}
            valueIcon={form.icone}
            valueCor={form.cor}
            onChangeIcon={(icone) => setForm((prev) => ({ ...prev, icone }))}
            onChangeCor={(cor) => setForm((prev) => ({ ...prev, cor }))}
          />
        </div>

        <footer className="category-form__footer">
          <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" disabled={submitting || !form.nome.trim()}>
            {submitting ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar categoria'}
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
