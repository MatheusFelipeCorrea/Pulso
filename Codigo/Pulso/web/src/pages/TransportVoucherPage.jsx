import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Plus, RotateCcw } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setUser } from '@/store/slices/authSlice.js'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { Tabs } from '@/design-system/components/navigation/Tabs/Tabs.jsx'
import { MonthPicker } from '@/design-system/components/pickers/MonthPicker/MonthPicker.jsx'
import { Pagination } from '@/design-system/components/navigation/Pagination/Pagination.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { VtOptInScreen } from '@/components/features/transport/VtOptInScreen.jsx'
import { VtDisabledScreen } from '@/components/features/transport/VtDisabledScreen.jsx'
import { VtBalanceCards } from '@/components/features/transport/VtBalanceCards.jsx'
import { VtSaleHistory } from '@/components/features/transport/VtSaleHistory.jsx'
import { VtUsageHistory } from '@/components/features/transport/VtUsageHistory.jsx'
import { VtSaleModal } from '@/components/features/transport/VtSaleModal.jsx'
import { VtUsageModal } from '@/components/features/transport/VtUsageModal.jsx'
import * as transportService from '@/services/transportService.js'
import { periodoAtual } from '@/utils/transactionRecurrence.js'
import {
  canUseVtFeatures,
  isVtDisabledByUser,
  monthValueFromPeriodo,
  needsVtOptIn,
  periodoFromMonthValue,
} from '@/utils/transportUtils.js'

const LIMITE = 10

