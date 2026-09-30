/**
 * Nome para exibição na UI — remove sufixos entre parênteses (ex.: seed "Nome (Estagiário)").
 */
export function getUserDisplayName(nome) {
  if (!nome?.trim()) return 'Usuário'

  const cleaned = nome.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim()
  return cleaned || 'Usuário'
}
