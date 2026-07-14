import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TRIP_EXPENSE_CATEGORY_MAP } from '@/utils/tripExpenseCategories.js'

export function formatGroupTripDate(iso) {
  if (!iso) return 'Data a definir'
  const date = typeof iso === 'string' ? parseISO(iso) : iso
  if (Number.isNaN(date.getTime())) return 'Data a definir'
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatGroupChatTimestamp(iso) {
  if (!iso) return ''
  const date = typeof iso === 'string' ? parseISO(iso) : iso
  if (Number.isNaN(date.getTime())) return ''

  const time = format(date, 'HH:mm', { locale: ptBR })
  if (isToday(date)) return `Hoje, ${time}`
  if (isYesterday(date)) return `Ontem, ${time}`
  return format(date, "d MMM, HH:mm", { locale: ptBR })
}

export function getExpenseCategoryLabel(categoria) {
  return TRIP_EXPENSE_CATEGORY_MAP[categoria]?.tableLabel ?? categoria
}

/**
 * Combina o histórico já carregado (incluindo páginas antigas trazidas via
 * "carregar mensagens anteriores") com o lote mais recente do polling, sem
 * descartar mensagens antigas que não vieram na página 1.
 */
export function mesclarMensagensChat(atuais, recentes) {
  const porId = new Map(atuais.map((mensagem) => [mensagem.id, mensagem]))
  recentes.forEach((mensagem) => porId.set(mensagem.id, mensagem))

  return Array.from(porId.values()).sort(
    (a, b) => new Date(a.criadoEm) - new Date(b.criadoEm)
  )
}

export function mergeMetaAportes(meta, membros) {
  if (!meta) return []
  const map = new Map((meta.aportesPorMembro ?? []).map((item) => [item.usuarioId, item]))

  return (membros ?? []).map((membro) => {
    const aporte = map.get(membro.id)
    return {
      usuarioId: membro.id,
      nome: membro.nome,
      urlAvatar: membro.urlAvatar,
      souEu: membro.souEu,
      total: aporte?.total ?? '0.00',
      completo: Number(aporte?.total ?? 0) > 0,
    }
  })
}

export function mergeTripMemberColumns(grupoMembros, viagemMembros) {
  const expenseMap = new Map((viagemMembros ?? []).map((item) => [item.usuarioId, item]))

  return (grupoMembros ?? []).map((membro) => {
    const withExpenses = expenseMap.get(membro.id)
    return {
      usuarioId: membro.id,
      nome: membro.nome,
      urlAvatar: membro.urlAvatar,
      souEu: membro.souEu,
      despesas: withExpenses?.despesas ?? [],
      total: withExpenses?.total ?? '0.00',
    }
  })
}

/** RF-095 — saldo por pretensão ou divisão igual do total */
export function calcularSaldosViagem(colunas, totalGrupo, modoDivisao = 'PRETENSAO') {
  const total = Number(totalGrupo ?? 0)
  const count = colunas.length || 1
  const parteIgual = count > 0 ? total / count : 0

  return colunas.map((membro) => {
    const pretensao = Number(membro.total ?? 0)

    if (modoDivisao === 'IGUAL') {
      const saldo = pretensao - parteIgual
      return {
        ...membro,
        saldo,
        saldoAbs: Math.abs(saldo),
        tipoSaldo: saldo >= 0 ? 'credito' : 'deve',
        labelSaldo: saldo >= 0 ? 'crédito' : 'deve',
      }
    }

    return {
      ...membro,
      saldo: pretensao,
      saldoAbs: pretensao,
      tipoSaldo: 'deve',
      labelSaldo: 'deve',
    }
  })
}
