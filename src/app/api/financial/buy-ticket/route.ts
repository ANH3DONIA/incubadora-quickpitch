import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { passType, amount, gateway } = body;

    if (!['VIP_PASS', 'DEMO_DAY_PASS'].includes(passType)) {
      return NextResponse.json({ error: 'Tipo de pase inválido' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { role: 'INVESTOR' } });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const auditHash = crypto.createHmac('sha256', process.env.AUDIT_SECRET || 'secret').update(`${user.id}:${amount}:${Date.now()}`).digest('hex');

    const transaction = await prisma.financialTransaction.create({
      data: {
        userId: user.id,
        gateway: gateway as any,
        amount,
        transactionType: 'TICKET',
        status: 'COMPLETED',
        auditHash,
      },
    });

    const ticket = await prisma.ticket.create({
      data: {
        userId: user.id,
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
    return NextResponse.json({ error: 'Error al procesar la compra' }, { status: 400 });
  }
}
