'use client';

import { useState } from 'react';
import { BuyPassModal } from '@/components/financial/buy-pass-modal';
import Link from 'next/link';

export function InvestorClient() {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setIsBuyModalOpen(true)}
          className="btn btn-accent"
        >
          🎟️ Comprar Pase de Inversionista
        </button>
        <Link 
          href="#startups"
          className="btn btn-outline"
        >
          🔍 Explorar Startups Disponibles
        </Link>
      </div>

      <BuyPassModal isOpen={isBuyModalOpen} onClose={() => setIsBuyModalOpen(false)} />
    </>
  );
}
