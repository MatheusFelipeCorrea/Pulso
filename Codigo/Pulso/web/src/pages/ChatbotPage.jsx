import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    Bot,
    CalendarDays,
    CheckCheck,
    Clock3,
    Lightbulb,
    LineChart,
    MessageSquare,
    MessageSquarePlus,
    MessagesSquare,
    PanelLeft,
    Receipt,
    Send,
    Sparkles,
    Target,
    Trash2,
    TrendingUp,
    Wallet,
    X,
} from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import ChatMessageContent from '@/components/chatbot/ChatMessageContent.jsx'
import { useAppSelector } from '@/store/hooks'
import { getUserDisplayName } from '@/utils/userDisplayName.js'
import * as chatbotService from '@/services/chatbotService.js'

/** Fora do componente — evita react-hooks/purity (Date.now no corpo do render). */
const stampMsg = (prefix) => {
    const at = Date.now()
    return { id: `${prefix}-${at}`, at }
}

const ICON_MAP = {
    calendar: CalendarDays,
    target: Target,
    chart: LineChart,
    wallet: Wallet,
    trend: TrendingUp,
    bulb: Lightbulb,
}

const WELCOME =
    'Olá! Sou o Pulso Assistente 💜 Posso consultar seus gastos, metas, saldos e ajudar a lançar transações rápidas. O que você quer saber?'

function formatMsgTime(at) {
    try {
        return new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(at))
    } catch {
        return ''
    }
}

function formatConversaQuando(at) {
    try {
        const d = new Date(at)
        const hoje = new Date()
        const ontem = new Date()
        ontem.setDate(hoje.getDate() - 1)
        const sameDay = (a, b) =>
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
        if (sameDay(d, hoje)) {
            return new Intl.DateTimeFormat('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
            }).format(d)
        }
        if (sameDay(d, ontem)) return 'Ontem'
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
        }).format(d)
    } catch {
        return ''
    }
}

const welcomeMsg = () => ({
    ...stampMsg('welcome'),
    id: 'welcome',
    role: 'assistant',
    content: WELCOME,
})

