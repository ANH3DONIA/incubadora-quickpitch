'use client';

import { useState } from 'react';
import styles from './entrepreneur.module.css';
import { CreateStartupModal } from '@/components/startup/create-startup-modal';
import { UploadDeckModal } from '@/components/startup/upload-deck-modal';

interface EntrepreneurClientProps {
  formattedDate: string;
  startups: any[];
  pitchSessions: any[];
  activeStartupsCount: number;
  totalInvestment: number;
  nextSession: any;
}

export function EntrepreneurClient({
  formattedDate,
  startups,
  pitchSessions,
  activeStartupsCount,
  totalInvestment,
  nextSession
}: EntrepreneurClientProps) {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [uploadDeckModalData, setUploadDeckModalData] = useState<{ isOpen: boolean, startupId: string }>({ isOpen: false, startupId: '' });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.welcomeTitle}>Bienvenido, Emprendedor</h1>
        <p className={styles.date}>{formattedDate}</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={() => setCreateModalOpen(true)} style={{ padding: '0.5rem 1rem', background: 'black', color: 'white', borderRadius: '4px' }}>
            Crear Startup
          </button>
          <button style={{ padding: '0.5rem 1rem', background: '#333', color: 'white', borderRadius: '4px' }}>
            Agendar Pitch
          </button>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Startups Registradas</span>
            <RocketIcon className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{startups.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Startups Aprobadas</span>
            <RocketIcon className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{activeStartupsCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Inversión Recibida</span>
            <MoneyIcon className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>
            ${totalInvestment.toLocaleString('en-US')}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Próximo Pitch</span>
            <CalendarIcon className={styles.statIcon} />
          </div>
          <div className={styles.statValue} style={{ fontSize: '1.1rem' }}>
            {nextSession
              ? new Date(nextSession.scheduledStart).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Sin programar'}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Mis Startups</h2>
        </div>

        {startups.length === 0 ? (
          <div className={styles.emptyState}>
            <RocketIcon className={styles.emptyIcon} size={48} />
            <p className={styles.emptyMessage}>No tienes startups registradas en la incubadora</p>
          </div>
        ) : (
          <div className={styles.startupGrid}>
            {startups.map((startup) => (
              <div key={startup.id} className={styles.startupCard}>
                <div className={styles.cardTop}>
                  <div>
                    <h3 className={styles.startupName}>{startup.name}</h3>
                    <span className={styles.startupSector}>Sector: {startup.sector}</span>
                  </div>
                  <span
                    className={`${styles.badge} ${
                      startup.isApproved ? styles.badgeSuccess : styles.badgeAmber
                    }`}
                  >
                    {startup.isApproved ? 'Aprobada' : 'En Revisión'}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'hsl(var(--color-text-secondary))', margin: '0.75rem 0' }}>
                  {startup.description}
                </p>
                <div className={styles.cardMetrics}>
                  <span className={styles.metricLabel}>Valoración Objetivo</span>
                  <span className={styles.metricValue}>
                    ${Number(startup.valuationTarget).toLocaleString('en-US')} USD
                  </span>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <button onClick={() => setUploadDeckModalData({ isOpen: true, startupId: startup.id })} style={{ padding: '0.25rem 0.5rem', background: '#eee', color: 'black', borderRadius: '4px', fontSize: '0.875rem' }}>
                    Subir Pitch Deck
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Próximas Sesiones</h2>
        </div>
        {pitchSessions.length === 0 ? (
          <div className={styles.emptyState}>
            <CalendarIcon className={styles.emptyIcon} size={48} />
            <p className={styles.emptyMessage}>No tienes sesiones de Quick Pitch programadas</p>
          </div>
        ) : (
          <div className={styles.startupGrid}>
            {pitchSessions.map((session) => (
              <div key={session.id} className={styles.startupCard}>
                <h3 className={styles.startupName}>{session.startup.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'hsl(var(--color-text-muted))' }}>
                  {new Date(session.scheduledStart).toLocaleString('es-ES')}
                </p>
                <span className={styles.badge}>{session.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {isCreateModalOpen && (
        <CreateStartupModal onClose={() => setCreateModalOpen(false)} />
      )}
      
      {uploadDeckModalData.isOpen && (
        <UploadDeckModal 
          startupId={uploadDeckModalData.startupId} 
          onClose={() => setUploadDeckModalData({ isOpen: false, startupId: '' })} 
        />
      )}
    </div>
  );
}

// Icons
function RocketIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function MoneyIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function CalendarIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
