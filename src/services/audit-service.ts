import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { TransactionGateway, TransactionType, TransactionStatus } from '@prisma/client';

const AUDIT_SECRET = process.env.AUTH_SECRET || 'default-audit-secret';

interface CreateTransactionParams {
  userId: string;
  gateway: TransactionGateway;
  externalTransactionId?: string;
  amount: number;
  currency: string;
  transactionType: TransactionType;
  status: TransactionStatus;
  metadata?: Record<string, unknown>;
}

/**
 * Normaliza los datos de una transacción para generar un payload determinista.
 */
function serializeTransactionData(data: {
  userId: string;
  gateway: string;
  amount: number;
  currency: string;
  type: string;
  timestamp: string;
}): string {
  return JSON.stringify({
    userId: data.userId,
    gateway: data.gateway,
    amount: data.amount.toFixed(2),
    currency: data.currency,
    type: data.type,
    timestamp: data.timestamp,
  });
}

/**
 * Genera un hash HMAC-SHA256 encadenado para auditoría.
 */
async function generateAuditHash(serializedData: string): Promise<string> {
  const lastTransaction = await prisma.financialTransaction.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { auditHash: true },
  });

  const previousHash = lastTransaction?.auditHash || '0';
  const payload = `${previousHash}:${serializedData}`;

  return crypto
    .createHmac('sha256', AUDIT_SECRET)
    .update(payload)
    .digest('hex');
}

/**
 * Registra una transacción financiera en el log auditable.
 */
export async function createAuditedTransaction(params: CreateTransactionParams) {
  const timestamp = new Date();
  const serializedData = serializeTransactionData({
    userId: params.userId,
    gateway: params.gateway,
    amount: params.amount,
    currency: params.currency,
    type: params.transactionType,
    timestamp: timestamp.toISOString(),
  });

  const auditHash = await generateAuditHash(serializedData);

  return prisma.financialTransaction.create({
    data: {
      userId: params.userId,
      gateway: params.gateway,
      externalTransactionId: params.externalTransactionId,
      amount: params.amount,
      currency: params.currency,
      transactionType: params.transactionType,
      status: params.status,
      auditHash,
      createdAt: timestamp,
      metadata: (params.metadata || {}) as Record<string, string | number | boolean>,
    },
  });
}

/**
 * Verifica la integridad matemática de toda la cadena de auditoría.
 */
export async function verifyAuditChain(): Promise<{ valid: boolean; brokenAt?: string }> {
  const transactions = await prisma.financialTransaction.findMany({
    orderBy: { createdAt: 'asc' },
  });

  let previousHash = '0';

  for (const tx of transactions) {
    const serializedData = serializeTransactionData({
      userId: tx.userId,
      gateway: tx.gateway,
      amount: Number(tx.amount),
      currency: tx.currency,
      type: tx.transactionType,
      timestamp: tx.createdAt.toISOString(),
    });

    const payload = `${previousHash}:${serializedData}`;
    const expectedHash = crypto
      .createHmac('sha256', AUDIT_SECRET)
      .update(payload)
      .digest('hex');

    // Si el hash almacenado no coincide exactamente, la cadena está alterada
    if (tx.auditHash && expectedHash !== tx.auditHash) {
      return { valid: false, brokenAt: tx.id };
    }

    previousHash = tx.auditHash || '0';
  }

  return { valid: true };
}
