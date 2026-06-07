import {
  Bell,
  Brain,
  Bus,
  CalendarDays,
  ChevronDown,
  HandCoins,
  LayoutGrid,
  PieChart,
  Search,
  Target,
  TrendingUp,
  User,
  Wallet,
  Wrench,
} from 'lucide-react'
import { PulsoLogoMark } from '@/components/features/auth/PulsoBrand'

const NAV = [
  { icon: LayoutGrid, label: 'Dashboard', active: true },
  {
    icon: HandCoins,
    label: 'Financeiro',
    open: true,
    children: ['Transações', 'Vale Transporte'],
  },
  {
    icon: Target,
    label: 'Planejamento & Metas',
    children: ['Metas Financeiras', 'Viagens e Moedas', 'Grupos'],
  },
  {
    icon: Brain,
    label: 'Inteligência & Relatórios',
    children: ['Relatórios', 'Insights e Chatbot', 'Gamificação'],
  },
  { icon: Wrench, label: 'Ferramentas', children: ['Agenda e Lembretes'] },
  { icon: User, label: 'Conta', children: ['Perfil'] },
]

const RESOURCES = [
  { label: 'Dinheiro', value: 'R$ 2.356,40', tone: 'cash', icon: Wallet },
  { label: 'Vale-Alimentação', value: 'R$ 980,50', tone: 'va', icon: PieChart },
  {
    label: 'Vale-Refeição',
    value: 'R$ 850,30',
    tone: 'vr',
    icon: Target,
    hint: 'Sugestão: R$ 34,90/dia',
  },
  { label: 'Vale-Transporte', value: 'R$ 375,55', tone: 'vt', icon: Bus },
]

const CATEGORIES = [
  { name: 'Alimentação', pct: '35%', value: 'R$ 1.151,24', color: '#3b82f6' },
  { name: 'Moradia', pct: '25%', value: 'R$ 822,31', color: '#7c3aed' },
  { name: 'Transporte', pct: '20%', value: 'R$ 657,85', color: '#ec4899' },
  { name: 'Saúde', pct: '12%', value: 'R$ 394,71', color: '#eab308' },
  { name: 'Lazer', pct: '8%', value: 'R$ 263,14', color: '#22c55e' },
]

const TRANSACTIONS = [
  { date: '28/05', desc: 'Supermercado Extra', cat: 'Alimentação', type: 'Despesa', val: '-R$ 156,68', bal: 'R$ 4.560,75' },
  { date: '27/05', desc: 'Salário CLT', cat: 'Salário', type: 'Receita', val: '+R$ 7.879,90', bal: 'R$ 4.717,43', positive: true },
  { date: '26/05', desc: 'Aluguel', cat: 'Moradia', type: 'Despesa', val: '-R$ 1.200,00', bal: '-R$ 3.162,47' },
]

const GOALS = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  label: 'Reserva de Emergência',
  pct: 42,
  current: 'R$ 4.200,00',
  target: 'R$ 10.000,00',
}))

function LineChartMock() {
  return (
    <svg viewBox="0 0 320 80" className="ldash-line-chart" aria-hidden>
      {[20, 40, 60].map((y) => (
        <line key={y} x1="0" y1={y} x2="320" y2={y} className="ldash-line-chart__grid" />
      ))}
      <polyline
        points="0,58 40,52 80,48 120,55 160,38 200,42 240,28 280,35 320,22"
        fill="none"
        className="ldash-line-chart__income"
      />
      <polyline
        points="0,68 40,62 80,65 120,58 160,60 200,52 240,48 280,50 320,45"
        fill="none"
        className="ldash-line-chart__expense"
      />
    </svg>
  )
}

function HealthGauge() {
  return (
    <div className="ldash-gauge" aria-hidden>
      <svg viewBox="0 0 100 60" className="ldash-gauge__svg">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" className="ldash-gauge__track" strokeWidth="8" />
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" className="ldash-gauge__fill" strokeWidth="8" strokeDasharray="126" strokeDashoffset="23" />
      </svg>
      <div className="ldash-gauge__center">
        <strong>82</strong>
        <span>Excelente</span>
      </div>
    </div>
  )
}

function GoalRing({ pct }) {
  const r = 18
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <svg viewBox="0 0 44 44" className="ldash-goal-ring" aria-hidden>
      <circle cx="22" cy="22" r={r} fill="none" className="ldash-goal-ring__track" strokeWidth="4" />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        className="ldash-goal-ring__fill"
        strokeWidth="4"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 22 22)"
      />
      <text x="22" y="24" textAnchor="middle" className="ldash-goal-ring__text">
        {pct}%
      </text>
    </svg>
  )
}

