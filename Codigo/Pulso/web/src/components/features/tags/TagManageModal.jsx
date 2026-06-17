import { useCallback, useEffect, useState } from 'react'
import { Layers, Pencil, Plus, Sparkles, Tag, Trash2, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import * as tagService from '@/services/tagService.js'
import { TagFormModal } from './TagFormModal.jsx'

const TAG_COLOR = '#7C3AED'

export function TagManageModal({ open, onClose, onChanged }) {
  const toast = useToast()
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const lista = await tagService.listarTags()
      setTags(lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')))
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao carregar tags')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (!open) return
    carregar()
  }, [open, carregar])

  const abrirNova = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleSalvar = async ({ nome }) => {
    setSubmitting(true)
    try {
      if (editing) {
        await tagService.editarTag(editing.id, { nome })
        toast.success('Tag atualizada!')
      } else {
        await tagService.criarTag(nome)
        toast.success('Tag criada!')
      }
      setFormOpen(false)
      setEditing(null)
      await carregar()
      onChanged?.()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao salvar tag')
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleExcluir = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await tagService.excluirTag(deleteTarget.id)
      toast.success('Tag excluída!')
      setDeleteTarget(null)
      await carregar()
      onChanged?.()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir tag')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Modal isOpen={open} onClose={onClose} size="lg" className="category-modal category-modal--manage">
        <div className="category-manage">
          <header className="category-manage__header">
            <div className="category-manage__header-main">
              <span className="category-manage__header-icon" aria-hidden>
                <Tag size={20} />
              </span>
              <div>
                <h2>Tags</h2>
                <p>Organize transações com etiquetas personalizadas.</p>
              </div>
            </div>
            <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
          </header>

          <div className="category-manage__body">
            {loading ? (
              <div className="category-manage__loading">
                <SpinnerDots label="Carregando tags..." />
              </div>
            ) : tags.length === 0 ? (
              <div className="category-manage__empty">
                <span className="category-manage__empty-icon" aria-hidden>
                  <Sparkles size={28} />
                </span>
                <h3>Nenhuma tag ainda</h3>
                <p>Crie tags para filtrar e agrupar transações rapidamente.</p>
                <Button type="button" variant="primary" size="md" leftIcon={<Plus size={18} />} onClick={abrirNova}>
                  Criar primeira tag
                </Button>
              </div>
            ) : (
              <>
                <div className="category-manage__toolbar">
                  <span className="category-manage__count">
                    <Layers size={15} aria-hidden />
                    {tags.length} tag{tags.length === 1 ? '' : 's'}
                  </span>
                  <Button type="button" variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={abrirNova}>
                    Nova tag
                  </Button>
                </div>

                <ul className="category-manage__list">
                  {tags.map((item) => {
                    const cor = item.cor || TAG_COLOR
                    return (
                      <li key={item.id} className="category-manage__item">
                        <span
                          className="category-manage__item-icon"
                          style={{
                            color: cor,
                            background: `color-mix(in srgb, ${cor} 16%, transparent)`,
                            borderColor: `color-mix(in srgb, ${cor} 28%, transparent)`,
                          }}
                        >
                          {resolveBadgeIcon(item.icone ?? 'Tag', { size: 18 })}
                        </span>
                        <div className="category-manage__item-body">
                          <strong>{item.nome}</strong>
                        </div>
                        <div className="category-manage__item-actions">
                          <IconButton
                            variant="ghost"
                            size="sm"
                            ariaLabel={`Editar ${item.nome}`}
                            icon={<Pencil size={16} />}
                            onClick={() => {
                              setEditing(item)
                              setFormOpen(true)
                            }}
                          />
                          <IconButton
                            variant="ghost"
                            size="sm"
                            ariaLabel={`Excluir ${item.nome}`}
                            icon={<Trash2 size={16} />}
                            onClick={() => setDeleteTarget(item)}
                          />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      </Modal>

      <TagFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSalvar}
        submitting={submitting}
        tag={editing}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleExcluir}
        title="Excluir tag?"
        message={
          deleteTarget
            ? `A tag "${deleteTarget.nome}" será removida. Transações antigas mantêm o histórico, mas a tag deixa de aparecer nos filtros.`
            : ''
        }
        confirmLabel="Excluir"
        variant="danger"
        loading={deleting}
      />
    </>
  )
}
