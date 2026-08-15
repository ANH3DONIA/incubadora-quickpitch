'use client';

import React, { useState } from 'react';

interface InvestmentModalProps {
  startupId: string;
  sessionId: string;
  startupName: string;
  onClose: () => void;
  onInvestmentSuccess: (tx: any) => void;
}

export function InvestmentModal({
  startupId,
  sessionId,
  startupName,
  onClose,
  onInvestmentSuccess,
}: InvestmentModalProps) {
  const [amount, setAmount] = useState<number>(1000);
  const [gateway, setGateway] = useState<'STRIPE' | 'BINANCE_PAY'>('STRIPE');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedTx, setCompletedTx] = useState<any | null>(null);

  const presetAmounts = [250, 500, 1000, 2500, 5000];

  const handleInvest = async () => {
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/financial/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId,
          sessionId,
          amount: Number(amount),
          gateway,
          currency: gateway === 'STRIPE' ? 'USD' : 'USDT',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'No se pudo procesar la inversión.');
        return;
      }

      setCompletedTx(data.transaction);
      onInvestmentSuccess(data.transaction);
    } catch (err) {
      setError('Ocurrió un error inesperado al procesar el pago.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem',
    }}>
      <div style={{
        backgroundColor: 'hsl(var(--color-surface))',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '520px',
        width: '100%',
        padding: '2rem',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid hsl(var(--color-border))',
      }}>
        {completedTx ? (
          /* Vista de Confirmación con Auditoría */
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(var(--color-navy))' }}>
              ¡Micro-Inversión Confirmada!
            </h2>
            <p style={{ color: 'hsl(var(--color-text-secondary))', fontSize: '0.9375rem' }}>
              Tu aporte de <strong>${completedTx.amount.toLocaleString()} {completedTx.currency}</strong> a <strong>{startupName}</strong> ha sido procesado mediante <strong>{completedTx.gateway}</strong>.
            </p>

            <div style={{
              backgroundColor: 'hsl(var(--color-bg-alt))',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
              fontSize: '0.8rem',
              border: '1px solid hsl(var(--color-border))',
            }}>
              <p style={{ color: 'hsl(var(--color-text-muted))', marginBottom: '4px' }}>HASH DE AUDITORÍA (INMUTABLE):</p>
              <code style={{ wordBreak: 'break-all', color: 'hsl(var(--color-navy))', fontWeight: 600 }}>
                {completedTx.auditHash || 'Generado'}
              </code>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              Cerrar y Volver al Dashboard
            </button>
          </div>
        ) : (
          /* Formulario de Decisión e Inversión */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>Fase de Decisión</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(var(--color-navy))' }}>
                ¿Deseas invertir en {startupName}?
              </h2>
              <p style={{ color: 'hsl(var(--color-text-secondary))', fontSize: '0.875rem', marginTop: '4px' }}>
                El tiempo de pitch ha concluido. Puedes formalizar una micro-inversión al instante.
              </p>
            </div>

            {error && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'hsl(var(--color-error) / 0.1)',
                color: 'hsl(var(--color-error))',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            {/* Selección de Pasarela Dual */}
            <div className="input-group">
              <label>Selecciona la Pasarela de Pago</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div
                  onClick={() => setGateway('STRIPE')}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: gateway === 'STRIPE' ? '2px solid hsl(var(--color-navy))' : '1.5px solid hsl(var(--color-border))',
                    backgroundColor: gateway === 'STRIPE' ? 'hsl(var(--color-navy) / 0.04)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'hsl(var(--color-navy))' }}>💳 Stripe Checkout</div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--color-text-muted))', marginTop: '2px' }}>Tarjeta de Crédito (USD)</div>
                </div>

                <div
                  onClick={() => setGateway('BINANCE_PAY')}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: gateway === 'BINANCE_PAY' ? '2px solid hsl(var(--color-amber))' : '1.5px solid hsl(var(--color-border))',
                    backgroundColor: gateway === 'BINANCE_PAY' ? 'hsl(var(--color-amber-subtle) / 0.4)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'hsl(var(--color-navy))' }}>🟡 Binance Pay</div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--color-text-muted))', marginTop: '2px' }}>Criptoactivos (USDT)</div>
                </div>
              </div>
            </div>

            {/* Monto de Inversión */}
            <div className="input-group">
              <label>Monto de Micro-Inversión ({gateway === 'STRIPE' ? 'USD' : 'USDT'})</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`btn btn-sm ${amount === preset ? 'btn-primary' : 'btn-outline'}`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={10}
                max={500000}
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="input-field"
                placeholder="Ingresa un monto personalizado"
                disabled={isLoading}
              />
            </div>

            {/* Botones de Acción */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
                style={{ flex: 1 }}
                disabled={isLoading}
              >
                Pasar / No Invertir
              </button>
              <button
                type="button"
                onClick={handleInvest}
                className="btn btn-accent btn-lg"
                style={{ flex: 2 }}
                disabled={isLoading || amount < 10}
              >
                {isLoading ? 'Procesando...' : `Confirmar Inversión ($${amount.toLocaleString()})`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