export function LandingDashboardPreview() {
  return (
    <div className="ldash" aria-hidden>
      <div className="ldash__frame">
        <aside className="ldash__sidebar">
          <div className="ldash__brand">
            <PulsoLogoMark size={20} />
            <div>
              <strong>Pulso</strong>
              <span>Seu monitoramento financeiro</span>
            </div>
          </div>

          <div className="ldash__user">
            <span className="ldash__avatar">MF</span>
            <div>
              <strong>Matheus Felipe</strong>
              <span className="ldash__badge">Estagiário</span>
            </div>
          </div>

          <div className="ldash__search">
            <Search size={10} />
            <span>Buscar...</span>
          </div>

          <nav className="ldash__nav">
            {NAV.map((item) => (
              <div key={item.label} className="ldash__nav-group">
                <div className={`ldash__nav-item${item.active ? ' ldash__nav-item--active' : ''}`}>
                  <item.icon size={11} />
                  <span>{item.label}</span>
                  {item.children ? <ChevronDown size={10} className={item.open ? 'ldash__chev--open' : ''} /> : null}
                </div>
                {item.open && item.children ? (
                  <div className="ldash__nav-children">
                    {item.children.map((child) => (
                      <span key={child} className="ldash__nav-child">
                        {child}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
        </aside>

        <div className="ldash__main">
          <header className="ldash__header">
            <div>
              <h3>Olá, Matheus! 👋</h3>
              <p>Aqui está o resumo das suas finanças desse mês!</p>
            </div>
            <div className="ldash__header-actions">
              <span className="ldash__date">
                <CalendarDays size={10} />
                Maio de 2026
                <ChevronDown size={10} />
              </span>
              <span className="ldash__bell">
                <Bell size={11} />
                <i />
              </span>
              <span className="ldash__header-user">
                <span className="ldash__avatar ldash__avatar--sm">MF</span>
                Matheus Felipe
                <ChevronDown size={10} />
              </span>
            </div>
          </header>

          <div className="ldash__summary">
            <div className="ldash__balance-card">
              <div className="ldash__balance-top">
                <span>
                  <Wallet size={12} />
                  Saldo total disponível
                </span>
                <TrendingUp size={12} />
              </div>
              <strong>R$ 4.560,75</strong>
              <span className="ldash__balance-delta">▲ 8,2% em relação a abril</span>
              <svg viewBox="0 0 200 40" className="ldash__balance-spark" aria-hidden>
                <polyline points="0,30 25,28 50,22 75,26 100,18 125,20 150,12 175,15 200,8" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>

            {RESOURCES.map(({ label, value, tone, icon: Icon, hint }) => (
              <div key={label} className={`ldash__resource ldash__resource--${tone}`}>
                <span className="ldash__resource-icon">
                  <Icon size={11} />
                </span>
                <span className="ldash__resource-label">{label}</span>
                <strong>{value}</strong>
                {hint ? <small>{hint}</small> : null}
              </div>
            ))}
          </div>

          <div className="ldash__charts-row">
            <article className="ldash__panel ldash__panel--wide">
              <div className="ldash__panel-head">
                <h4>Receitas x Despesas</h4>
                <span className="ldash__panel-filter">
                  Esse Mês <ChevronDown size={10} />
                </span>
              </div>
              <div className="ldash__legend">
                <span className="ldash__legend-item ldash__legend-item--income">Receitas R$ 7.879,90</span>
                <span className="ldash__legend-item ldash__legend-item--expense">Despesas R$ 2.879,90</span>
              </div>
              <LineChartMock />
            </article>

            <article className="ldash__panel">
              <div className="ldash__panel-head">
                <h4>Gastos por categoria</h4>
                <span className="ldash__panel-filter">
                  Esse Mês <ChevronDown size={10} />
                </span>
              </div>
              <div className="ldash__donut-wrap">
                <div className="ldash__donut">
                  <div className="ldash__donut-hole">
                    <span>Total</span>
                    <strong>R$ 3.289,25</strong>
                  </div>
                </div>
                <ul className="ldash__cat-list">
                  {CATEGORIES.map((c) => (
                    <li key={c.name}>
                      <i style={{ background: c.color }} />
                      <span>{c.name}</span>
                      <em>{c.pct}</em>
                      <strong>{c.value}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>

          <div className="ldash__bottom-row">
            <article className="ldash__panel ldash__panel--wide">
              <div className="ldash__panel-head">
                <h4>Últimas Transações</h4>
                <span className="ldash__panel-filter">
                  Esse Mês <ChevronDown size={10} />
                </span>
              </div>
              <table className="ldash__table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map((tx) => (
                    <tr key={tx.date + tx.desc}>
                      <td>{tx.date}</td>
                      <td>{tx.desc}</td>
                      <td>{tx.cat}</td>
                      <td>{tx.type}</td>
                      <td className={tx.positive ? 'ldash__val--pos' : 'ldash__val--neg'}>{tx.val}</td>
                      <td>{tx.bal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>

            <article className="ldash__panel ldash__panel--health">
              <div className="ldash__panel-head">
                <h4>Saúde Financeira</h4>
              </div>
              <div className="ldash__health">
                <HealthGauge />
                <div className="ldash__health-copy">
                  <strong>Parabéns!</strong>
                  <p>Sua saúde financeira está excelente.</p>
                  <ul>
                    <li>✓ Gastos sob controle</li>
                    <li>✓ Dentro do orçamento</li>
                    <li>✓ Reserva em dia</li>
                  </ul>
                </div>
              </div>
            </article>
          </div>

          <article className="ldash__panel ldash__panel--goals">
            <div className="ldash__panel-head">
              <h4>Metas Ativas</h4>
              <span className="ldash__panel-filter">
                Esse Mês <ChevronDown size={10} />
              </span>
            </div>
            <div className="ldash__goals">
              {GOALS.map((g) => (
                <div key={g.id} className="ldash__goal">
                  <GoalRing pct={g.pct} />
                  <strong>{g.label}</strong>
                  <span>
                    {g.current} de {g.target}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
