import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Calculator,
  Check,
  Info,
  Plus,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { categoriaToSelectOption } from '@/utils/filterOptions.js'

export function BudgetEditModal({
  open,
  onClose,
  mesReferencia,
  categoriasComLimite = [],
  categoriasSemOrcamento = [],
  rendaMensal = 0,
  preselectCategoriaId = null,
  onSalvar,
  submitting = false,
}) {
  const [limites, setLimites] = useState([])
  const [categoriaAdicionar, setCategoriaAdicionar] = useState(null)

  useEffect(() => {
    if (!open) return
    setLimites(
      categoriasComLimite.map((item) => ({
        categoriaId: item.categoriaId,
        categoriaNome: item.categoriaNome,
        categoriaIcone: item.categoriaIcone,
        categoriaCor: item.categoriaCor,
        limiteValor: item.limiteValor,
      }))
    )
    setCategoriaAdicionar(preselectCategoriaId)
  }, [open, categoriasComLimite, preselectCategoriaId])

  const categoriasDisponiveis = useMemo(() => {
    const idsUsados = new Set(limites.map((item) => item.categoriaId))
    const removidas = categoriasComLimite
      .filter((item) => !idsUsados.has(item.categoriaId))
      .map((item) => ({
        id: item.categoriaId,
        nome: item.categoriaNome,
        icone: item.categoriaIcone,
        cor: item.categoriaCor,
      }))
    const map = new Map()
    ;[...categoriasSemOrcamento, ...removidas].forEach((item) => map.set(item.id, item))
    return [...map.values()].filter((item) => !idsUsados.has(item.id))
  }, [categoriasComLimite, categoriasSemOrcamento, limites])

  const categoriaOptions = categoriasDisponiveis.map(categoriaToSelectOption)

  const orcamentoTotal = limites.reduce((sum, item) => sum + Number(item.limiteValor || 0), 0)
  const sobra = rendaMensal - orcamentoTotal
  const sobraPct = rendaMensal > 0 ? Math.round((sobra / rendaMensal) * 100) : 0
  const acimaDaRenda = rendaMensal > 0 && orcamentoTotal > rendaMensal

  const handleRemover = (categoriaId) => {
    setLimites((prev) => prev.filter((item) => item.categoriaId !== categoriaId))
  }

  const handleAtualizarValor = (categoriaId, valor) => {
    setLimites((prev) =>
      prev.map((item) =>
        item.categoriaId === categoriaId ? { ...item, limiteValor: valor } : item
      )
    )
  }

  const handleAdicionar = () => {
    if (!categoriaAdicionar) return
    const categoria = categoriasDisponiveis.find((item) => item.id === categoriaAdicionar)
    if (!categoria) return

    setLimites((prev) => [
      ...prev,
      {
        categoriaId: categoria.id,
        categoriaNome: categoria.nome,
        categoriaIcone: categoria.icone,
        categoriaCor: categoria.cor,
        limiteValor: 0,
      },
    ])
    setCategoriaAdicionar(null)
  }

  const handleSalvar = async () => {
    await onSalvar?.({
      mesReferencia,
      limites: limites.map((item) => ({
        categoriaId: item.categoriaId,
        limiteValor: Number(item.limiteValor),
      })),
    })
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="xl" className="budget-edit-modal">
      <header className="budget-edit-modal__header">
        <h2 className="budget-edit-modal__title">Editar Limites de Orçamento</h2>
        <IconButton
          variant="ghost"
          size="sm"
          ariaLabel="Fechar"
          icon={<X size={18} />}
          onClick={onClose}
        />
      </header>

      <div className="budget-edit-modal__body">
        <div className="budget-edit-modal__info">
          <Info size={18} aria-hidden />
          <p>
            Defina quanto pretende gastar no máximo por categoria este mês. Você será alertado ao
            atingir <strong>80%</strong> do limite.
          </p>
        </div>

        <section className="budget-edit-modal__section">
          <h3 className="budget-edit-modal__section-title">Limites por categoria</h3>
          {limites.length === 0 ? (
            <p className="budget-edit-modal__empty">Nenhum limite definido ainda.</p>
          ) : (
            <ul className="budget-edit-modal__list">
              {limites.map((item) => (
                <li key={item.categoriaId} className="budget-edit-modal__row">
                  <div className="budget-edit-modal__cat">
                    <span
                      className="budget-edit-modal__cat-icon"
                      style={{
                        color: item.categoriaCor,
                        background: `color-mix(in srgb, ${item.categoriaCor} 14%, transparent)`,
                      }}
                      aria-hidden
                    >
                      {resolveBadgeIcon(item.categoriaIcone ?? 'Tag', { size: 16 })}
                    </span>
                    <span className="budget-edit-modal__cat-name">{item.categoriaNome}</span>
                  </div>

                  <InputMoney
                    value={item.limiteValor}
                    onChange={(value) => handleAtualizarValor(item.categoriaId, value)}
                    className="budget-edit-modal__money"
                  />

                  <IconButton
                    variant="ghost"
                    size="sm"
                    ariaLabel={`Remover ${item.categoriaNome}`}
                    icon={<X size={16} />}
                    className="budget-edit-modal__remove"
                    onClick={() => handleRemover(item.categoriaId)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="budget-edit-modal__section">
          <h3 className="budget-edit-modal__section-title">Adicionar categoria</h3>
          <div className="budget-edit-modal__add">
            <Select
              label="Categoria"
              value={categoriaAdicionar}
              onChange={setCategoriaAdicionar}
              options={categoriaOptions}
              placeholder="Adicionar limite para..."
              className="budget-edit-modal__add-select"
            />
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Plus size={16} />}
              disabled={!categoriaAdicionar}
              onClick={handleAdicionar}
              className="budget-edit-modal__add-btn"
            >
              Adicionar
            </Button>
          </div>
        </section>

        <aside
          className={`budget-edit-modal__summary${acimaDaRenda ? ' budget-edit-modal__summary--warn' : ''}`}
        >
          <h4 className="budget-edit-modal__summary-title">Resumo do orçamento</h4>

          <div className="budget-edit-modal__summary-row">
            <Calculator size={16} aria-hidden />
            <span>Orçamento total definido</span>
            <strong>{formatCurrency(orcamentoTotal)}</strong>
          </div>

          <div className="budget-edit-modal__summary-row">
            <Wallet size={16} aria-hidden />
            <span>Sua renda mensal</span>
            <strong>{formatCurrency(rendaMensal)}</strong>
          </div>

          <div className="budget-edit-modal__summary-row budget-edit-modal__summary-row--highlight">
            <TrendingUp size={16} aria-hidden />
            <span>Sobra planejada</span>
            <strong>
              {formatCurrency(sobra)}
              {rendaMensal > 0 ? ` (${sobraPct}%)` : ''}
            </strong>
          </div>

          <p
            className={`budget-edit-modal__feedback${acimaDaRenda ? ' budget-edit-modal__feedback--warn' : ' budget-edit-modal__feedback--ok'}`}
          >
            {acimaDaRenda ? <AlertTriangle size={16} aria-hidden /> : <Check size={16} aria-hidden />}
            {acimaDaRenda
              ? 'Atenção: seu orçamento está acima da sua renda mensal.'
              : 'Ótimo! Seu orçamento está dentro da sua renda.'}
          </p>
        </aside>
      </div>

      <footer className="budget-edit-modal__footer">
        <Button variant="ghost" size="md" onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button variant="primary" size="md" onClick={handleSalvar} disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar Limites'}
        </Button>
      </footer>
    </Modal>
  )
}
