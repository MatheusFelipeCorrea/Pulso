/** Mensagem padrão de campo obrigatório — substitui o tooltip nativo do browser. */
export const REQUIRED_FIELD_ERROR = 'Preencha este campo.'

export function isRequiredValueEmpty(value) {
  if (value == null) return true
  if (typeof value === 'string') return !value.trim()
  return false
}