export default function ChatbotPage() {
    const toast = useToast()
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const user = useAppSelector((state) => state.auth.user)
    const modo = params.get('modo') === 'quick_add' ? 'quick_add' : 'chat'

    const [mensagens, setMensagens] = useState([welcomeMsg()])
    const [conversaId, setConversaId] = useState(null)
    const [conversas, setConversas] = useState([])
    const [loadingConversas, setLoadingConversas] = useState(true)
    const [loadingThread, setLoadingThread] = useState(false)
    const [historyOpen, setHistoryOpen] = useState(true)
    const [draft, setDraft] = useState('')
    const [sending, setSending] = useState(false)
    const [sugestoes, setSugestoes] = useState([])
    const [pendingProposta, setPendingProposta] = useState(null)
    const feedRef = useRef(null)

    const displayName = getUserDisplayName(user?.nome)
    const avatarUrl = user?.urlAvatar

    const refreshConversas = useCallback(async (signal) => {
        try {
            const list = await chatbotService.listarConversas({ signal })
            setConversas(Array.isArray(list) ? list : [])
        } catch {
            if (!signal?.aborted) setConversas([])
        } finally {
            if (!signal?.aborted) setLoadingConversas(false)
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        chatbotService
            .listarSugestoes({ signal: controller.signal })
            .then(setSugestoes)
            .catch(() => setSugestoes([]))
        refreshConversas(controller.signal)
        return () => controller.abort()
    }, [refreshConversas])

    useEffect(() => {
        const el = feedRef.current
        if (el) el.scrollTop = el.scrollHeight
    }, [mensagens, sending, pendingProposta])

    const historicoApi = useMemo(
        () =>
            mensagens
                .filter((m) => m.id !== 'welcome')
                .map((m) => ({ role: m.role, content: m.content })),
        [mensagens]
    )

    const novaConversa = () => {
        setConversaId(null)
        setMensagens([welcomeMsg()])
        setPendingProposta(null)
        setDraft('')
    }

    const abrirConversa = async (id) => {
        if (!id || loadingThread || sending) return
        setLoadingThread(true)
        setPendingProposta(null)
        try {
            const data = await chatbotService.obterConversa(id)
            setConversaId(data.id)
            const msgs = (data.mensagens || []).map((m) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                at: m.at ? new Date(m.at).getTime() : stampMsg('hist').at,
            }))
            setMensagens(msgs.length ? msgs : [welcomeMsg()])
            if (typeof window !== 'undefined' && window.innerWidth < 900) {
                setHistoryOpen(false)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Não foi possível abrir a conversa')
        } finally {
            setLoadingThread(false)
        }
    }

    const apagarConversa = async (id, e) => {
        e?.stopPropagation?.()
        if (!id) return
        try {
            await chatbotService.excluirConversa(id)
            setConversas((prev) => prev.filter((c) => c.id !== id))
            if (conversaId === id) novaConversa()
            toast.success('Conversa apagada')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Falha ao apagar conversa')
        }
    }

    const enviar = async (texto) => {
        const mensagem = String(texto || '').trim()
        if (!mensagem || sending) return

        setDraft('')
        setPendingProposta(null)
        const userMsg = {
            ...stampMsg('u'),
            role: 'user',
            content: mensagem,
        }
        setMensagens((prev) => [...prev, userMsg])
        setSending(true)

        try {
            const result = await chatbotService.enviarMensagem({
                mensagem,
                historico: historicoApi,
                modo,
                conversaId,
            })
            if (result.conversaId) {
                setConversaId(result.conversaId)
            }
            setMensagens((prev) => [
                ...prev,
                {
                    ...stampMsg('a'),
                    role: 'assistant',
                    content: result.resposta,
                    recusada: Boolean(result.recusada),
                },
            ])
            if (result.propostaTransacao) {
                setPendingProposta(result.propostaTransacao)
            }
            refreshConversas()
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                'Não consegui falar com o assistente agora. Tente de novo.'
            toast.error(msg)
            setMensagens((prev) => [
                ...prev,
                {
                    ...stampMsg('e'),
                    role: 'assistant',
                    content: msg,
                },
            ])
        } finally {
            setSending(false)
        }
    }

    const confirmar = async () => {
        if (!pendingProposta || sending) return
        setSending(true)
        try {
            await chatbotService.confirmarTransacao(pendingProposta)
            toast.success('Transação lançada!')
            setMensagens((prev) => [
                ...prev,
                {
                    ...stampMsg('a-ok'),
                    role: 'assistant',
                    content: `Pronto! Lancei ${pendingProposta.tipo === 'DESPESA' ? 'a despesa' : 'a receita'} de R$ ${Number(pendingProposta.valor).toFixed(2).replace('.', ',')}${pendingProposta.descricao ? ` (${pendingProposta.descricao})` : ''}.`,
                },
            ])
            setPendingProposta(null)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Falha ao confirmar lançamento')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className={`chatbot-layout ${historyOpen ? 'chatbot-layout--open' : ''}`}>
            <aside className="chatbot-history" aria-label="Conversas anteriores">
                <div className="chatbot-history__head">
                    <h2>
                        <MessagesSquare size={15} aria-hidden />
                        Conversas
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<MessageSquarePlus size={16} />}
                        onClick={novaConversa}
                    >
                        Nova
                    </Button>
                </div>
                <div className="chatbot-history__list">
                    {loadingConversas && <p className="chatbot-history__empty">Carregando…</p>}
                    {!loadingConversas && conversas.length === 0 && (
                        <div className="chatbot-history__empty">
                            <MessageSquare size={22} aria-hidden />
                            <p>Suas conversas salvas aparecem aqui.</p>
                        </div>
                    )}
                    {conversas.map((c) => (
                        <div
                            key={c.id}
                            className={`chatbot-history__item ${
                                conversaId === c.id ? 'is-active' : ''
                            }`}
                        >
                            <button
                                type="button"
                                className="chatbot-history__item-main"
                                onClick={() => abrirConversa(c.id)}
                                disabled={loadingThread}
                            >
                                <span className="chatbot-history__item-title">
                                    <MessageSquare size={13} aria-hidden />
                                    {c.titulo || 'Conversa'}
                                </span>
                                <span className="chatbot-history__item-meta">
                                    <Clock3 size={11} aria-hidden />
                                    {formatConversaQuando(c.atualizadoEm)}
                                </span>
                                {c.preview && (
                                    <span className="chatbot-history__item-preview">
                                        {c.preview}
                                    </span>
                                )}
                            </button>
                            <button
                                type="button"
                                className="chatbot-history__item-del"
                                aria-label="Apagar conversa"
                                onClick={(e) => apagarConversa(c.id, e)}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </aside>

            <div className="chatbot-page">
                <header className="chatbot-page__header">
                    <div className="chatbot-page__title-wrap">
                        <button
                            type="button"
                            className="chatbot-page__toggle-history"
                            aria-label={historyOpen ? 'Ocultar histórico' : 'Mostrar histórico'}
                            onClick={() => setHistoryOpen((v) => !v)}
                        >
                            {historyOpen ? <X size={18} /> : <PanelLeft size={18} />}
                        </button>
                        <div className="chatbot-page__title-row">
                            <div className="chatbot-page__title-icon" aria-hidden>
                                <Bot size={20} />
                            </div>
                            <div>
                                <h1>Pulso Assistente</h1>
                                <div className="chatbot-page__meta">
                                    <span className="chatbot-page__badge">
                                        <Sparkles size={12} aria-hidden />
                                        Powered by Gemini
                                    </span>
                                    <span className="chatbot-page__online">
                                        <span className="chatbot-page__online-dot" />
                                        Online
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<MessageSquarePlus size={16} />}
                        onClick={novaConversa}
                    >
                        Nova conversa
                    </Button>
                </header>

                <div className="chatbot-page__feed" ref={feedRef} aria-live="polite">
                    {loadingThread && <p className="chatbot-history__empty">Abrindo conversa…</p>}
                    {!loadingThread &&
                        mensagens.map((msg) => {
                            const mine = msg.role === 'user'
                            return (
                                <div
                                    key={msg.id}
                                    className={`chatbot-msg ${mine ? 'chatbot-msg--user' : 'chatbot-msg--bot'}`}
                                >
                                    {!mine && (
                                        <div
                                            className="chatbot-msg__avatar chatbot-msg__avatar--bot"
                                            aria-hidden
                                        >
                                            <Bot size={16} />
                                        </div>
                                    )}
                                    <div className="chatbot-msg__col">
                                        <div className="chatbot-msg__bubble">
                                            <ChatMessageContent content={msg.content} />
                                        </div>
                                        <div className="chatbot-msg__meta">
                                            <Clock3 size={11} aria-hidden />
                                            <time>{formatMsgTime(msg.at)}</time>
                                            {mine && (
                                                <span className="chatbot-msg__checks" aria-hidden>
                                                    <CheckCheck size={14} />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {mine && (
                                        <div
                                            className="chatbot-msg__avatar chatbot-msg__avatar--user"
                                            aria-hidden
                                        >
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt="" />
                                            ) : (
                                                <span>
                                                    {(displayName || '?').slice(0, 1).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                    {sending && (
                        <div className="chatbot-msg chatbot-msg--bot">
                            <div
                                className="chatbot-msg__avatar chatbot-msg__avatar--bot"
                                aria-hidden
                            >
                                <Bot size={16} />
                            </div>
                            <div className="chatbot-msg__col">
                                <div className="chatbot-msg__bubble chatbot-msg__bubble--typing">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        </div>
                    )}

                    {pendingProposta && (
                        <div className="chatbot-proposta">
                            <p>
                                <Receipt size={15} aria-hidden />
                                <span>
                                    Confirmar lançamento:{' '}
                                    <strong>
                                        {pendingProposta.tipo} · R${' '}
                                        {Number(pendingProposta.valor).toFixed(2).replace('.', ',')}
                                    </strong>
                                    {pendingProposta.descricao
                                        ? ` — ${pendingProposta.descricao}`
                                        : ''}
                                    {pendingProposta.categoriaNome
                                        ? ` · ${pendingProposta.categoriaNome}`
                                        : ''}
                                </span>
                            </p>
                            <div className="chatbot-proposta__actions">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => setPendingProposta(null)}
                                >
                                    Descartar
                                </Button>
                                <Button size="sm" onClick={confirmar} disabled={sending}>
                                    Confirmar
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="chatbot-page__composer">
                    {sugestoes.length > 0 && (
                        <div className="chatbot-page__chips" role="list">
                            {sugestoes.map((s) => {
                                const Icon = ICON_MAP[s.icon] || Lightbulb
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        className="chatbot-chip"
                                        role="listitem"
                                        disabled={sending}
                                        onClick={() => enviar(s.label)}
                                    >
                                        <span className="chatbot-chip__icon" aria-hidden>
                                            <Icon size={14} />
                                        </span>
                                        {s.label}
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    <form
                        className="chatbot-page__input-row"
                        onSubmit={(e) => {
                            e.preventDefault()
                            enviar(draft)
                        }}
                    >
                        <Sparkles size={16} className="chatbot-page__input-icon" aria-hidden />
                        <input
                            type="text"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Pergunte ao Pulso..."
                            aria-label="Pergunte ao Pulso"
                            maxLength={2000}
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            className="chatbot-page__send"
                            aria-label="Enviar"
                            disabled={sending || !draft.trim()}
                        >
                            <Send size={18} aria-hidden />
                        </button>
                    </form>

                    {modo === 'quick_add' && (
                        <p className="chatbot-page__hint">
                            Modo lançamento rápido — diga algo como “gastei 45 no almoço”.{' '}
                            <button type="button" onClick={() => navigate('/chatbot')}>
                                Voltar ao chat normal
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
