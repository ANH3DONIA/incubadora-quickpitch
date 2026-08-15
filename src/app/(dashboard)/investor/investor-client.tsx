'use client';

import { useState } from 'react';
import { BuyPassModal } from '@/components/financial/buy-pass-modal';
import Link from 'next/link';

export function InvestorClient() {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setIsBuyModalOpen(true)}
          style={{ padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#10b981', color: 'white', border: 'none', fontWeight: 'bold' }}
        >
          Comprar Pase de Inversionista
        </button>
        <Link 
          href="#startups"
          style={{ padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
        >
          Explorar Startups
        </Link>
      </div>

      <BuyPassModal isOpen={isBuyModalOpen} onClose={() => setIsBuyModalOpen(false)} />
    </>
  );
}
