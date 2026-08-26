/**
 * Rotas do app autenticado — título exibido na página placeholder.
 */
export const APP_PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transações',
  '/budget': 'Orçamento Mensal',
  '/calendar': 'Calendário Financeiro',
  '/debts': 'Dívidas',
  '/goals': 'Metas Financeiras',
  '/trips': 'Viagens e Moedas',
  '/groups': 'Grupos',
  '/purchase-planning': 'Planejamento de Compra',
  '/expense-split': 'Divisão de Despesas',
  '/insights': 'Insights',
  '/chatbot': 'Chatbot',
  '/profile': 'Perfil',
  '/settings': 'Configurações',
}

export function getPageTitle(pathname) {
  return APP_PAGE_TITLES[pathname] ?? 'Página'
}

export function getDevelopmentMessage(pathname) {
  const title = getPageTitle(pathname)
  return `${title} em desenvolvimento`
}

export const APP_ROUTE_PATHS = Object.keys(APP_PAGE_TITLES)
