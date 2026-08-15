import 'dotenv/config';
import { io } from 'socket.io-client';
import { prisma } from '../src/lib/prisma';
import { verifyAuditChain } from '../src/services/audit-service';
import { encryptBuffer, decryptBuffer } from '../src/lib/crypto';

const BASE_URL = 'http://localhost:3000';
const SOCKET_URL = 'http://localhost:3002';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function recordTest(suite: string, name: string, passed: boolean, details?: string) {
  results.push({ suite, name, passed, details });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${suite}] ${name}${details ? ` -> ${details}` : ''}`);
}

async function runAuthTests() {
  console.log('\n--- 1. PRUEBAS DE AUTENTICACIÓN Y VALIDACIONES ---');
  
  // 1.1 Registro válido
  const testEmail = `test.user.${Date.now()}@quickpitch.com`;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Usuario de Prueba',
        email: testEmail,
        password: 'password123',
        role: 'ENTREPRENEUR',
      }),
    });
    const data = await res.json();
    recordTest('AUTH', 'Registro con datos válidos (201 Created)', res.status === 201);
  } catch (err: any) {
    recordTest('AUTH', 'Registro con datos válidos', false, err.message);
  }

  // 1.2 Registro duplicado (debe fallar con 409)
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Usuario Duplicado',
        email: testEmail,
        password: 'password123',
        role: 'ENTREPRENEUR',
      }),
    });
    recordTest('AUTH', 'Rechazo de correo duplicado (409 Conflict)', res.status === 409);
  } catch (err: any) {
    recordTest('AUTH', 'Rechazo de correo duplicado', false, err.message);
  }

  // 1.3 Intento de profesor: Contraseña corta (<6 caracteres)
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Hacker',
        email: 'hacker@test.com',
        password: '123',
        role: 'ENTREPRENEUR',
      }),
    });
    recordTest('AUTH', 'Zod rechaza contraseña corta (<6 chars) con 400 Bad Request', res.status === 400);
  } catch (err: any) {
    recordTest('AUTH', 'Zod rechaza contraseña corta', false, err.message);
  }

  // 1.4 Intento de profesor: Rol inválido
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Invasor',
        email: 'invasor@test.com',
        password: 'password123',
        role: 'SUPER_ADMIN_HACK',
      }),
    });
    recordTest('AUTH', 'Zod rechaza rol no autorizado con 400 Bad Request', res.status === 400);
  } catch (err: any) {
    recordTest('AUTH', 'Zod rechaza rol no autorizado', false, err.message);
  }
}

async function runStartupTests() {
  console.log('\n--- 2. PRUEBAS DE STARTUPS Y LÍMITES DE DESBORDAMIENTO ---');

  // 2.1 Creación válida
  try {
    const res = await fetch(`${BASE_URL}/api/startups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'BioQuantum CleanTech',
        description: 'Biotecnología avanzada para la captura de carbono a escala industrial.',
        sector: 'CleanTech',
        valuationTarget: 2500000,
      }),
    });
    recordTest('STARTUPS', 'Crear startup con parámetros válidos (201 Created)', res.status === 201);
  } catch (err: any) {
    recordTest('STARTUPS', 'Crear startup con parámetros válidos', false, err.message);
  }

  // 2.2 Intento de profesor: Valoración absurda (9 mil millones / Overflow)
  try {
    const res = await fetch(`${BASE_URL}/api/startups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Overflow Startup',
        description: 'Descripción válida de más de veinte caracteres para pasar el filtro.',
        sector: 'FinTech',
        valuationTarget: 9_000_000_000, // Excede el máximo de 100M USD
      }),
    });
    recordTest('STARTUPS', 'Zod bloquea valoración de 9 mil millones (Overflow)', res.status === 400);
  } catch (err: any) {
    recordTest('STARTUPS', 'Zod bloquea valoración excesiva', false, err.message);
  }

  // 2.3 Intento de profesor: Valoración negativa
  try {
    const res = await fetch(`${BASE_URL}/api/startups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Negative Startup',
        description: 'Descripción válida de más de veinte caracteres para pasar el filtro.',
        sector: 'FinTech',
        valuationTarget: -50000,
      }),
    });
    recordTest('STARTUPS', 'Zod bloquea valoración negativa (-$50k)', res.status === 400);
  } catch (err: any) {
    recordTest('STARTUPS', 'Zod bloquea valoración negativa', false, err.message);
  }
}

