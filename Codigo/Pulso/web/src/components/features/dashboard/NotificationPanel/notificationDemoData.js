import { NOTIFICATION_TYPES } from './notificationConfig.js'

const now = Date.now()

/** @type {import('./NotificationItem.jsx').Notification[]} */
export const NOTIFICATION_DEMO_ITEMS = [
  {
    id: 'demo-1',
    type: NOTIFICATION_TYPES.RECEITA_REGISTRADA,
    description: 'Nova receita: Salário +R$ 1.500,00',
    timestamp: new Date(now - 2 * 60 * 1000),
    read: false,
  },
  {
    id: 'demo-2',
    type: NOTIFICATION_TYPES.DESPESA_REGISTRADA,
    description: 'Nova despesa: Mercado -R$ 87,00',
    timestamp: new Date(now - 15 * 60 * 1000),
    read: false,
  },
  {
    id: 'demo-3',
    type: NOTIFICATION_TYPES.META_ATINGIDA,
    description: "Meta 'Viagem Macaé' concluída!",
    timestamp: new Date(now - 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'demo-4',
    type: NOTIFICATION_TYPES.ALERTA_ORCAMENTO,
    description: 'Alimentação atingiu 80% do limite',
    timestamp: new Date(now - 2 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'demo-5',
    type: NOTIFICATION_TYPES.ORCAMENTO_ESTOURADO,
    description: 'Lazer ultrapassou o limite em R$ 30',
    timestamp: new Date(now - 3 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'demo-6',
    type: NOTIFICATION_TYPES.LEMBRETE_VENCIMENTO,
    description: 'Fatura do cartão vence amanhã',
    timestamp: new Date(now - 5 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'demo-7',
    type: NOTIFICATION_TYPES.STREAK,
    description: '12 dias seguidos! Continue assim!',
    timestamp: new Date(now - 8 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'demo-8',
    type: NOTIFICATION_TYPES.CONQUISTA,
    description: 'Nova conquista: Primeiro mês positivo!',
    timestamp: new Date(now - 10 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'demo-9',
    type: NOTIFICATION_TYPES.GRUPO_ATIVIDADE,
    description: 'Maria adicionou pretensão no grupo',
    timestamp: new Date(now - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'demo-10',
    type: NOTIFICATION_TYPES.DIVIDA_COBRANCA,
    description: 'Lembrete: cobrar João (R$ 50)',
    timestamp: new Date(now - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'demo-11',
    type: NOTIFICATION_TYPES.INSIGHT_IA,
    description: 'Novo insight: seu VA acaba dia 26',
    timestamp: new Date(now - 26 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'demo-12',
    type: NOTIFICATION_TYPES.ACAO_CONCLUIDA,
    description: 'Transação salva com sucesso',
    timestamp: new Date(now - 30 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'demo-13',
    type: NOTIFICATION_TYPES.ERRO,
    description: 'Erro ao salvar. Tente novamente.',
    timestamp: new Date(now - 32 * 60 * 60 * 1000),
    read: true,
  },
]
