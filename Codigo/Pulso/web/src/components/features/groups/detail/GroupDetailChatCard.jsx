import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { GroupDetailSectionTitle } from './GroupDetailSectionTitle.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { formatGroupChatTimestamp } from '@/utils/groupDetailUtils.js'
import { formatGrupoMembroDisplayNome } from '@/utils/groupFormat.js'

export function GroupDetailChatCard({
  mensagens,
  onSend,
  sending = false,
  onLoadOlder,
  hasOlder = false,
  loadingOlder = false,
}) {
  const [draft, setDraft] = useState('')
  const feedRef = useRef(null)
  const items = mensagens ?? []
  const prevLengthRef = useRef(items.length)

  useEffect(() => {
    const feed = feedRef.current
    if (!feed) return

    const grewAtEnd = items.length > prevLengthRef.current && !loadingOlder
    if (grewAtEnd) {
      feed.scrollTop = feed.scrollHeight
    }
    prevLengthRef.current = items.length
  }, [items.length, items.at(-1)?.id, loadingOlder])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const conteudo = draft.trim()
    if (!conteudo || sending) return

    try {
      await onSend?.(conteudo)
      setDraft('')
    } catch {
      // erro tratado na página
    }
  }

  return (
    <section className="group-detail-card group-detail-card--chat">
      <header className="group-detail-card__header">
        <GroupDetailSectionTitle icon={MessageCircle}>Chat do grupo</GroupDetailSectionTitle>
      </header>

      <div className="group-detail-chat__body">
        {items.length === 0 ? (
          <EmptyState
            className="group-detail-card__empty group-detail-chat__empty"
            size="compact"
            bordered
            icon={<MessageCircle size={20} strokeWidth={1.75} />}
            title="Nenhuma mensagem ainda"
            description="Seja o primeiro a escrever no chat do grupo."
          />
        ) : (
          <ul ref={feedRef} className="group-detail-chat__feed" aria-live="polite">
            {hasOlder ? (
              <li className="group-detail-chat__load-more">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  loading={loadingOlder}
                  onClick={onLoadOlder}
                >
                  Carregar mensagens anteriores
                </Button>
              </li>
            ) : null}
            {items.map((mensagem) => {
              const displayNome = formatGrupoMembroDisplayNome(mensagem.nome)

              return (
                <li key={mensagem.id}>
                  <Avatar
                    name={displayNome}
                    src={mensagem.urlAvatar}
                    size="sm"
                    fallback="color"
                  />
                  <div className="group-detail-chat__bubble">
                    <div className="group-detail-chat__meta">
                      <strong>{displayNome}</strong>
                      <time dateTime={mensagem.criadoEm}>
                        {formatGroupChatTimestamp(mensagem.criadoEm)}
                      </time>
                    </div>
                    <p>{mensagem.conteudo}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <form className="group-detail-chat__composer" onSubmit={handleSubmit}>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Escrever mensagem..."
          aria-label="Escrever mensagem"
          maxLength={2000}
          disabled={sending}
        />
        <button
          type="submit"
          className="group-detail-chat__send"
          aria-label="Enviar mensagem"
          disabled={sending || !draft.trim()}
        >
          <Send size={16} aria-hidden />
        </button>
      </form>
    </section>
  )
}
