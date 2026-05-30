/**
 * Catálogo de badges semânticas do Pulso.
 * Cada entrada associa: rótulo, ícone (nome Lucide), variant visual e formato.
 *
 * Para adicionar uma badge nova ao produto:
 * 1. Registre o ícone em `iconRegistry.js` (se ainda não existir)
 * 2. Adicione a entrada abaixo OU use `registerBadgeKind()` em runtime
 */

/** @typedef {'success'|'danger'|'warning'|'info'|'primary'|'default'|'neutral'|'cyan'|'orange'} BadgeVariant */
/** @typedef {'pill'|'rounded'} BadgeShape */
/** @typedef {'soft'|'outline'} BadgeAppearance */

/**
 * @typedef {Object} BadgeDefinition
 * @property {string} label
 * @property {string} [icon] — nome Lucide (ver iconRegistry)
 * @property {BadgeVariant} [variant]
 * @property {BadgeShape} [shape]
 * @property {BadgeAppearance} [appearance]
 * @property {string} [color] — hex opcional; sobrescreve variant quando definido
 */

/** @type {Record<string, BadgeDefinition>} */
export const PULSO_BADGE_CATALOG = {
  'recurso.dinheiro': { label: 'Dinheiro', icon: 'DollarSign', variant: 'primary' },
  'recurso.va': { label: 'VA', icon: 'Apple', variant: 'success' },
  'recurso.vr': { label: 'VR', icon: 'Utensils', variant: 'orange' },
  'recurso.vt': { label: 'VT', icon: 'Bus', variant: 'info' },

  'meta-status.ativa': { label: 'Ativa', icon: 'Play', variant: 'primary' },
  'meta-status.pausada': { label: 'Pausada', icon: 'Pause', variant: 'warning' },
  'meta-status.concluida': { label: 'Concluída', icon: 'CheckCircle', variant: 'success' },
  'meta-status.cancelada': { label: 'Cancelada', icon: 'XCircle', variant: 'danger' },

  'meta-tipo.curto': { label: 'Curto prazo', icon: 'Clock', variant: 'cyan', shape: 'rounded' },
  'meta-tipo.longo': { label: 'Longo prazo', icon: 'Calendar', variant: 'primary', shape: 'rounded' },

  'prioridade.alta': { label: 'Alta', icon: 'ArrowUp', variant: 'danger' },
  'prioridade.media': { label: 'Média', icon: 'Minus', variant: 'warning' },
  'prioridade.baixa': { label: 'Baixa', icon: 'ArrowDown', variant: 'success' },

  'perfil.estagiario': { label: 'Estagiário', icon: 'GraduationCap', variant: 'primary' },
  'perfil.clt': { label: 'CLT', icon: 'Briefcase', variant: 'info' },
  'perfil.pj': { label: 'PJ/Freelancer', icon: 'Laptop', variant: 'cyan' },
  'perfil.pf': { label: 'Pessoa Física', icon: 'User', variant: 'neutral' },

  'grupo.admin': { label: 'Admin', icon: 'Crown', variant: 'primary' },
  'grupo.membro': { label: 'Membro', icon: 'User', variant: 'neutral' },

  'sync.sincronizado': { label: 'Sincronizado', icon: 'CalendarCheck', variant: 'success' },
  'sync.pendente': { label: 'Pendente', icon: 'Hourglass', variant: 'warning' },

  'transacao.recorrente': { label: 'Recorrente', icon: 'RefreshCw', variant: 'info' },

  'nivel.iniciante': { label: 'Iniciante', icon: 'Sprout', variant: 'neutral' },
  'nivel.consciente': { label: 'Consciente', icon: 'BarChart3', variant: 'info' },
  'nivel.estrategista': { label: 'Estrategista', icon: 'Star', variant: 'primary' },
  'nivel.investidor': { label: 'Investidor', icon: 'Diamond', variant: 'success' },

  'generico.info': { label: 'Informação', icon: 'Info', variant: 'neutral' },
}

const runtimeCatalog = { ...PULSO_BADGE_CATALOG }

/** Registra ou sobrescreve uma badge semântica (ex.: feature flag, módulo novo) */
export function registerBadgeKind(kind, definition) {
  runtimeCatalog[kind] = { ...definition }
}

export function getBadgeDefinition(kind) {
  return runtimeCatalog[kind] ?? null
}

/** Normaliza payload da API / formulário de criação de badge */
export function normalizeBadgeDefinition(input) {
  if (!input) return null
  if (typeof input === 'string') return getBadgeDefinition(input)

  const kind = input.kind ?? input.id ?? input.codigo
  const fromCatalog = kind ? runtimeCatalog[kind] : null

  if (fromCatalog) {
    return { ...fromCatalog, ...input, kind }
  }

  return {
    label: input.label ?? input.nome ?? '',
    icon: input.icon ?? input.icone ?? 'Tag',
    variant: input.variant ?? 'default',
    shape: input.shape ?? 'pill',
    appearance: input.appearance,
    color: input.color ?? input.cor,
    kind,
  }
}
