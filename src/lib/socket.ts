import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

/**
 * Obtiene o crea la conexión WebSocket del cliente al servidor de señales y cronómetro
 */
export function getSocket(): Socket {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002'
    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })
  }
  return socket
}

/**
 * Desconecta el socket del cliente
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
