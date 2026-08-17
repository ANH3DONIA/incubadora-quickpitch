'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { TimerHud } from '@/components/pitch/timer-hud';
import { WaitingRoom } from '@/components/pitch/waiting-room';
import { VideoPlayer } from '@/components/pitch/video-player';
import { InvestmentModal } from '@/components/financial/investment-modal';
import { 
  RocketIcon, 
  BriefcaseIcon, 
  DollarSignIcon, 
  CheckCircleIcon,
  VideoIcon,
  ShieldIcon 
} from '@/components/ui/icons';

interface PitchRoomClientProps {
  sessionId: string;
  startup: {
    id: string;
    name: string;
    sector: string;
    description: string;
    valuationTarget: number;
    ownerName: string;
  };
}

export default function PitchRoomClient({ sessionId, startup }: PitchRoomClientProps) {
  const [role, setRole] = useState<'ENTREPRENEUR' | 'INVESTOR'>('INVESTOR');
  const [userName, setUserName] = useState('Inversionista');
  const [status, setStatus] = useState<'WAITING' | 'IN_PROGRESS' | 'EXPIRED' | 'COMPLETED'>('WAITING');
  const [remainingSeconds, setRemainingSeconds] = useState(180);
  const [totalSeconds, setTotalSeconds] = useState(180);
  const [isReady, setIsReady] = useState(false);
  const [isAutoMuted, setIsAutoMuted] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [investmentAlert, setInvestmentAlert] = useState<any | null>(null);

  useEffect(() => {
    const socket = getSocket();

    // Unirse a la sala vía WebSocket
    socket.emit('join_room', {
      sessionId,
      userId: `user-${Date.now().toString(36)}`,
      name: userName,
      role,
    });

    // Escuchar actualización de estado de la sala
    socket.on('room_state', (roomData: any) => {
      setStatus(roomData.status);
      setRemainingSeconds(roomData.remainingSeconds);
      setTotalSeconds(roomData.totalSeconds);
    });

    // Escuchar inicio del cronómetro
    socket.on('timer_start', (data: any) => {
      setStatus('IN_PROGRESS');
      setRemainingSeconds(data.remainingSeconds);
      setTotalSeconds(data.totalSeconds);
      setIsAutoMuted(false);
    });

    // Escuchar cada segundo del cronómetro sincronizado por el servidor
    socket.on('timer_tick', (data: any) => {
      setRemainingSeconds(data.remainingSeconds);
      setTotalSeconds(data.totalSeconds);
    });

    // Escuchar cuando el cronómetro llega a 00:00
    socket.on('timer_expired', () => {
      setStatus('EXPIRED');
      setIsAutoMuted(true);
      if (role === 'INVESTOR') {
        setShowInvestmentModal(true);
      }
    });

    // Escuchar alertas de micro-inversiones en tiempo real
    socket.on('investment_received', (txData: any) => {
      setInvestmentAlert(txData);
      setTimeout(() => setInvestmentAlert(null), 8000);
    });

    return () => {
      socket.off('room_state');
      socket.off('timer_start');
      socket.off('timer_tick');
      socket.off('timer_expired');
      socket.off('investment_received');
    };
  }, [sessionId, userName, role]);

  const handleToggleReady = () => {
    const nextReady = !isReady;
    setIsReady(nextReady);
    getSocket().emit('toggle_ready', { sessionId, isReady: nextReady });
  };

  const handleStartPitch = () => {
    getSocket().emit('start_pitch', { sessionId, durationSeconds: 180 });
  };

  const handleInvestmentSuccess = (tx: any) => {
    getSocket().emit('send_investment', {
      sessionId,
      amount: tx.amount,
      currency: tx.currency,
      gateway: tx.gateway,
      investorName: userName,
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'hsl(var(--color-bg-alt))',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      maxWidth: '1280px',
      margin: '0 auto',
    }}>
      {/* Alerta flotante de inversión en tiempo real */}
      {investmentAlert && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'hsl(var(--color-navy))',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          border: '2px solid hsl(var(--color-amber))',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          animation: 'slideInRight 0.5s ease-out',
        }}>
          <CheckCircleIcon size={28} color="hsl(var(--color-amber))" />
          <div>
            <h4 style={{ color: 'hsl(var(--color-amber))', fontSize: '1rem', fontWeight: 800 }}>
              Micro-Inversión Recibida
            </h4>
            <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
              {investmentAlert.investorName} aportó <strong>${investmentAlert.amount.toLocaleString()} {investmentAlert.currency}</strong> vía {investmentAlert.gateway}.
            </p>
          </div>
        </div>
      )}

      {/* Header de la Sala */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        backgroundColor: 'hsl(var(--color-surface))',
        padding: '1rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid hsl(var(--color-border))',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href={role === 'ENTREPRENEUR' ? '/entrepreneur' : '/investor'} className="btn btn-outline btn-sm">
            ← Salir al Dashboard
          </Link>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--color-navy))' }}>
              Sala Quick Pitch: {startup.name}
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--color-text-muted))' }}>
              ID de Sesión: {sessionId}
            </span>
          </div>
        </div>

        {/* Selector de Rol para Demo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--color-text-secondary))' }}>
            Simular rol:
          </span>
          <button
            type="button"
            onClick={() => { setRole('ENTREPRENEUR'); setUserName('Carlos Emprendedor'); }}
            className={`btn btn-sm ${role === 'ENTREPRENEUR' ? 'btn-primary' : 'btn-outline'}`}
          >
            <RocketIcon size={16} />
            Emprendedor
          </button>
          <button
            type="button"
            onClick={() => { setRole('INVESTOR'); setUserName('Sofía Inversionista'); }}
            className={`btn btn-sm ${role === 'INVESTOR' ? 'btn-primary' : 'btn-outline'}`}
          >
            <BriefcaseIcon size={16} />
            Inversionista
          </button>
        </div>
      </header>

      {/* Barra de Cronómetro HUD */}
      <TimerHud
        remainingSeconds={remainingSeconds}
        totalSeconds={totalSeconds}
        status={status}
      />

      {/* Contenido Principal */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {status === 'WAITING' ? (
          /* Fase 1: Sala de Espera y Checklist */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <WaitingRoom
              startupName={startup.name}
              sector={startup.sector}
              valuationTarget={startup.valuationTarget}
              description={startup.description}
              isReady={isReady}
              onToggleReady={handleToggleReady}
              onStartPitch={handleStartPitch}
              canStart={isReady}
              userRole={role}
            />
            <VideoPlayer
              userName={userName}
              userRole={role}
              isExpositor={role === 'ENTREPRENEUR'}
              isAutoMuted={isAutoMuted}
              status={status}
            />
          </div>
        ) : (
          /* Fase 2 y 3: Pitch en Vivo & Post-Pitch */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <VideoPlayer
              userName={userName}
              userRole={role}
              isExpositor={role === 'ENTREPRENEUR'}
              isAutoMuted={isAutoMuted}
              status={status}
            />

            {status === 'EXPIRED' && (
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'hsl(var(--color-surface))',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid hsl(var(--color-border))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--color-navy))' }}>
                    Tiempo de Presentación Concluido
                  </h3>
                  <p style={{ color: 'hsl(var(--color-text-secondary))', fontSize: '0.875rem', marginTop: '2px' }}>
                    {role === 'ENTREPRENEUR'
                      ? 'El micrófono ha sido silenciado automáticamente. Esperando decisión del inversionista...'
                      : 'Puedes formalizar una micro-inversión en este momento.'}
                  </p>
                </div>

                {role === 'INVESTOR' && (
                  <button
                    type="button"
                    onClick={() => setShowInvestmentModal(true)}
                    className="btn btn-accent btn-lg"
                  >
                    <DollarSignIcon size={20} />
                    Invertir en {startup.name}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Inversión Dual */}
      {showInvestmentModal && (
        <InvestmentModal
          startupId={startup.id}
          sessionId={sessionId}
          startupName={startup.name}
          onClose={() => setShowInvestmentModal(false)}
          onInvestmentSuccess={handleInvestmentSuccess}
        />
      )}
    </div>
  );
}
