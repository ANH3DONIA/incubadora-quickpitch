'use client';

import React from 'react';

interface TimerHudProps {
  remainingSeconds: number;
  totalSeconds: number;
  status: 'WAITING' | 'IN_PROGRESS' | 'EXPIRED' | 'COMPLETED';
}

export function TimerHud({ remainingSeconds, totalSeconds, status }: TimerHudProps) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isUrgent = remainingSeconds <= 30 && status === 'IN_PROGRESS';
  const progressPercent = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;

  return (
    <div style={{
      width: '100%',
      backgroundColor: isUrgent ? 'hsl(var(--color-error) / 0.12)' : 'hsl(var(--color-navy))',
      color: 'hsl(var(--color-text-inverse))',
      padding: '0.875rem 1.5rem',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: isUrgent ? '0 0 20px hsl(var(--color-error) / 0.3)' : 'var(--shadow-lg)',
      transition: 'all var(--transition-base)',
      border: isUrgent ? '1.5px solid hsl(var(--color-error))' : '1px solid hsl(var(--color-navy-light))',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: status === 'IN_PROGRESS' 
            ? (isUrgent ? 'hsl(var(--color-error))' : 'hsl(var(--color-success))')
            : status === 'EXPIRED' ? 'hsl(var(--color-error))' : 'hsl(var(--color-amber))',
          animation: status === 'IN_PROGRESS' ? 'pulse-subtle 1.5s infinite' : 'none',
        }} />
        <span style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {status === 'WAITING' && 'Sala de Espera — Sesión Programada'}
          {status === 'IN_PROGRESS' && (isUrgent ? 'Últimos 30 Segundos' : 'Pitch en Transmisión')}
          {status === 'EXPIRED' && 'Tiempo de Pitch Concluido'}
          {status === 'COMPLETED' && 'Sesión Concluida'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Barra de progreso */}
        <div style={{
          width: '140px',
          height: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: isUrgent ? 'hsl(var(--color-error))' : 'hsl(var(--color-amber))',
            transition: 'width 1s linear',
          }} />
        </div>

        {/* Reloj numérico */}
        <div style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '1.75rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: isUrgent ? 'hsl(var(--color-error))' : 'hsl(var(--color-amber))',
        }}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
}
