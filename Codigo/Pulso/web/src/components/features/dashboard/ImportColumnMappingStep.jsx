import { Select } from '@/design-system/components/selects/Select/Select.jsx'

const CAMPOS = [
  { key: 'data', label: 'Data' },
  { key: 'valor', label: 'Valor' },
  { key: 'descricao', label: 'Descrição' },
]

export function ImportColumnMappingStep({ colunas = [], mapping, onChangeMapping, onSubmit, onBack, loading }) {
  const options = colunas.map((col) => ({ value: col, label: col }))

  return (
    <div className="dashboard-import-mapping">
      <p className="dashboard-import-mapping__hint">
        Não identificamos as colunas automaticamente. Informe qual coluna corresponde a cada campo.
      </p>

      <div className="dashboard-import-mapping__fields">
        {CAMPOS.map((campo) => (
          <Select
            key={campo.key}
            label={campo.label}
            placeholder="Selecione a coluna"
            options={options}
            value={mapping[campo.key] ?? null}
            onChange={(value) => onChangeMapping((prev) => ({ ...prev, [campo.key]: value }))}
          />
        ))}
      </div>

      <div className="dashboard-import-mapping__actions">
        <button type="button" className="dashboard-import-modal__back" onClick={onBack}>
          ← Voltar
        </button>
        <button
          type="button"
          className="dashboard-import-mapping__submit"
          disabled={loading || !mapping.data || !mapping.valor || !mapping.descricao}
          onClick={onSubmit}
        >
          {loading ? 'Analisando…' : 'Continuar'}
        </button>
      </div>
    </div>
  )
}