export default function TransportVoucherPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const modoUso = user?.modoUso ?? 'CLT'
  const vtHabilitado = user?.vtHabilitado
  const canUse = canUseVtFeatures(modoUso, vtHabilitado)
  const showOptIn = needsVtOptIn(modoUso, vtHabilitado)
  const showDisabled = isVtDisabledByUser(modoUso, vtHabilitado)
  const isPessoaFisica = modoUso === 'PESSOA_FISICA'

  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const [periodo, setPeriodo] = useState(() => periodoAtual())
  const [periodoRascunho, setPeriodoRascunho] = useState(() =>
    monthValueFromPeriodo(periodoAtual())
  )
  const [loadingFilter, setLoadingFilter] = useState(false)
  const [aba, setAba] = useState('vendas')
  const [pagina, setPagina] = useState(1)

  const [saldo, setSaldo] = useState(null)
  const [vendasData, setVendasData] = useState(null)
  const [usosData, setUsosData] = useState(null)

  const [loadingSaldo, setLoadingSaldo] = useState(true)
  const [loadingHistorico, setLoadingHistorico] = useState(true)

  const [modalVenda, setModalVenda] = useState(false)
  const [modalUso, setModalUso] = useState(false)
  const [submittingVenda, setSubmittingVenda] = useState(false)
  const [submittingUso, setSubmittingUso] = useState(false)
  const [vendaError, setVendaError] = useState('')
  const [usoError, setUsoError] = useState('')
  const [savingPreferencia, setSavingPreferencia] = useState(false)

  const periodoRascunhoStr = useMemo(
    () => periodoFromMonthValue(periodoRascunho),
    [periodoRascunho]
  )
  const periodoPendente = periodoRascunhoStr !== periodo
  const podeLimparPeriodo = !periodoPendente && periodo !== periodoAtual()

  const carregarSaldo = useCallback(async (signal) => {
    setLoadingSaldo(true)
    try {
      const data = await transportService.obterSaldo(periodo, { signal })
      setSaldo(data)
    } catch (err) {
      if (signal?.aborted) return
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar saldo de VT')
    } finally {
      if (!signal?.aborted) {
        setLoadingSaldo(false)
        setLoadingFilter(false)
      }
    }
  }, [periodo])

  const carregarHistorico = useCallback(async (signal) => {
    setLoadingHistorico(true)
    try {
      if (aba === 'vendas') {
        const data = await transportService.listarVendas(periodo, pagina, LIMITE, { signal })
        setVendasData(data)
      } else {
        const data = await transportService.listarUsos(periodo, pagina, LIMITE, { signal })
        setUsosData(data)
      }
    } catch (err) {
      if (signal?.aborted) return
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar histórico')
    } finally {
      if (!signal?.aborted) {
        setLoadingHistorico(false)
        setLoadingFilter(false)
      }
    }
  }, [aba, periodo, pagina])

  const recarregarTudo = useCallback(async () => {
    try {
      const [saldoData, historicoData] = await Promise.all([
        transportService.obterSaldo(periodo),
        aba === 'vendas'
          ? transportService.listarVendas(periodo, pagina, LIMITE)
          : transportService.listarUsos(periodo, pagina, LIMITE),
      ])
      setSaldo(saldoData)
      if (aba === 'vendas') setVendasData(historicoData)
      else setUsosData(historicoData)
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao atualizar dados')
    }
  }, [aba, periodo, pagina])

  useEffect(() => {
    if (!canUse) return
    const ctrl = new AbortController()
    carregarSaldo(ctrl.signal)
    return () => ctrl.abort()
  }, [canUse, carregarSaldo])

  useEffect(() => {
    if (!canUse) return
    const ctrl = new AbortController()
    carregarHistorico(ctrl.signal)
    return () => ctrl.abort()
  }, [canUse, carregarHistorico])

  useEffect(() => {
    setPagina(1)
  }, [periodo, aba])

  const handlePeriodoRascunhoChange = (value) => {
    setPeriodoRascunho(value)
  }

  const handleFiltrar = () => {
    setLoadingFilter(true)
    setPeriodo(periodoRascunhoStr)
    setPagina(1)
  }

  const handleLimparFiltros = () => {
    const atual = periodoAtual()
    setLoadingFilter(true)
    setPeriodoRascunho(monthValueFromPeriodo(atual))
    setPeriodo(atual)
    setPagina(1)
  }

  const handleBotaoFiltro = () => {
    if (periodoPendente) {
      handleFiltrar()
    } else if (podeLimparPeriodo) {
      handleLimparFiltros()
    }
  }

  const botaoFiltroIcon = loadingFilter ? (
    <SpinnerDots
      label={podeLimparPeriodo && !periodoPendente ? 'Limpando filtros...' : 'Aplicando filtros...'}
    />
  ) : podeLimparPeriodo && !periodoPendente ? (
    <RotateCcw size={16} />
  ) : undefined

  const handleVtPreferencia = async (habilitado) => {
    setSavingPreferencia(true)
    try {
      const res = await transportService.atualizarVtHabilitado(habilitado)
      dispatch(setUser({ ...user, vtHabilitado: res.vtHabilitado }))
      if (habilitado) {
        toast.success('Vale Transporte habilitado!')
      } else {
        toast.success('Vale Transporte desabilitado.')
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao salvar preferência')
    } finally {
      setSavingPreferencia(false)
    }
  }

  const handleRegistrarVenda = async (payload) => {
    setSubmittingVenda(true)
    setVendaError('')
    try {
      const res = await transportService.registrarVenda(payload)
      setModalVenda(false)
      toast.success('Venda registrada com sucesso! 💜')
      if (res.warning) {
        toast.warning(res.warning)
      }
      await recarregarTudo()
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Erro ao registrar venda'
      setVendaError(msg)
    } finally {
      setSubmittingVenda(false)
    }
  }

  const handleRegistrarUso = async (payload) => {
    setSubmittingUso(true)
    setUsoError('')
    try {
      await transportService.registrarUso(payload)
      setModalUso(false)
      toast.success('Uso registrado com sucesso! 💜')
      await recarregarTudo()
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Erro ao registrar uso'
      setUsoError(msg)
    } finally {
      setSubmittingUso(false)
    }
  }

  if (isPessoaFisica) {
    return <Navigate to="/dashboard" replace />
  }

  if (showOptIn) {
    return (
      <div className="vt-page">
        <VtOptInScreen onConfirm={handleVtPreferencia} loading={savingPreferencia} />
      </div>
    )
  }

  if (showDisabled) {
    return (
      <div className="vt-page">
        <VtDisabledScreen
          onEnable={() => handleVtPreferencia(true)}
          loading={savingPreferencia}
        />
      </div>
    )
  }

  const paginacao = aba === 'vendas' ? vendasData?.paginacao : usosData?.paginacao

  return (
    <div className="vt-page">
      <header className="vt-page__header">
        <h1 className="vt-page__title">Vale Transporte</h1>
        <p className="vt-page__subtitle">
          Acompanhe seu saldo, usos e vendas do vale transporte.
        </p>
      </header>

      <section className="vt-filters" aria-label="Filtro de período">
        <MonthPicker
          label="Período"
          value={periodoRascunho}
          onChange={handlePeriodoRascunhoChange}
          monthDisplay="long"
          disableFuture
          className="vt-filters__period"
        />
        <div className="vt-filters__action-wrap">
          <Button
            type="button"
            variant={podeLimparPeriodo && !periodoPendente ? 'secondary' : 'primary'}
            size="md"
            disabled={loadingFilter || (!periodoPendente && !podeLimparPeriodo)}
            onClick={handleBotaoFiltro}
            leftIcon={botaoFiltroIcon}
            className="vt-filters__action"
          >
            {periodoPendente ? 'Filtrar' : podeLimparPeriodo ? 'Limpar filtros' : 'Filtrar'}
          </Button>
        </div>
      </section>

      <VtBalanceCards saldo={saldo} periodo={periodo} loading={loadingSaldo} />

      <div className="vt-page__actions">
        <Button
          variant="secondary"
          leftIcon={<Plus size={18} />}
          onClick={() => setModalUso(true)}
        >
          Registrar Uso
        </Button>
        <Button
          variant="primary"
          leftIcon={<Plus size={18} />}
          onClick={() => setModalVenda(true)}
        >
          Registrar Venda
        </Button>
      </div>

      <section className="vt-history">
        <div className="vt-history__tabs">
          <Tabs
            tabs={[
              { key: 'vendas', label: 'Histórico de vendas' },
              { key: 'usos', label: 'Histórico de usos' },
            ]}
            activeKey={aba}
            onChange={setAba}
          />
        </div>

        {aba === 'vendas' ? (
          <VtSaleHistory
            vendas={vendasData?.vendas ?? []}
            totais={vendasData?.totais}
            loading={loadingHistorico}
            onRetry={carregarHistorico}
            onRegister={() => setModalVenda(true)}
          />
        ) : (
          <VtUsageHistory
            usos={usosData?.usos ?? []}
            totais={usosData?.totais}
            loading={loadingHistorico}
            onRetry={carregarHistorico}
            onRegister={() => setModalUso(true)}
          />
        )}

        {paginacao && paginacao.paginas > 1 ? (
          <div className="vt-page__pagination">
            <Pagination
              page={paginacao.paginaAtual}
              totalPages={paginacao.paginas}
              onChange={setPagina}
            />
          </div>
        ) : null}
      </section>

      <VtSaleModal
        open={modalVenda}
        saldo={saldo}
        onClose={() => {
          setModalVenda(false)
          setVendaError('')
        }}
        onSubmit={handleRegistrarVenda}
        submitting={submittingVenda}
        error={vendaError}
      />

      <VtUsageModal
        open={modalUso}
        saldo={saldo}
        valorPadrao={saldo?.valorPadraoPassagem ?? user?.valorPadraoPassagem}
        onClose={() => {
          setModalUso(false)
          setUsoError('')
        }}
        onSubmit={handleRegistrarUso}
        submitting={submittingUso}
        error={usoError}
      />
    </div>
  )
}
