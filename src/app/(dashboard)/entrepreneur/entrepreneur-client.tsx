'use client';

import { useState } from 'react';
import styles from './entrepreneur.module.css';
import { CreateStartupModal } from '@/components/startup/create-startup-modal';
import { UploadDeckModal } from '@/components/startup/upload-deck-modal';
import { SchedulePitchModal } from '@/components/pitch/schedule-pitch-modal';
import { 
  RocketIcon, 
  CalendarIcon, 
  DollarSignIcon, 
  VideoIcon, 
  FileTextIcon, 
  PlusIcon,
  EyeIcon,
  ArrowRightIcon
} from '@/components/ui/icons';

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
  const [isPitchModalOpen, setPitchModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.welcomeTitle}>Panel de Emprendedor</h1>
          <p className={styles.date}>{formattedDate}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            type="button"
            onClick={() => setCreateModalOpen(true)} 
            className="btn btn-primary"
          >
            <PlusIcon size={18} />
            Crear Startup
          </button>
          <button 
            type="button"
            className="btn btn-accent" 
            onClick={() => setPitchModalOpen(true)}
            disabled={startups.length === 0}
            title={startups.length === 0 ? 'Primero registra una startup' : 'Agendar sesión de pitch'}
          >
            <CalendarIcon size={18} />
            Agendar Pitch
          </button>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Startups Registradas</span>
            <RocketIcon className={styles.statIcon} size={20} />
          </div>
          <div className={styles.statValue}>{startups.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Startups Aprobadas</span>
            <RocketIcon className={styles.statIcon} size={20} />
          </div>
          <div className={styles.statValue}>{activeStartupsCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Inversión Recibida</span>
            <DollarSignIcon className={styles.statIcon} size={20} />
          </div>
          <div className={styles.statValue}>
            ${totalInvestment.toLocaleString('en-US')} USD
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Próximo Pitch</span>
            <CalendarIcon className={styles.statIcon} size={20} />
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

      <section className={styles.section} id="startups">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Mis Startups</h2>
        </div>

        {startups.length === 0 ? (
          <div className={styles.emptyState}>
            <RocketIcon className={styles.emptyIcon} size={48} />
            <p className={styles.emptyMessage}>No tienes startups registradas en la incubadora</p>
            <button 
              type="button"
              onClick={() => setCreateModalOpen(true)} 
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              <PlusIcon size={18} />
              Registrar mi primera startup
            </button>
          </div>
        ) : (
          <div className={styles.startupGrid}>
            {startups.map((startup) => {
              const activeDeck = startup.pitchDecks?.find((d: any) => d.isActive) || startup.pitchDecks?.[0];

              return (
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

                  <p style={{ fontSize: '0.875rem', color: 'hsl(var(--color-text-secondary))', margin: '0.75rem 0', minHeight: '40px' }}>
                    {startup.description}
                  </p>

                  <div className={styles.cardMetrics}>
                    <span className={styles.metricLabel}>Valoración Objetivo</span>
                    <span className={styles.metricValue}>
                      ${Number(startup.valuationTarget).toLocaleString('en-US')} USD
                    </span>
                  </div>

                  <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      type="button"
                      onClick={() => setUploadDeckModalData({ isOpen: true, startupId: startup.id })} 
                      className="btn btn-outline btn-sm"
                    >
                      <FileTextIcon size={16} />
                      {activeDeck ? 'Actualizar Deck' : 'Subir Pitch Deck'}
                    </button>

                    {activeDeck && (
                      <a
                        href={`/api/pitch-decks/${activeDeck.id}/view`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline btn-sm"
                        title="Ver PDF cifrado"
                      >
                        <EyeIcon size={16} />
                        Ver Deck
                      </a>
                    )}

                    <button 
                      type="button"
                      onClick={() => setPitchModalOpen(true)}
                      className="btn btn-primary btn-sm"
                    >
                      <CalendarIcon size={16} />
                      Programar Pitch
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className={styles.section} id="sesiones">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Próximas Sesiones de Quick Pitch</h2>
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
                <div className={styles.cardTop}>
                  <h3 className={styles.startupName}>{session.startup.name}</h3>
                  <span className={styles.badge}>{session.status}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'hsl(var(--color-text-muted))', margin: '0.5rem 0' }}>
                  Fecha y Hora: {new Date(session.scheduledStart).toLocaleString('es-ES', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'hsl(var(--color-text-secondary))' }}>
                    Duración: {session.timerDurationSeconds}s
                  </span>
                  <a 
                    href={`/pitch-room/${session.id}`} 
                    className="btn btn-accent btn-sm"
                    style={{ textDecoration: 'none' }}
                  >
                    <VideoIcon size={16} />
                    Entrar a Sala
                  </a>
                </div>
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

      {isPitchModalOpen && (
        <SchedulePitchModal
          isOpen={isPitchModalOpen}
          onClose={() => setPitchModalOpen(false)}
          startups={startups.map((s: { id: string; name: string }) => ({ id: s.id, name: s.name }))}
        />
      )}
    </div>
  );
}
