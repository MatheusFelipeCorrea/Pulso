/**
 * Mapeia enums do Prisma → kind do badgeCatalog / props do PulsoBadge.
 * Badges semânticas usam dados já persistidos; tags/categorias usam icone+cor.
 */

const RECURSO_KIND = {
  DINHEIRO: 'recurso.dinheiro',
  VA: 'recurso.va',
  VR: 'recurso.vr',
  VT: 'recurso.vt',
}

const META_STATUS_KIND = {
  ATIVA: 'meta-status.ativa',
  PAUSADA: 'meta-status.pausada',
  CONCLUIDA: 'meta-status.concluida',
  CANCELADA: 'meta-status.cancelada',
}

const META_TIPO_KIND = {
  CURTO_PRAZO: 'meta-tipo.curto',
  LONGO_PRAZO: 'meta-tipo.longo',
}

const PRIORIDADE_KIND = {
  ALTA: 'prioridade.alta',
  MEDIA: 'prioridade.media',
  BAIXA: 'prioridade.baixa',
}

const MODO_USO_KIND = {
  ESTAGIARIO: 'perfil.estagiario',
  CLT: 'perfil.clt',
  PJ: 'perfil.pj',
  PESSOA_FISICA: 'perfil.pf',
}

const PAPEL_GRUPO_KIND = {
  ADMIN: 'grupo.admin',
  MEMBRO: 'grupo.membro',
}

const NIVEL_FINANCEIRO_KIND = {
  INICIANTE: 'nivel.iniciante',
  CONSCIENTE: 'nivel.consciente',
  ESTRATEGISTA: 'nivel.estrategista',
  INVESTIDOR: 'nivel.investidor',
}

export const badgeKindFromRecurso = (recurso) => RECURSO_KIND[recurso] ?? null
export const badgeKindFromMetaStatus = (status) => META_STATUS_KIND[status] ?? null
export const badgeKindFromMetaTipo = (tipo) => META_TIPO_KIND[tipo] ?? null
export const badgeKindFromPrioridade = (prioridade) => PRIORIDADE_KIND[prioridade] ?? null
export const badgeKindFromModoUso = (modo) => MODO_USO_KIND[modo] ?? null
export const badgeKindFromPapelGrupo = (papel) => PAPEL_GRUPO_KIND[papel] ?? null
export const badgeKindFromNivelFinanceiro = (nivel) => NIVEL_FINANCEIRO_KIND[nivel] ?? null

/** Tag ou Categoria do banco → definition do PulsoBadge */
export function badgeDefinitionFromTag(tag) {
  if (!tag) return null
  return {
    label: tag.nome,
    icon: tag.icone ?? 'Tag',
    color: tag.cor,
  }
}

export function badgeDefinitionFromCategoria(categoria) {
  if (!categoria) return null
  return {
    label: categoria.nome,
    icon: categoria.icone ?? 'Tag',
    color: categoria.cor,
  }
}

/** Lembrete.sincronizado + config google calendar */
export function badgeKindFromSync(sincronizado) {
  return sincronizado ? 'sync.sincronizado' : 'sync.pendente'
}

export function badgeKindFromRecorrente(recorrente) {
  return recorrente ? 'transacao.recorrente' : null
}
