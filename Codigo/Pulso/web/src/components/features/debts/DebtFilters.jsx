import { RotateCcw } from 'lucide-react'
import { InputSearch } from '@/design-system/components/inputs/InputSearch/InputSearch.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { DateRangePicker } from '@/design-system/components/pickers/DateRangePicker/DateRangePicker.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { DEBT_STATUS_FILTERS, filtrosDividaSaoPadrao } from '@/utils/debtFilters.js'

const ORDENAR_OPTIONS = [
  { value: '', label: 'Mais recentes' },
  { value: 'asc', label: 'Menor valor' },
  { value: 'desc', label: 'Maior valor' },
]

const STATUS_OPTIONS = [
  { value: DEBT_STATUS_FILTERS.TODAS, label: 'Todos os status' },
  { value: DEBT_STATUS_FILTERS.VENCIDA, label: 'Vencidas' },
  { value: DEBT_STATUS_FILTERS.VENCE_BREVE, label: 'Vence em breve' },
]

export function DebtFilters({
  filtros,
  filtrosAplicados,
  filtrosPendentes,
  loading,
  tabAtiva,
  onChange,
  onFiltrar,
  onLimpar,
}) {
  const podeLimpar = !filtrosPendentes && !filtrosDividaSaoPadrao(filtrosAplicados)
  const mostraStatus = tabAtiva !== 'QUITADAS'

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

  return (
    <section className="debts-filters">
      <div className="debts-filters__search">
        <InputSearch
          label="Buscar"
          value={filtros.busca}
          onChange={(v) => onChange?.({ ...filtros, busca: v })}
          placeholder="Buscar por nome da pessoa..."
        />
      </div>

      <div className="debts-filters__row">
        <DateRangePicker
          label="Período do empréstimo"
          startDate={filtros.dataInicio}
          endDate={filtros.dataFim}
          onChange={({ start, end }) =>
            onChange?.({ ...filtros, dataInicio: start, dataFim: end })
          }
          maxDate={new Date()}
          fullWidth
        />

        {mostraStatus ? (
          <Select
            label="Status"
            value={filtros.status}
            onChange={(v) => onChange?.({ ...filtros, status: v })}
            options={STATUS_OPTIONS}
          />
        ) : (
          <Select
            label="Ordenar por valor"
            value={filtros.ordenarValor}
            onChange={(v) => onChange?.({ ...filtros, ordenarValor: v })}
            options={ORDENAR_OPTIONS}
          />
        )}

        <div className="debts-filters__action-wrap">
          <Button
            type="button"
            variant={podeLimpar && !filtrosPendentes ? 'secondary' : 'primary'}
            size="md"
            leftIcon={botaoIcon}
            onClick={handleBotao}
            disabled={!filtrosPendentes && !podeLimpar}
            className="debts-filters__action"
          >
            {filtrosPendentes ? 'Filtrar' : podeLimpar ? 'Limpar filtros' : 'Filtrar'}
          </Button>
        </div>
      </div>

      <div className="debts-filters__row debts-filters__row--secondary">
        <DateRangePicker
          label="Prazo de devolução"
          startDate={filtros.prazoInicio}
          endDate={filtros.prazoFim}
          onChange={({ start, end }) =>
            onChange?.({ ...filtros, prazoInicio: start, prazoFim: end })
          }
          fullWidth
        />

        {mostraStatus ? (
          <Select
            label="Ordenar por valor"
            value={filtros.ordenarValor}
            onChange={(v) => onChange?.({ ...filtros, ordenarValor: v })}
            options={ORDENAR_OPTIONS}
          />
        ) : (
          <div className="debts-filters__spacer" aria-hidden />
        )}

        <div className="debts-filters__spacer debts-filters__spacer--action" aria-hidden />
      </div>
    </section>
  )
}
