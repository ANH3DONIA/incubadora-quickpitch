import styles from './investor.module.css';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { InvestorClient } from './investor-client';

export const dynamic = 'force-dynamic';

export default async function InvestorDashboard() {
  // Consultar startups e inversiones reales de Neon PostgreSQL
  const [startups, transactions] = await Promise.all([
    prisma.startup.findMany({
      include: {
        owner: true,
        pitchDecks: { where: { isActive: true } },
        pitchSessions: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.financialTransaction.findMany({
      where: {
        transactionType: 'MICRO_INVESTMENT',
        status: 'COMPLETED',
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalInvested = transactions.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.welcomeTitle}>Bienvenido, Inversionista</h1>
      </header>
      <InvestorClient />

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>Startups Disponibles</div>
          <div className={styles.statValue}>{startups.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>Inversiones Realizadas</div>
          <div className={styles.statValue}>{transactions.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>Total Invertido</div>
          <div className={styles.statValue}>
            ${totalInvested.toLocaleString('en-US')} USD
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>Próximo Pitch</div>
          <div className={styles.statValue} style={{ fontSize: '1.1rem' }}>
            {startups.some((s) => s.pitchSessions.length > 0)
              ? 'Sesión activa'
              : 'Sin sesiones'}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Startups en Incubación</h2>
        {startups.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'hsl(var(--color-text-secondary))' }}>
            <p>No hay startups registradas en la incubadora por el momento.</p>
          </div>
        ) : (
          <div className={styles.startupGrid}>
            {startups.map((startup) => (
              <div key={startup.id} className={styles.startupCard}>
                <div className={styles.cardTop}>
                  <h3 className={styles.startupName}>{startup.name}</h3>
                  <span className={styles.badge}>{startup.sector}</span>
                </div>
                <p className={styles.description}>{startup.description}</p>
                <div className={styles.valuation}>
                  Meta: ${Number(startup.valuationTarget).toLocaleString('en-US')} USD
                </div>
                <div className={styles.cardActions}>
                  <Link
                    href={`/pitch-room/${startup.id}`}
                    className={`btn btn-primary btn-sm ${styles.btnPrimary}`}
                  >
                    Entrar a Quick Pitch
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Historial de Inversiones</h2>
        {transactions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'hsl(var(--color-text-muted))' }}>
            <p>No has realizado inversiones aún. Los aportes con Stripe o Binance Pay se mostrarán aquí.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid hsl(var(--color-border))', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Pasarela</th>
                  <th style={{ padding: '0.75rem' }}>Monto</th>
                  <th style={{ padding: '0.75rem' }}>Estado</th>
                  <th style={{ padding: '0.75rem' }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid hsl(var(--color-border))' }}>
                    <td style={{ padding: '0.75rem' }}>{tx.gateway}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                      ${Number(tx.amount).toLocaleString('en-US')} {tx.currency}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{tx.status}</td>
                    <td style={{ padding: '0.75rem' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
