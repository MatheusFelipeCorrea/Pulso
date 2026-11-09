import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    AlertTriangle,
    ArrowDownRight,
    ArrowLeftRight,
    ArrowUpRight,
    BookOpen,
    Check,
    HeartPulse,
    Info,
    Lightbulb,
    LineChart,
    PieChart,
    RefreshCw,
    Sparkles,
    TrendingDown,
    TrendingUp,
    Minus,
    Wallet,
} from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { MonthPicker } from '@/design-system/components/pickers/MonthPicker/MonthPicker.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import {
    monthPickerParaPeriodo,
    periodoParaMonthPicker,
} from '@/utils/transactionRecurrence.js'
import * as insightsService from '@/services/insightsService.js'

function mesAtual() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatMesLabel(mes) {
    if (!mes || !/^\d{4}-\d{2}$/.test(mes)) return mes || ''
    const [y, m] = mes.split('-')
    const nomes = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
    ]
    return `${nomes[Number(m) - 1]}/${y}`
}

function formatBRL(v) {
    return Number(v || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}

function SectionTitle({ icon: Icon, tone = 'primary', children, trailing }) {
    return (
        <div className="insights-section-title">
            <div className="insights-section-title__main">
                <span className={`insights-soft-icon insights-soft-icon--${tone}`} aria-hidden>
                    <Icon size={16} strokeWidth={2} />
                </span>
                <h2>{children}</h2>
            </div>
            {trailing}
        </div>
    )
}

function ScoreGauge({ score = 0, label = '' }) {
    const pct = Math.max(0, Math.min(100, Number(score) || 0))
    const r = 54
    const c = 2 * Math.PI * r
    const offset = c - (pct / 100) * c
    return (
        <div className="insights-gauge" aria-label={`Score ${pct} de 100`}>
            <svg viewBox="0 0 140 140" className="insights-gauge__svg">
                <circle
                    cx="70"
                    cy="70"
                    r={r}
                    className="insights-gauge__track"
                    fill="none"
                    strokeWidth="12"
                />
                <circle
                    cx="70"
                    cy="70"
                    r={r}
                    className="insights-gauge__fill"
                    fill="none"
                    strokeWidth="12"
                    strokeDasharray={c}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                />
            </svg>
            <div className="insights-gauge__center">
                <strong>
                    {pct}
                    <span>/100</span>
                </strong>
                <em>{label}</em>
            </div>
        </div>
    )
}

function VariacaoBar({ item }) {
    const pct = Number(item.percentual || 0)
    const width = Math.min(100, Math.abs(pct))
    const Icon = pct > 0 ? TrendingUp : pct < 0 ? TrendingDown : Minus
    const tone = pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat'
    return (
        <div className="insights-var__row">
            <div className="insights-var__label">
                <span>{item.categoria}</span>
                <strong className={`insights-var__pct insights-var__pct--${tone}`}>
                    <Icon size={14} aria-hidden />
                    {pct > 0 ? '+' : ''}
                    {pct}%
                </strong>
            </div>
            <div className="insights-var__track">
                <div
                    className={`insights-var__fill insights-var__fill--${tone}`}
                    style={{ width: `${width}%` }}
                />
            </div>
            {item.comentario && <p className="insights-var__comment">{item.comentario}</p>}
        </div>
    )
}

function AlertaCard({ alerta }) {
    const sev = alerta.severidade || 'info'
    const Icon =
        sev === 'critico' ? AlertTriangle : sev === 'aviso' ? AlertTriangle : Info
    return (
        <div className={`insights-alert insights-alert--${sev}`}>
            <span className="insights-alert__icon" aria-hidden>
                <Icon size={16} />
            </span>
            <p>{alerta.mensagem}</p>
        </div>
    )
}

export default function InsightsPage() {
    const toast = useToast()
    const navigate = useNavigate()
    const [mes, setMes] = useState(mesAtual)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [regenerating, setRegenerating] = useState(false)
    const now = useMemo(() => new Date(), [])

    const carregar = useCallback(
        async (signal) => {
            setLoading(true)
            try {
                const result = await insightsService.obterInsights({ mes }, { signal })
                setData(result)
            } catch (err) {
                if (signal?.aborted) return
                const msg =
                    err.response?.data?.message ||
                    'Não foi possível carregar os Insights agora.'
                toast.error(msg)
                setData(null)
            } finally {
                if (!signal?.aborted) setLoading(false)
            }
        },
        [mes, toast]
    )

    useEffect(() => {
        const controller = new AbortController()
        carregar(controller.signal)
        return () => controller.abort()
    }, [carregar])

    const regenerar = async () => {
        setRegenerating(true)
        try {
            const result = await insightsService.regenerarInsights({ mes })
            setData(result)
            toast.success('Insights regenerados!')
        } catch (err) {
            toast.error(
                err.response?.data?.message || 'Falha ao regenerar Insights'
            )
        } finally {
            setRegenerating(false)
        }
    }

    const semDados = useMemo(() => {
        if (!data) return false
        const r = Number(data.fluxo?.receitas || 0)
        const d = Number(data.fluxo?.despesas || 0)
        return r === 0 && d === 0
    }, [data])

    const saldo = useMemo(() => {
        if (!data?.fluxo) return 0
        return Number(data.fluxo.receitas || 0) - Number(data.fluxo.despesas || 0)
    }, [data])

    return (
        <div className="insights-page">
            <header className="insights-page__header">
                <div className="insights-page__intro">
                    <div className="insights-page__title-row">
                        <div className="insights-page__title-icon" aria-hidden>
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <div className="insights-page__title-line">
                                <h1>Insights Inteligentes</h1>
                                <span className="insights-page__badge">
                                    <Sparkles size={12} aria-hidden />
                                    Powered by Gemini
                                </span>
                            </div>
                            <p className="insights-page__subtitle">
                                Análises geradas automaticamente com base nos seus
                                hábitos financeiros.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="insights-page__actions">
                    <MonthPicker
                        className="insights-page__month-picker"
                        value={periodoParaMonthPicker(mes)}
                        onChange={(value) => setMes(monthPickerParaPeriodo(value))}
                        monthDisplay="long"
                        minYear={now.getFullYear() - 2}
                        maxYear={now.getFullYear()}
                        placeholder="Selecione o mês"
                    />
                    <Button
                        leftIcon={<RefreshCw size={16} />}
                        onClick={regenerar}
                        disabled={loading || regenerating}
                    >
                        {regenerating ? 'Regenerando…' : 'Regenerar Insights'}
                    </Button>
                </div>
            </header>

            {loading && (
                <div className="insights-page__loading" aria-busy="true">
                    Gerando análises do seu mês…
                </div>
            )}

            {!loading && !data && (
                <EmptyState
                    className="insights-page__empty"
                    title="Insights indisponíveis"
                    description="Tente novamente em instantes ou verifique a configuração do Gemini."
                    action={{
                        label: 'Tentar de novo',
                        onClick: () => carregar(),
                        leftIcon: <RefreshCw size={16} />,
                    }}
                />
            )}

            {!loading && data && semDados && (
                <EmptyState
                    className="insights-page__empty"
                    title="Poucos dados neste mês"
                    description="Registre receitas e despesas para liberar análises personalizadas."
                    action={{
                        label: 'Ir para Transações',
                        onClick: () => navigate('/transactions'),
                        leftIcon: <ArrowLeftRight size={16} />,
                    }}
                />
            )}

            {!loading && data && !semDados && (
                <div className="insights-layout">
                    <section className="insights-hero">
                        <div className="insights-hero__copy">
                            <div className="insights-hero__eyebrow">
                                <span className="insights-soft-icon insights-soft-icon--primary" aria-hidden>
                                    <Wallet size={16} />
                                </span>
                                Resumo de {formatMesLabel(data.mesReferencia)}
                            </div>
                            <p className="insights-hero__text">{data.resumoMensal}</p>
                        </div>
                        <div className="insights-hero__kpis">
                            <div className="insights-kpi insights-kpi--income">
                                <span className="insights-kpi__icon" aria-hidden>
                                    <ArrowUpRight size={16} />
                                </span>
                                <div>
                                    <span>Receitas</span>
                                    <strong>{formatBRL(data.fluxo?.receitas)}</strong>
                                </div>
                            </div>
                            <div className="insights-kpi insights-kpi--expense">
                                <span className="insights-kpi__icon" aria-hidden>
                                    <ArrowDownRight size={16} />
                                </span>
                                <div>
                                    <span>Despesas</span>
                                    <strong>{formatBRL(data.fluxo?.despesas)}</strong>
                                </div>
                            </div>
                            <div
                                className={`insights-kpi ${
                                    saldo >= 0 ? 'insights-kpi--pos' : 'insights-kpi--neg'
                                }`}
                            >
                                <span className="insights-kpi__icon" aria-hidden>
                                    <Wallet size={16} />
                                </span>
                                <div>
                                    <span>Saldo</span>
                                    <strong>{formatBRL(saldo)}</strong>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="insights-card insights-card--variacao">
                        <SectionTitle icon={PieChart} tone="violet">
                            Variação por categoria
                        </SectionTitle>
                        <div className="insights-var">
                            {(data.variacaoCategorias || []).length === 0 && (
                                <p className="insights-muted">Sem comparação MoM ainda.</p>
                            )}
                            {(data.variacaoCategorias || []).slice(0, 6).map((item) => (
                                <VariacaoBar key={item.categoria} item={item} />
                            ))}
                        </div>
                    </section>

                    <section className="insights-card insights-card--score">
                        <SectionTitle icon={HeartPulse} tone="rose">
                            Score de saúde financeira
                        </SectionTitle>
                        <div className="insights-score">
                            <ScoreGauge
                                score={data.score?.valor}
                                label={data.score?.label}
                            />
                            <ul className="insights-score__list">
                                {(data.score?.checklist || []).map((item) => (
                                    <li
                                        key={item.id}
                                        className={item.ok ? 'is-ok' : 'is-warn'}
                                    >
                                        <span className="insights-score__check" aria-hidden>
                                            {item.ok ? (
                                                <Check size={14} />
                                            ) : (
                                                <AlertTriangle size={14} />
                                            )}
                                        </span>
                                        {item.texto}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section className="insights-card insights-card--proj">
                        <SectionTitle
                            icon={LineChart}
                            tone="blue"
                            trailing={
                                data.diasAteNegativo != null ? (
                                    <span className="insights-chip insights-chip--warn">
                                        ~{data.diasAteNegativo} dias até aperto
                                    </span>
                                ) : null
                            }
                        >
                            Projeção para os próximos meses
                        </SectionTitle>
                        <div className="insights-proj">
                            {(Array.isArray(data.projecoes) ? data.projecoes : []).map((p) => (
                                <article
                                    key={p.id}
                                    className={`insights-proj__card insights-proj__card--${p.id}`}
                                >
                                    <div className="insights-proj__head">
                                        <span className="insights-proj__dot" aria-hidden />
                                        <h3>{p.label}</h3>
                                    </div>
                                    <p>{p.descricao}</p>
                                    <dl>
                                        <div>
                                            <dt>3 meses</dt>
                                            <dd>{formatBRL(p.acumulado?.['3'])}</dd>
                                        </div>
                                        <div>
                                            <dt>6 meses</dt>
                                            <dd>{formatBRL(p.acumulado?.['6'])}</dd>
                                        </div>
                                        <div>
                                            <dt>12 meses</dt>
                                            <dd>{formatBRL(p.acumulado?.['12'])}</dd>
                                        </div>
                                    </dl>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="insights-card insights-card--sugs">
                        <SectionTitle icon={Lightbulb} tone="amber">
                            Sugestões personalizadas
                        </SectionTitle>
                        <div className="insights-sugs">
                            {(data.sugestoes || []).length === 0 && (
                                <p className="insights-muted">
                                    Sem sugestões novas neste ciclo — regenerar pode trazer
                                    ideias frescas.
                                </p>
                            )}
                            {(data.sugestoes || []).map((s, index) => (
                                <div key={s.id} className="insights-sug">
                                    <span className="insights-sug__index" aria-hidden>
                                        {index + 1}
                                    </span>
                                    <div className="insights-sug__body">
                                        <div className="insights-sug__title">
                                            <strong>{s.titulo}</strong>
                                            <span className="insights-chip">IA</span>
                                        </div>
                                        <p>{s.descricao}</p>
                                        {s.impactoEstimado && (
                                            <small>{s.impactoEstimado}</small>
                                        )}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() =>
                                            navigate(s.acaoPath || '/budget')
                                        }
                                    >
                                        Aplicar sugestão
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="insights-card insights-card--alerts">
                        <SectionTitle icon={AlertTriangle} tone="orange">
                            Alertas
                        </SectionTitle>
                        <div className="insights-alerts">
                            {(data.alertas || []).length === 0 && (
                                <p className="insights-muted">Nenhum alerta no momento.</p>
                            )}
                            {(data.alertas || []).map((a, i) => (
                                <AlertaCard key={`${a.tipo}-${i}`} alerta={a} />
                            ))}
                        </div>
                    </section>

                    {(data.educacao || []).length > 0 && (
                        <section className="insights-card insights-card--edu">
                            <SectionTitle icon={BookOpen} tone="teal">
                                Para aprender mais
                            </SectionTitle>
                            <div className="insights-edu">
                                {data.educacao.map((e, i) => (
                                    <a
                                        key={`${e.url}-${i}`}
                                        className="insights-edu__card"
                                        href={e.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="insights-edu__icon" aria-hidden>
                                            <BookOpen size={16} />
                                        </span>
                                        <div>
                                            <span className="insights-chip">{e.tipo}</span>
                                            <strong>{e.titulo}</strong>
                                            {e.motivo && <p>{e.motivo}</p>}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    )
}
