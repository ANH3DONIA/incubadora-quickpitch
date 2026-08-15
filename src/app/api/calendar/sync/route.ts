import { NextRequest, NextResponse } from 'next/server'

/**
 * Endpoint para sincronizar sesiones de Quick Pitch con Google Calendar.
 * Crea un evento en el calendario del usuario con el enlace a la sala de video.
 * 
 * TODO: Implementar con googleapis SDK
 */
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { sessionId, userEmail, title, startTime, endTime, roomUrl } = body

  // TODO: Implementar integración real con Google Calendar API
  // 1. Obtener token OAuth2 del usuario
  // 2. Crear evento con google.calendar.events.insert
  // 3. Guardar calendarEventId en la sesión de pitch

  return NextResponse.json({
    message: 'Sincronización con Google Calendar pendiente de implementación',
    sessionId,
  })
}
