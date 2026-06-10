import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import { isSameMonth, parseISO, startOfMonth } from 'date-fns'

import { Plus } from 'lucide-react'

import { Button } from '@/design-system/components/buttons/Button/Button.jsx'

import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'

import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'

import { CalendarInsightCard } from '@/components/features/calendar/CalendarInsightCard.jsx'

import { CalendarMonthNav } from '@/components/features/calendar/CalendarMonthNav.jsx'

import {

  CalendarMonthGrid,

  dateToApiKey,

} from '@/components/features/calendar/CalendarMonthGrid.jsx'

import { CalendarDayPanel } from '@/components/features/calendar/CalendarDayPanel.jsx'

import { UpcomingReminders } from '@/components/features/calendar/UpcomingReminders.jsx'

import { ReminderFormModal } from '@/components/features/calendar/ReminderFormModal.jsx'

import { GoogleCalendarBanner } from '@/components/features/calendar/GoogleCalendarBanner.jsx'
import { GoogleResyncModal } from '@/components/features/calendar/GoogleResyncModal.jsx'

import * as calendarService from '@/services/calendarService.js'

import * as reminderService from '@/services/reminderService.js'
import { deleteReminderMessage } from '@/utils/confirmDeleteMessages.js'
import { reminderHasPayment } from '@/utils/reminderUtils.js'



