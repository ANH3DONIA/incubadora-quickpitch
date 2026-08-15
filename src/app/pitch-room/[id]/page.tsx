import React from 'react';
import { prisma } from '@/lib/prisma';
import PitchRoomClient from './pitch-room-client';

export const dynamic = 'force-dynamic';

export default async function PitchRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Buscar startup o sesión en Neon PostgreSQL
  const startup = await prisma.startup.findFirst({
    where: {
      OR: [
        { id },
        { pitchSessions: { some: { id } } },
      ],
    },
    include: {
      owner: true,
      pitchDecks: { where: { isActive: true } },
    },
  });

  const startupData = startup
    ? {
        id: startup.id,
        name: startup.name,
        sector: startup.sector,
        description: startup.description,
        valuationTarget: Number(startup.valuationTarget),
        ownerName: startup.owner?.name || 'Emprendedor',
      }
    : {
        id,
        name: 'Startup Quick Pitch Demo',
        sector: 'Tecnología',
        description: 'Plataforma SaaS en proceso de validación e incubación.',
        valuationTarget: 500000,
        ownerName: 'Carlos Emprendedor',
      };

  return <PitchRoomClient sessionId={id} startup={startupData} />;
}
