import { useCallback, useEffect, useMemo, useState } from 'react'
import { Layers, Pencil, Plus, Sparkles, Tags, Trash2, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { cn } from '@/design-system/utils/cn.js'
import * as categoryService from '@/services/categoryService.js'
import { CategoryFormModal } from './CategoryFormModal.jsx'

export function CategoryManageModal({ open, onClose, onChanged, tipoInicial = 'DESPESA' }) {
  const toast = useToast()
  const [categorias, setCategorias] = useState([])
  const [icones, setIcones] = useState([])
  const [cores, setCores] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const personalizadas = useMemo(
    () => categorias.filter((c) => !c.padrao).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
    [categorias]
  )

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const [lista, meta] = await Promise.all([
        categoryService.listarCategorias(),
        categoryService.listarIconesCategoria(),
      ])
      setCategorias(lista)
      setIcones(meta.icones ?? [])
      setCores(meta.cores ?? [])
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao carregar categorias')
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

  const handleSalvar = async (payload) => {
    setSubmitting(true)
    try {
      if (editing) {
        await categoryService.atualizarCategoria(editing.id, payload)
        toast.success('Categoria atualizada!')
      } else {
        await categoryService.criarCategoria(payload)
        toast.success('Categoria criada!')
      }
      setFormOpen(false)
      setEditing(null)
      await carregar()
      onChanged?.()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao salvar categoria')
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleExcluir = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await categoryService.removerCategoria(deleteTarget.id)
      toast.success('Categoria excluída!')
      setDeleteTarget(null)
      await carregar()
      onChanged?.()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir categoria')
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
                <Tags size={20} />
              </span>
              <div>
                <h2>Categorias personalizadas</h2>
                <p>Crie categorias com ícone e cor para usar nas transações.</p>
              </div>
            </div>
            <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
          </header>

          <div className="category-manage__body">
            {loading ? (
              <div className="category-manage__loading">
                <SpinnerDots label="Carregando categorias..." />
              </div>
            ) : personalizadas.length === 0 ? (
              <div className="category-manage__empty">
                <span className="category-manage__empty-icon" aria-hidden>
                  <Sparkles size={28} />
                </span>
                <h3>Nenhuma categoria sua ainda</h3>
                <p>
                  As categorias padrão do Pulso continuam disponíveis. Crie as suas para organizar do seu jeito.
                </p>
                <Button type="button" variant="primary" size="md" leftIcon={<Plus size={18} />} onClick={abrirNova}>
                  Criar primeira categoria
                </Button>
              </div>
            ) : (
              <>
                <div className="category-manage__toolbar">
                  <span className="category-manage__count">
                    <Layers size={15} aria-hidden />
                    {personalizadas.length} personalizada{personalizadas.length === 1 ? '' : 's'}
                  </span>
                  <Button type="button" variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={abrirNova}>
                    Nova categoria
                  </Button>
                </div>

                <ul className="category-manage__list">
                  {personalizadas.map((item) => (
                    <li key={item.id} className="category-manage__item">
                      <span
                        className="category-manage__item-icon"
                        style={{
                          color: item.cor,
                          background: `color-mix(in srgb, ${item.cor} 16%, transparent)`,
                          borderColor: `color-mix(in srgb, ${item.cor} 28%, transparent)`,
                        }}
                      >
                        {resolveBadgeIcon(item.icone ?? 'Tag', { size: 18 })}
                      </span>
                      <div className="category-manage__item-body">
                        <strong>{item.nome}</strong>
                        <span
                          className={cn(
                            'category-manage__tipo',
                            item.tipo === 'RECEITA'
                              ? 'category-manage__tipo--income'
                              : 'category-manage__tipo--expense'
                          )}
                        >
                          {item.tipo === 'RECEITA' ? 'Receita' : 'Despesa'}
                        </span>
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
                  ))}
                </ul>
              </>
            )}
          </div>

          {personalizadas.length > 0 ? (
            <footer className="category-manage__footer">
              <p>As categorias padrão do sistema não aparecem aqui, mas seguem disponíveis nos formulários.</p>
            </footer>
          ) : null}
        </div>
      </Modal>

      <CategoryFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSalvar}
        submitting={submitting}
        categoria={editing}
        tipoPadrao={tipoInicial}
        icones={icones}
        cores={cores}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleExcluir}
        title="Excluir categoria?"
        message={
          deleteTarget
            ? `A categoria "${deleteTarget.nome}" será removida. Transações que a usam impedem a exclusão.`
            : ''
        }
        confirmLabel="Excluir"
        variant="danger"
        loading={deleting}
      />
    </>
  )
}
