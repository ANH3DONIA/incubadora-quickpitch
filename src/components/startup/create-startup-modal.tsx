'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { startupSchema } from '@/lib/validations';
import styles from '@/components/ui/modal.module.css';

interface CreateStartupModalProps {
  onClose: () => void;
}

export function CreateStartupModal({ onClose }: CreateStartupModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    sector: 'CleanTech',
    valuationTarget: 500000,
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const parsed = startupSchema.parse({
        ...formData,
        valuationTarget: Number(formData.valuationTarget),
      });

      setLoading(true);
      const res = await fetch('/api/startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error creando startup');
      }

      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.errors ? err.errors[0].message : err.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Registrar Nueva Startup</h2>
            <p className={styles.subtitle}>Ingresa los datos para postular a la incubadora</p>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Nombre de la Startup</label>
            <input 
              type="text" 
              className={styles.input}
              placeholder="Ej. EcoTech Solutions"
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label>Sector de la Industria</label>
            <select 
              className={styles.select}
              value={formData.sector} 
              onChange={e => setFormData({ ...formData, sector: e.target.value })}
              required
              disabled={loading}
            >
              <option value="CleanTech">CleanTech (Sostenibilidad)</option>
              <option value="HealthTech">HealthTech (Salud y Medicina)</option>
              <option value="FinTech">FinTech (Finanzas y Pagos)</option>
              <option value="EdTech">EdTech (Educación)</option>
              <option value="Logística">Logística & Supply Chain</option>
              <option value="IA">Inteligencia Artificial</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Valoración Objetivo (USD)</label>
            <input 
              type="number" 
              className={styles.input}
              min="1000" 
              max="100000000"
              step="10000"
              value={formData.valuationTarget} 
              onChange={e => setFormData({ ...formData, valuationTarget: Number(e.target.value) })}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label>Descripción y Propuesta de Valor (mínimo 20 caracteres)</label>
            <textarea 
              className={styles.textarea}
              placeholder="Describe qué problema resuelve tu proyecto y cuál es tu ventaja competitiva..."
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} disabled={loading} className="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Guardando...' : 'Crear Startup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
