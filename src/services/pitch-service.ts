import { prisma } from '@/lib/prisma'
import { createDailyRoom, deleteDailyRoom } from '@/lib/daily'
import { SessionStatus } from '@prisma/client'

interface CreatePitchSessionParams {
  startupId: string
  scheduledStart: Date
  timerDurationSeconds?: number
}

/**
 * Crea una nueva sesión de Quick Pitch con su sala de video asociada
 */
export async function createPitchSession(params: CreatePitchSessionParams) {
  // Calcular hora de fin basándose en la duración del timer + 10 min de margen
  const durationMs = (params.timerDurationSeconds || 180) * 1000 + 10 * 60 * 1000
  const scheduledEnd = new Date(params.scheduledStart.getTime() + durationMs)

  // Crear sala en Daily.co
  const room = await createDailyRoom({
    expiryMinutes: Math.ceil(durationMs / 60000) + 30,
    maxParticipants: 4,
  })

  // Registrar sesión en la base de datos
  return prisma.pitchSession.create({
    data: {
      startupId: params.startupId,
      scheduledStart: params.scheduledStart,
      scheduledEnd,
      timerDurationSeconds: params.timerDurationSeconds || 180,
      dailyRoomName: room.name,
      dailyRoomUrl: room.url,
      status: SessionStatus.SCHEDULED,
    },
  })
}

/**
 * Actualiza el estado de una sesión de pitch
 */
export async function updatePitchSessionStatus(
  sessionId: string,
  status: SessionStatus
) {
  return prisma.pitchSession.update({
    where: { id: sessionId },
    data: { status },
  })
}

/**
 * Cancela una sesión y elimina la sala de video asociada
 */
export async function cancelPitchSession(sessionId: string) {
  const session = await prisma.pitchSession.findUnique({
    where: { id: sessionId },
  })

  if (session?.dailyRoomName) {
    await deleteDailyRoom(session.dailyRoomName)
  }

  return prisma.pitchSession.update({
    where: { id: sessionId },
    data: { status: SessionStatus.CANCELLED },
  })
}

/**
 * Obtiene las sesiones próximas de un emprendedor o inversionista
 */
export async function getUpcomingSessions(userId: string, role: 'ENTREPRENEUR' | 'INVESTOR') {
  if (role === 'ENTREPRENEUR') {
    return prisma.pitchSession.findMany({
      where: {
        startup: { ownerId: userId },
        status: { in: [SessionStatus.SCHEDULED, SessionStatus.WAITING] },
        scheduledStart: { gte: new Date() },
      },
      include: { startup: true, bookings: { include: { user: true } } },
      orderBy: { scheduledStart: 'asc' },
    })
  }

  return prisma.pitchSession.findMany({
    where: {
      bookings: { some: { userId } },
      status: { in: [SessionStatus.SCHEDULED, SessionStatus.WAITING] },
      scheduledStart: { gte: new Date() },
    },
    include: { startup: true },
    orderBy: { scheduledStart: 'asc' },
  })
}
