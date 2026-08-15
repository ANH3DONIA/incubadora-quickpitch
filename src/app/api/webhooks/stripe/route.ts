import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createAuditedTransaction } from '@/services/audit-service'
import Stripe from 'stripe'

/**
 * Webhook de Stripe para procesar eventos de pago.
 * Verifica la firma del webhook y registra la transacción en el log auditable.
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Firma no proporcionada' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Error verificando webhook de Stripe:', err)
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
  }

  // Procesar el evento según su tipo
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      await createAuditedTransaction({
        userId: session.metadata?.userId || '',
        gateway: 'STRIPE',
        externalTransactionId: session.id,
        amount: (session.amount_total || 0) / 100,
        currency: (session.currency || 'usd').toUpperCase(),
        transactionType: session.metadata?.type === 'SUBSCRIPTION' ? 'SUBSCRIPTION' : 'TICKET',
        status: 'COMPLETED',
        metadata: { stripeSessionId: session.id },
      })
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error('Pago fallido:', paymentIntent.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
