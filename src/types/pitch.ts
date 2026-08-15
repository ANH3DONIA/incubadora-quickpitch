/**
 * Estados posibles del cronómetro del Quick Pitch
 */
export type TimerState = 'IDLE' | 'RUNNING' | 'PAUSED' | 'EXPIRED'

/**
 * Evento emitido por el servidor WebSocket para el cronómetro
 */
export interface TimerEvent {
  type: 'TIMER_START' | 'TIMER_TICK' | 'TIMER_EXPIRED' | 'TIMER_PAUSE'
  remainingSeconds: number
  totalSeconds: number
  sessionId: string
}

/**
 * Evento de estado de la sala de pitch
 */
export interface PitchRoomEvent {
  type: 'USER_JOINED' | 'USER_LEFT' | 'PITCH_STARTED' | 'PITCH_ENDED' | 'INVESTMENT_RECEIVED'
  userId: string
  userName: string
  sessionId: string
  data?: Record<string, unknown>
}

/**
 * Datos del resumen ejecutivo mostrado en la sala de espera
 */
export interface StartupSummary {
  id: string
  name: string
  sector: string
  description: string
  valuationTarget: number
  ownerName: string
  deckUrl?: string
}

/**
 * Parámetros para iniciar una micro-inversión
 */
export interface InvestmentParams {
  sessionId: string
  startupId: string
  amount: number
  currency: 'USD' | 'USDT' | 'BTC'
  gateway: 'STRIPE' | 'BINANCE_PAY'
}
