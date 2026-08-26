import { io } from 'socket.io-client'
import { getApiBaseUrl } from '@/utils/apiBaseUrl.js'

let socket = null

/**
 * Conexão única Socket.IO (cookies httpOnly via credentials).
 * Path /api/socket.io — compatível com cookie path=/api e proxy Vite.
 * Se falhar, o chat REST segue normal.
 */
export function getGroupChatSocket() {
  if (typeof window === 'undefined') return null
  if (socket?.connected) return socket

  const apiBase = getApiBaseUrl()
  // Mesma origem em dev (/api) → socket relativo; API remota → origem da URL
  const origin =
    apiBase.startsWith('http') ? new URL(apiBase).origin : window.location.origin

  socket = io(origin, {
    path: '/api/socket.io',
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: true,
  })

  return socket
}

export function joinGrupoRoom(grupoId) {
  const s = getGroupChatSocket()
  if (!s || !grupoId) return
  const join = () => s.emit('grupo:join', grupoId)
  if (s.connected) join()
  else s.once('connect', join)
}

export function onGrupoMensagem(handler) {
  const s = getGroupChatSocket()
  if (!s) return () => {}
  const listener = (payload) => handler(payload)
  s.on('grupo:mensagem', listener)
  return () => s.off('grupo:mensagem', listener)
}
