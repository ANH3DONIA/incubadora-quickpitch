'use client';

import { useState } from 'react';

type Startup = { id: string; name: string };

interface SchedulePitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  startups: Startup[];
}

export function SchedulePitchModal({ isOpen, onClose, startups }: SchedulePitchModalProps) {
  const [startupId, setStartupId] = useState('');
  const [scheduledStart, setScheduledStart] = useState('');
  const [timerDurationSeconds, setTimerDurationSeconds] = useState(180);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/pitch-sessions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startupId,
        scheduledStart: new Date(scheduledStart).toISOString(),
        timerDurationSeconds,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setResult(data);
    }
  };

  return (
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content" style={contentStyle}>
        <h2>Programar Pitch</h2>
        {!result ? (
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={fieldStyle}>
              <label>Startup</label>
              <select value={startupId} onChange={(e) => setStartupId(e.target.value)} required style={inputStyle}>
                <option value="">Seleccionar Startup</option>
                {startups.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div style={fieldStyle}>
              <label>Fecha y Hora</label>
              <input
                type="datetime-local"
                value={scheduledStart}
                onChange={(e) => setScheduledStart(e.target.value)}
                required
                style={inputStyle}
                min={new Date(Date.now() + 10 * 60000).toISOString().slice(0, 16)} // Minimum 10 minutes in the future
              />
            </div>
            <div style={fieldStyle}>
              <label>Duración (segundos)</label>
              <input
                type="number"
                value={timerDurationSeconds}
                onChange={(e) => setTimerDurationSeconds(Number(e.target.value))}
                required
                style={inputStyle}
              />
            </div>
            <div style={actionsStyle}>
              <button type="submit" className="btn btn-primary" style={btnStyle}>Programar</button>
              <button type="button" onClick={onClose} className="btn" style={btnStyle}>Cancelar</button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h3>¡Sesión Programada!</h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <a href={result.googleCalendarUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={btnStyle}>📅 Agregar a Google Calendar</a>
              <a href={result.roomUrl} className="btn" style={btnStyle}>Entrar a la Sala</a>
            </div>
            <button onClick={onClose} className="btn" style={{ marginTop: '2rem', ...btnStyle }}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const contentStyle: React.CSSProperties = {
  backgroundColor: 'hsl(var(--color-bg-elevated))',
  padding: '2rem',
  borderRadius: '8px',
  border: '1px solid hsl(var(--color-border))',
  width: '100%',
  maxWidth: '500px',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: '1.5rem',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const inputStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderRadius: '4px',
  border: '1px solid hsl(var(--color-border))',
  backgroundColor: 'hsl(var(--color-bg-base))',
  color: 'hsl(var(--color-text-primary))',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',
  justifyContent: 'flex-end',
};

const btnStyle: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  cursor: 'pointer',
  border: '1px solid hsl(var(--color-border))',
  background: 'hsl(var(--color-bg-base))',
  color: 'hsl(var(--color-text-primary))',
  textDecoration: 'none',
};
