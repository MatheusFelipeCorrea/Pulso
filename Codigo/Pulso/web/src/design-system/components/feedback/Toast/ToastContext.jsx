import { createContext, useState, useCallback, useMemo } from 'react'
import { ToastContainer } from './ToastContainer.jsx'

/**
 * ToastContext - Context para gerenciar toasts globalmente
 * 
 * Fornece um sistema centralizado de notificações toast
 * que pode ser acessado de qualquer lugar da aplicação via useToast()
 */
export const ToastContext = createContext(null)

/**
 * ToastProvider - Provider para o sistema de toasts
 * 
 * Deve envolver a aplicação inteira (geralmente no App.jsx)
 * 
 * @example
 * ```jsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  // ============================================================
  // ADICIONAR TOAST
  // ============================================================
  const addToast = useCallback(({ type, title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random()
    const newToast = { id, type, title, message, duration }
    
    setToasts((prev) => [newToast, ...prev])
    
    return id
  }, [])

  // ============================================================
  // REMOVER TOAST
  // ============================================================
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // ============================================================
  // ATALHOS POR TIPO
  // ============================================================
  const success = useCallback(
    (message, title, duration) => {
      return addToast({ type: 'success', title, message, duration })
    },
    [addToast]
  )

  const error = useCallback(
    (message, title, duration) => {
      return addToast({ type: 'error', title, message, duration })
    },
    [addToast]
  )

  const warning = useCallback(
    (message, title, duration) => {
      return addToast({ type: 'warning', title, message, duration })
    },
    [addToast]
  )

  const info = useCallback(
    (message, title, duration) => {
      return addToast({ type: 'info', title, message, duration })
    },
    [addToast]
  )

  // ============================================================
  // VALUE DO CONTEXT
  // ============================================================
  const value = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      success,
      error,
      warning,
      info,
    }),
    [toasts, addToast, removeToast, success, error, warning, info]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}
