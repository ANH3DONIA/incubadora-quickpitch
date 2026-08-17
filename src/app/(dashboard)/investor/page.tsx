import styles from './investor.module.css';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { InvestorClient } from './investor-client';
import { 
  RocketIcon, 
  CreditCardIcon, 
  DollarSignIcon, 
  VideoIcon, 
  FileTextIcon, 
  EyeIcon, 
  CheckCircleIcon 
} from '@/components/ui/icons';

export const dynamic = 'force-dynamic';

export default async function InvestorDashboard() {
  // Consultar startups e inversiones reales de Neon PostgreSQL
  const [startups, transactions] = await Promise.all([
    prisma.startup.findMany({
      include: {
        owner: true,
        pitchDecks: { where: { isActive: true } },
        pitchSessions: {
          orderBy: { scheduledStart: 'desc' },
          take: 1,
        },
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
        <div>
          <h1 className={styles.welcomeTitle}>Panel de Inversionista</h1>
          <p style={{ color: 'hsl(var(--color-text-secondary))', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Explora startups en incubación y participa en sesiones de Quick Pitch en vivo.
          </p>
        </div>
      </header>
      
      <InvestorClient />

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Startups Disponibles</span>
            <RocketIcon size={20} color="hsl(var(--color-text-secondary))" />
          </div>
          <div className={styles.statValue}>{startups.length}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Inversiones Realizadas</span>
            <CreditCardIcon size={20} color="hsl(var(--color-text-secondary))" />
          </div>
          <div className={styles.statValue}>{transactions.length}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Total Invertido</span>
            <DollarSignIcon size={20} color="hsl(var(--color-text-secondary))" />
          </div>
          <div className={styles.statValue}>
            ${totalInvested.toLocaleString('en-US')} USD
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Sesiones Activas</span>
            <VideoIcon size={20} color="hsl(var(--color-text-secondary))" />
          </div>
          <div className={styles.statValue} style={{ fontSize: '1.1rem' }}>
            {startups.filter((s) => s.pitchSessions.length > 0).length} en agenda
          </div>
        </div>
      </section>

      <section className={styles.section} id="startups">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 className={styles.sectionTitle}>Startups en Incubación</h2>
            <p style={{ fontSize: '0.875rem', color: 'hsl(var(--color-text-secondary))' }}>
              Proyectos filtrados y validados por el comité de la incubadora.
            </p>
          </div>
        </div>

        {startups.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'hsl(var(--color-surface))', borderRadius: 'var(--radius-lg)', border: '1px solid hsl(var(--color-border))' }}>
            <p style={{ color: 'hsl(var(--color-text-secondary))' }}>No hay startups registradas en la incubadora por el momento.</p>
          </div>
        ) : (
          <div className={styles.startupGrid}>
            {startups.map((startup) => {
              const activeDeck = startup.pitchDecks?.[0];
              const nextSession = startup.pitchSessions?.[0];
              const roomUrl = nextSession ? `/pitch-room/${nextSession.id}` : `/pitch-room/${startup.id}`;

              return (
                <div key={startup.id} className={styles.startupCard}>
                  <div className={styles.cardTop}>
                    <div>
                      <h3 className={styles.startupName}>{startup.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--color-text-muted))' }}>
                        Fundador: {startup.owner?.name || 'Emprendedor'}
                      </span>
                    </div>
                    <span className="badge badge-amber">{startup.sector}</span>
                  </div>

                  <p className={styles.description}>{startup.description}</p>
                  
                  <div className={styles.valuation}>
                    Valoración Objetivo: <strong>${Number(startup.valuationTarget).toLocaleString('en-US')} USD</strong>
                  </div>

                  <div className={styles.cardActions} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
                    <Link
                      href={roomUrl}
                      className="btn btn-primary btn-sm"
                    >
                      <VideoIcon size={16} />
                      Entrar a Quick Pitch
                    </Link>

                    {activeDeck && (
                      <a
                        href={`/api/pitch-decks/${activeDeck.id}/view`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        <EyeIcon size={16} />
                        Ver Deck
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className={styles.section} id="inversiones">
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 className={styles.sectionTitle}>Historial de Inversiones</h2>
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--color-text-secondary))' }}>
            Registro de aportes financieros procesados con pasarela dual.
          </p>
        </div>

        {transactions.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: 'hsl(var(--color-surface))', borderRadius: 'var(--radius-lg)', border: '1px solid hsl(var(--color-border))' }}>
            <p style={{ color: 'hsl(var(--color-text-secondary))' }}>
              No has realizado inversiones aún. Los aportes confirmados vía Stripe o Binance Pay aparecerán en esta tabla.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', backgroundColor: 'hsl(var(--color-surface))', borderRadius: 'var(--radius-lg)', border: '1px solid hsl(var(--color-border))' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid hsl(var(--color-border))', textAlign: 'left', backgroundColor: 'hsl(var(--color-bg-alt))' }}>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>ID Transacción</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Pasarela</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Monto</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Estado</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid hsl(var(--color-border))' }}>
                    <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      {tx.id.substring(0, 10)}...
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 500 }}>{tx.gateway}</td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'hsl(var(--color-navy))' }}>
                      ${Number(tx.amount).toLocaleString('en-US')} {tx.currency}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span className="badge badge-success">{tx.status}</span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: 'hsl(var(--color-text-muted))' }}>
                      {new Date(tx.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
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
