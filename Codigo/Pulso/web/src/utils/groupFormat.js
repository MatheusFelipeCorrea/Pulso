import { formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/** Sufixos de modo de uso que às vezes aparecem no nome do perfil (ex.: seed/demo). */
const SUFIXO_MODO_USO =
  /\s+(?:pessoa\s+f[ií]sica|estagi[aá]rio|clt|pj)\s*$/i

/** Remove sufixos entre parênteses e vínculo (CLT, PJ, etc.) do nome. */
export function limparNomeGrupoMembro(nome) {
  return String(nome ?? '')
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(SUFIXO_MODO_USO, '')
    .trim()
    .replace(/\s{2,}/g, ' ')
}

export function formatGrupoMembroDisplayNome(nome, souEu = false) {
  const base = limparNomeGrupoMembro(nome) || String(nome ?? '').trim()
  return souEu ? `${base} (você)` : base
}

export function formatGroupActivity(iso) {
  if (!iso) return 'Sem atividade recente'
  const date = typeof iso === 'string' ? parseISO(iso) : iso
  if (Number.isNaN(date.getTime())) return 'Sem atividade recente'
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
}
