import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import * as calendarService from '@/services/calendarService.js'

export function GoogleResyncModal({
  open,
  onClose,
  pendentes = { futuros: 0, todos: 0 },
  onSynced,
}) {
  const [escopo, setEscopo] = useState('futuros')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setEscopo(pendentes.futuros > 0 ? 'futuros' : 'todos')
  }, [open, pendentes.futuros])

  const totalSelecionado = useMemo(() => {
    if (escopo === 'todos') return pendentes.todos ?? 0
    return pendentes.futuros ?? 0
  }, [escopo, pendentes])

  const handleSync = async () => {
    setSubmitting(true)
    try {
      const resultado = await calendarService.sincronizarPendentesGoogle(escopo)
      onSynced?.(resultado)
      onClose()
    } catch (err) {
      onSynced?.(null, err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="md" className="calendar-google-resync-modal">
      <div className="calendar-google-resync">
        <header className="calendar-google-resync__header">
          <div>
            <h2>Sincronizar lembretes anteriores?</h2>
            <p>
              Estes lembretes foram criados <strong>antes</strong> de conectar o Google Agenda. Escolha
              quais enviar para o calendário <strong>&quot;Pulso&quot;</strong>.
            </p>
          </div>
          <IconButton
            variant="ghost"
            size="sm"
            ariaLabel="Fechar"
            icon={<X size={18} />}
            onClick={onClose}
          />
        </header>

        <div className="calendar-google-resync__options">
          {pendentes.futuros > 0 ? (
            <label
              className={`calendar-google-resync__option${
                escopo === 'futuros' ? ' calendar-google-resync__option--selected' : ''
              }`}
            >
              <input
                type="radio"
                name="sync-escopo"
                value="futuros"
                checked={escopo === 'futuros'}
                onChange={() => setEscopo('futuros')}
              />
              <span>
                <strong>Futuros não sincronizados</strong>
                <small>
                  {pendentes.futuros} lembrete{pendentes.futuros === 1 ? '' : 's'} — recomendado
                </small>
              </span>
            </label>
          ) : null}

          {(pendentes.todos ?? 0) > (pendentes.futuros ?? 0) ? (
            <label
              className={`calendar-google-resync__option${
                escopo === 'todos' ? ' calendar-google-resync__option--selected' : ''
              }`}
            >
              <input
                type="radio"
                name="sync-escopo"
                value="todos"
                checked={escopo === 'todos'}
                onChange={() => setEscopo('todos')}
              />
              <span>
                <strong>Todos os não sincronizados</strong>
                <small>
                  {pendentes.todos} lembrete{pendentes.todos === 1 ? '' : 's'}, incluindo vencidos
                </small>
              </span>
            </label>
          ) : null}
        </div>

        <footer className="calendar-google-resync__footer">
          <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={submitting}>
            Agora não
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSync}
            disabled={submitting || totalSelecionado === 0}
          >
            {submitting
              ? 'Sincronizando...'
              : `Sincronizar ${totalSelecionado} lembrete${totalSelecionado === 1 ? '' : 's'}`}
          </Button>
        </footer>
      </div>
    </Modal>
  )
}
