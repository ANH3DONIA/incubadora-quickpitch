'use client';

import { useState } from 'react';
import styles from '@/components/ui/modal.module.css';

type Startup = { id: string; name: string };

interface SchedulePitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  startups: Startup[];
}

export function SchedulePitchModal({ isOpen, onClose, startups }: SchedulePitchModalProps) {
  const [startupId, setStartupId] = useState(startups[0]?.id || '');
  const [scheduledStart, setScheduledStart] = useState('');
  const [timerDurationSeconds, setTimerDurationSeconds] = useState(180);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/pitch-sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId: startupId || startups[0]?.id,
          scheduledStart: new Date(scheduledStart).toISOString(),
          timerDurationSeconds: Number(timerDurationSeconds),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al programar la sesión');
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error al programar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Programar Quick Pitch</h2>
            <p className={styles.subtitle}>Configura fecha y duración de tu presentación</p>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {!result ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Seleccionar Startup</label>
              <select 
                value={startupId} 
                onChange={(e) => setStartupId(e.target.value)} 
                required 
                className={styles.select}
                disabled={loading}
              >
                {startups.length === 0 && <option value="">No tienes startups registradas</option>}
                {startups.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Fecha y Hora de Inicio</label>
              <input
                type="datetime-local"
                value={scheduledStart}
                onChange={(e) => setScheduledStart(e.target.value)}
                required
                className={styles.input}
                min={new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16)}
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label>Duración del Cronómetro</label>
              <select
                value={timerDurationSeconds}
                onChange={(e) => setTimerDurationSeconds(Number(e.target.value))}
                className={styles.select}
                disabled={loading}
              >
                <option value={60}>1 Minuto (Elevator Pitch)</option>
                <option value={180}>3 Minutos (Estándar QuickPitch)</option>
                <option value={300}>5 Minutos (Pitch Extendido)</option>
              </select>
            </div>

            <div className={styles.actions}>
              <button type="button" onClick={onClose} disabled={loading} className="btn btn-outline">
                Cancelar
              </button>
              <button type="submit" disabled={loading || startups.length === 0} className="btn btn-primary">
                {loading ? 'Programando...' : 'Programar Pitch'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ¡Sesión de Quick Pitch Programada!
            </h3>
            <p style={{ color: 'hsl(var(--color-text-secondary))', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Se ha generado la sala de video con cronómetro estricto.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a 
                href={result.googleCalendarUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-accent btn-lg"
                style={{ width: '100%', textDecoration: 'none' }}
              >
                📅 Agregar a Google Calendar
              </a>
              <a 
                href={result.roomUrl} 
                className="btn btn-primary"
                style={{ width: '100%', textDecoration: 'none' }}
              >
                🎥 Entrar a la Sala de Pitch
              </a>
            </div>

            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-ghost" 
              style={{ marginTop: '1rem', width: '100%' }}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
