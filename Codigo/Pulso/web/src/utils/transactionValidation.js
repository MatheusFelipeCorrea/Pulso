import {
  ALIAS_EXATO_PARA_GRUPO,
  DEFAULT_NOME_PARA_GRUPO,
  GRUPO_BENEFICIO,
  GRUPO_BENEFICIO_LABELS,
} from '@/constants/categoryBeneficioGroups.js'

export const normalize = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export const inferirGrupoBeneficioPorNome = (nome) => {
  const normalized = normalize(nome)
  if (!normalized) return null

  if (DEFAULT_NOME_PARA_GRUPO[normalized]) {
    return DEFAULT_NOME_PARA_GRUPO[normalized]
  }

  return ALIAS_EXATO_PARA_GRUPO[normalized] ?? null
}

export const resolverGrupoBeneficio = (categoria) => {
  if (!categoria) return null
  if (categoria.grupoBeneficio) return categoria.grupoBeneficio
  return inferirGrupoBeneficioPorNome(categoria.nome)
}

const asCategoria = (categoria) =>
  typeof categoria === 'string' ? { nome: categoria } : categoria

const buildMensagemIncompativel = (recurso, categoriaNome) => {
  const nome = categoriaNome?.trim() || 'esta categoria'

  if (recurso === 'VA') {
    return (
      `A categoria "${nome}" não aceita Vale Alimentação (VA). ` +
      `Use ${GRUPO_BENEFICIO_LABELS.ALIMENTACAO} ou ${GRUPO_BENEFICIO_LABELS.COMPRAS}, ` +
      'ou edite a categoria e escolha o preset compatível.'
    )
  }

  if (recurso === 'VR') {
    return (
      `A categoria "${nome}" não aceita Vale Refeição (VR). ` +
      `VR só vale para ${GRUPO_BENEFICIO_LABELS.ALIMENTACAO}.`
    )
  }

  return (
    `A categoria "${nome}" não aceita Vale Transporte (VT). ` +
    `VT só vale para ${GRUPO_BENEFICIO_LABELS.TRANSPORTE}.`
  )
}

/** Validação cruzada recurso x categoria no cliente (espelha backend). */
export function validarRecursoCategoria(recurso, categoria, tipo) {
  if (tipo !== 'DESPESA' || recurso === 'DINHEIRO' || recurso === 'POUPANCA') return null

  const cat = asCategoria(categoria)
  const grupo = resolverGrupoBeneficio(cat)

  if (recurso === 'VA') {
    const permitido =
      grupo === GRUPO_BENEFICIO.ALIMENTACAO || grupo === GRUPO_BENEFICIO.COMPRAS
    return permitido ? null : buildMensagemIncompativel('VA', cat?.nome)
  }

  if (recurso === 'VR') {
    return grupo === GRUPO_BENEFICIO.ALIMENTACAO
      ? null
      : buildMensagemIncompativel('VR', cat?.nome)
  }

  if (recurso === 'VT') {
    if (grupo === GRUPO_BENEFICIO.ALIMENTACAO) {
      return `Não é possível usar VT na categoria "${cat?.nome}". VT não vale para alimentação.`
    }
    return grupo === GRUPO_BENEFICIO.TRANSPORTE
      ? null
      : buildMensagemIncompativel('VT', cat?.nome)
  }

  return null
}

/** Valida a transferência entre recursos no cliente (RF-140, espelha backend) */
export function validarTransferencia(recurso, recursoDestino) {
  if (!recurso || !recursoDestino) return null
  if (recurso === recursoDestino) {
    return 'Recurso de destino deve ser diferente do recurso de origem'
  }
  return null
}
