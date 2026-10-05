/**
 * Estrutura da sidebar — fonte única para MainLayout / Sidebar / Drawer (mobile).
 * Ícones: nomes Lucide (resolver no componente Sidebar).
 */

export const SIDEBAR_NAV = [
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: 'HandCoins',
    children: [
      { id: 'transacoes', label: 'Transações', path: '/transactions', icon: 'ArrowLeftRight' },
      { id: 'orcamento', label: 'Orçamento Mensal', path: '/budget', icon: 'PieChart' },
      { id: 'calendario', label: 'Calendário Financeiro', path: '/calendar', icon: 'CalendarDays' },
    ],
  },
  {
    id: 'planejamento',
    label: 'Planejamento & Metas',
    icon: 'Target',
    children: [
      { id: 'metas', label: 'Metas Financeiras', path: '/goals', icon: 'Target' },
      { id: 'viagens', label: 'Viagens e Moedas', path: '/trips', icon: 'Plane' },
      { id: 'compra', label: 'Planejamento de Compra', path: '/purchase-planning', icon: 'ShoppingCart' },
      // TEMP: rotas abaixo ainda não existem neste repo
      // { id: 'grupos', label: 'Grupos', path: '/groups', icon: 'Users' },
      // { id: 'divisao', label: 'Divisão de Despesas', path: '/expense-split', icon: 'Split' },
    ],
  },
]

/** Itens fixos no rodapé da sidebar (seção Conta) */
export const SIDEBAR_NAV_FOOTER = [
  { id: 'perfil', label: 'Perfil', path: '/profile', icon: 'User' },
  { id: 'configuracoes', label: 'Configurações', path: '/settings', icon: 'Settings' },
  { id: 'sair', label: 'Sair', icon: 'LogOut', action: 'logout' },
]
