'use client';

import { useState } from 'react';
import styles from '@/components/ui/modal.module.css';

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
      setError('El archivo debe ser un formato PDF válido.');
      return;
    }
    
    if (file.size > 15 * 1024 * 1024) {
      setError('El archivo no puede superar los 15MB.');
      return;
    }

    setError('');
    setStatus('🔒 Cifrando documento con AES-256-GCM y guardando...');
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
        const data = await res.json();
        throw new Error(data.error || 'Error al subir el deck');
      }

      setStatus('✅ ¡Pitch Deck cifrado y almacenado con éxito!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error al procesar el archivo');
      setStatus('');
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} style={{ maxWidth: '460px' }}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Subir Pitch Deck</h2>
            <p className={styles.subtitle}>Presentación cifrada para inversionistas</p>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {status && <div className={styles.success}>{status}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Archivo PDF (Máximo 15MB)</label>
            <input 
              type="file" 
              accept="application/pdf"
              className={styles.input}
              onChange={e => setFile(e.target.files?.[0] || null)}
              disabled={loading}
              required
            />
            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--color-text-secondary))', marginTop: '4px' }}>
              🛡️ El archivo se cifrará de punto a punto antes de ser almacenado.
            </p>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} disabled={loading} className="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" disabled={loading || !file} className="btn btn-primary">
              {loading ? 'Cifrando y Subiendo...' : 'Subir Deck'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
