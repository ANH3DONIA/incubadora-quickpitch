import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

/**
 * Obtiene la instancia de Stripe de forma lazy.
 * Solo lanza error cuando realmente se intenta usar sin la key configurada.
 */
export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY no está definida en las variables de entorno')
    }
    stripeInstance = new Stripe(key, {
      apiVersion: '2026-07-29.dahlia',
      typescript: true,
    })
  }
  return stripeInstance
}
