import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { getResourceConfig } from '@/components/features/dashboard/ResourceCard/resourceConfig.js'

export function ImportManualBalanceStep({
  type,
  saldo,
  onSaldoChange,
  onConfirm,
  onBack,
  loading,
}) {
  const resource = getResourceConfig(type.recurso)
  const podeConfirmar = Number(saldo) > 0

  return (
    <div className="dashboard-import-manual">
      <p className="dashboard-import-manual__hint">
        Sem extrato em PDF? Informe o saldo disponível em{' '}
        <strong style={{ color: `var(${resource.colorVar})` }}>{type.label}</strong> — o dashboard
        será ajustado automaticamente.
      </p>

      <InputMoney
        label="Saldo atual"
        value={saldo}
        onChange={onSaldoChange}
        required
        helperText="Use o valor que aparece no app do benefício ou que você sabe ter disponível."
      />

      <div className="dashboard-import-preview__actions">
        <button type="button" className="dashboard-import-modal__back" onClick={onBack}>
          ← Voltar
        </button>
        <button
          type="button"
          className="dashboard-import-mapping__submit"
          disabled={loading || !podeConfirmar}
          onClick={onConfirm}
        >
          {loading ? 'Salvando…' : 'Confirmar saldo'}
        </button>
      </div>
    </div>
  )
}
