const DAILY_API_KEY = process.env.DAILY_API_KEY || ''
const DAILY_API_URL = 'https://api.daily.co/v1'

export interface CreateRoomOptions {
  name?: string
  expiryMinutes?: number
  maxParticipants?: number
}

/**
 * Crea una sala de videoconferencia en Daily.co
 */
export async function createDailyRoom(options: CreateRoomOptions = {}) {
  const expiry = Math.floor(Date.now() / 1000) + (options.expiryMinutes || 60) * 60

  const response = await fetch(`${DAILY_API_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      name: options.name,
      properties: {
        exp: expiry,
        max_participants: options.maxParticipants || 4,
        enable_chat: true,
        enable_knocking: true,
        start_video_off: false,
        start_audio_off: false,
      },
    }),
  })

  return response.json()
}

/**
 * Crea un token de acceso para un participante de la sala
 */
export async function createMeetingToken(roomName: string, userName: string, isOwner: boolean = false) {
  const expiry = Math.floor(Date.now() / 1000) + 3600 // 1 hora

  const response = await fetch(`${DAILY_API_URL}/meeting-tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_name: userName,
        exp: expiry,
        is_owner: isOwner,
      },
    }),
  })

  return response.json()
}

/**
 * Elimina una sala de Daily.co
 */
export async function deleteDailyRoom(roomName: string) {
  const response = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
  })

  return response.ok
}
