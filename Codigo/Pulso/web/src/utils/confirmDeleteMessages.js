/** Mensagens padronizadas dos modais de exclusão (protótipo DS). */

export function deleteTransactionMessage(nome) {
  return `A transação "${nome}" será excluída permanentemente.`
}

export function deleteRecurringTransactionMessage(nome) {
  return `A transação "${nome}" é recorrente. Como deseja excluir?`
}

export function deleteGoalMessage(nome) {
  return `A meta "${nome}" e todos os aportes serão excluídos.`
}

export function deleteTripMessage(nome) {
  return `A viagem "${nome}" e todos os dados relacionados serão excluídos.`
}

export function deleteReminderMessage(nome) {
  return `O lembrete "${nome}" será excluído permanentemente.`
}

export function deleteGroupMessage(nome) {
  return `O grupo "${nome}" e todos os dados serão excluídos.`
}

export function leaveGroupMessage(nome) {
  return `Você sairá do grupo "${nome}". Você pode entrar novamente depois.`
}

export function deleteGenericMessage(nome) {
  return `"${nome}" será excluído permanentemente. Esta ação não pode ser desfeita.`
}

export function deleteAccountMessage() {
  return 'Sua conta e TODOS os seus dados serão excluídos permanentemente. Esta ação não pode ser desfeita.'
}
