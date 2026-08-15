'use client';

import { useState } from 'react';

interface UploadDeckModalProps {
  startupId: string;
  onClose: () => void;
}

export function UploadDeckModal({ startupId, onClose }: UploadDeckModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor selecciona un archivo PDF.');
      return;
    }
    
    if (file.type !== 'application/pdf') {
      setError('El archivo debe ser un PDF.');
      return;
    }
    
    if (file.size > 15 * 1024 * 1024) {
      setError('El archivo no puede superar los 15MB.');
      return;
    }

    setError('');
    setStatus('Cifrando con AES-256-GCM y guardando...');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('startupId', startupId);

      const res = await fetch('/api/pitch-decks/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Error al subir el deck');
      }

      setStatus('¡Pitch Deck cifrado y protegido exitosamente!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setStatus('');
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px', color: 'black' }}>
        <h2 style={{ marginTop: 0 }}>Subir Pitch Deck</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {status && <p style={{ color: 'green' }}>{status}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <input 
              type="file" 
              accept="application/pdf"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
            <p style={{ fontSize: '0.8rem', color: 'gray' }}>PDF máximo 15MB</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} disabled={loading} style={{ padding: '0.5rem 1rem' }}>Cancelar</button>
            <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem', backgroundColor: 'black', color: 'white' }}>
              Subir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
