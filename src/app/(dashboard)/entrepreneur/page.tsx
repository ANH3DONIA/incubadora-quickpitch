import { prisma } from '@/lib/prisma';
import { EntrepreneurClient } from './entrepreneur-client';

export const dynamic = 'force-dynamic';

export default async function EntrepreneurDashboard() {
  const currentDate = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  // Consultar datos reales de Neon PostgreSQL
  const [startups, pitchSessions, transactions] = await Promise.all([
    prisma.startup.findMany({
      include: {
        pitchDecks: { where: { isActive: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.pitchSession.findMany({
      where: {
        scheduledStart: { gte: new Date() },
      },
      include: { startup: true },
      orderBy: { scheduledStart: 'asc' },
      take: 5,
    }),
    prisma.financialTransaction.findMany({
      where: {
        transactionType: 'MICRO_INVESTMENT',
        status: 'COMPLETED',
      },
    }),
  ]);

  const activeStartupsCount = startups.filter((s) => s.isApproved).length;
  const totalInvestment = transactions.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const nextSession = pitchSessions[0];

  return (
    <EntrepreneurClient 
      formattedDate={formattedDate}
      startups={startups}
      pitchSessions={pitchSessions}
      activeStartupsCount={activeStartupsCount}
      totalInvestment={totalInvestment}
      nextSession={nextSession}
    />
  );
}

