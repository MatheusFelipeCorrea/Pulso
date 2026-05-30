import {
  TrendingUp,
  TrendingDown,
  PartyPopper,
  AlertTriangle,
  AlarmClock,
  Bell,
  Flame,
  Trophy,
  Users,
  Wallet,
  Bot,
  CheckCircle,
  XCircle,
} from 'lucide-react'

/** @typedef {keyof typeof NOTIFICATION_TYPES} NotificationType */

export const NOTIFICATION_TYPES = /** @type {const} */ ({
  RECEITA_REGISTRADA: 'RECEITA_REGISTRADA',
  DESPESA_REGISTRADA: 'DESPESA_REGISTRADA',
  META_ATINGIDA: 'META_ATINGIDA',
  ALERTA_ORCAMENTO: 'ALERTA_ORCAMENTO',
  ORCAMENTO_ESTOURADO: 'ORCAMENTO_ESTOURADO',
  LEMBRETE_VENCIMENTO: 'LEMBRETE_VENCIMENTO',
  STREAK: 'STREAK',
  CONQUISTA: 'CONQUISTA',
  GRUPO_ATIVIDADE: 'GRUPO_ATIVIDADE',
  DIVIDA_COBRANCA: 'DIVIDA_COBRANCA',
  INSIGHT_IA: 'INSIGHT_IA',
  ACAO_CONCLUIDA: 'ACAO_CONCLUIDA',
  ERRO: 'ERRO',
})

/** Títulos padrão por tipo (podem ser sobrescritos via notification.title) */
export const NOTIFICATION_DEFAULT_TITLES = {
  [NOTIFICATION_TYPES.RECEITA_REGISTRADA]: 'Receita registrada',
  [NOTIFICATION_TYPES.DESPESA_REGISTRADA]: 'Despesa registrada',
  [NOTIFICATION_TYPES.META_ATINGIDA]: 'Meta atingida',
  [NOTIFICATION_TYPES.ALERTA_ORCAMENTO]: 'Alerta orçamento (80%)',
  [NOTIFICATION_TYPES.ORCAMENTO_ESTOURADO]: 'Orçamento estourado',
  [NOTIFICATION_TYPES.LEMBRETE_VENCIMENTO]: 'Lembrete/vencimento',
  [NOTIFICATION_TYPES.STREAK]: 'Streak',
  [NOTIFICATION_TYPES.CONQUISTA]: 'Conquista',
  [NOTIFICATION_TYPES.GRUPO_ATIVIDADE]: 'Grupo (atividade)',
  [NOTIFICATION_TYPES.DIVIDA_COBRANCA]: 'Dívida/cobrança',
  [NOTIFICATION_TYPES.INSIGHT_IA]: 'Insight IA',
  [NOTIFICATION_TYPES.ACAO_CONCLUIDA]: 'Ação concluída',
  [NOTIFICATION_TYPES.ERRO]: 'Erro',
}

/** @type {Record<NotificationType, { colorVar: string, icon: import('lucide-react').LucideIcon }>} */
export const notificationConfig = {
  [NOTIFICATION_TYPES.RECEITA_REGISTRADA]: {
    colorVar: '--ds-color-success',
    icon: TrendingUp,
  },
  [NOTIFICATION_TYPES.DESPESA_REGISTRADA]: {
    colorVar: '--ds-color-danger',
    icon: TrendingDown,
  },
  [NOTIFICATION_TYPES.META_ATINGIDA]: {
    colorVar: '--ds-color-primary',
    icon: PartyPopper,
  },
  [NOTIFICATION_TYPES.ALERTA_ORCAMENTO]: {
    colorVar: '--ds-color-warning',
    icon: AlertTriangle,
  },
  [NOTIFICATION_TYPES.ORCAMENTO_ESTOURADO]: {
    colorVar: '--ds-color-danger',
    icon: AlarmClock,
  },
  [NOTIFICATION_TYPES.LEMBRETE_VENCIMENTO]: {
    colorVar: '--ds-color-info',
    icon: Bell,
  },
  [NOTIFICATION_TYPES.STREAK]: {
    colorVar: '--ds-color-warning',
    icon: Flame,
  },
  [NOTIFICATION_TYPES.CONQUISTA]: {
    colorVar: '--ds-color-primary',
    icon: Trophy,
  },
  [NOTIFICATION_TYPES.GRUPO_ATIVIDADE]: {
    colorVar: '--ds-notification-grupo',
    icon: Users,
  },
  [NOTIFICATION_TYPES.DIVIDA_COBRANCA]: {
    colorVar: '--ds-notification-divida',
    icon: Wallet,
  },
  [NOTIFICATION_TYPES.INSIGHT_IA]: {
    colorVar: '--ds-notification-insight',
    icon: Bot,
  },
  [NOTIFICATION_TYPES.ACAO_CONCLUIDA]: {
    colorVar: '--ds-color-success',
    icon: CheckCircle,
  },
  [NOTIFICATION_TYPES.ERRO]: {
    colorVar: '--ds-color-danger',
    icon: XCircle,
  },
}

export function getNotificationConfig(type) {
  return (
    notificationConfig[type] ??
    notificationConfig[NOTIFICATION_TYPES.ACAO_CONCLUIDA]
  )
}