export default function CalendarPage() {

  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast
  const googleConnectHandledRef = useRef(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const [periodo, setPeriodo] = useState(() => {

    const now = new Date()

    const y = now.getFullYear()

    const m = String(now.getMonth() + 1).padStart(2, '0')

    return `${y}-${m}`

  })

  const [visaoMes, setVisaoMes] = useState(null)

  const [loadingMes, setLoadingMes] = useState(true)

  const [selectedDate, setSelectedDate] = useState(() => new Date())

  const [detalheDia, setDetalheDia] = useState(null)

  const [loadingDia, setLoadingDia] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)

  const [editingReminder, setEditingReminder] = useState(null)

  const [submitting, setSubmitting] = useState(false)

  const [googleBannerRefresh, setGoogleBannerRefresh] = useState(0)

  const [googleConnected, setGoogleConnected] = useState(false)

  const [resyncModalOpen, setResyncModalOpen] = useState(false)

  const [resyncPendentes, setResyncPendentes] = useState({
    futuros: 0,
    todos: 0,
    futurosNaoPagos: 0,
    todosNaoPagos: 0,
  })

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deletingReminder, setDeletingReminder] = useState(false)



  const monthDate = useMemo(() => parseISO(`${periodo}-01T12:00:00`), [periodo])



  const carregarMes = useCallback(async (signal) => {

    setLoadingMes(true)

    try {

      const data = await calendarService.obterVisaoMes(periodo, { signal })

      setVisaoMes(data)

    } catch (err) {

      if (signal?.aborted || err.code === 'ERR_CANCELED') return

      toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar calendário')

    } finally {

      if (!signal?.aborted) setLoadingMes(false)

    }

  }, [periodo])



  const carregarDia = useCallback(async (date, signal) => {

    setLoadingDia(true)

    try {

      const data = await calendarService.obterDetalheDia(dateToApiKey(date), { signal })

      setDetalheDia(data)

    } catch (err) {

      if (signal?.aborted || err.code === 'ERR_CANCELED') return

      toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar detalhes do dia')

    } finally {

      if (!signal?.aborted) setLoadingDia(false)

    }

  }, [])



  useEffect(() => {

    const controller = new AbortController()

    carregarMes(controller.signal)

    return () => controller.abort()

  }, [carregarMes])



  useEffect(() => {

    setSelectedDate((current) => {

      if (current && isSameMonth(current, monthDate)) return current

      const today = new Date()

      return isSameMonth(today, monthDate) ? today : startOfMonth(monthDate)

    })

  }, [monthDate])



  useEffect(() => {

    if (!selectedDate) return undefined

    const controller = new AbortController()

    carregarDia(selectedDate, controller.signal)

    return () => controller.abort()

  }, [selectedDate, carregarDia])



  useEffect(() => {
    const mes = searchParams.get('mes')
    if (mes && /^\d{4}-\d{2}$/.test(mes)) {
      setPeriodo(mes)
    }

    const data = searchParams.get('data')
    if (data && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
      setPeriodo(data.slice(0, 7))
      setSelectedDate(parseISO(`${data}T12:00:00`))
    }
  }, [searchParams])

  useEffect(() => {

    if (searchParams.get('google') !== 'connected') {
      googleConnectHandledRef.current = false
      return undefined
    }

    if (googleConnectHandledRef.current) return undefined

    googleConnectHandledRef.current = true

    let cancelled = false

    const confirmarConexaoGoogle = async () => {

      try {

        const status = await calendarService.obterStatusGoogle()

        if (cancelled) return

        setGoogleBannerRefresh((value) => value + 1)

        if (status.conectado) {

          toast.success('Google Agenda conectado com sucesso!')

          try {
            const pendentes = await calendarService.obterPendentesSyncGoogle()
            if (!cancelled && (pendentes.todos ?? 0) > 0) {
              setResyncPendentes(pendentes)
              setResyncModalOpen(true)
            }
          } catch {
            // Conexão ok — sync manual disponível no banner se necessário.
          }

          recarregarTudo()

        } else {

          toast.error('Não foi possível confirmar a conexão com o Google Agenda.')

        }

      } catch {

        if (!cancelled) {

          toast.error('Não foi possível confirmar a conexão com o Google Agenda.')

        }

      } finally {

        if (cancelled) return

        const nextParams = new URLSearchParams(searchParams)

        nextParams.delete('google')

        setSearchParams(nextParams, { replace: true })

      }

    }

    confirmarConexaoGoogle()

    return () => {

      cancelled = true

    }

  }, [searchParams, setSearchParams])



  const recarregarTudo = async () => {

    await carregarMes()

    if (selectedDate) await carregarDia(selectedDate)

  }

  const handleGoogleStatusChange = useCallback((status) => {
    setGoogleConnected(Boolean(status?.conectado))
  }, [])






  const abrirNovoLembrete = () => {

    setEditingReminder(null)

    setModalOpen(true)

  }



  const abrirEditarLembrete = (lembrete) => {

    setEditingReminder(lembrete)

    setModalOpen(true)

  }



  const handleSalvarLembrete = async (payload) => {

    setSubmitting(true)

    try {

      if (editingReminder) {

        await reminderService.atualizarLembrete(editingReminder.id, payload)

        toast.success('Lembrete atualizado!')

      } else {

        await reminderService.criarLembrete(payload)

        toast.success(
          payload.sincronizarGoogle
            ? 'Lembrete criado e sincronizado com o Google Agenda!'
            : 'Lembrete criado!'
        )

      }

      setModalOpen(false)

      setEditingReminder(null)

      await recarregarTudo()

    } catch (err) {

      toast.error(err.response?.data?.message ?? 'Erro ao salvar lembrete')

      throw err

    } finally {

      setSubmitting(false)

    }

  }



  const abrirExcluirLembrete = (lembrete) => {
    setDeleteTarget(lembrete)
    setDeleteModalOpen(true)
  }

  const handleConfirmExcluirLembrete = async () => {
    if (!deleteTarget) return

    setDeletingReminder(true)
    try {
      await reminderService.excluirLembrete(deleteTarget.id)
      toast.success('Lembrete excluído')
      setDeleteModalOpen(false)
      setDeleteTarget(null)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir lembrete')
    } finally {
      setDeletingReminder(false)
    }
  }



  const handleMarcarPago = async (lembrete) => {

    try {

      await reminderService.marcarComoPago(lembrete.id)

      toast.success(
        reminderHasPayment(lembrete) ? 'Marcado como pago!' : 'Marcado como feito!'
      )

      await recarregarTudo()

    } catch (err) {

      toast.error(
        err.response?.data?.message
          ?? (reminderHasPayment(lembrete) ? 'Erro ao marcar como pago' : 'Erro ao marcar como feito')
      )

    }

  }



  return (

    <div className="calendar-page">

      <header className="calendar-page__header">
        <div>
          <h1 className="calendar-page__title">Calendário Financeiro</h1>
          <p className="calendar-page__subtitle">
            Acompanhe vencimentos, lembretes e o resumo financeiro do mês.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          className="calendar-page__cta shrink-0 whitespace-nowrap"
          leftIcon={<Plus size={16} />}
          onClick={abrirNovoLembrete}
        >
          Novo Lembrete
        </Button>
      </header>



      <GoogleCalendarBanner
        refreshToken={googleBannerRefresh}
        onStatusChange={handleGoogleStatusChange}
        onOpenResync={(pendentes) => {
          setResyncPendentes(pendentes)
          setResyncModalOpen(true)
        }}
      />

      <GoogleResyncModal
        open={resyncModalOpen}
        onClose={() => setResyncModalOpen(false)}
        pendentes={resyncPendentes}
        onSynced={(resultado, err) => {
          if (err) {
            toast.error(err.response?.data?.message ?? 'Erro ao sincronizar lembretes.')
            return
          }
          if ((resultado?.sincronizados ?? 0) > 0) {
            const parcial = resultado.erros?.length
              ? ` (${resultado.erros.length} com falha)`
              : ''
            toast.success(
              `${resultado.sincronizados} lembrete${resultado.sincronizados === 1 ? '' : 's'} sincronizado${resultado.sincronizados === 1 ? '' : 's'} no calendário Pulso!${parcial}`
            )
            setGoogleBannerRefresh((value) => value + 1)
            recarregarTudo()
            return
          }
          if ((resultado?.total ?? 0) === 0) {
            toast.info('Nenhum lembrete encontrado para sincronizar.')
            return
          }
          toast.warning('Nenhum lembrete foi sincronizado. Tente novamente ou reconecte o Google.')
        }}
      />



      <CalendarInsightCard resumo={visaoMes?.resumo} loading={loadingMes} monthDate={monthDate} />



      <div className="calendar-page__main">

        <div className="calendar-page__row">

          <div className="calendar-page__grid-wrap">

            <CalendarMonthNav periodo={periodo} onChangePeriodo={setPeriodo} />

            <CalendarMonthGrid

              monthDate={monthDate}

              selectedDate={selectedDate}

              dias={visaoMes?.dias ?? {}}

              onSelectDay={setSelectedDate}

            />

          </div>

          <CalendarDayPanel

            selectedDate={selectedDate}

            detalhe={detalheDia}

            loading={loadingDia}

            onEditReminder={abrirEditarLembrete}

            onDeleteReminder={abrirExcluirLembrete}

            onMarkPaid={handleMarcarPago}

          />

        </div>

        <UpcomingReminders

          items={visaoMes?.proximosVencimentos ?? []}

          onEdit={abrirEditarLembrete}

          onDelete={abrirExcluirLembrete}

          onMarkPaid={handleMarcarPago}

        />

      </div>



      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={handleConfirmExcluirLembrete}
        message={
          deleteTarget
            ? deleteReminderMessage(deleteTarget.titulo)
            : deleteReminderMessage('este lembrete')
        }
        loading={deletingReminder}
      />

      <ReminderFormModal

        open={modalOpen}

        onClose={() => {

          setModalOpen(false)

          setEditingReminder(null)

        }}

        onSubmit={handleSalvarLembrete}

        submitting={submitting}

        lembrete={editingReminder}

        defaultDate={selectedDate ?? new Date()}

        googleConnected={googleConnected}

      />

    </div>

  )

}

