'use client';

import { useState } from 'react';
import styles from '@/components/ui/modal.module.css';

interface BuyPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuyPassModal({ isOpen, onClose }: BuyPassModalProps) {
  const [passType, setPassType] = useState('DEMO_DAY_PASS');
  const [gateway, setGateway] = useState<'STRIPE' | 'BINANCE_PAY'>('STRIPE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const amount = passType === 'VIP_PASS' ? 199 : 49;

    try {
      const res = await fetch('/api/financial/buy-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passType, amount, gateway }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el pase');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error en la compra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Pase de Inversionista</h2>
            <p className={styles.subtitle}>Acceso a sesiones exclusivas y Demo Days</p>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {!result ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Selecciona el Nivel de Acceso</label>
              <select 
                value={passType} 
                onChange={(e) => setPassType(e.target.value)} 
                required 
                className={styles.select}
                disabled={loading}
              >
                <option value="DEMO_DAY_PASS">Demo Day Pass — $49 USD (Acceso General)</option>
                <option value="VIP_PASS">Investor VIP Access — $199 USD (Acceso Total + Pitch Decks)</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Método de Pago</label>
              <select 
                value={gateway} 
                onChange={(e) => setGateway(e.target.value as any)} 
                required 
                className={styles.select}
                disabled={loading}
              >
                <option value="STRIPE">💳 Stripe (Tarjeta de Crédito / Débito en USD)</option>
                <option value="BINANCE_PAY">🟡 Binance Pay (Cripto USDT)</option>
              </select>
            </div>

            <div className={styles.actions}>
              <button type="button" onClick={onClose} disabled={loading} className="btn btn-outline">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="btn btn-accent btn-lg">
                {loading ? 'Procesando...' : `Adquirir Pase (${passType === 'VIP_PASS' ? '$199' : '$49'} USD)`}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ¡Pase Adquirido Exitosamente!
            </h3>
            <p style={{ color: 'hsl(var(--color-text-secondary))', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Tu ticket para <strong>{result.ticket.eventName}</strong> está activo y registrado con hash auditable.
            </p>

            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-primary" 
              style={{ width: '100%' }}
            >
              Continuar al Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