async function runFinancialAndAuditTests() {
  console.log('\n--- 3. PRUEBAS DE MOTOR FINANCIERO Y AUDITORÍA INMUTABLE ---');

  // 3.1 Inversión válida en USD vía Stripe
  try {
    const res = await fetch(`${BASE_URL}/api/financial/invest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startupId: 'startup-test-1',
        sessionId: 'session-test-1',
        amount: 2500,
        gateway: 'STRIPE',
        currency: 'USD',
      }),
    });
    const data = await res.json();
    const hasAuditHash = !!data.transaction?.auditHash;
    recordTest('FINANCE', 'Procesar inversión Stripe y generar hash HMAC-SHA256', res.status === 200 && hasAuditHash);
  } catch (err: any) {
    recordTest('FINANCE', 'Procesar inversión Stripe', false, err.message);
  }

  // 3.2 Inversión válida en USDT vía Binance Pay
  try {
    const res = await fetch(`${BASE_URL}/api/financial/invest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startupId: 'startup-test-2',
        sessionId: 'session-test-2',
        amount: 5000,
        gateway: 'BINANCE_PAY',
        currency: 'USDT',
      }),
    });
    const data = await res.json();
    const hasAuditHash = !!data.transaction?.auditHash;
    recordTest('FINANCE', 'Procesar micro-inversión Binance Pay (USDT) con hash auditable', res.status === 200 && hasAuditHash);
  } catch (err: any) {
    recordTest('FINANCE', 'Procesar micro-inversión Binance Pay', false, err.message);
  }

  // 3.3 Intento de profesor: Invertir $0 o números negativos
  try {
    const res = await fetch(`${BASE_URL}/api/financial/invest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startupId: 'startup-test-1',
        sessionId: 'session-test-1',
        amount: -100,
        gateway: 'STRIPE',
        currency: 'USD',
      }),
    });
    recordTest('FINANCE', 'Zod bloquea inversión negativa (-$100)', res.status === 400);
  } catch (err: any) {
    recordTest('FINANCE', 'Zod bloquea inversión negativa', false, err.message);
  }

  // 3.4 Verificación de integridad matemática en la cadena de auditoría
  try {
    const auditCheck = await verifyAuditChain();
    recordTest('AUDIT_CHAIN', 'Verificación matemática de la cadena HMAC (Inmutabilidad)', auditCheck.valid);
  } catch (err: any) {
    recordTest('AUDIT_CHAIN', 'Verificación matemática de la cadena HMAC', false, err.message);
  }
}

async function runCryptoEncryptionTests() {
  console.log('\n--- 4. PRUEBAS DE CIFRADO AES-256-GCM EN PITCH DECKS ---');

  try {
    const samplePdfContent = Buffer.from('%PDF-1.4 Fake PDF Content for QuickPitch Encrypted Deck Test...');
    
    // Cifrar
    const encrypted = encryptBuffer(samplePdfContent);
    const hasIvAndTag = !!encrypted.iv && !!encrypted.authTag && !!encrypted.data;
    
    // Descifrar
    const decrypted = decryptBuffer(encrypted);
    const matchesOriginal = decrypted.equals(samplePdfContent);

    recordTest('ENCRYPTION', 'Cifrado y descifrado simétrico AES-256-GCM sin pérdida de datos', hasIvAndTag && matchesOriginal);
  } catch (err: any) {
    recordTest('ENCRYPTION', 'Cifrado y descifrado simétrico AES-256-GCM', false, err.message);
  }
}

async function runWebSocketRealTimeTests(): Promise<void> {
  console.log('\n--- 5. PRUEBAS DE WEBSOCKETS, CRONÓMETRO Y MULTI-USUARIO ---');

  return new Promise((resolve) => {
    const testSessionId = `test-room-${Date.now()}`;
    const clientEntrepreneur = io(SOCKET_URL, { transports: ['websocket'] });
    const clientInvestor = io(SOCKET_URL, { transports: ['websocket'] });

    let ticksReceived = 0;
    let timerExpiredReceived = false;
    let investmentAlertReceived = false;

    clientEntrepreneur.on('connect', () => {
      clientEntrepreneur.emit('join_room', {
        sessionId: testSessionId,
        userId: 'user-emp-1',
        name: 'Emprendedor Test',
        role: 'ENTREPRENEUR',
      });
    });

    clientInvestor.on('connect', () => {
      clientInvestor.emit('join_room', {
        sessionId: testSessionId,
        userId: 'user-inv-1',
        name: 'Inversionista Test',
        role: 'INVESTOR',
      });

      // Iniciar pitch de prueba de 2 segundos para test rápido
      setTimeout(() => {
        clientEntrepreneur.emit('start_pitch', {
          sessionId: testSessionId,
          durationSeconds: 2,
        });
      }, 500);
    });

    clientInvestor.on('timer_tick', (data) => {
      ticksReceived++;
    });

    clientInvestor.on('timer_expired', () => {
      timerExpiredReceived = true;
      // Inversionista envía micro-inversión
      clientInvestor.emit('send_investment', {
        sessionId: testSessionId,
        amount: 1000,
        currency: 'USDT',
        gateway: 'BINANCE_PAY',
        investorName: 'Inversionista Test',
      });
    });

    clientEntrepreneur.on('investment_received', (data) => {
      investmentAlertReceived = true;
      
      // Concluir pruebas de sockets
      recordTest('WEBSOCKETS', 'Sincronización de cronómetro en tiempo real (ticks de servidor)', ticksReceived > 0);
      recordTest('WEBSOCKETS', 'Emisión estricta de timer_expired al llegar a 00:00', timerExpiredReceived);
      recordTest('WEBSOCKETS', 'Transmisión de alerta de inversión en tiempo real entre participantes', investmentAlertReceived);

      clientEntrepreneur.disconnect();
      clientInvestor.disconnect();
      resolve();
    });

    // Timeout de seguridad por si no responde
    setTimeout(() => {
      if (!investmentAlertReceived) {
        recordTest('WEBSOCKETS', 'Prueba de WebSockets (Timeout)', false, 'Tiempo de espera agotado');
        clientEntrepreneur.disconnect();
        clientInvestor.disconnect();
        resolve();
      }
    }, 6000);
  });
}

async function main() {
  console.log('🚀 INICIANDO BATERÍA COMPLETA DE PRUEBAS AUTOMATIZADAS...');
  const startTime = Date.now();

  await runAuthTests();
  await runStartupTests();
  await runFinancialAndAuditTests();
  await runCryptoEncryptionTests();
  await runWebSocketRealTimeTests();

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log('\n========================================');
  console.log(`📊 REPORTE FINAL: ${passed}/${total} PRUEBAS SUPERADAS (${totalTime}s)`);
  if (failed === 0) {
    console.log('🎉 ¡EL SISTEMA ESTÁ 100% BLINDADO Y SIN ERRORES!');
  } else {
    console.log(`⚠️ ${failed} prueba(s) fallaron.`);
  }
  console.log('========================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Error fatal en runner:', err);
  process.exit(1);
});
