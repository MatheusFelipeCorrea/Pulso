import { useState } from 'react'
import {
  Edit, Trash, X, Plus, Check, Mail,
  Utensils, Bus, Gamepad2, GraduationCap, ShoppingBag, Heart, Home, MoreHorizontal,
  DollarSign, Apple, CreditCard, Wallet,
  ClipboardList, Target, Users, SearchX, BarChart3,
  FileSearch, Receipt, CalendarDays, PieChart, Bell, Folder, Gem,
  Play, Pause, CheckCircle, XCircle, Clock, Calendar,
  ArrowUp, Minus, ArrowDown, Crown, User, Briefcase, Laptop,
  RefreshCw, Sprout, Star, Diamond, Info,
  TrendingUp, TrendingDown, AlertTriangle, LineChart,
  Settings, Shield,
  Eye, Calculator,
} from 'lucide-react'
import { Button, IconButton } from '../design-system/components/buttons/index.js'
import { Spinner, SpinnerDots, SpinnerOverlay, useToast, Alert, Skeleton, EmptyState, ErrorState } from '../design-system/components/feedback/index.js'
import { InputText, InputPassword, InputMoney, InputNumber, InputSearch, Textarea } from '../design-system/components/inputs/index.js'
import { Select, SelectSearch, MultiSelect, MultiSelectSearch, TagsInput } from '../design-system/components/selects/index.js'
import { DatePicker, DateRangePicker, MonthPicker, TimePicker } from '../design-system/components/pickers/index.js'
import {
  Tooltip, Avatar, AvatarGroup, Badge, Card, CardHeader, CardBody, CardFooter,
  ProgressBar, ProgressCircle, Table,
} from '../design-system/components/data-display/index.js'
import { formatCurrency } from '../design-system/utils/formatCurrency.js'
import { PulsoBadge } from '../components/badges/index.js'
import {
  ResourceCard,
  NotificationPanel,
  NOTIFICATION_TYPES,
} from '../components/features/dashboard/index.js'
import { Toggle, Checkbox, Radio, RadioGroup, FormField } from '../design-system/components/forms/index.js'
import { Tabs, Breadcrumbs, Pagination } from '../design-system/components/navigation/index.js'
import { ConfirmModal } from '../design-system/components/overlays/index.js'
import { cn } from '../design-system/utils/cn.js'

function buildDemoNotifications() {
  const now = Date.now()
  const min = (n) => new Date(now - n * 60 * 1000)
  const hours = (n) => new Date(now - n * 60 * 60 * 1000)
  const days = (n) => new Date(now - n * 24 * 60 * 60 * 1000)

  return [
    { id: '1', type: NOTIFICATION_TYPES.RECEITA_REGISTRADA, description: 'Nova receita: Salário • +R$ 1.500,00', timestamp: min(2), read: false },
    { id: '2', type: NOTIFICATION_TYPES.DESPESA_REGISTRADA, description: 'Nova despesa: Mercado • -R$ 87,00', timestamp: min(15), read: false },
    { id: '3', type: NOTIFICATION_TYPES.META_ATINGIDA, description: "Meta 'Viagem Macaé' concluída!", timestamp: hours(3), read: false },
    { id: '4', type: NOTIFICATION_TYPES.ALERTA_ORCAMENTO, description: 'Alimentação atingiu 80% do limite', timestamp: hours(5), read: true },
    { id: '5', type: NOTIFICATION_TYPES.ORCAMENTO_ESTOURADO, description: 'Lazer ultrapassou o limite em R$ 30', timestamp: days(1), read: true },
    { id: '6', type: NOTIFICATION_TYPES.LEMBRETE_VENCIMENTO, description: 'Fatura do cartão vence amanhã', timestamp: days(1), read: false },
    { id: '7', type: NOTIFICATION_TYPES.STREAK, description: '12 dias seguidos! Continue assim!', timestamp: days(2), read: true },
    { id: '8', type: NOTIFICATION_TYPES.CONQUISTA, description: 'Nova conquista: Primeiro mês positivo!', timestamp: days(2), read: true },
    { id: '9', type: NOTIFICATION_TYPES.GRUPO_ATIVIDADE, description: 'Maria adicionou pretensão no grupo', timestamp: days(3), read: true },
    { id: '10', type: NOTIFICATION_TYPES.DIVIDA_COBRANCA, description: 'Lembrete: cobrar João (R$ 50)', timestamp: days(4), read: true },
    { id: '11', type: NOTIFICATION_TYPES.INSIGHT_IA, description: 'Novo insight: seu VA acaba dia 26', timestamp: days(5), read: false },
    { id: '12', type: NOTIFICATION_TYPES.ACAO_CONCLUIDA, description: 'Transação salva com sucesso', timestamp: min(1), read: true },
    { id: '13', type: NOTIFICATION_TYPES.ERRO, description: 'Erro ao salvar. Tente novamente.', timestamp: min(45), read: false },
  ]
}

/**
 * Página de demonstração do Design System
 * Para testar componentes: Button, IconButton, Spinner, Tooltip
 */
