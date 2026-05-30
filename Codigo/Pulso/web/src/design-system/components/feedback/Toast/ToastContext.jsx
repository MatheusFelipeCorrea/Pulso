import { createContext, useState, useCallback } from 'react'
import { ToastContainer } from './ToastContainer.jsx'

const MAX_VISIBLE_TOASTS = 3

/**
 * ToastContext - Context para gerenciar toasts globalmente
 */
export const ToastContext = createContext(null)

/**
 * ToastProvider - Provider para o sistema de toasts
 * Deve envolver a aplicação inteira (geralmente no App.jsx)
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type, title, message, duration = 4000, action }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const newToast = { id, type, title, message, duration, action }

    setToasts((prev) => [newToast, ...prev].slice(0, MAX_VISIBLE_TOASTS))

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const dismiss = removeToast

  const success = useCallback(
    (message, title, duration, action) =>
      addToast({ type: 'success', title, message, duration, action }),
    [addToast]
  )

  const error = useCallback(
    (message, title, duration, action) =>
      addToast({ type: 'error', title, message, duration, action }),
    [addToast]
  )

  const warning = useCallback(
    (message, title, duration, action) =>
      addToast({ type: 'warning', title, message, duration, action }),
    [addToast]
  )

  const info = useCallback(
    (message, title, duration, action) =>
      addToast({ type: 'info', title, message, duration, action }),
    [addToast]
  )

  const value = {
    toasts,
    addToast,
    removeToast,
    dismiss,
    success,
    error,
    warning,
    info,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}
