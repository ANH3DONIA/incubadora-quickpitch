import { z } from 'zod';

/**
 * Esquema de validación para Registro de Usuarios
 */
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80, 'El nombre no puede exceder los 80 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  email: z
    .string()
    .trim()
    .email('Formato de correo electrónico inválido')
    .max(120, 'El correo no puede exceder los 120 caracteres')
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(72, 'La contraseña no puede exceder los 72 caracteres'), // Límite seguro de bcrypt
  role: z.enum(['ENTREPRENEUR', 'INVESTOR']),
});

/**
 * Esquema de validación para Creación de Startups
 */
export const startupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre de la startup debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z
    .string()
    .trim()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(1000, 'La descripción no puede exceder 1,000 caracteres'),
  sector: z
    .string()
    .trim()
    .min(2, 'El sector es requerido')
    .max(50, 'Sector no válido'),
  valuationTarget: z
    .number()
    .positive('La valoración debe ser un número positivo')
    .min(1000, 'La valoración mínima es de $1,000 USD')
    .max(100_000_000, 'La valoración máxima permitida es de $100,000,000 USD'), // Evita overflow
});

/**
 * Esquema de validación para Inversiones Financieras (Stripe / Binance Pay)
 */
export const investmentSchema = z.object({
  startupId: z.string().min(1, 'ID de startup requerido'),
  sessionId: z.string().min(1, 'ID de sesión requerido'),
  amount: z
    .number()
    .positive('El monto debe ser estrictamente mayor a 0')
    .min(10, 'El monto mínimo de micro-inversión es $10 USD/USDT')
    .max(500_000, 'El monto máximo por transacción en plataforma es $500,000 USD/USDT'),
  gateway: z.enum(['STRIPE', 'BINANCE_PAY']),
  currency: z.enum(['USD', 'USDT', 'BTC', 'EUR']),
});

/**
 * Esquema de validación para Agendamiento de Quick Pitch
 */
export const pitchSessionSchema = z.object({
  startupId: z.string().min(1, 'ID de startup requerido'),
  scheduledStart: z
    .string()
    .datetime('Formato de fecha y hora ISO inválido')
    .refine((dateStr) => new Date(dateStr) > new Date(), {
      message: 'La sesión no puede agendarse en el pasado',
    }),
  timerDurationSeconds: z
    .number()
    .int('La duración debe ser en segundos enteros')
    .min(60, 'El tiempo mínimo de pitch es 60 segundos (1 min)')
    .max(600, 'El tiempo máximo de pitch es 600 segundos (10 min)')
    .default(180),
});
