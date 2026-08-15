'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { startupSchema } from '@/lib/validations';

interface CreateStartupModalProps {
  onClose: () => void;
}

export function CreateStartupModal({ onClose }: CreateStartupModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    valuationTarget: 1000,
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
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px', color: 'black' }}>
        <h2 style={{ marginTop: 0 }}>Crear Startup</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label>Nombre de Startup</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} 
            />
          </div>
          <div>
            <label>Sector</label>
            <select 
              value={formData.sector} 
              onChange={e => setFormData({ ...formData, sector: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            >
              <option value="">Selecciona un sector</option>
              <option value="CleanTech">CleanTech</option>
              <option value="HealthTech">HealthTech</option>
              <option value="FinTech">FinTech</option>
              <option value="EdTech">EdTech</option>
              <option value="Logística">Logística</option>
              <option value="IA">IA</option>
            </select>
          </div>
          <div>
            <label>Valoración Objetivo (USD)</label>
            <input 
              type="number" 
              min="1000" 
              max="100000000"
              value={formData.valuationTarget} 
              onChange={e => setFormData({ ...formData, valuationTarget: Number(e.target.value) })}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} 
            />
          </div>
          <div>
            <label>Descripción</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', minHeight: '100px' }} 
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} disabled={loading} style={{ padding: '0.5rem 1rem' }}>Cancelar</button>
            <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem', backgroundColor: 'black', color: 'white' }}>
              {loading ? 'Guardando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
