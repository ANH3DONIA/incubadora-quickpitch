import crypto from 'crypto'

const BINANCE_PAY_API_KEY = process.env.BINANCE_PAY_API_KEY || ''
const BINANCE_PAY_SECRET_KEY = process.env.BINANCE_PAY_SECRET_KEY || ''
const BINANCE_PAY_BASE_URL = 'https://bpay.binanceapi.com'

export interface BinancePayOrderParams {
  merchantTradeNo: string
  totalFee: string
  currency: string
  description: string
}

/**
 * Genera la firma HMAC-SHA512 requerida por Binance Pay
 */
function generateSignature(timestamp: string, nonce: string, body: string): string {
  const payload = `${timestamp}\n${nonce}\n${body}\n`
  return crypto
    .createHmac('sha512', BINANCE_PAY_SECRET_KEY)
    .update(payload)
    .digest('hex')
    .toUpperCase()
}

/**
 * Genera un nonce aleatorio de 32 caracteres
 */
function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex')
}

/**
 * Crea una orden de pago en Binance Pay
 */
export async function createBinancePayOrder(params: BinancePayOrderParams) {
  const timestamp = Date.now().toString()
  const nonce = generateNonce()

  const body = JSON.stringify({
    env: { terminalType: 'WEB' },
    merchantTradeNo: params.merchantTradeNo,
    orderAmount: params.totalFee,
    currency: params.currency,
    description: params.description,
    goodsType: '02', // servicio virtual
  })

  const signature = generateSignature(timestamp, nonce, body)

  const response = await fetch(`${BINANCE_PAY_BASE_URL}/binancepay/openapi/v3/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'BinancePay-Timestamp': timestamp,
      'BinancePay-Nonce': nonce,
      'BinancePay-Certificate-SN': BINANCE_PAY_API_KEY,
      'BinancePay-Signature': signature,
    },
    body,
  })

  return response.json()
}

/**
 * Verifica la firma de un webhook de Binance Pay
 */
export function verifyBinanceWebhook(payload: string, signature: string): boolean {
  const computed = crypto
    .createHmac('sha512', BINANCE_PAY_SECRET_KEY)
    .update(payload)
    .digest('hex')
    .toUpperCase()
  return computed === signature
}
