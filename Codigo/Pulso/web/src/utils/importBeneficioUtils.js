const GRUPO_ALIMENTACAO = 'ALIMENTACAO'
const GRUPO_COMPRAS = 'COMPRAS'
const GRUPO_TRANSPORTE = 'TRANSPORTE'

export const AJUSTE_SALDO_IMPORTACAO_DESCRICAO = 'Ajuste de saldo — importação de extrato'

export function isAjusteSaldoImportacao(descricao) {
  return descricao === AJUSTE_SALDO_IMPORTACAO_DESCRICAO
}

const normalize = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const resolverGrupoBeneficio = (categoria) => {
  if (!categoria) return null
  if (categoria.grupoBeneficio) return categoria.grupoBeneficio
  const nome = normalize(categoria.nome)
  if (nome === 'alimentacao') return GRUPO_ALIMENTACAO
  if (nome === 'compras' || nome === 'mercado' || nome === 'supermercado') return GRUPO_COMPRAS
  if (nome === 'transporte') return GRUPO_TRANSPORTE
  return null
}

export function categoriaCompativelImportacao(categoria, origem, tipoTransacao) {
  if (!categoria || categoria.tipo !== tipoTransacao) return false
  if (!['VT', 'VA', 'VR'].includes(origem)) return true
  if (tipoTransacao === 'RECEITA') return true

  const grupo = resolverGrupoBeneficio(categoria)
  if (origem === 'VR') return grupo === GRUPO_ALIMENTACAO
  if (origem === 'VA') return grupo === GRUPO_ALIMENTACAO || grupo === GRUPO_COMPRAS
  if (origem === 'VT') return grupo === GRUPO_TRANSPORTE
  return true
}

export function isOrigemBeneficio(origem) {
  return ['VT', 'VA', 'VR'].includes(origem)
}

export function isOrigemComSaldoExtrato(origem) {
  return origem === 'CONTA' || isOrigemBeneficio(origem)
}
