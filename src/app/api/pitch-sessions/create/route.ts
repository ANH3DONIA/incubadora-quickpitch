import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pitchSessionSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = pitchSessionSchema.parse(body);

    const startup = await prisma.startup.findUnique({
      where: { id: parsed.startupId },
    });

    if (!startup) {
      return NextResponse.json({ error: 'Startup no encontrada' }, { status: 404 });
    }

    const scheduledStart = new Date(parsed.scheduledStart);
    const scheduledEnd = new Date(scheduledStart.getTime() + parsed.timerDurationSeconds * 1000);

    const session = await prisma.pitchSession.create({
      data: {
        startupId: parsed.startupId,
        scheduledStart,
        scheduledEnd,
        timerDurationSeconds: parsed.timerDurationSeconds,
        status: 'SCHEDULED',
      },
    });

    const roomUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pitch-room/${session.id}`;

    const startDateISO = scheduledStart.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDateISO = scheduledEnd.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Quick Pitch: ' + startup.name)}&dates=${startDateISO}/${endDateISO}&details=${encodeURIComponent('Sala de Quick Pitch en vivo: ' + roomUrl)}&location=${encodeURIComponent(roomUrl)}`;

    return NextResponse.json({
      success: true,
      session,
      googleCalendarUrl,
      roomUrl,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al programar la sesión' }, { status: 400 });
  }
}
