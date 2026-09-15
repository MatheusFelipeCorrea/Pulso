/** Gera sequência de páginas com reticências (ex: 1, 2, 3, …, 12) */
export function getPaginationRange(page, totalPages) {
  if (totalPages < 1) return []
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set([1, totalPages, page])
  if (page > 1) pages.add(page - 1)
  if (page < totalPages) pages.add(page + 1)
  if (page > 2) pages.add(page - 2)
  if (page < totalPages - 1) pages.add(page + 2)

  const sorted = [...pages].sort((a, b) => a - b)
  const result = []

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('ellipsis')
    }
    result.push(sorted[i])
  }

  return result
}

/** Intervalo "11–20 de 117" para paginação com info */
export function getPaginationInfoRange(page, pageSize, totalItems) {
  if (!totalItems) return { start: 0, end: 0, total: 0 }
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)
  return { start, end, total: totalItems }
}
