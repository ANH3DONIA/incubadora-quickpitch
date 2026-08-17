'use client';

import React from 'react';
import { RocketIcon, VideoIcon, CheckCircleIcon, ClockIcon } from '@/components/ui/icons';

interface WaitingRoomProps {
  startupName: string;
  sector: string;
  valuationTarget: number;
  description: string;
  isReady: boolean;
  onToggleReady: () => void;
  onStartPitch: () => void;
  canStart: boolean;
  userRole: string;
}

export function WaitingRoom({
  startupName,
  sector,
  valuationTarget,
  description,
  isReady,
  onToggleReady,
  onStartPitch,
  canStart,
  userRole,
}: WaitingRoomProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1.5rem',
      backgroundColor: 'hsl(var(--color-surface))',
      borderRadius: 'var(--radius-xl)',
      padding: '2rem',
      border: '1px solid hsl(var(--color-border))',
      boxShadow: 'var(--shadow-md)',
    }}>
      {/* Columna Izquierda: Resumen Ejecutivo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-amber">{sector}</span>
            <span className="badge badge-navy">Sesión de 3 Minutos</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'hsl(var(--color-navy))' }}>
            {startupName}
          </h2>
        </div>

        <p style={{ color: 'hsl(var(--color-text-secondary))', lineHeight: 1.6 }}>
          {description}
        </p>

        <div style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'hsl(var(--color-bg-alt))',
          borderRadius: 'var(--radius-md)',
          border: '1px solid hsl(var(--color-border))',
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--color-text-muted))', textTransform: 'uppercase' }}>
            Valoración Objetivo
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(var(--color-navy))', marginTop: '2px' }}>
            ${valuationTarget.toLocaleString('en-US')} USD
          </div>
        </div>

        <div style={{
          padding: '0.875rem',
          backgroundColor: 'hsl(var(--color-amber-subtle) / 0.5)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8125rem',
          color: 'hsl(var(--color-navy))',
          lineHeight: 1.5,
        }}>
          <strong>Reglas del Quick Pitch:</strong> El expositor dispondrá de 3 minutos continuos. Al llegar el contador a cero, el sistema silenciará el micrófono y habilitará la pasarela de decisión y micro-inversión para el inversionista.
        </div>
      </div>

      {/* Columna Derecha: Checklist de Entrada y Preparación */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem',
        backgroundColor: 'hsl(var(--color-bg-alt))',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid hsl(var(--color-border))',
      }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'hsl(var(--color-navy))' }}>
            Verificación de Sala y Conexión
          </h3>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <CheckCircleIcon size={18} color="hsl(var(--color-success))" />
              <span>Cámara y micrófono inicializados</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <CheckCircleIcon size={18} color="hsl(var(--color-success))" />
              <span>Conexión WebSocket establecida</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <CheckCircleIcon size={18} color={isReady ? 'hsl(var(--color-success))' : 'hsl(var(--color-text-muted))'} />
              <span>Estado del participante: {isReady ? 'Listo' : 'Pendiente de confirmación'}</span>
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            type="button"
            onClick={onToggleReady}
            className={`btn ${isReady ? 'btn-primary' : 'btn-outline'} btn-lg`}
            style={{ width: '100%' }}
          >
            {isReady ? 'Confirmado: Estoy Listo' : 'Confirmar que Estoy Listo'}
          </button>

          {userRole === 'ENTREPRENEUR' && (
            <button
              type="button"
              onClick={onStartPitch}
              className="btn btn-accent btn-lg"
              style={{ width: '100%' }}
            >
              <ClockIcon size={18} />
              Iniciar Quick Pitch (3:00 min)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
