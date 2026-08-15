'use client';

import { useState } from 'react';

interface BuyPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuyPassModal({ isOpen, onClose }: BuyPassModalProps) {
  const [passType, setPassType] = useState('DEMO_DAY_PASS');
  const [gateway, setGateway] = useState('STRIPE');
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = passType === 'VIP_PASS' ? 199 : 49;
    const res = await fetch('/api/financial/buy-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passType, amount, gateway }),
    });
    const data = await res.json();
    if (data.success) {
      setResult(data);
    }
  };

  return (
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content" style={contentStyle}>
        <h2>Comprar Pase de Inversionista</h2>
        {!result ? (
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={fieldStyle}>
              <label>Tipo de Pase</label>
              <select value={passType} onChange={(e) => setPassType(e.target.value)} required style={inputStyle}>
                <option value="DEMO_DAY_PASS">Demo Day Pass ($49 USD)</option>
                <option value="VIP_PASS">Investor VIP Access ($199 USD)</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <label>Método de Pago</label>
              <select value={gateway} onChange={(e) => setGateway(e.target.value)} required style={inputStyle}>
                <option value="STRIPE">Stripe (Tarjeta de Crédito)</option>
                <option value="BINANCE_PAY">Binance Pay (Cripto)</option>
              </select>
            </div>
            <div style={actionsStyle}>
              <button type="submit" className="btn btn-primary" style={{ ...btnStyle, backgroundColor: '#2563eb', color: 'white' }}>Pagar Ahora</button>
              <button type="button" onClick={onClose} className="btn" style={btnStyle}>Cancelar</button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h3>¡Pago Exitoso!</h3>
            <p>Se ha generado tu ticket ({result.ticket.eventName}).</p>
            <button onClick={onClose} className="btn" style={{ marginTop: '2rem', ...btnStyle }}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const contentStyle: React.CSSProperties = {
  backgroundColor: 'hsl(var(--color-bg-elevated))',
  padding: '2rem',
  borderRadius: '8px',
  border: '1px solid hsl(var(--color-border))',
  width: '100%',
  maxWidth: '500px',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: '1.5rem',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const inputStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderRadius: '4px',
  border: '1px solid hsl(var(--color-border))',
  backgroundColor: 'hsl(var(--color-bg-base))',
  color: 'hsl(var(--color-text-primary))',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',
  justifyContent: 'flex-end',
};

const btnStyle: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  cursor: 'pointer',
  border: '1px solid hsl(var(--color-border))',
  background: 'hsl(var(--color-bg-base))',
  color: 'hsl(var(--color-text-primary))',
  textDecoration: 'none',
};
