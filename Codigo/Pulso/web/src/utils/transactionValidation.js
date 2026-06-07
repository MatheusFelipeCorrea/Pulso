const normalize = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

/** Validação cruzada recurso x categoria no cliente (espelha backend) */
export function validarRecursoCategoria(recurso, categoriaNome, tipo) {
  if (tipo !== 'DESPESA' || recurso === 'DINHEIRO') return null

  const nome = normalize(categoriaNome)

  if (recurso === 'VA' && !['alimentacao', 'compras'].includes(nome)) {
    return 'VA só pode ser usado em despesas de Alimentação ou Compras'
  }

  if (recurso === 'VR' && nome !== 'alimentacao') {
    return 'VR só pode ser usado em despesas de Alimentação'
  }

  if (recurso === 'VT') {
    if (nome === 'alimentacao') {
      return 'Não é possível usar VT para despesas de alimentação'
    }
    if (nome !== 'transporte') {
      return 'VT só pode ser usado em despesas de Transporte'
    }
  }

  return null
}
