'use client';

import { useState } from 'react';
import { BuyPassModal } from '@/components/financial/buy-pass-modal';
import Link from 'next/link';
import { TicketIcon, RocketIcon } from '@/components/ui/icons';

export function InvestorClient() {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          type="button"
          onClick={() => setIsBuyModalOpen(true)}
          className="btn btn-accent"
        >
          <TicketIcon size={18} />
          Comprar Pase de Inversionista
        </button>
        <Link 
          href="#startups"
          className="btn btn-outline"
        >
          <RocketIcon size={18} />
          Explorar Startups Disponibles
        </Link>
      </div>

      <BuyPassModal isOpen={isBuyModalOpen} onClose={() => setIsBuyModalOpen(false)} />
    </>
  );
}
