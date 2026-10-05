import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import * as calendarService from '@/services/calendarService.js'

function GoogleCalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="calendar-google__icon">
      <rect x="3" y="4" width="18" height="17" rx="2" fill="#fff" stroke="#dadce0" strokeWidth="1" />
      <rect x="3" y="4" width="18" height="5" rx="2" fill="#1a73e8" />
      <text x="12" y="18" textAnchor="middle" fill="#1a73e8" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif">
        31
      </text>
    </svg>
  )
}

export function GoogleCalendarBanner({
  onStatusChange,
  refreshToken = 0,
  onOpenResync,
}) {
  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast
  const onStatusChangeRef = useRef(onStatusChange)
  onStatusChangeRef.current = onStatusChange
  const [status, setStatus] = useState(null)
  const [pendentes, setPendentes] = useState({
    futuros: 0,
    todos: 0,
    futurosNaoPagos: 0,
    todosNaoPagos: 0,
  })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const data = await calendarService.obterStatusGoogle()
      setStatus(data)
      onStatusChangeRef.current?.(data)

      if (data.conectado) {
        const counts = await calendarService.obterPendentesSyncGoogle()
        setPendentes(counts)
      } else {
        setPendentes({ futuros: 0, todos: 0, futurosNaoPagos: 0, todosNaoPagos: 0 })
      }
    } catch {
      setStatus({ conectado: false, email: null })
      setPendentes({ futuros: 0, todos: 0, futurosNaoPagos: 0, todosNaoPagos: 0 })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar, refreshToken])

  const conectar = async () => {
    setActionLoading(true)
    try {
      const { url } = await calendarService.obterUrlGoogle()
      window.location.href = url
    } catch {
      setActionLoading(false)
    }
  }

  const desconectar = async () => {
    setActionLoading(true)
    try {
      await calendarService.desconectarGoogle()
      setStatus((prev) => {
        const next = { conectado: false, email: prev?.email ?? null }
        onStatusChangeRef.current?.(next)
        return next
      })
      toastRef.current.success('Google Agenda desconectado.')
      await carregar()
    } catch {
      toastRef.current.error('Não foi possível desconectar o Google Agenda.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="calendar-google calendar-google--loading">
        <SpinnerDots label="Carregando Google Agenda..." />
      </div>
    )
  }

  const conectado = Boolean(status?.conectado)

  return (
    <div className="calendar-google">
      <div className="calendar-google__info">
        <GoogleCalendarIcon />
        <p className="calendar-google__status">
          <strong className="calendar-google__label">Google Agenda:</strong>
          <span
            className={`calendar-google__dot calendar-google__dot--${conectado ? 'on' : 'off'}`}
            aria-hidden
          />
          <span className="calendar-google__status-text">
            {conectado ? 'Conectado' : 'Não conectado'}
          </span>
          {conectado && status?.email ? (
            <span className="calendar-google__email" title="Conta Google conectada ao Agenda">
              ({status.email})
            </span>
          ) : null}
        </p>
        {conectado ? (
          <p className="calendar-google__hint">
            Novos lembretes sincronizam automaticamente. Os criados antes da conexão podem ser
            enviados pelo botão ao lado.
          </p>
        ) : null}
      </div>

      <div className="calendar-google__actions">
      {conectado && (pendentes.todos ?? 0) > 0 ? (
        <Button
          variant="ghost"
          size="sm"
          className="calendar-google__action"
          onClick={() => onOpenResync?.(pendentes)}
          disabled={actionLoading}
        >
          Sincronizar anteriores ({pendentes.todos})
        </Button>
      ) : null}

      {conectado ? (
        <Button
          variant="secondary"
          size="sm"
          className="calendar-google__action"
          onClick={desconectar}
          disabled={actionLoading}
        >
          {actionLoading ? 'Desconectando...' : 'Desconectar'}
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="calendar-google__action"
          onClick={conectar}
          disabled={actionLoading}
        >
          {actionLoading ? 'Abrindo Google...' : 'Conectar'}
        </Button>
      )}
      </div>
    </div>
  )
}
