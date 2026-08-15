import { NextRequest, NextResponse } from 'next/server'
import { verifyBinanceWebhook } from '@/lib/binance'
import { createAuditedTransaction } from '@/services/audit-service'

/**
 * Webhook de Binance Pay para procesar confirmaciones de pago cripto.
 * Verifica la firma HMAC y registra la transacción en el log auditable.
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('binancepay-signature') || ''

  // Verificar firma del webhook
  if (!verifyBinanceWebhook(body, signature)) {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
  }

  const payload = JSON.parse(body)

  if (payload.bizStatus === 'PAY_SUCCESS') {
    await createAuditedTransaction({
      userId: payload.data?.merchantTradeNo?.split('-')[0] || '',
      gateway: 'BINANCE_PAY',
      externalTransactionId: payload.data?.transactionId,
      amount: parseFloat(payload.data?.totalFee || '0'),
      currency: payload.data?.currency || 'USDT',
      transactionType: 'MICRO_INVESTMENT',
      status: 'COMPLETED',
      metadata: { binanceOrderId: payload.data?.prepayId },
    })
  }

  return NextResponse.json({ returnCode: 'SUCCESS', returnMessage: null })
}
