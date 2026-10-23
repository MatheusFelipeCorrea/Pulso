import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertTriangle, FileText, Wallet } from 'lucide-react'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { Checkbox } from '@/design-system/components/forms/Checkbox/Checkbox.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { categoriaToSelectOption } from '@/utils/filterOptions.js'
import { categoriaCompativelImportacao, isOrigemComSaldoExtrato } from '@/utils/importBeneficioUtils.js'

function formatDateLabel(iso) {
  try {
    return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return iso
  }
}

function StatCard({ label, value, tone = 'default' }) {
  return (
    <div className={`dashboard-import-preview__stat dashboard-import-preview__stat--${tone}`}>
      <span className="dashboard-import-preview__stat-label">{label}</span>
      <strong className="dashboard-import-preview__stat-value">{value}</strong>
    </div>
  )
}

export function ImportPreviewStep({
  linhas,
  categorias,
  origem,
  origemLabel,
  arquivoNome,
  onChangeLinhas,
  onConfirm,
  onBack,
  loading,
  resumo,
  onSaldoExtratoChange,
}) {
  const saldoExtrato = Number(resumo?.saldoExtrato ?? 0)
  const totalDetectadas = resumo?.totalDetectadas ?? linhas.length
  const duplicatas = resumo?.duplicatas ?? 0
  const importaveis = linhas.filter((linha) => !linha.duplicata).length
  const selecionadas = linhas.filter((linha) => linha.incluir !== false && !linha.duplicata).length
  const semCategoria = linhas.filter(
    (linha) => linha.incluir !== false && !linha.duplicata && !linha.categoriaId
  ).length
  const todasSelecionadas = selecionadas === importaveis && importaveis > 0
  const comSaldoExtrato = isOrigemComSaldoExtrato(origem)

  const podeConfirmar =
    (selecionadas > 0 && semCategoria === 0) ||
    (selecionadas === 0 && saldoExtrato > 0 && comSaldoExtrato)

  const toggleAll = (checked) => {
    onChangeLinhas((prev) =>
      prev.map((linha) => ({
        ...linha,
        incluir: linha.duplicata ? false : checked,
      }))
    )
  }

  const updateLinha = (id, patch) => {
    onChangeLinhas((prev) => prev.map((linha) => (linha.id === id ? { ...linha, ...patch } : linha)))
  }

  const categoriaOptions = categorias
    .filter((cat) => cat.tipo === 'RECEITA' || cat.tipo === 'DESPESA')
    .map(categoriaToSelectOption)

  const optionsForLinha = (linha) =>
    categoriaOptions.filter((opt) => {
      const cat = categorias.find((c) => c.id === opt.value)
      return categoriaCompativelImportacao(cat, origem, linha.tipo)
    })

  return (
    <div className="dashboard-import-preview">
      {(origemLabel || arquivoNome) && (
        <div className="dashboard-import-preview__meta">
          {origemLabel ? (
            <span className="dashboard-import-preview__badge">{origemLabel}</span>
          ) : null}
          {arquivoNome ? (
            <span className="dashboard-import-preview__file" title={arquivoNome}>
              <FileText size={14} aria-hidden />
              {arquivoNome}
            </span>
          ) : null}
        </div>
      )}

      <div className="dashboard-import-preview__stats">
        <StatCard label="Detectadas" value={totalDetectadas} />
        <StatCard label="Para importar" value={selecionadas} tone="primary" />
        {duplicatas > 0 ? (
          <StatCard label="Duplicatas" value={duplicatas} tone="warning" />
        ) : (
          <StatCard label="Sem categoria" value={semCategoria} tone={semCategoria > 0 ? 'danger' : 'default'} />
        )}
      </div>

      {comSaldoExtrato ? (
        <div className="dashboard-import-preview__saldo-panel">
          <div className="dashboard-import-preview__saldo-copy">
            <span className="dashboard-import-preview__saldo-icon" aria-hidden>
              <Wallet size={16} />
            </span>
            <div>
              <strong>Saldo no extrato</strong>
              <p>O dashboard usará este valor; as movimentações entram como histórico.</p>
            </div>
          </div>
          <div className="dashboard-import-preview__saldo-input">
            <InputMoney
              label="Saldo atual"
              value={saldoExtrato}
              onChange={onSaldoExtratoChange}
            />
          </div>
        </div>
      ) : null}

      {semCategoria > 0 ? (
        <div className="dashboard-import-preview__alert" role="status">
          <AlertTriangle size={16} aria-hidden />
          <span>
            {semCategoria} transação{semCategoria === 1 ? '' : 'ões'} selecionada
            {semCategoria === 1 ? '' : 's'} sem categoria — escolha uma categoria para continuar.
          </span>
        </div>
      ) : null}

      <div className="dashboard-import-preview__toolbar">
        <Checkbox
          checked={todasSelecionadas}
          onChange={toggleAll}
          label="Selecionar todas (exceto duplicatas)"
        />
        <span className="dashboard-import-preview__toolbar-count">
          {selecionadas} de {importaveis} marcadas
        </span>
      </div>

      <div className="dashboard-import-preview__table-wrap">
        <table className="dashboard-import-preview__table">
          <thead>
            <tr>
              <th scope="col" className="col-check" aria-label="Incluir" />
              <th scope="col">Data</th>
              <th scope="col">Descrição</th>
              <th scope="col" className="col-value">Valor</th>
              <th scope="col" className="col-category">Categoria</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => {
              const incluida = linha.incluir !== false && !linha.duplicata
              return (
                <tr
                  key={linha.id}
                  className={[
                    linha.duplicata ? 'is-duplicate' : undefined,
                    !incluida && !linha.duplicata ? 'is-excluded' : undefined,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <td className="col-check">
                    {linha.duplicata ? (
                      <span className="dashboard-import-preview__dup" title="Possível duplicata">
                        <AlertTriangle size={14} aria-hidden />
                      </span>
                    ) : (
                      <Checkbox
                        checked={linha.incluir !== false}
                        onChange={(checked) => updateLinha(linha.id, { incluir: checked })}
                        ariaLabel={`Incluir ${linha.descricao}`}
                      />
                    )}
                  </td>
                  <td className="col-date">{formatDateLabel(linha.data)}</td>
                  <td className="col-desc" title={linha.descricao ?? ''}>
                    {linha.descricao || '—'}
                  </td>
                  <td className={`col-value ${linha.tipo === 'RECEITA' ? 'is-income' : 'is-expense'}`}>
                    {linha.tipo === 'RECEITA' ? '+' : '−'}
                    {formatCurrency(linha.valor)}
                  </td>
                  <td className="col-category">
                    {linha.duplicata ? (
                      <span className="dashboard-import-preview__dup-label">Duplicata</span>
                    ) : (
                      <div className="dashboard-import-preview__category-cell">
                        <Select
                          className="dashboard-import-preview__category-select"
                          options={optionsForLinha(linha)}
                          value={linha.categoriaId}
                          onChange={(value) => {
                            const cat = categorias.find((c) => c.id === value)
                            updateLinha(linha.id, {
                              categoriaId: value,
                              categoriaNome: cat?.nome ?? null,
                            })
                          }}
                          placeholder="Categoria"
                        />
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

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
          {loading
            ? 'Importando…'
            : selecionadas > 0
              ? `Importar ${selecionadas} transação${selecionadas === 1 ? '' : 'ões'}`
              : 'Confirmar saldo'}
        </button>
      </div>
    </div>
  )
}
