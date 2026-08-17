import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * Endpoint para sincronizar sesiones de Quick Pitch con Google Calendar.
 * Genera un enlace directo para agregar el evento al calendario del usuario.
 */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId es requerido' }, { status: 400 })
    }

    const pitchSession = await prisma.pitchSession.findUnique({
      where: { id: sessionId },
      include: { startup: true },
    })

    if (!pitchSession) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const roomUrl = `${appUrl}/pitch-room/${sessionId}`
    const startDateISO = pitchSession.scheduledStart.toISOString().replace(/-|:|\.\d{3}/g, '')
    const endDateISO = pitchSession.scheduledEnd.toISOString().replace(/-|:|\.\d{3}/g, '')

    const googleCalendarUrl = [
      'https://calendar.google.com/calendar/render?action=TEMPLATE',
      `&text=${encodeURIComponent('Quick Pitch: ' + pitchSession.startup.name)}`,
      `&dates=${startDateISO}/${endDateISO}`,
      `&details=${encodeURIComponent('Sala de Quick Pitch en vivo: ' + roomUrl)}`,
      `&location=${encodeURIComponent(roomUrl)}`,
    ].join('')

    return NextResponse.json({
      success: true,
      googleCalendarUrl,
      sessionId,
    })
  } catch (error) {
    console.error('Error al generar enlace de calendario:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
