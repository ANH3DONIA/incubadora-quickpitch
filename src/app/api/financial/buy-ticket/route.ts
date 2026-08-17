import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { createAuditedTransaction } from '@/services/audit-service';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json();
    const { passType, amount, gateway } = body;

    if (!['VIP_PASS', 'DEMO_DAY_PASS'].includes(passType)) {
      return NextResponse.json({ error: 'Tipo de pase inválido' }, { status: 400 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
    }

    const transaction = await createAuditedTransaction({
      userId,
      gateway: gateway as 'STRIPE' | 'BINANCE_PAY',
      amount,
      currency: 'USD',
      transactionType: 'TICKET',
      status: 'COMPLETED',
      metadata: { passType },
    });

    const ticket = await prisma.ticket.create({
      data: {
        userId,
        transactionId: transaction.id,
        eventName: passType,
      },
    });

    return NextResponse.json({
      success: true,
      ticket,
      transaction,
    });
  } catch (error) {
    console.error('Error al procesar compra de pase:', error);
    return NextResponse.json({ error: 'Error al procesar la compra' }, { status: 500 });
  }
}
