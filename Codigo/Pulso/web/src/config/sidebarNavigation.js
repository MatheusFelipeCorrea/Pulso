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
      // TEMP: rotas abaixo ainda não existem neste repo
      // { id: 'orcamento', label: 'Orçamento Mensal', path: '/budget', icon: 'PieChart' },
      // { id: 'calendario', label: 'Calendário Financeiro', path: '/calendar', icon: 'CalendarDays' },
      // { id: 'dividas', label: 'Dívidas', path: '/debts', icon: 'Landmark' },
    ],
  },
  // {
  //   id: 'planejamento',
  //   ...
  // },
]

/** Itens fixos no rodapé da sidebar (seção Conta) */
export const SIDEBAR_NAV_FOOTER = [
  { id: 'perfil', label: 'Perfil', path: '/profile', icon: 'User' },
  { id: 'configuracoes', label: 'Configurações', path: '/settings', icon: 'Settings' },
  { id: 'sair', label: 'Sair', icon: 'LogOut', action: 'logout' },
]
