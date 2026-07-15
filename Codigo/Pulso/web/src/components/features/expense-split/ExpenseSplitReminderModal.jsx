import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlarmClock, Bell, Calendar, DollarSign, Eye, Hourglass, RefreshCw, Users, Wallet, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { Checkbox } from '@/design-system/components/forms/Checkbox/Checkbox.jsx'
import { Toggle } from '@/design-system/components/forms/Toggle/Toggle.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { formatPersonName } from '@/utils/personName.js'
import * as calendarService from '@/services/calendarService.js'

function GoogleCalendarAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path d="M6 14a4 4 0 0 1 4-4h4v8H6z" fill="#EA4335" />
      <path d="M42 14a4 4 0 0 0-4-4h-4v8h8z" fill="#EA4335" />
      <rect x="6" y="10" width="36" height="32" fill="#fff" />
      <rect x="6" y="10" width="36" height="10" fill="#1A73E8" />
      <path d="M6 38v-4l4 4z" fill="#188038" />
      <path d="M42 38v-4l-4 4z" fill="#F9AB00" />
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fontSize="16"
        fill="#1A73E8"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
      >
        31
      </text>
    </svg>
  )
}

const QUANDO_OPTIONS = [
  { value: 'HOJE', label: 'Hoje', dias: 0 },
  { value: 'AMANHA', label: 'Amanhã', dias: 1 },
  { value: 'EM_2_DIAS', label: 'Em 2 dias', dias: 2 },
  { value: 'EM_3_DIAS', label: 'Em 3 dias', dias: 3 },
  { value: 'UMA_SEMANA', label: 'Em 1 semana', dias: 7 },
  { value: 'PERSONALIZADO', label: 'Data personalizada', dias: null },
]

