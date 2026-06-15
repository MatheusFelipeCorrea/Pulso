import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, Info } from 'lucide-react'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { buildCurrencySelectOptions } from '@/components/features/trips/CurrencyFlag.jsx'
import * as moedaService from '@/services/moedaService.js'

function buildRatesMap(favoritas = [], extra = []) {
  const map = {
    BRL: { code: 'BRL', bid: 1, pctChange: 0, updatedAt: null },
  }

  for (const item of [...favoritas, ...extra]) {
    if (!item?.code) continue
    map[item.code] = item
  }

  return map
}

function convertAmount(valor, de, para, ratesMap) {
  const amount = Number(valor)
  if (!Number.isFinite(amount) || amount < 0) return null

  const rateDe = de === 'BRL' ? 1 : Number(ratesMap[de]?.bid)
  const ratePara = para === 'BRL' ? 1 : Number(ratesMap[para]?.bid)

  if (!Number.isFinite(rateDe) || rateDe <= 0 || !Number.isFinite(ratePara) || ratePara <= 0) {
    return null
  }

  const valorEmBrl = de === 'BRL' ? amount : amount * rateDe
  const valorConvertido = para === 'BRL' ? valorEmBrl : valorEmBrl / ratePara
  const taxa = para === 'BRL' ? rateDe : rateDe / ratePara

  const updatedAt =
    ratesMap[para]?.updatedAt ?? ratesMap[de]?.updatedAt ?? new Date().toISOString()

  return {
    de,
    para,
    valorOrigem: amount.toFixed(2),
    valorConvertido: valorConvertido.toFixed(2),
    taxa: taxa.toFixed(4),
    atualizadoEm: updatedAt,
  }
}

function buildCotacaoLabelFromRates(de, para, ratesMap) {
  const rateDe = de === 'BRL' ? 1 : Number(ratesMap[de]?.bid)
  const ratePara = para === 'BRL' ? 1 : Number(ratesMap[para]?.bid)
  if (!Number.isFinite(rateDe) || rateDe <= 0 || !Number.isFinite(ratePara) || ratePara <= 0) {
    return null
  }

  if (de === 'BRL' && para !== 'BRL') {
    return `1 ${para} = ${formatCurrency(ratePara)}`
  }
  if (para === 'BRL' && de !== 'BRL') {
    return `1 ${de} = ${formatCurrency(rateDe)}`
  }
  return `1 ${de} = ${(rateDe / ratePara).toFixed(4)} ${para}`
}

export function TripQuickConverter({ catalog = [], favoritas = [], ratesUpdatedAt }) {
  const [valor, setValor] = useState(0)
  const [de, setDe] = useState('BRL')
  const [para, setPara] = useState('USD')
  const [extraRates, setExtraRates] = useState([])
  const [loadingRates, setLoadingRates] = useState(false)
  const [rateError, setRateError] = useState('')

  const options = useMemo(() => buildCurrencySelectOptions(catalog), [catalog])
  const targetOptions = useMemo(
    () => buildCurrencySelectOptions(catalog, { exclude: de === 'BRL' ? ['BRL'] : [] }),
    [catalog, de]
  )

  const ratesMap = useMemo(() => buildRatesMap(favoritas, extraRates), [favoritas, extraRates])

  const ensureRates = useCallback(async () => {
    const needed = [de, para]
      .filter((code) => code !== 'BRL')
      .filter((code) => {
        const bid = Number(ratesMap[code]?.bid)
        return !Number.isFinite(bid) || bid <= 0
      })

    if (!needed.length) {
      setRateError('')
      return
    }

    setLoadingRates(true)
    setRateError('')

    try {
      const data = await moedaService.listarCotacoes(needed)
      setExtraRates((prev) => {
        const merged = [...prev]
        for (const item of data.cotacoes ?? []) {
          const index = merged.findIndex((rate) => rate.code === item.code)
          if (index >= 0) merged[index] = item
          else merged.push(item)
        }
        return merged
      })
    } catch (err) {
      setRateError(err.response?.data?.message ?? 'Não foi possível carregar a cotação.')
    } finally {
      setLoadingRates(false)
    }
  }, [de, para, ratesMap])

  useEffect(() => {
    ensureRates()
  }, [ensureRates])

  const resultado = useMemo(
    () => convertAmount(valor, de, para, ratesMap),
    [valor, de, para, ratesMap]
  )

  const targetCurrency = catalog.find((item) => item.code === para)
  const cotacaoLabel = useMemo(() => {
    if (valor > 0 && resultado) {
      const taxa = Number(resultado.taxa)
      if (!Number.isFinite(taxa) || taxa <= 0) return buildCotacaoLabelFromRates(de, para, ratesMap)

      if (de === 'BRL' && para !== 'BRL') {
        return `1 ${para} = ${formatCurrency(1 / taxa)}`
      }
      if (para === 'BRL' && de !== 'BRL') {
        return `1 ${de} = ${formatCurrency(taxa)}`
      }
      return `1 ${de} = ${taxa.toFixed(4)} ${para}`
    }
    return buildCotacaoLabelFromRates(de, para, ratesMap)
  }, [valor, resultado, de, para, ratesMap])

  const convertedAmount = Number(resultado?.valorConvertido ?? 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const hasAmount = valor > 0

  const handleSwap = () => {
    setDe(para)
    setPara(de)
  }

  return (
    <section className="trips-converter">
      <h2>Conversor rápido</h2>
      <div className="trips-converter__grid">
        <div className="trips-converter__side">
          <span className="trips-converter__label">Você envia</span>
          <div className="trips-converter__money">
            <InputMoney
              value={valor}
              onChange={setValor}
              size="large"
              placeholder="0,00"
            />
          </div>
          <Select value={de} onChange={setDe} options={options} />
        </div>

        <button
          type="button"
          className="trips-converter__swap"
          aria-label="Inverter moedas"
          onClick={handleSwap}
        >
          <ArrowRight size={16} />
        </button>

        <div className="trips-converter__side trips-converter__side--result">
          <span className="trips-converter__label">Você recebe</span>
          <Select value={para} onChange={setPara} options={targetOptions} />
          <div className="trips-converter__result-box" aria-live="polite">
            <strong
              className={`trips-converter__amount${hasAmount ? '' : ' trips-converter__amount--empty'}`}
            >
              {loadingRates ? '...' : `${targetCurrency?.symbol ?? ''} ${convertedAmount}`}
            </strong>
          </div>
        </div>
      </div>

      {rateError ? <p className="trips-converter__error">{rateError}</p> : null}

      {cotacaoLabel ? (
        <p className="trips-converter__rate">
          <Info size={12} aria-hidden />
          <span>
            Cotação: {cotacaoLabel}
            {resultado?.atualizadoEm
              ? ` · Atualizado ${new Date(resultado.atualizadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
              : ratesUpdatedAt
                ? ` · Atualizado ${new Date(ratesUpdatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                : ''}
          </span>
        </p>
      ) : null}
    </section>
  )
}
