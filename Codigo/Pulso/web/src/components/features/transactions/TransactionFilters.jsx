import { useMemo } from 'react'
import { RotateCcw } from 'lucide-react'
import { filtrosTransacaoSaoPadrao } from '@/utils/transactionFilters.js'
import { InputSearch } from '@/design-system/components/inputs/InputSearch/InputSearch.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { MonthPicker } from '@/design-system/components/pickers/MonthPicker/MonthPicker.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { Skeleton } from '@/design-system/components/feedback/Skeleton/Skeleton.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import {
  monthPickerParaPeriodo,
  periodoParaMonthPicker,
} from '@/utils/transactionRecurrence.js'
import { categoriaFilterOptions, recursoFilterOptions, toSelectOptions } from '@/utils/filterOptions.js'

export function TransactionFilters({
  filtros,
  filtrosAtivos,
  opcoes,
  opcoesLoading,
  onChange,
  onFiltrar,
  onLimpar,
  filtrosPendentes,
  loading,
}) {
  const categoriaOptions = useMemo(
    () => categoriaFilterOptions(opcoes?.categorias ?? []),
    [opcoes?.categorias]
  )
  const tipoOptions = toSelectOptions(opcoes?.tipos)
  const recursoOptions = recursoFilterOptions(opcoes?.recursos)

  const podeLimpar = !filtrosPendentes && !filtrosTransacaoSaoPadrao(filtrosAtivos)

  const handleFilterChange = (patch) => {
    onChange?.({ ...filtros, ...patch })
  }

  const handleBotao = () => {
    if (filtrosPendentes) {
      onFiltrar?.()
    } else if (podeLimpar) {
      onLimpar?.()
    }
  }

  const botaoIcon = loading ? (
    <SpinnerDots label={podeLimpar && !filtrosPendentes ? 'Limpando filtros...' : 'Aplicando filtros...'} />
  ) : podeLimpar && !filtrosPendentes ? (
    <RotateCcw size={16} />
  ) : undefined

  if (opcoesLoading) {
    return (
      <section className="tx-filters-card">
        <Skeleton className="h-[4.5rem] w-full rounded-lg" />
        <div className="tx-filters__row">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[4.5rem] w-full rounded-lg" />
          ))}
          <Skeleton className="h-11 w-[8.75rem] rounded-lg" />
        </div>
      </section>
    )
  }

  return (
    <section className="tx-filters-card">
      <div className="tx-filters__search">
        <InputSearch
          label="Buscar"
          value={filtros.busca}
          onChange={(v) => handleFilterChange({ busca: v })}
          placeholder="Buscar por descrição ou tag..."
        />
      </div>

      <div className="tx-filters__row">
        <MonthPicker
          label="Período"
          value={periodoParaMonthPicker(filtros.periodo)}
          onChange={(v) => handleFilterChange({ periodo: monthPickerParaPeriodo(v) })}
          disableFuture
          monthDisplay="long"
        />

        <Select
          label="Categoria"
          value={filtros.categoria || ''}
          onChange={(v) => handleFilterChange({ categoria: v || null })}
          options={categoriaOptions}
        />

        <Select
          label="Tipo"
          value={filtros.tipo}
          onChange={(v) => handleFilterChange({ tipo: v })}
          options={tipoOptions}
        />

        <Select
          label="Recurso"
          value={filtros.recurso}
          onChange={(v) => handleFilterChange({ recurso: v })}
          options={recursoOptions}
        />

        <div className="tx-filters__action-wrap">
          <Button
            variant={podeLimpar && !filtrosPendentes ? 'secondary' : 'primary'}
            size="md"
            disabled={loading || (!filtrosPendentes && !podeLimpar)}
            onClick={handleBotao}
            leftIcon={botaoIcon}
            className="tx-filters__action"
          >
            {filtrosPendentes ? 'Filtrar' : podeLimpar ? 'Limpar filtros' : 'Filtrar'}
          </Button>
        </div>
      </div>
    </section>
  )
}