export default function DesignSystemDemo() {
  const [darkMode, setDarkMode] = useState(false)
  const [loadingButtons, setLoadingButtons] = useState({})
  const [spinnerOverlay, setSpinnerOverlay] = useState(null)
  const [email, setEmail] = useState('')
  const [emailFilled, setEmailFilled] = useState('exemplo@email.com')
  const [emailClear, setEmailClear] = useState('exemplo@email.com')
  const [password, setPassword] = useState('')
  const [passwordValidation, setPasswordValidation] = useState('')
  const [money, setMoney] = useState(1500)
  const [moneyLarge, setMoneyLarge] = useState(2850)
  const [quantity, setQuantity] = useState(1)
  const [search, setSearch] = useState('')
  const [searchCompact, setSearchCompact] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('Estudar as opções de investimento disponíveis e definir estratégia para os próximos aportes.')
  const [selectValue, setSelectValue] = useState(null)
  const [selectSearchValue, setSelectSearchValue] = useState(null)
  const [multiSelectValues, setMultiSelectValues] = useState(['dinheiro'])
  const [multiSelectSearchValues, setMultiSelectSearchValues] = useState(['alimentacao', 'transporte'])
  const [tags, setTags] = useState(['faculdade', 'almoço'])
  const [dateValue, setDateValue] = useState(new Date(2026, 3, 22))
  const [rangeValue, setRangeValue] = useState({
    start: new Date(2026, 3, 1),
    end: new Date(2026, 3, 30),
  })
  const [monthValue, setMonthValue] = useState({ month: 5, year: 2026 })
  const [timeValue, setTimeValue] = useState('14:30')
  const [time12Value, setTime12Value] = useState('02:30 PM')
  const [toggleOn, setToggleOn] = useState(true)
  const [toggleCompact, setToggleCompact] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(true)
  const [checkboxIndeterminate, setCheckboxIndeterminate] = useState(false)
  const [checkboxError, setCheckboxError] = useState(false)
  const [radioValue, setRadioValue] = useState('mensal')
  const [radioHorizontal, setRadioHorizontal] = useState('pix')
  const [radioCard, setRadioCard] = useState('premium')
  const [formFieldName, setFormFieldName] = useState('')
  const [confirmDefaultOpen, setConfirmDefaultOpen] = useState(false)
  const [confirmCriticalOpen, setConfirmCriticalOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [errorRetryLoading, setErrorRetryLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('todas')
  const [activePillTab, setActivePillTab] = useState('ativas')
  const [activeVerticalTab, setActiveVerticalTab] = useState('geral')
  const [demoPage, setDemoPage] = useState(2)
  const [demoNotifications, setDemoNotifications] = useState(() => buildDemoNotifications())
  const [demoPageSize, setDemoPageSize] = useState(10)
  const [tableSort, setTableSort] = useState({ key: 'data', direction: 'asc' })
  const [tableSelected, setTableSelected] = useState(['2'])
  const [tableView, setTableView] = useState('data')
  const toast = useToast()

  const TABLE_ROWS = [
    { id: '1', data: '05/04/2025', comprador: 'Ana Costa', nominal: 1200, recebido: 1200, diff: 0, status: 'pago' },
    { id: '2', data: '04/04/2025', comprador: 'Bruno Lima', nominal: 800, recebido: 400, diff: -400, status: 'parcial' },
    { id: '3', data: '03/04/2025', comprador: 'Carla Dias', nominal: 350, recebido: 0, diff: -350, status: 'atrasado' },
  ]

  const CATEGORY_OPTIONS = [
    { value: 'alimentacao', label: 'Alimentação', icon: <Utensils size={20} />, iconColor: '#F97316' },
    { value: 'transporte', label: 'Transporte', icon: <Bus size={20} />, iconColor: '#3B82F6' },
    { value: 'lazer', label: 'Lazer', icon: <Gamepad2 size={20} />, iconColor: '#10B981' },
    { value: 'educacao', label: 'Educação', icon: <GraduationCap size={20} />, iconColor: '#EAB308' },
    { value: 'compras', label: 'Compras', icon: <ShoppingBag size={20} />, iconColor: '#7C3AED' },
    { value: 'saude', label: 'Saúde', icon: <Heart size={20} />, iconColor: '#EF4444' },
    { value: 'moradia', label: 'Moradia', icon: <Home size={20} />, iconColor: '#14B8A6' },
    { value: 'outros', label: 'Outros', icon: <MoreHorizontal size={20} />, iconColor: '#6B7280' },
  ]

  const RESOURCE_OPTIONS = [
    { value: 'dinheiro', label: 'Dinheiro', icon: <DollarSign size={20} />, iconColor: '#10B981' },
    { value: 'va', label: 'VA', icon: <Apple size={20} />, iconColor: '#EF4444' },
    { value: 'vr', label: 'VR', icon: <CreditCard size={20} />, iconColor: '#3B82F6' },
    { value: 'cartao', label: 'Cartão', icon: <Wallet size={20} />, iconColor: '#7C3AED' },
  ]

  const WEEKDAY_OPTIONS = [
    { value: 'seg', label: 'Seg' },
    { value: 'ter', label: 'Ter' },
    { value: 'qua', label: 'Qua' },
    { value: 'qui', label: 'Qui' },
    { value: 'sex', label: 'Sex' },
    { value: 'sab', label: 'Sáb' },
    { value: 'dom', label: 'Dom' },
  ]

  const TAG_SUGGESTIONS = ['transporte', 'trabalho', 'trilha', 'faculdade', 'almoço', 'RU']

  const MOCK_SEARCH = [
    { title: 'Viagem Macaé 2026', subtitle: 'Viagem em grupo • 3 membros', emoji: '🧳', color: 'bg-[#7C3AED]/20' },
    { title: 'Planejamento: Viagem de Férias', subtitle: 'Checklist • Atualizado há 2 dias', emoji: '🌴', color: 'bg-[#10B981]/20' },
    { title: 'Passagem aérea • Viagem Macaé', subtitle: 'Despesa • R$ 1.250,00 • 20/04/2026', emoji: '✈️', color: 'bg-[#3B82F6]/20' },
    { title: 'Observações da viagem', subtitle: 'Nota • Criada em 18/04/2026', emoji: '📝', color: 'bg-[#F59E0B]/20' },
  ]

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-[var(--ds-color-primary)] font-medium">{part}</span>
      ) : (
        part
      )
    )
  }

  const searchResults = search.trim()
    ? MOCK_SEARCH.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
    : []

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleErrorRetry = () => {
    setErrorRetryLoading(true)
    setTimeout(() => {
      setErrorRetryLoading(false)
      toast.success('Dados recarregados')
    }, 2000)
  }

  // Simula loading em um botão específico
  const handleLoadingDemo = (id) => {
    setLoadingButtons((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setLoadingButtons((prev) => ({ ...prev, [id]: false }))
    }, 2000)
  }

  const handleMarkAllNotificationsRead = () => {
    setDemoNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success('Todas as notificações marcadas como lidas')
  }

  const handleNotificationRead = (id) => {
    setDemoNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <div className="min-h-screen bg-[var(--ds-color-background)] text-[var(--ds-color-text)] p-8">
      {spinnerOverlay && (
        <SpinnerOverlay text={spinnerOverlay.text} variant={spinnerOverlay.variant} />
      )}
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[var(--ds-color-primary)] mb-2">
              💜 Pulso Design System
            </h1>
            <p className="text-[var(--ds-color-text-secondary)]">
              Biblioteca de componentes UI genéricos e reutilizáveis
            </p>
          </div>
          <Button
            variant={darkMode ? 'secondary' : 'primary'}
            onClick={toggleDarkMode}
          >
            {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* ============================================================
            SECTION: BUTTONS
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Botões
          </h2>

          {/* Variantes */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Variantes
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
            </div>

            {/* Tamanhos */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Tamanhos
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="sm">Small (32px)</Button>
                <Button variant="primary" size="md">Medium (40px)</Button>
                <Button variant="primary" size="lg">Large (48px)</Button>
              </div>
            </div>

            {/* Estados */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Estados
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" disabled>Disabled</Button>
                <Button
                  variant="primary"
                  loading={loadingButtons.btn1}
                  onClick={() => handleLoadingDemo('btn1')}
                >
                  {loadingButtons.btn1 ? 'Carregando...' : 'Clique para Loading'}
                </Button>
              </div>
            </div>

            {/* Com ícones */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Com Ícones
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" leftIcon={<Plus size={20} />}>
                  Criar novo
                </Button>
                <Button variant="success" rightIcon={<Check size={20} />}>
                  Confirmar
                </Button>
                <Button variant="danger" leftIcon={<Trash size={20} />}>
                  Excluir
                </Button>
              </div>
            </div>

            {/* Full Width */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Full Width
              </h3>
              <Button variant="primary" fullWidth>
                Botão 100% largura
              </Button>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: ICON BUTTONS
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Icon Buttons
          </h2>

          <div className="space-y-6">
            {/* Variantes — circular */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Variantes (circular)
              </h3>
              <div className="flex flex-wrap gap-4">
                <Tooltip content="Editar">
                  <IconButton variant="primary" icon={<Edit size={20} />} ariaLabel="Editar" />
                </Tooltip>
                <Tooltip content="Fechar">
                  <IconButton variant="secondary" icon={<X size={20} />} ariaLabel="Fechar" />
                </Tooltip>
                <Tooltip content="Adicionar">
                  <IconButton variant="ghost" icon={<Plus size={20} />} ariaLabel="Adicionar" />
                </Tooltip>
                <Tooltip content="Excluir">
                  <IconButton variant="danger" icon={<Trash size={20} />} ariaLabel="Excluir" />
                </Tooltip>
                <Tooltip content="Confirmar">
                  <IconButton variant="success" icon={<Check size={20} />} ariaLabel="Confirmar" />
                </Tooltip>
              </div>
            </div>

            {/* Com label — pílula */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Com Label (pílula)
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <IconButton variant="primary" icon={<Plus size={20} />} label="Criar novo" />
                <IconButton variant="secondary" icon={<Edit size={20} />} label="Editar" />
                <IconButton variant="danger" icon={<Trash size={20} />} label="Excluir" />
                <IconButton variant="ghost" size="sm" icon={<Plus size={16} />} label="Adicionar" />
              </div>
            </div>

            {/* Tamanhos — circular */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Tamanhos
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Tooltip content="Small (32px)">
                  <IconButton variant="primary" size="sm" icon={<Edit size={16} />} ariaLabel="Small" />
                </Tooltip>
                <Tooltip content="Medium (40px)">
                  <IconButton variant="primary" size="md" icon={<Edit size={20} />} ariaLabel="Medium" />
                </Tooltip>
                <Tooltip content="Large (48px)">
                  <IconButton variant="primary" size="lg" icon={<Edit size={20} />} ariaLabel="Large" />
                </Tooltip>
              </div>
            </div>

            {/* Estados */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Estados
              </h3>
              <div className="flex flex-wrap gap-4">
                <Tooltip content="Desabilitado">
                  <IconButton variant="primary" icon={<Edit size={20} />} disabled ariaLabel="Disabled" />
                </Tooltip>
                <Tooltip content="Loading">
                  <IconButton
                    variant="primary"
                    icon={<Check size={20} />}
                    loading={loadingButtons.icon1}
                    onClick={() => handleLoadingDemo('icon1')}
                    ariaLabel="Loading"
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: SPINNER
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Spinner (Circular - SVG)
          </h2>

          <div className="space-y-6">
            {/* Tamanhos */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Tamanhos (conforme protótipo)
              </h3>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">SM (16px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="md" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">MD (24px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="lg" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">LG (40px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="xl" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">XL (64px)</span>
                </div>
              </div>
            </div>

            {/* Variantes de cor */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Variantes de Cor
              </h3>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Spinner variant="primary" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">Primary</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner variant="success" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">Success</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner variant="danger" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">Danger</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner variant="warning" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">Warning</span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-[var(--ds-color-primary)] p-4 rounded-lg">
                  <Spinner variant="white" />
                  <span className="text-xs text-white">White</span>
                </div>
              </div>
            </div>

            {/* Track visível */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Com Track Visível (fundo cinza)
              </h3>
              <div className="flex items-center gap-4">
                <Spinner size="lg" />
                <span className="text-sm text-[var(--ds-color-text-secondary)]">
                  → Note o círculo de fundo (#27272A com opacity 20%)
                </span>
              </div>
            </div>

            {/* Centralizado */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Centralizado (center prop)
              </h3>
              <div className="h-32 bg-[var(--ds-color-surface)] rounded-lg">
                <Spinner center size="lg" label="Carregando dados..." />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: SPINNER DOTS
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Spinner Dots (3 pontinhos)
          </h2>

          <div className="space-y-6">
            {/* Exemplo padrão */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Padrão
              </h3>
              <div className="flex items-center gap-4">
                <SpinnerDots />
                <span className="text-sm text-[var(--ds-color-text-secondary)]">
                  3 pontos pulsando em sequência
                </span>
              </div>
            </div>

            {/* Com texto ao lado */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Uso em Contexto
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-[var(--ds-color-surface)] rounded-lg">
                  <SpinnerDots />
                  <span className="text-sm text-[var(--ds-color-text-secondary)]">
                    Buscando transações...
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[var(--ds-color-surface)] rounded-lg">
                  <SpinnerDots />
                  <span className="text-sm text-[var(--ds-color-text-secondary)]">
                    Gerando insights...
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[var(--ds-color-surface)] rounded-lg">
                  <SpinnerDots />
                  <span className="text-sm text-[var(--ds-color-text-secondary)]">
                    Sincronizando com Google Calendar...
                  </span>
                </div>
              </div>
            </div>

            {/* Centralizado */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Centralizado
              </h3>
              <div className="h-32 bg-[var(--ds-color-surface)] rounded-lg">
                <SpinnerDots center label="Carregando..." />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: SPINNER OVERLAY
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            SpinnerOverlay (Fullscreen)
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Demonstração (clique para ativar)
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  onClick={() => {
                    setSpinnerOverlay({ text: 'Carregando...', variant: 'primary' })
                    setTimeout(() => setSpinnerOverlay(null), 3000)
                  }}
                >
                  Exibir Overlay (3s)
                </Button>
                <Button
                  variant="success"
                  onClick={() => {
                    setSpinnerOverlay({ text: 'Salvando...', variant: 'success' })
                    setTimeout(() => setSpinnerOverlay(null), 2000)
                  }}
                >
                  Exibir Overlay Success
                </Button>
              </div>
            </div>

            {/* Preview estático */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Preview (não interativo)
              </h3>
              <div className="relative h-64 bg-[var(--ds-color-surface)] rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090B] bg-opacity-80">
                  <Spinner size="xl" variant="primary" />
                  <p className="mt-6 text-[var(--ds-color-placeholder)] text-base font-medium">
                    Carregando...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: TOAST NOTIFICATIONS
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Toast Notifications
          </h2>

          <div className="space-y-6">
            {/* Tipos */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                4 Tipos (clique para testar)
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="success"
                  onClick={() => toast.success('Transação salva com sucesso')}
                >
                  Toast Success
                </Button>
                <Button
                  variant="danger"
                  onClick={() => toast.error('Não foi possível salvar. Tente novamente.')}
                >
                  Toast Error
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => toast.warning('Seu orçamento de alimentação atingiu 80%')}
                >
                  Toast Warning
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => toast.info('Sua meta foi atualizada automaticamente')}
                >
                  Toast Info
                </Button>
              </div>
            </div>

            {/* Com títulos customizados */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Com Títulos Customizados
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="success"
                  onClick={() => toast.success('Seus dados foram sincronizados', 'Sincronização concluída')}
                >
                  Success + Título
                </Button>
                <Button
                  variant="danger"
                  onClick={() => toast.error('Verifique sua conexão com a internet', 'Falha na conexão')}
                >
                  Error + Título
                </Button>
              </div>
            </div>

            {/* Duração customizada */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Duração Customizada
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="ghost"
                  onClick={() => toast.info('Esta mensagem fica 2 segundos', null, 2000)}
                >
                  Toast 2s
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => toast.info('Esta mensagem fica 8 segundos', null, 8000)}
                >
                  Toast 8s
                </Button>
              </div>
            </div>

            {/* Empilhamento (máx. 3) */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Empilhamento (máx. 3 visíveis)
              </h3>
              <Button
                variant="primary"
                onClick={() => {
                  toast.success('Toast 1 - Primeira notificação')
                  setTimeout(() => toast.info('Toast 2 - Segunda notificação'), 200)
                  setTimeout(() => toast.warning('Toast 3 - Terceira notificação'), 400)
                  setTimeout(() => toast.error('Toast 4 - Quarta notificação (oculta até liberar espaço)'), 600)
                }}
              >
                Disparar 4 Toasts Sequenciais
              </Button>
              <p className="text-sm text-[var(--ds-color-text-secondary)] mt-2">
                → Note que apenas 3 toasts são visíveis por vez (canto superior direito)
              </p>
            </div>

            {/* Contextos reais */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Exemplos de Contextos Reais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--ds-color-surface)] rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm text-[var(--ds-color-text)]">Transações</h4>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      fullWidth
                      variant="success"
                      onClick={() => toast.success('Transação de R$ 250,00 criada com sucesso')}
                    >
                      Criar Transação
                    </Button>
                    <Button
                      size="sm"
                      fullWidth
                      variant="danger"
                      onClick={() => toast.error('Saldo insuficiente para esta transação')}
                    >
                      Simular Erro
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-[var(--ds-color-surface)] rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm text-[var(--ds-color-text)]">Metas</h4>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      fullWidth
                      variant="success"
                      onClick={() => toast.success('Meta "Viagem para Macaé" atualizada')}
                    >
                      Atualizar Meta
                    </Button>
                    <Button
                      size="sm"
                      fullWidth
                      variant="ghost"
                      onClick={() => toast.warning('Faltam apenas R$ 200,00 para atingir sua meta!')}
                    >
                      Alerta de Meta
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-[var(--ds-color-surface)] rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm text-[var(--ds-color-text)]">Sincronização</h4>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      fullWidth
                      variant="ghost"
                      onClick={() => toast.info('Sincronizado com Google Calendar', 'Sincronização concluída')}
                    >
                      Sync Google Calendar
                    </Button>
                    <Button
                      size="sm"
                      fullWidth
                      variant="danger"
                      onClick={() => toast.error('Falha ao conectar com Google Calendar', 'Erro de sincronização')}
                    >
                      Simular Erro Sync
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-[var(--ds-color-surface)] rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm text-[var(--ds-color-text)]">Gamificação</h4>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      fullWidth
                      variant="success"
                      onClick={() => toast.success('Você ganhou 50 XP!', '🏆 Conquista desbloqueada')}
                    >
                      Desbloquear Conquista
                    </Button>
                    <Button
                      size="sm"
                      fullWidth
                      variant="ghost"
                      onClick={() => toast.info('Você subiu para o nível 5!', '⬆️ Level Up')}
                    >
                      Level Up
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: ALERT
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Alert (Alerta Inline)
          </h2>

          <div className="space-y-6">
            {/* 4 Tipos */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                4 Tipos (Info, Success, Warning, Error)
              </h3>
              <div className="space-y-4">
                <Alert
                  type="info"
                  title="Informação"
                  message="Esta é uma mensagem informativa inline. Diferente do Toast, o Alert permanece no fluxo da página."
                />
                <Alert
                  type="success"
                  title="Sucesso"
                  message="Sua operação foi concluída com sucesso!"
                />
                <Alert
                  type="warning"
                  title="Atenção"
                  message="Seu orçamento de alimentação atingiu 80%. Revise seus gastos."
                />
                <Alert
                  type="error"
                  title="Erro"
                  message="Não foi possível salvar os dados. Verifique sua conexão e tente novamente."
                />
              </div>
            </div>

            {/* Sem título */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Sem Título (apenas mensagem)
              </h3>
              <div className="space-y-4">
                <Alert type="info" message="Mensagem simples sem título" />
                <Alert type="success" message="Transação criada com sucesso!" />
              </div>
            </div>

            {/* Dismissible (pode fechar) */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Dismissible (com botão X)
              </h3>
              <div className="space-y-4">
                <Alert
                  type="info"
                  message="Este alerta pode ser fechado pelo usuário"
                  dismissible
                  onDismiss={() => console.log('Alert fechado')}
                />
                <Alert
                  type="warning"
                  title="Lembrete"
                  message="Não esqueça de revisar suas metas mensais"
                  dismissible
                />
              </div>
            </div>

            {/* Casos de uso reais */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Exemplos de Contextos Reais
              </h3>
              <div className="space-y-4">
                <Alert
                  type="warning"
                  title="Meta próxima do prazo"
                  message='Sua meta "Viagem para Macaé" vence em 3 dias. Faltam R$ 200,00.'
                  dismissible
                />
                <Alert
                  type="info"
                  title="Sincronização pendente"
                  message="Há lembretes não sincronizados com Google Calendar. Conecte-se para sincronizar."
                />
                <Alert
                  type="success"
                  message="Você atingiu 100% da sua meta de economia mensal! 🎉"
                  dismissible
                />
                <Alert
                  type="error"
                  title="Falha na transação"
                  message="O valor inserido excede seu saldo disponível. Ajuste o valor ou selecione outra conta."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: SKELETON
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Skeleton (Placeholder Animado)
          </h2>

          <div className="space-y-6">
            {/* Variantes */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Variantes
              </h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">text (14px)</span>
                  <Skeleton variant="text" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">title (20px)</span>
                  <Skeleton variant="title" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">avatar (circular)</span>
                  <Skeleton variant="avatar" size={48} />
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">button (40px)</span>
                  <Skeleton variant="button" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">card</span>
                  <Skeleton variant="card" height={80} />
                </div>
              </div>
            </div>

            {/* Preview Dashboard (como protótipo) */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Preview — Dashboard Loading
              </h3>
              <div className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface)] p-6 space-y-6 overflow-hidden">
                {/* Recursos — row de cards */}
                <div>
                  <Skeleton variant="title" width="120px" className="mb-4" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="p-3 rounded-[var(--ds-radius-md)] bg-[var(--ds-color-background)] space-y-3">
                        <Skeleton variant="avatar" size={32} />
                        <Skeleton variant="text" width="70%" />
                        <Skeleton variant="text" width="50%" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Últimas transações */}
                  <div className="p-4 rounded-[var(--ds-radius-md)] bg-[var(--ds-color-background)] space-y-4">
                    <Skeleton variant="title" width="140px" />
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton variant="avatar" size={36} />
                        <div className="flex-1 space-y-2">
                          <Skeleton variant="text" width="80%" />
                          <Skeleton variant="text" width="40%" />
                        </div>
                        <Skeleton variant="text" width="48px" />
                      </div>
                    ))}
                  </div>

                  {/* Resumo do mês — chart */}
                  <div className="p-4 rounded-[var(--ds-radius-md)] bg-[var(--ds-color-background)] space-y-4">
                    <Skeleton variant="title" width="130px" />
                    <Skeleton variant="card" height={180} />
                  </div>

                  {/* Metas em andamento */}
                  <div className="p-4 rounded-[var(--ds-radius-md)] bg-[var(--ds-color-background)] space-y-4">
                    <Skeleton variant="title" width="150px" />
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                          <Skeleton variant="text" width="60%" />
                          <Skeleton variant="text" width="30px" />
                        </div>
                        <Skeleton variant="text" height={8} className="rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transações por categoria */}
                <div className="p-4 rounded-[var(--ds-radius-md)] bg-[var(--ds-color-background)]">
                  <Skeleton variant="title" width="180px" className="mb-4" />
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Skeleton variant="avatar" size={120} className="shrink-0" />
                    <div className="flex-1 w-full space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton variant="avatar" size={12} />
                          <Skeleton variant="text" width={`${60 - i * 8}%`} />
                          <Skeleton variant="text" width="40px" className="ml-auto" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[var(--ds-color-text-secondary)] mt-2">
                → Shimmer animado (1.5s loop) — use múltiplos Skeletons para compor layouts como o dashboard
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: INPUTS
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Inputs
          </h2>

          <div className="space-y-10">
            {/* InputText */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                InputText — Estados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
                <InputText
                  label="Email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail size={20} />}
                  type="email"
                />
                <InputText
                  label="Email"
                  placeholder="exemplo@email.com"
                  value={emailFilled}
                  onChange={(e) => setEmailFilled(e.target.value)}
                  leftIcon={<Mail size={20} />}
                  type="email"
                />
                <InputText
                  label="Email"
                  placeholder="exemplo@email.com"
                  value=""
                  leftIcon={<Mail size={20} />}
                  error="Este campo é obrigatório"
                  onChange={() => {}}
                />
                <InputText
                  label="Email"
                  value={emailClear}
                  onChange={(e) => setEmailClear(e.target.value)}
                  leftIcon={<Mail size={20} />}
                  onClear={() => setEmailClear('')}
                />
                <InputText
                  label="Email"
                  placeholder="exemplo@email.com"
                  value="exemplo@email.com"
                  leftIcon={<Mail size={20} />}
                  disabled
                  onChange={() => {}}
                />
              </div>
              <p className="text-sm text-[var(--ds-color-text-secondary)] mt-3">
                → Default / Filled / Error / Com clear (X) / Disabled
              </p>
            </div>

            {/* InputPassword */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                InputPassword — Toggle + Validação
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
                <InputPassword
                  label="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputPassword
                  label="Senha"
                  value={passwordValidation}
                  onChange={(e) => setPasswordValidation(e.target.value)}
                  showValidation
                />
                <InputPassword
                  label="Senha"
                  value="fraca"
                  error="Senha muito fraca"
                  onChange={() => {}}
                />
                <InputPassword
                  label="Senha"
                  value="••••••••"
                  disabled
                  onChange={() => {}}
                />
              </div>
              <p className="text-sm text-[var(--ds-color-text-secondary)] mt-3">
                → Toggle olho (Eye/EyeOff) · Checklist em tempo real · Error · Disabled
              </p>
            </div>

            {/* InputMoney */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                InputMoney — Máscara BRL
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                <InputMoney
                  label="Valor"
                  value={money}
                  onChange={setMoney}
                />
                <InputMoney
                  label="Valor"
                  value={750}
                  helperText="Saldo disponível: R$ 2.356,40"
                  conversionText="≈ $ 267,86 USD (conversão estimada)"
                  onChange={() => {}}
                />
                <InputMoney
                  label="Valor"
                  value={0}
                  error="Valor deve ser maior que zero"
                  onChange={() => {}}
                />
                <InputMoney
                  label="Aporte"
                  size="large"
                  value={moneyLarge}
                  onChange={setMoneyLarge}
                />
              </div>
            </div>

            {/* InputNumber */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                InputNumber — Stepper
              </h3>
              <div className="flex flex-wrap items-end gap-8">
                <InputNumber label="Quantidade" value={quantity} onChange={setQuantity} min={1} max={10} />
                <InputNumber label="Desabilitado" value={5} min={1} max={10} disabled onChange={() => {}} />
              </div>
            </div>

            {/* InputSearch */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                InputSearch — Dropdown
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
                <InputSearch
                  placeholder="Pesquisar por descrição ou tag..."
                  value={search}
                  onChange={setSearch}
                  onClear={() => setSearch('')}
                  results={search.trim() ? searchResults : undefined}
                  onViewAll={() => toast.info(`Buscando: ${search}`)}
                  renderResult={(item) => (
                    <div className="flex items-center gap-3">
                      <span className={cn('flex h-8 w-8 items-center justify-center rounded-full text-base', item.color)}>
                        {item.emoji}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[var(--ds-color-text)]">
                          {highlightMatch(item.title, search)}
                        </p>
                        <p className="text-xs text-[var(--ds-color-text-secondary)]">{item.subtitle}</p>
                      </div>
                    </div>
                  )}
                />
                <InputSearch
                  size="compact"
                  placeholder="Buscar..."
                  value={searchCompact}
                  onChange={setSearchCompact}
                  onClear={() => setSearchCompact('')}
                />
              </div>
              <p className="text-sm text-[var(--ds-color-text-secondary)] mt-3">
                → Digite &quot;viagem&quot; para ver resultados · &quot;xyz123&quot; para empty state
              </p>
            </div>

            {/* Textarea */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Textarea — Contador
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <Textarea
                  label="Descrição"
                  placeholder="Escreva sua observação, dica ou informação..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                />
                <Textarea
                  label="Notas"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                />
                <Textarea
                  label="Descrição"
                  value=""
                  error="Este campo é obrigatório"
                  maxLength={500}
                  onChange={() => {}}
                />
                <Textarea
                  label="Descrição"
                  value="Campo desabilitado"
                  disabled
                  maxLength={500}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: SELECTS
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Selects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Select básico */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                Select
              </h3>
              <Select
                label="Label"
                placeholder="Selecione..."
                options={CATEGORY_OPTIONS.slice(0, 7)}
                value={selectValue}
                onChange={setSelectValue}
              />
              <Select
                label="Com ícones"
                options={CATEGORY_OPTIONS.slice(0, 4)}
                value="alimentacao"
                onChange={() => {}}
              />
              <Select
                label="Erro"
                options={CATEGORY_OPTIONS.slice(0, 3)}
                value={null}
                onChange={() => {}}
                error="Este campo é obrigatório"
              />
            </div>

            {/* SelectSearch */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                SelectSearch
              </h3>
              <SelectSearch
                label="Categoria"
                placeholder="Selecione uma categoria..."
                options={CATEGORY_OPTIONS}
                value={selectSearchValue}
                onChange={setSelectSearchValue}
              />
            </div>

            {/* MultiSelect */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                MultiSelect (sem busca)
              </h3>
              <MultiSelect
                label="Recurso"
                placeholder="Selecione os recursos..."
                options={RESOURCE_OPTIONS}
                values={multiSelectValues}
                onChange={setMultiSelectValues}
              />
              <MultiSelect
                label="Dias da semana"
                placeholder="Selecione os dias..."
                options={WEEKDAY_OPTIONS}
                values={['seg', 'qua', 'sex']}
                onChange={() => {}}
                maxChipsVisible={3}
              />
            </div>

            {/* MultiSelectSearch */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                MultiSelectSearch (com busca)
              </h3>
              <MultiSelectSearch
                label="Categorias"
                placeholder="Selecione categorias..."
                options={CATEGORY_OPTIONS}
                values={multiSelectSearchValues}
                onChange={setMultiSelectSearchValues}
                maxChipsVisible={2}
              />
            </div>

            {/* TagsInput */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                TagsInput
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TagsInput
                  label="Tags"
                  tags={tags}
                  onAdd={(tag) => setTags((prev) => [...prev, tag])}
                  onRemove={(tag) => setTags((prev) => prev.filter((t) => t !== tag))}
                  suggestions={TAG_SUGGESTIONS}
                />
                <TagsInput
                  label="Tags"
                  tags={['tag1', 'tag2', 'tag3', 'tag4', 'tag5']}
                  onAdd={() => {}}
                  onRemove={() => {}}
                  max={5}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: PICKERS
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Pickers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                DatePicker
              </h3>
              <DatePicker label="Data" value={dateValue} onChange={setDateValue} />
              <DatePicker label="Com erro" value={null} onChange={() => {}} error="Este campo é obrigatório" />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                MonthPicker
              </h3>
              <MonthPicker label="Período" value={monthValue} onChange={setMonthValue} />
              <MonthPicker label="Sem futuro" value={monthValue} onChange={setMonthValue} disableFuture />
            </div>

            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                DateRangePicker
              </h3>
              <DateRangePicker
                label="Intervalo"
                startDate={rangeValue.start}
                endDate={rangeValue.end}
                onChange={({ start, end }) => setRangeValue({ start, end })}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                TimePicker (24h)
              </h3>
              <TimePicker label="Horário" value={timeValue} onChange={setTimeValue} />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                TimePicker (12h) + Inline
              </h3>
              <TimePicker label="Horário AM/PM" value={time12Value} onChange={setTime12Value} format="12h" />
              <TimePicker label="Inline" value={timeValue} onChange={setTimeValue} variant="inline" />
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: FORMS
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Forms
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Toggle */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                Toggle
              </h3>
              <Toggle
                checked={toggleOn}
                onChange={setToggleOn}
                label="Notificações push"
                description="Receba alertas de gastos e metas"
              />
              <Toggle
                checked={toggleCompact}
                onChange={setToggleCompact}
                label="Modo compacto"
                size="compact"
              />
              <Toggle checked={false} onChange={() => {}} label="Desabilitado" disabled />
            </div>

            {/* Checkbox */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                Checkbox
              </h3>
              <Checkbox
                checked={checkboxChecked}
                onChange={setCheckboxChecked}
                label="Aceito os termos de uso"
                description="Leia a política de privacidade antes de continuar"
              />
              <Checkbox
                checked={checkboxIndeterminate}
                indeterminate
                onChange={setCheckboxIndeterminate}
                label="Selecionar todos (indeterminate)"
              />
              <Checkbox
                checked={checkboxError}
                onChange={setCheckboxError}
                label="Campo obrigatório"
                error={!checkboxError ? 'Você precisa aceitar para continuar' : undefined}
              />
              <Checkbox checked label="Marcado e desabilitado" disabled />
            </div>

            {/* Radio vertical */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                Radio — Vertical
              </h3>
              <RadioGroup
                aria-label="Frequência de aporte"
                value={radioValue}
                onChange={setRadioValue}
                options={[
                  { value: 'semanal', label: 'Semanal', description: 'Todo domingo' },
                  { value: 'mensal', label: 'Mensal', description: 'Dia 5 de cada mês' },
                  { value: 'trimestral', label: 'Trimestral', description: 'A cada 3 meses' },
                ]}
              />
            </div>

            {/* Radio horizontal */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                Radio — Horizontal
              </h3>
              <RadioGroup
                aria-label="Forma de pagamento"
                value={radioHorizontal}
                onChange={setRadioHorizontal}
                orientation="horizontal"
                options={[
                  { value: 'pix', label: 'PIX' },
                  { value: 'cartao', label: 'Cartão' },
                  { value: 'boleto', label: 'Boleto' },
                ]}
              />
            </div>

            {/* Radio card */}
            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                Radio — Card
              </h3>
              <RadioGroup
                aria-label="Plano de assinatura"
                variant="card"
                value={radioCard}
                onChange={setRadioCard}
                orientation="horizontal"
                options={[
                  { value: 'free', label: 'Gratuito', description: 'Até 50 transações/mês' },
                  { value: 'premium', label: 'Premium', description: 'Ilimitado + relatórios' },
                  { value: 'family', label: 'Família', description: 'Até 5 membros' },
                ]}
              />
            </div>

            {/* FormField */}
            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase">
                FormField
              </h3>
              <div className="max-w-md">
                <FormField
                  label="Nome da meta"
                  required
                  htmlFor="form-field-name"
                  helperText={!formFieldName ? 'Ex: Reserva de emergência' : undefined}
                  error={formFieldName.length > 0 && formFieldName.length < 3 ? 'Mínimo 3 caracteres' : undefined}
                >
                  <InputText
                    id="form-field-name"
                    value={formFieldName}
                    onChange={setFormFieldName}
                    placeholder="Digite o nome"
                  />
                </FormField>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: CONFIRM MODAL
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            ConfirmModal
          </h2>

          <div className="flex flex-wrap gap-4">
            <Button variant="danger" onClick={() => setConfirmDefaultOpen(true)}>
              Excluir transação
            </Button>
            <Button variant="secondary" onClick={() => setConfirmCriticalOpen(true)}>
              Excluir conta (crítico)
            </Button>
          </div>

          <ConfirmModal
            isOpen={confirmDefaultOpen}
            onClose={() => setConfirmDefaultOpen(false)}
            onConfirm={() => {
              setConfirmLoading(true)
              setTimeout(() => {
                setConfirmLoading(false)
                setConfirmDefaultOpen(false)
                toast.success('Transação excluída')
              }, 1200)
            }}
            title="Excluir transação?"
            message="Esta ação não pode ser desfeita. A transação será removida permanentemente do histórico."
            confirmLabel="Excluir"
            loading={confirmLoading}
          />

          <ConfirmModal
            isOpen={confirmCriticalOpen}
            onClose={() => setConfirmCriticalOpen(false)}
            onConfirm={() => {
              setConfirmCriticalOpen(false)
              toast.warning('Conta excluída (demo)')
            }}
            variant="critical"
            confirmationText="EXCLUIR"
            title="Excluir conta permanentemente?"
            message="Todos os dados, transações e metas serão apagados. Esta ação é irreversível."
            confirmLabel="Excluir conta"
          />
        </section>

        {/* ============================================================
            SECTION: EMPTY STATE & ERROR STATE
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            EmptyState & ErrorState
          </h2>

          <div className="space-y-10">
            {/* Pulso wrappers style — bordered default */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Empty — Pulso (default + bordered)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <EmptyState
                  bordered
                  icon={<ClipboardList strokeWidth={1.5} />}
                  title="Nenhuma transação encontrada"
                  description="Registre sua primeira receita ou despesa"
                  action={{ label: 'Nova Transação', onClick: () => toast.info('Nova transação'), leftIcon: <Plus size={16} /> }}
                />
                <EmptyState
                  bordered
                  icon={<Target strokeWidth={1.5} />}
                  title="Você ainda não tem metas"
                  description="Crie sua primeira meta financeira e comece a guardar!"
                  action={{ label: 'Criar Meta', onClick: () => toast.info('Criar meta') }}
                />
                <EmptyState
                  bordered
                  icon={<Users strokeWidth={1.5} />}
                  title="Nenhum grupo ainda"
                  description="Crie um grupo ou entre com um código de convite"
                  action={{ label: 'Criar Grupo', onClick: () => toast.info('Criar grupo') }}
                  secondaryAction={{ label: 'Entrar com código', onClick: () => toast.info('Entrar'), variant: 'secondary' }}
                />
                <EmptyState
                  bordered
                  icon={<SearchX strokeWidth={1.5} />}
                  title="Nenhum resultado"
                  description="Tente buscar por outro termo"
                  linkAction={{ label: 'Limpar filtros', onClick: () => toast.info('Filtros limpos') }}
                />
                <EmptyState
                  bordered
                  icon={<BarChart3 strokeWidth={1.5} />}
                  title="Sem dados para este período"
                  description="Selecione outro período ou registre transações"
                />
              </div>
            </div>

            {/* Generic variations — protótipo EMPTY STATE */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Empty — Variações (protótipo)
              </h3>
              <div className="mx-auto max-w-4xl space-y-4">
                <EmptyState
                  icon={<Wallet strokeWidth={1.25} />}
                  title="Você ainda não tem transações"
                  description="Comece registrando suas receitas e despesas para ter controle total das suas finanças."
                  action={{ label: 'Nova transação', onClick: () => toast.info('Nova transação'), leftIcon: <Plus size={16} /> }}
                />

                <EmptyState
                  variant="inline-list"
                  items={[
                    {
                      icon: <DollarSign />,
                      title: 'Nenhum aporte registrado.',
                      linkAction: { label: 'Fazer aporte', onClick: () => toast.info('Aporte') },
                    },
                    {
                      icon: <PieChart />,
                      title: 'Nenhum gasto por categoria.',
                      linkAction: { label: 'Ver categorias', onClick: () => toast.info('Categorias') },
                    },
                    {
                      icon: <CalendarDays />,
                      title: 'Nenhum vencimento neste mês.',
                      linkAction: { label: 'Ver calendário', onClick: () => toast.info('Calendário') },
                    },
                  ]}
                />

                <EmptyState
                  variant="suggestion"
                  icon={<FileSearch strokeWidth={1.25} />}
                  title="Você ainda não tem transações"
                  description="Comece registrando suas receitas e despesas para acompanhar seu fluxo financeiro."
                  suggestions={[
                    { icon: <Receipt />, title: 'Registrar despesa', description: 'Anote um gasto do dia', onClick: () => {} },
                    { icon: <Wallet />, title: 'Registrar receita', description: 'Adicione uma entrada', onClick: () => {} },
                    { icon: <CalendarDays />, title: 'Ver calendário', description: 'Confira vencimentos', onClick: () => {} },
                  ]}
                  action={{ label: 'Nova transação', onClick: () => toast.info('Nova transação'), leftIcon: <Plus size={16} /> }}
                />

                <EmptyState
                  variant="rows"
                  items={[
                    {
                      icon: <Folder />,
                      title: 'Nenhum documento encontrado.',
                      linkAction: { label: 'Enviar documento', onClick: () => toast.info('Enviar') },
                    },
                    {
                      icon: <Bell />,
                      title: 'Nenhum lembrete ativo.',
                      linkAction: { label: 'Criar lembrete', onClick: () => toast.info('Lembrete') },
                    },
                    {
                      icon: <Users />,
                      title: 'Nenhum membro no grupo.',
                      linkAction: { label: 'Convidar', onClick: () => toast.info('Convidar') },
                    },
                    {
                      icon: <Gem />,
                      title: 'Nenhuma conquista desbloqueada.',
                      linkAction: { label: 'Ver gamificação', onClick: () => toast.info('Gamificação') },
                    },
                    {
                      icon: <CreditCard />,
                      title: 'Nenhum cartão cadastrado.',
                      linkAction: { label: 'Adicionar cartão', onClick: () => toast.info('Cartão') },
                    },
                  ]}
                />
              </div>
            </div>

            {/* Error variations */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Error — Variações
              </h3>
              <div className="space-y-4">
                <div className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface)]">
                  <ErrorState
                    loading={errorRetryLoading}
                    onRetry={handleErrorRetry}
                    secondaryAction={{ label: 'Voltar ao Dashboard', onClick: () => toast.info('Dashboard') }}
                  />
                </div>
                <ErrorState
                  variant="inline"
                  title="Erro ao carregar transações"
                  message="Não foi possível buscar os dados neste momento."
                  onRetry={() => toast.info('Retry inline')}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ErrorState
                    variant="card"
                    errorType="connection"
                    title="Sem conexão"
                    message="Verifique sua internet e tente novamente."
                    onRetry={() => toast.info('Retry conexão')}
                  />
                  <ErrorState
                    variant="card"
                    errorType="permission"
                    title="Acesso negado"
                    message="Você não tem permissão para ver estes dados."
                    onRetry={() => toast.info('Retry permissão')}
                  />
                  <ErrorState
                    variant="card"
                    errorType="server"
                    title="Erro no servidor"
                    message="Estamos com instabilidade. Tente em alguns minutos."
                    onRetry={() => toast.info('Retry servidor')}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: AVATAR, BADGE, CARD
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Avatar, Badge & Card
          </h2>

          <div className="space-y-10">
            {/* Avatar */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Avatar — tamanhos e estados
              </h3>
              <div className="flex flex-wrap items-end gap-6">
                {(['xs', 'sm', 'md', 'lg', 'xl']).map((size) => (
                  <div key={size} className="flex flex-col items-center gap-2">
                    <Avatar
                      src="https://i.pravatar.cc/150?u=pulso-demo"
                      name="Maria Fernandes"
                      size={size}
                      status={size === 'md' ? 'online' : undefined}
                    />
                    <span className="text-xs text-[var(--ds-color-text-secondary)]">{size}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-8 mt-6">
                <Avatar name="Maria Fernandes" size="md" />
                <Avatar
                  src="https://i.pravatar.cc/150?u=pulso-online"
                  name="João Silva"
                  size="md"
                  status="online"
                />
                <Avatar
                  src="https://i.pravatar.cc/150?u=pulso-edit"
                  name="Perfil"
                  size="xl"
                  editable
                  onEdit={() => toast.info('Editar foto')}
                />
              </div>
              <div className="mt-6">
                <p className="text-xs text-[var(--ds-color-text-secondary)] mb-3">Grupo de avatares</p>
                <AvatarGroup
                  size="md"
                  max={3}
                  avatars={[
                    { name: 'Ana Costa', src: 'https://i.pravatar.cc/150?u=ana' },
                    { name: 'Bruno Lima', src: 'https://i.pravatar.cc/150?u=bruno' },
                    { name: 'Carla Dias', src: 'https://i.pravatar.cc/150?u=carla' },
                    { name: 'Diego Souza' },
                    { name: 'Elena Rocha' },
                  ]}
                />
              </div>
            </div>

            {/* Badge */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-2">
                Badge — Pulso (catálogo + ícone associado)
              </h3>
              <p className="text-xs text-[var(--ds-color-text-secondary)] mb-4 max-w-2xl">
                Use <code className="text-[var(--ds-color-primary)]">PulsoBadge</code> com{' '}
                <code className="text-[var(--ds-color-primary)]">kind</code> do catálogo ou{' '}
                <code className="text-[var(--ds-color-primary)]">definition</code> com{' '}
                <code className="text-[var(--ds-color-primary)]">icon</code> /{' '}
                <code className="text-[var(--ds-color-primary)]">icone</code> (nome Lucide, como em Categoria).
              </p>
              <div className="flex flex-wrap gap-2">
                <PulsoBadge kind="recurso.dinheiro" appearance={darkMode ? 'outline' : 'soft'} />
                <PulsoBadge kind="recurso.va" appearance={darkMode ? 'outline' : 'soft'} />
                <PulsoBadge kind="recurso.vr" appearance={darkMode ? 'outline' : 'soft'} />
                <PulsoBadge kind="recurso.vt" appearance={darkMode ? 'outline' : 'soft'} />
                <PulsoBadge kind="meta-status.ativa" appearance={darkMode ? 'outline' : 'soft'} />
                <PulsoBadge kind="meta-status.pausada" appearance={darkMode ? 'outline' : 'soft'} />
                <PulsoBadge kind="meta-status.concluida" appearance={darkMode ? 'outline' : 'soft'} />
                <PulsoBadge kind="meta-status.cancelada" appearance={darkMode ? 'outline' : 'soft'} />
                <PulsoBadge kind="meta-tipo.curto" appearance={darkMode ? 'outline' : 'soft'} />
                <PulsoBadge kind="meta-tipo.longo" appearance={darkMode ? 'outline' : 'soft'} />
                <PulsoBadge kind="prioridade.alta" appearance={darkMode ? 'outline' : 'soft'} />
                <PulsoBadge kind="prioridade.media" appearance={darkMode ? 'outline' : 'soft'} />
                <PulsoBadge kind="prioridade.baixa" appearance={darkMode ? 'outline' : 'soft'} />
                <PulsoBadge kind="generico.info" appearance={darkMode ? 'outline' : 'soft'} />
              </div>
              <p className="text-xs text-[var(--ds-color-text-secondary)] mt-4 mb-2">
                Badge criada no Pulso (ex.: API / usuário — ícone + cor custom)
              </p>
              <div className="flex flex-wrap gap-2">
                <PulsoBadge
                  definition={{ label: 'Side project', icon: 'Laptop', color: '#06B6D4' }}
                  appearance={darkMode ? 'outline' : 'soft'}
                />
                <PulsoBadge
                  definition={{ nome: 'Meta pessoal', icone: 'Star', cor: '#7C3AED' }}
                  appearance={darkMode ? 'outline' : 'soft'}
                />
              </div>
            </div>

            {/* Cards */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Card — variações
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card variant="elevated" padding="md">
                  <p className="text-sm font-semibold text-[var(--ds-color-text)]">Resumo do mês</p>
                  <p className="text-xs text-[var(--ds-color-text-secondary)] mt-1">Total em abril</p>
                  <p className="text-2xl font-bold text-[var(--ds-color-text)] mt-3">{formatCurrency(2450)}</p>
                  <div className="flex justify-end mt-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--ds-color-primary)_15%,transparent)] text-[var(--ds-color-primary)]">
                      <LineChart size={16} />
                    </span>
                  </div>
                </Card>

                <Card variant="elevated" padding="none">
                  <CardHeader
                    action={
                      <button type="button" className="text-sm font-medium text-[var(--ds-color-primary)] hover:underline">
                        Ver todas →
                      </button>
                    }
                  >
                    <h4 className="font-semibold text-[var(--ds-color-text)]">Últimas Transações</h4>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    {[
                      { label: 'Salário', sub: 'Receita • 22/04', value: '+R$ 1.500,00', up: true },
                      { label: 'Mercado', sub: 'Despesa • 21/04', value: '-R$ 87,00', up: false },
                      { label: 'Transporte', sub: 'Despesa • 20/04', value: '-R$ 12,50', up: false },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                              row.up
                                ? 'bg-[color-mix(in_srgb,var(--ds-color-success)_15%,transparent)] text-[var(--ds-color-success)]'
                                : 'bg-[color-mix(in_srgb,var(--ds-color-danger)_15%,transparent)] text-[var(--ds-color-danger)]'
                            )}
                          >
                            {row.up ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[var(--ds-color-text)] truncate">{row.label}</p>
                            <p className="text-xs text-[var(--ds-color-text-secondary)]">{row.sub}</p>
                          </div>
                        </div>
                        <span className={cn('text-sm font-semibold shrink-0', row.up ? 'text-[var(--ds-color-success)]' : 'text-[var(--ds-color-danger)]')}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </CardBody>
                </Card>

                <Card variant="elevated" padding="none" className="lg:col-span-2">
                  <CardHeader
                    action={<Badge variant="primary" size="sm">68%</Badge>}
                  >
                    <h4 className="font-semibold text-[var(--ds-color-text)]">Meta: Viagem Macaé</h4>
                  </CardHeader>
                  <CardBody>
                    <p className="text-2xl font-bold text-[var(--ds-color-text)]">
                      {formatCurrency(680)}
                      <span className="text-sm font-normal text-[var(--ds-color-text-secondary)]"> de {formatCurrency(1000)}</span>
                    </p>
                    <ProgressBar
                      className="mt-4"
                      value={680}
                      max={1000}
                      variant="primary"
                      layout="labeled"
                      label={`${formatCurrency(680)} de ${formatCurrency(1000)}`}
                      showLabel
                      helperText={`Faltam ${formatCurrency(320)} para concluir`}
                    />
                  </CardBody>
                  <CardFooter>
                    <button type="button" className="text-sm font-medium text-[var(--ds-color-primary)] hover:underline">
                      Ver detalhes
                    </button>
                    <Button
                      size="sm"
                      loading={loadingButtons.cardMeta}
                      onClick={() => handleLoadingDemo('cardMeta')}
                    >
                      Adicionar valor
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
                {[
                  { color: 'primary', icon: Target, title: 'Meta em andamento', desc: 'Continue aportando para alcançar sua meta.' },
                  { color: 'success', icon: CheckCircle, title: 'Tudo certo!', desc: 'Suas finanças estão dentro do planejado.' },
                  { color: 'warning', icon: AlertTriangle, title: 'Atenção', desc: 'Alguns gastos estão acima da média.' },
                  { color: 'danger', icon: TrendingDown, title: 'Gasto acima do normal', desc: 'Revise despesas da última semana.' },
                ].map((item) => (
                  <Card key={item.title} variant="accent" accentColor={item.color} padding="md">
                    <item.icon size={20} className="text-[var(--ds-card-accent,var(--ds-color-primary))]" style={{ color: `var(--ds-card-accent)` }} />
                    <p className="font-semibold text-[var(--ds-color-text)] mt-3">{item.title}</p>
                    <p className="text-xs text-[var(--ds-color-text-secondary)] mt-1 leading-relaxed">{item.desc}</p>
                    <button type="button" className="text-xs font-medium mt-3 hover:underline" style={{ color: 'var(--ds-card-accent)' }}>
                      Ver detalhes →
                    </button>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Card variant="elevated" interactive padding="md">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--ds-color-primary)_12%,transparent)] text-[var(--ds-color-primary)]">
                      <Wallet size={20} />
                    </span>
                    <div>
                      <p className="text-sm text-[var(--ds-color-text-secondary)]">Carteira</p>
                      <p className="text-xl font-bold text-[var(--ds-color-text)]">{formatCurrency(8420)}</p>
                      <p className="text-xs text-[var(--ds-color-text-secondary)]">Saldo total</p>
                    </div>
                  </div>
                </Card>
                <p className="text-xs text-[var(--ds-color-text-secondary)] self-center">
                  Passe o mouse no card à esquerda para ver a borda roxa (interativo).
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {[
                  { name: 'Dólar (USD)', value: 'R$ 5,24', change: '+0,32%', up: true },
                  { name: 'Euro (EUR)', value: 'R$ 5,68', change: '-0,15%', up: false },
                  { name: 'Bitcoin (BTC)', value: 'R$ 312k', change: '+2,1%', up: true },
                  { name: 'Ethereum (ETH)', value: 'R$ 16,2k', change: '-0,8%', up: false },
                ].map((c) => (
                  <Card key={c.name} variant="elevated" padding="sm">
                    <p className="text-xs font-medium text-[var(--ds-color-text-secondary)]">{c.name}</p>
                    <p className="text-lg font-bold text-[var(--ds-color-text)] mt-2">{c.value}</p>
                    <p className={cn('text-xs font-medium mt-1', c.up ? 'text-[var(--ds-color-success)]' : 'text-[var(--ds-color-danger)]')}>
                      {c.change}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: PROGRESS
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            ProgressBar & ProgressCircle
          </h2>

          <div className="space-y-10">
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Barra — variantes semânticas
              </h3>
              <div className="space-y-4 max-w-xl">
                {[
                  { variant: 'primary', value: 67, label: 'Metas em andamento', sub: 'PRIMARY' },
                  { variant: 'success', value: 100, label: 'Meta concluída', sub: 'SUCCESS' },
                  { variant: 'warning', value: 80, label: 'Orçamento em 80%', sub: 'WARNING' },
                  { variant: 'danger', value: 120, max: 100, label: 'Orçamento estourado', sub: 'DANGER (overflow)' },
                  { variant: 'info', value: 45, label: 'Informativo', sub: 'INFO' },
                ].map((row) => (
                  <div key={row.sub}>
                    <p className="text-xs font-semibold text-[var(--ds-color-text-secondary)] mb-1">{row.sub}</p>
                    <p className="text-sm text-[var(--ds-color-text)] mb-2">{row.label}</p>
                    <ProgressBar
                      value={row.value}
                      max={row.max ?? 100}
                      variant={row.variant}
                      showLabel
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Barra — score de saúde (cor dinâmica)
              </h3>
              <div className="space-y-3 max-w-xl">
                {[30, 50, 70, 90, 100].map((v) => (
                  <ProgressBar key={v} value={v} colorMode="health" showLabel />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              <ProgressBar
                layout="labeled"
                value={1407}
                max={2100}
                variant="primary"
                label={`${formatCurrency(1407)} de ${formatCurrency(2100)}`}
                showLabel
              />
              <ProgressBar
                layout="xp"
                value={450}
                max={1000}
                variant="primary"
                label="450 / 1000 XP"
                helperText="Faltam 550 XP"
                showLabel
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Barra slim (4px)
              </h3>
              <div className="flex flex-wrap gap-6 max-w-2xl">
                {[
                  { variant: 'primary', value: 67 },
                  { variant: 'success', value: 100 },
                  { variant: 'warning', value: 80 },
                  { variant: 'danger', value: 120, max: 100 },
                  { variant: 'info', value: 45 },
                ].map((b) => (
                  <div key={b.variant} className="w-28">
                    <ProgressBar size="sm" showLabel {...b} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Círculo — variações principais
              </h3>
              <div className="flex flex-wrap items-end gap-10">
                <ProgressCircle value={67} label="Viagem Macaé" />
                <ProgressCircle value={78} colorMode="health" size="lg">
                  <span className="text-xl font-bold text-[var(--ds-color-text)]">
                    78
                    <span className="text-sm font-normal text-[var(--ds-color-text-secondary)]"> /100</span>
                  </span>
                </ProgressCircle>
                <ProgressCircle value={72} size={64} variant="primary" label="Consciente">
                  <Star size={22} className="text-[var(--ds-color-primary)]" aria-hidden />
                </ProgressCircle>
                <ProgressCircle value={42} size="sm" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Círculo — estados
              </h3>
              <div className="flex flex-wrap gap-8">
                <ProgressCircle value={67} label="Padrão" />
                <ProgressCircle state="loading" label="Carregando" />
                <ProgressCircle state="complete" value={100} label="Concluído" />
                <ProgressCircle state="empty" value={0} label="Vazio" />
                <ProgressCircle state="indeterminate" label="Indeterminado" />
                <ProgressCircle state="paused" value={45} label="Pausado" />
                <ProgressCircle state="error" value={30} label="Erro" />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: TABS, BREADCRUMBS, PAGINATION
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Tabs, Breadcrumbs & Pagination
          </h2>

          <div className="space-y-10">
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Tabs — underline
              </h3>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                variant="underline"
                tabs={[
                  { key: 'todas', label: 'Todas', count: 23 },
                  { key: 'ativas', label: 'Ativas', count: 5 },
                  { key: 'pausadas', label: 'Pausadas', count: 2 },
                  { key: 'concluidas', label: 'Concluídas', count: 16 },
                ]}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Tabs — pills
              </h3>
              <Tabs
                activeKey={activePillTab}
                onChange={setActivePillTab}
                variant="pill"
                tabs={[
                  { key: 'ativas', label: 'Ativas' },
                  { key: 'pausadas', label: 'Pausadas' },
                  { key: 'concluidas', label: 'Concluídas' },
                ]}
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div>
                <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                  Tabs — vertical
                </h3>
                <Tabs
                  activeKey={activeVerticalTab}
                  onChange={setActiveVerticalTab}
                  variant="underline"
                  orientation="vertical"
                  tabs={[
                    { key: 'geral', label: 'Geral', icon: <Settings size={18} /> },
                    { key: 'notificacoes', label: 'Notificações', icon: <Bell size={18} /> },
                    { key: 'seguranca', label: 'Segurança', icon: <Shield size={18} /> },
                  ]}
                />
              </div>
              <p className="text-sm text-[var(--ds-color-text-secondary)] self-center">
                Painel ativo: <strong className="text-[var(--ds-color-text)]">{activeVerticalTab}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Breadcrumbs
              </h3>
              <Breadcrumbs
                showHomeIcon
                items={[
                  { label: 'Dashboard', onClick: () => toast.info('Dashboard') },
                  { label: 'Transações', onClick: () => toast.info('Transações') },
                ]}
              />
              <Breadcrumbs
                showHomeIcon
                items={[
                  { label: 'Dashboard', onClick: () => toast.info('Dashboard') },
                  { label: 'Planejamento', onClick: () => toast.info('Planejamento') },
                  { label: 'Viagens', onClick: () => toast.info('Viagens') },
                  { label: 'Macaé - RJ' },
                ]}
              />
              <Breadcrumbs
                showHomeIcon
                maxItems={4}
                items={[
                  { label: 'Dashboard', onClick: () => toast.info('Dashboard') },
                  { label: 'Planejamento', onClick: () => toast.info('Planejamento') },
                  { label: 'Orçamentos', onClick: () => toast.info('Orçamentos') },
                  { label: 'Viagens', onClick: () => toast.info('Viagens') },
                  { label: 'Macaé - RJ' },
                ]}
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                Pagination
              </h3>
              <Pagination
                page={demoPage}
                totalPages={12}
                onChange={setDemoPage}
              />
              <Pagination
                layout="simple"
                page={demoPage}
                totalPages={12}
                onChange={setDemoPage}
              />
              <Pagination
                layout="full"
                page={demoPage}
                totalPages={12}
                totalItems={117}
                pageSize={demoPageSize}
                showInfo
                showPageSize
                onChange={setDemoPage}
                onPageSizeChange={setDemoPageSize}
              />
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: TABLE
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Table
          </h2>

          <div className="space-y-6 mb-6">
            <div className="flex flex-wrap gap-2">
              {['data', 'loading', 'empty', 'error', 'no-results', 'compact'].map((v) => (
                <Button
                  key={v}
                  size="sm"
                  variant={tableView === v ? 'primary' : 'secondary'}
                  onClick={() => setTableView(v)}
                >
                  {v}
                </Button>
              ))}
            </div>
          </div>

          <Table
            density={tableView === 'compact' ? 'compact' : 'comfortable'}
            loading={tableView === 'loading'}
            error={tableView === 'error'}
            onRetry={() => { setTableView('data'); toast.info('Retry') }}
            emptyState={tableView === 'no-results' ? 'no-results' : 'default'}
            data={tableView === 'data' || tableView === 'compact' ? TABLE_ROWS : []}
            selectable={tableView === 'data' || tableView === 'compact'}
            selectedIds={tableSelected}
            onSelectionChange={setTableSelected}
            sortKey={tableSort.key}
            sortDirection={tableSort.direction}
            onSort={setTableSort}
            showMobileScrollHint
            columns={[
              {
                key: 'data',
                header: 'Data',
                sortable: true,
                width: '110px',
                render: (row) => row.data,
              },
              {
                key: 'comprador',
                header: 'Comprador',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <Avatar name={row.comprador} size="sm" />
                    <span>{row.comprador}</span>
                  </div>
                ),
              },
              {
                key: 'nominal',
                header: 'Nominal',
                align: 'right',
                hideOnMobile: true,
                render: (row) => formatCurrency(row.nominal),
              },
              {
                key: 'recebido',
                header: 'Recebido',
                align: 'right',
                render: (row) => formatCurrency(row.recebido),
              },
              {
                key: 'diff',
                header: 'Diferença',
                align: 'right',
                hideOnMobile: true,
                render: (row) => (
                  <span
                    className={cn(
                      'font-semibold',
                      row.diff > 0 && 'text-[var(--ds-color-success)]',
                      row.diff < 0 && 'text-[var(--ds-color-danger)]',
                      row.diff === 0 && 'text-[var(--ds-color-text-secondary)]'
                    )}
                  >
                    {row.diff > 0 ? '+' : ''}{formatCurrency(row.diff)}
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) => (
                  <Badge
                    variant={row.status === 'pago' ? 'success' : row.status === 'parcial' ? 'warning' : 'danger'}
                    dot
                    appearance={darkMode ? 'outline' : 'soft'}
                  >
                    {row.status === 'pago' ? 'Pago' : row.status === 'parcial' ? 'Pago parcial' : 'Atrasado'}
                  </Badge>
                ),
              },
              {
                key: 'actions',
                header: 'Ações',
                type: 'actions',
                render: () => (
                  <div className="flex justify-end gap-1">
                    <IconButton size="sm" variant="ghost" ariaLabel="Visualizar" icon={<Eye size={16} />} />
                    <IconButton size="sm" variant="ghost" ariaLabel="Editar" icon={<Edit size={16} />} />
                    <IconButton size="sm" variant="ghost" ariaLabel="Mais" icon={<MoreHorizontal size={16} />} />
                  </div>
                ),
              },
            ]}
            footer={
              <>
                {tableView === 'data' || tableView === 'compact' ? (
                  <>
                    <td colSpan={2} className="ds-table__cell">
                      <span className="inline-flex items-center gap-2 text-[var(--ds-color-primary)]">
                        <Calculator size={16} />
                        TOTAL
                      </span>
                    </td>
                    <td className="ds-table__cell ds-table__cell--right ds-table__cell--hide-mobile">
                      {formatCurrency(2350)}
                    </td>
                    <td className="ds-table__cell ds-table__cell--right">{formatCurrency(1600)}</td>
                    <td className="ds-table__cell ds-table__cell--right ds-table__cell--hide-mobile text-[var(--ds-color-danger)]">
                      {formatCurrency(-750)}
                    </td>
                    <td colSpan={2} className="ds-table__cell" />
                  </>
                ) : null}
              </>
            }
          />
        </section>

        {/* ============================================================
            SECTION: TOOLTIP
            ============================================================ */}
        {/* ============================================================
            SECTION: PULSO — ResourceCard + NotificationPanel
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-2 text-[var(--ds-color-text)]">
            Pulso — Dashboard
          </h2>
          <p className="text-[var(--ds-color-text-secondary)] mb-8">
            Componentes específicos do Pulso (camada <code className="text-xs">src/components/</code>)
          </p>

          <div className="space-y-12">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[var(--ds-color-text)]">Recursos</h3>
                  <p className="text-sm text-[var(--ds-color-text-secondary)] mt-1">
                    Acompanhe o saldo dos seus recursos financeiros
                  </p>
                </div>
                <Button variant="secondary" leftIcon={<Settings size={18} />}>
                  Gerenciar recursos
                </Button>
              </div>

              <div className="pulso-resources-grid">
                <ResourceCard type="DINHEIRO" value={2356.4} subtitle="Disponível" />
                <ResourceCard type="VA" value={980.5} subtitle="Disponível" />
                <ResourceCard type="VR" value={850.3} subtitle="Disponível" />
                <ResourceCard
                  type="VT"
                  value={375.55}
                  subtitle="Sugestão de uso: R$ 24,90 por dia"
                  subtitleDot="suggestion"
                />
                <ResourceCard
                  type="SALDO_TOTAL"
                  value={4560.75}
                  subtitle="↑ 8,2% em relação a abril"
                  subtitleDot="growth"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-8 items-start">
              <div>
                <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                  NotificationPanel
                </h3>
                <NotificationPanel
                  notifications={demoNotifications}
                  onMarkAllRead={handleMarkAllNotificationsRead}
                  onRead={handleNotificationRead}
                  onNotificationClick={(n) => toast.info(n.description)}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-4">
                  NotificationPanel — vazio
                </h3>
                <NotificationPanel notifications={[]} />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Tooltip
          </h2>

          <div className="space-y-6">
            {/* Posições */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Posições
              </h3>
              <div className="flex flex-wrap gap-8 items-center justify-center py-12">
                <Tooltip content="Tooltip no topo" position="top">
                  <Button variant="secondary">Top</Button>
                </Tooltip>
                <Tooltip content="Tooltip embaixo" position="bottom">
                  <Button variant="secondary">Bottom</Button>
                </Tooltip>
                <Tooltip content="Tooltip à esquerda" position="left">
                  <Button variant="secondary">Left</Button>
                </Tooltip>
                <Tooltip content="Tooltip à direita" position="right">
                  <Button variant="secondary">Right</Button>
                </Tooltip>
              </div>
            </div>

            {/* Em IconButtons */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Tooltip em IconButtons
              </h3>
              <div className="flex flex-wrap gap-4">
                <Tooltip content="Editar item">
                  <IconButton variant="primary" icon={<Edit size={20} />} ariaLabel="Editar" />
                </Tooltip>
                <Tooltip content="Excluir permanentemente">
                  <IconButton variant="danger" icon={<Trash size={20} />} ariaLabel="Excluir" />
                </Tooltip>
                <Tooltip content="Adicionar novo">
                  <IconButton variant="success" icon={<Plus size={20} />} ariaLabel="Adicionar" />
                </Tooltip>
              </div>
            </div>

            {/* Tooltip desabilitado */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Tooltip Desabilitado
              </h3>
              <div className="flex flex-wrap gap-4">
                <Tooltip content="Este tooltip não aparece" disabled>
                  <Button variant="ghost">Passe o mouse (tooltip disabled)</Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[var(--ds-color-border)]">
        <p className="text-center text-[var(--ds-color-text-secondary)] text-sm">
          ✨ Design System • … Table, Tooltip • Pulso: ResourceCard, NotificationPanel
        </p>
      </div>
    </div>
  )
}
