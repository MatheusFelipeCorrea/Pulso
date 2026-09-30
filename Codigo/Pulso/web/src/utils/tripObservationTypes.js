export const TRIP_OBSERVATION_TYPES = [
  { value: 'CHECKLIST', label: 'Checklist' },
  { value: 'LINK', label: 'Link útil' },
  { value: 'GERAL', label: 'Geral' },
]

export const TRIP_OBSERVATION_TYPE_MAP = Object.fromEntries(
  TRIP_OBSERVATION_TYPES.map((item) => [item.value, item])
)

/** Infere o tipo da observação a partir do conteúdo preenchido. */
export function inferObservationTipo({ checklist = [], linkUrl = '' } = {}) {
  const hasChecklist = (checklist ?? []).some((item) => String(item?.texto ?? '').trim())
  const hasLink = Boolean(String(linkUrl ?? '').trim())

  if (hasChecklist && hasLink) return 'GERAL'
  if (hasChecklist) return 'CHECKLIST'
  if (hasLink) return 'LINK'
  return null
}

/** Badge exibido na listagem — null quando não há checklist nem link. */
export function resolveObservationBadge(observacao) {
  return inferObservationTipo({
    checklist: observacao?.checklist,
    linkUrl: observacao?.linkUrl,
  })
}

export function getObservationBadgeLabel(observacao) {
  const tipo = resolveObservationBadge(observacao)
  if (!tipo) return null
  return TRIP_OBSERVATION_TYPE_MAP[tipo]?.label ?? tipo
}
