export { PulsoBadge, PulsoBadgeByKind } from './PulsoBadge.jsx'
export {
  PULSO_BADGE_CATALOG,
  registerBadgeKind,
  getBadgeDefinition,
  normalizeBadgeDefinition,
} from './badgeCatalog.js'
export { registerBadgeIcon, resolveBadgeIcon, listRegisteredBadgeIcons } from './iconRegistry.jsx'
export {
  badgeKindFromRecurso,
  badgeKindFromMetaStatus,
  badgeKindFromMetaTipo,
  badgeKindFromPrioridade,
  badgeKindFromModoUso,
  badgeKindFromPapelGrupo,
  badgeKindFromNivelFinanceiro,
  badgeKindFromSync,
  badgeKindFromRecorrente,
  badgeDefinitionFromTag,
  badgeDefinitionFromCategoria,
} from './enumMappers.js'
