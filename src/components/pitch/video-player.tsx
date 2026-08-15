'use client';

import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  userName: string;
  userRole: string;
  isExpositor: boolean;
  isAutoMuted: boolean;
  status: 'WAITING' | 'IN_PROGRESS' | 'EXPIRED' | 'COMPLETED';
}

export function VideoPlayer({ userName, userRole, isExpositor, isAutoMuted, status }: VideoPlayerProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function initMedia() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        setHasCameraPermission(true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn('No se pudo acceder a la cámara/micrófono local:', err);
        setHasCameraPermission(false);
      }
    }

    initMedia();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Manejo de Auto-Mute al expirar el cronómetro
  useEffect(() => {
    if (isAutoMuted && stream && isExpositor) {
      stream.getAudioTracks().forEach((track) => (track.enabled = false));
      setIsMicOn(false);
    }
  }, [isAutoMuted, stream, isExpositor]);

  const toggleMic = () => {
    if (isAutoMuted && isExpositor) return; // Bloqueado tras expirar timer
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleCam = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOn(videoTrack.enabled);
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      width: '100%',
    }}>
      {/* Cuadrícula de Video */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        width: '100%',
        minHeight: '380px',
      }}>
        {/* Video Local */}
        <div style={{
          position: 'relative',
          backgroundColor: 'hsl(var(--color-navy-light))',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          aspectRatio: '16/9',
          boxShadow: 'var(--shadow-md)',
          border: '1.5px solid hsl(var(--color-navy-mid))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {hasCameraPermission === false || !isCamOn ? (
            <div style={{ textAlign: 'center', color: 'hsl(var(--color-text-inverse))' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'hsl(var(--color-navy))',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
              }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Cámara apagada</p>
            </div>
          ) : (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)', // Modo espejo
              }}
            />
          )}

          {/* Badge de nombre y rol */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span>{userName} (Tú)</span>
            <span style={{
              color: 'hsl(var(--color-amber))',
              fontSize: '0.7rem',
              borderLeft: '1px solid rgba(255,255,255,0.3)',
              paddingLeft: '6px',
            }}>
              {userRole}
            </span>
          </div>

          {/* Indicador de Silencio */}
          {!isMicOn && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'hsl(var(--color-error))',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.7rem',
              fontWeight: 700,
            }}>
              {isAutoMuted ? 'MUTE AUTOMÁTICO (00:00)' : 'MUTED'}
            </div>
          )}
        </div>

        {/* Video Remoto / Contraparte */}
        <div style={{
          position: 'relative',
          backgroundColor: 'hsl(var(--color-navy-light))',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          aspectRatio: '16/9',
          boxShadow: 'var(--shadow-md)',
          border: '1.5px solid hsl(var(--color-navy-mid))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center', color: 'hsl(var(--color-text-inverse))' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'hsl(var(--color-navy))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              border: '2px dashed hsl(var(--color-amber))',
            }}>
              🤝
            </div>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {isExpositor ? 'Inversionista en Sala' : 'Emprendedor Expositor'}
            </p>
            <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '4px' }}>
              {status === 'WAITING' ? 'Esperando inicio...' : 'Transmisión WebRTC Activa'}
            </p>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}>
            {isExpositor ? 'Inversionista' : 'Expositor'}
          </div>
        </div>
      </div>

      {/* Barra de Controles */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '0.75rem',
        backgroundColor: 'hsl(var(--color-surface))',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid hsl(var(--color-border))',
      }}>
        <button
          type="button"
          onClick={toggleMic}
          className={`btn ${isMicOn ? 'btn-outline' : 'btn-primary'}`}
          style={{
            backgroundColor: !isMicOn ? 'hsl(var(--color-error))' : undefined,
            borderColor: !isMicOn ? 'hsl(var(--color-error))' : undefined,
          }}
          disabled={isAutoMuted && isExpositor}
        >
          {isMicOn ? '🎤 Micrófono Activo' : '🔇 Micrófono Silenciado'}
        </button>

        <button
          type="button"
          onClick={toggleCam}
          className={`btn ${isCamOn ? 'btn-outline' : 'btn-primary'}`}
        >
          {isCamOn ? '📹 Cámara Activa' : '🚫 Cámara Apagada'}
        </button>
      </div>
    </div>
  );
}
