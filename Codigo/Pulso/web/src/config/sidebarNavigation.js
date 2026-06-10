/**
 * Estrutura da sidebar — fonte única para MainLayout / Sidebar / Drawer (mobile).
 * Ícones: nomes Lucide (resolver no componente Sidebar).
 */

export const SIDEBAR_NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutGrid',
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: 'HandCoins',
    children: [
      { id: 'transacoes', label: 'Transações', path: '/transactions', icon: 'ArrowLeftRight' },
      { id: 'vale-transporte', label: 'Vale Transporte', path: '/transport-voucher', icon: 'Bus' },
      { id: 'orcamento', label: 'Orçamento Mensal', path: '/budget', icon: 'PieChart' },
      { id: 'calendario', label: 'Calendário Financeiro', path: '/calendar', icon: 'CalendarDays' },
      { id: 'dividas', label: 'Dívidas', path: '/debts', icon: 'Landmark' },
    ],
  },
  {
    id: 'planejamento',
    label: 'Planejamento & Metas',
    icon: 'Target',
    children: [
      { id: 'metas', label: 'Metas Financeiras', path: '/goals', icon: 'Target' },
      { id: 'viagens', label: 'Viagens e Moedas', path: '/trips', icon: 'Plane' },
      { id: 'grupos', label: 'Grupos', path: '/groups', icon: 'Users' },
      { id: 'compra', label: 'Planejamento de Compra', path: '/purchase-planning', icon: 'ShoppingCart' },
      { id: 'divisao', label: 'Divisão de Despesas', path: '/expense-split', icon: 'Split' },
    ],
  },
  {
    id: 'inteligencia',
    label: 'Inteligência & Relatórios',
    icon: 'Brain',
    children: [
      { id: 'relatorios', label: 'Relatórios', path: '/reports', icon: 'BarChart3' },
      { id: 'insights', label: 'Insights', path: '/insights', icon: 'Sparkles' },
      { id: 'chatbot', label: 'Chatbot', path: '/chatbot', icon: 'MessageCircle' },
      { id: 'gamificacao', label: 'Gamificação', path: '/achievements', icon: 'Gamepad2' },
    ],
  },
]

/** Itens fixos no rodapé da sidebar (seção Conta) */
export const SIDEBAR_NAV_FOOTER = [
  { id: 'perfil', label: 'Perfil', path: '/profile', icon: 'User' },
  { id: 'configuracoes', label: 'Configurações', path: '/settings', icon: 'Settings' },
  { id: 'sair', label: 'Sair', icon: 'LogOut', action: 'logout' },
]
