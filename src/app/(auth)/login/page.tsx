'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from './login.module.css';

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMsg('🎉 ¡Cuenta creada con éxito! Ingresa tus credenciales para continuar.');
    }
  }, [searchParams]);

  const handleSubmit = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    const loginEmail = (customEmail || email).trim().toLowerCase();
    const loginPassword = customPassword || password;

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
      });

      if (result?.error) {
        setError('Credenciales inválidas. Por favor verifica tu correo y contraseña.');
        setIsLoading(false);
      } else {
        // Redirección completa para asegurar que la sesión se hidrate limpiamente
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al iniciar sesión.');
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    handleSubmit(undefined, quickEmail, quickPass);
  };

  return (
    <div className={styles.container}>
      <div className={styles.brandingPanel}>
        <div className={styles.logoContainer}>
          <svg
            className={styles.logoIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          QuickPitch
        </div>

        <div className={styles.quoteContainer}>
          <blockquote className={styles.quote}>
            "El futuro pertenece a quienes creen en la belleza de sus sueños."
          </blockquote>
          <div className={styles.author}>— Eleanor Roosevelt</div>
        </div>

        <div className={styles.decorativeElement} />
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>Bienvenido de nuevo</h1>
            <p className={styles.subtitle}>
              Ingresa a tu cuenta para continuar en QuickPitch
            </p>
          </div>

          {successMsg && (
            <div style={{
              padding: '0.875rem 1rem',
              backgroundColor: 'hsl(var(--color-success) / 0.12)',
              color: 'hsl(142 71% 30%)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '1rem',
              border: '1px solid hsl(var(--color-success) / 0.3)',
            }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className="input-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@correo.com"
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-lg ${styles.submitButton}`}
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Accesos Rápidos de Prueba para Demostración */}
          <div style={{ marginTop: '1.75rem', borderTop: '1px solid hsl(var(--color-border))', paddingTop: '1.25rem' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'hsl(var(--color-text-secondary))', marginBottom: '0.75rem', textAlign: 'center' }}>
              ⚡ Cuentas de demostración (1 clic):
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('emprendedor@quickpitch.com', 'emp123')}
                disabled={isLoading}
                style={{
                  padding: '0.5rem 0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid hsl(var(--color-border))',
                  backgroundColor: 'hsl(var(--color-bg-alt))',
                  cursor: 'pointer',
                  color: 'hsl(var(--color-text))',
                }}
              >
                🚀 Emprendedor
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('inversionista@quickpitch.com', 'inv123')}
                disabled={isLoading}
                style={{
                  padding: '0.5rem 0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid hsl(var(--color-border))',
                  backgroundColor: 'hsl(var(--color-bg-alt))',
                  cursor: 'pointer',
                  color: 'hsl(var(--color-text))',
                }}
              >
                💼 Inversionista
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@quickpitch.com', 'admin123')}
                disabled={isLoading}
                style={{
                  padding: '0.5rem 0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid hsl(var(--color-border))',
                  backgroundColor: 'hsl(var(--color-bg-alt))',
                  cursor: 'pointer',
                  color: 'hsl(var(--color-text))',
                }}
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          <div className={styles.footer}>
            ¿No tienes cuenta?{' '}
            <Link href="/register" className={styles.link}>
              Crear una cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Cargando formulario...</div>}>
      <LoginForm />
    </Suspense>
  );
}
