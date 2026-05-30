import { useContext } from 'react'
import { ToastContext } from './ToastContext.jsx'

/**
 * useToast - Hook para disparar toasts de qualquer lugar
 * 
 * @returns {object} - Métodos para exibir toasts
 * @returns {function} success - Exibe toast de sucesso
 * @returns {function} error - Exibe toast de erro
 * @returns {function} warning - Exibe toast de atenção
 * @returns {function} info - Exibe toast informativo
 * @returns {function} addToast - Exibe toast customizado
 * @returns {function} removeToast - Remove toast por ID
 * 
 * @example
 * ```jsx
 * const toast = useToast()
 * 
 * // Simples
 * toast.success('Transação salva com sucesso')
 * toast.error('Não foi possível salvar. Tente novamente.')
 * toast.warning('Seu orçamento de alimentação atingiu 80%')
 * toast.info('Sua meta foi atualizada automaticamente')
 * 
 * // Com título customizado
 * toast.success('Operação concluída', 'Tudo certo!')
 * 
 * // Com duração customizada (em ms)
 * toast.info('Esta mensagem fica 10 segundos', null, 10000)
 * 
 * // Toast customizado
 * toast.addToast({
 *   type: 'success',
 *   title: 'Título customizado',
 *   message: 'Mensagem customizada',
 *   duration: 5000
 * })
 * ```
 */
export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider')
  }

  return context
}