const formatarListaNomes = (nomes) => {
  if (nomes.length === 1) return nomes[0]
  if (nomes.length === 2) return `${nomes[0]} e ${nomes[1]}`
  return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`
}

const addDays = (date, dias) => {
  const result = new Date(date)
  result.setDate(result.getDate() + dias)
  return result
}

const diasEntreHojeE = (data) => {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const alvo = new Date(data)
  alvo.setHours(0, 0, 0, 0)
  return Math.round((alvo.getTime() - hoje.getTime()) / 86400000)
}

const formatDate = (date) => format(date, 'dd/MM/yyyy', { locale: ptBR })

const diasAteTexto = (dias) => {
  if (dias === 0) return 'hoje'
  if (dias === 1) return 'amanhã'
  if (dias < 0) return `${Math.abs(dias)} dia(s) atrás`
  return `em ${dias} dias`
}

export function ExpenseSplitReminderModal({
  open,
  onClose,
  onSubmit,
  submitting = false,
  divisao,
  participantesPendentes = [],
}) {
  const [selecionados, setSelecionados] = useState(() => new Set())
  const [quandoPreset, setQuandoPreset] = useState('EM_2_DIAS')
  const [dataLembrete, setDataLembrete] = useState(() => addDays(new Date(), 2))
  const [repetir, setRepetir] = useState(false)
  const [repetirCadaDias, setRepetirCadaDias] = useState(3)
  const [sincronizarGoogle, setSincronizarGoogle] = useState(false)
  const [googleConnected, setGoogleConnected] = useState(false)

  useEffect(() => {
    if (!open) return
    setSelecionados(new Set(participantesPendentes.map((p) => p.id)))
    setQuandoPreset('EM_2_DIAS')
    setDataLembrete(addDays(new Date(), 2))
    setRepetir(false)
    setRepetirCadaDias(3)
    setSincronizarGoogle(false)
    calendarService
      .obterStatusGoogle()
      .then((status) => setGoogleConnected(Boolean(status?.conectado)))
      .catch(() => setGoogleConnected(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!divisao) return null

  const toggleSelecionado = (id) => {
    setSelecionados((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleQuandoChange = (value) => {
    setQuandoPreset(value)
    const opt = QUANDO_OPTIONS.find((o) => o.value === value)
    if (opt?.dias != null) setDataLembrete(addDays(new Date(), opt.dias))
  }

  const handleDataChange = (value) => {
    setDataLembrete(value)
    setQuandoPreset('PERSONALIZADO')
  }

  const participantesSelecionados = participantesPendentes.filter((p) => selecionados.has(p.id))
  const valorSelecionado = participantesSelecionados.reduce((acc, p) => acc + Number(p.valor), 0)
  const nomesTexto = participantesSelecionados.length
    ? formatarListaNomes(participantesSelecionados.map((p) => formatPersonName(p.nome)))
    : ''
  const tituloLembrete = nomesTexto ? `Cobrar ${nomesTexto}` : 'Cobrar'
  const diasAte = diasEntreHojeE(dataLembrete)
  const podeEnviar = participantesSelecionados.length > 0

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!podeEnviar) return

    await onSubmit?.({
      participanteIds: participantesSelecionados.map((p) => p.id),
      dataVencimento: dataLembrete.toISOString().slice(0, 10),
      repetirCadaDias: repetir ? Number(repetirCadaDias) : null,
      sincronizarGoogle: googleConnected && sincronizarGoogle,
    })
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="lg" className="expense-split-reminder-modal">
      <form className="expense-split-reminder" onSubmit={handleSubmit} noValidate>
        <header className="expense-split-reminder__header">
          <h2>Lembrar de Cobrar</h2>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="expense-split-reminder__body">
          <div className="expense-split-reminder__card">
            <span
              className="expense-split-reminder__card-icon"
              style={{
                color: divisao.cor ?? undefined,
                background: divisao.cor
                  ? `color-mix(in srgb, ${divisao.cor} 14%, transparent)`
                  : undefined,
              }}
              aria-hidden
            >
              {resolveBadgeIcon(divisao.icone ?? 'Receipt', { size: 20 })}
            </span>
            <div>
              <strong>
                {divisao.titulo} — {formatCurrency(divisao.valorTotal)}
              </strong>
              <p className="expense-split-reminder__card-date">
                <Calendar size={13} aria-hidden /> {formatDate(new Date(divisao.data))}
              </p>
            </div>
          </div>

          <section className="expense-split-reminder__section">
            <h3>
              <Users size={16} aria-hidden /> Pendentes{' '}
              <span className="expense-split-reminder__hint">(selecione quem você quer lembrar)</span>
            </h3>
            <ul className="expense-split-reminder__participants">
              {participantesPendentes.map((participante) => (
                <li key={participante.id} className="expense-split-reminder__participant-row">
                  <Checkbox
                    checked={selecionados.has(participante.id)}
                    onChange={() => toggleSelecionado(participante.id)}
                  />
                  <Hourglass size={14} className="expense-split-reminder__pending-icon" aria-hidden />
                  <span className="expense-split-reminder__participant-name">
                    {formatPersonName(participante.nome)}
                  </span>
                  <span className="expense-split-reminder__participant-value">
                    deve {formatCurrency(participante.valor)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <div className="expense-split-reminder__total">
            <Wallet size={16} aria-hidden />
            <span>Total pendente selecionado:</span>
            <strong>{formatCurrency(valorSelecionado)}</strong>
          </div>

          <section className="expense-split-reminder__section">
            <h3>
              <AlarmClock size={16} aria-hidden /> Configurar lembrete
            </h3>

            <FormFieldLabel icon={Calendar}>Quando lembrar?</FormFieldLabel>
            <div className="expense-split-reminder__row">
              <Select
                value={quandoPreset}
                onChange={handleQuandoChange}
                options={QUANDO_OPTIONS.map(({ value, label }) => ({ value, label }))}
              />
              <DatePicker value={dataLembrete} onChange={handleDataChange} />
            </div>

            <div className="expense-split-reminder__toggle-block">
              <Toggle
                label={
                  <span className="expense-split-reminder__toggle-label">
                    <Bell size={15} aria-hidden /> Repetir?
                  </span>
                }
                description="Se ativado, você será lembrado novamente."
                checked={repetir}
                onChange={setRepetir}
              />
              {repetir ? (
                <p className="expense-split-reminder__repeat-config">
                  Repetir a cada{' '}
                  <input
                    type="number"
                    min={1}
                    value={repetirCadaDias}
                    onChange={(e) => setRepetirCadaDias(e.target.value)}
                    className="expense-split-reminder__repeat-input"
                  />{' '}
                  dias até marcar como pago
                </p>
              ) : null}
            </div>

            <div className="expense-split-reminder__toggle-block">
              <Toggle
                label={
                  <span className="expense-split-reminder__google-label">
                    <GoogleCalendarAppIcon /> Adicionar ao Google Calendar
                  </span>
                }
                description={
                  googleConnected
                    ? 'O lembrete será criado como um evento.'
                    : 'Conecte o Google Agenda no Calendário para sincronizar.'
                }
                checked={googleConnected && sincronizarGoogle}
                disabled={!googleConnected}
                onChange={setSincronizarGoogle}
              />
              {googleConnected && sincronizarGoogle ? (
                <p className="expense-split-reminder__google-preview">
                  Evento que será criado:{' '}
                  <strong>
                    {tituloLembrete} — {divisao.titulo} ({formatCurrency(valorSelecionado)})
                  </strong>
                </p>
              ) : null}
            </div>
          </section>

          <section className="expense-split-reminder__section">
            <h3>
              <Eye size={16} aria-hidden /> Preview do lembrete
            </h3>
            <div className="expense-split-reminder__preview">
              <p>
                <Bell size={14} className="expense-split-reminder__preview-icon--yellow" aria-hidden />
                Lembrete: <strong className="expense-split-reminder__preview-yellow">{tituloLembrete}</strong>
              </p>
              <p>
                <DollarSign size={14} className="expense-split-reminder__preview-icon--green" aria-hidden />
                Valor: <strong className="expense-split-reminder__preview-green">{formatCurrency(valorSelecionado)}</strong>
              </p>
              <p>
                <Calendar size={14} className="expense-split-reminder__preview-icon--blue" aria-hidden />
                Quando: <strong className="expense-split-reminder__preview-blue">{formatDate(dataLembrete)}</strong>{' '}
                ({diasAteTexto(diasAte)})
              </p>
              {repetir ? (
                <p>
                  <RefreshCw size={14} className="expense-split-reminder__preview-icon--yellow" aria-hidden />
                  Repetir: a cada <strong className="expense-split-reminder__preview-yellow">{repetirCadaDias} dias</strong>
                </p>
              ) : null}
            </div>
          </section>
        </div>

        <footer className="expense-split-reminder__footer">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting || !podeEnviar}>
            {submitting ? 'Criando...' : 'Criar Lembrete'}
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
