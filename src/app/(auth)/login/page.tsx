'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from './login.module.css';
import { 
  RocketIcon, 
  BriefcaseIcon, 
  ShieldIcon, 
  LightningIcon,
  CheckCircleIcon
} from '@/components/ui/icons';

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMsg('Cuenta creada con éxito. Ingresa tus credenciales para continuar.');
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
        setError('Credenciales inválidas. Verifica tu correo y contraseña.');
        setIsLoading(false);
      } else {
        // Redirección completa para hidratación inmediata de sesión en servidor
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
          <LightningIcon size={24} color="hsl(var(--color-amber))" />
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
            <h1 className={styles.title}>Iniciar Sesión</h1>
            <p className={styles.subtitle}>
              Accede a tu panel en la incubadora QuickPitch
            </p>
          </div>

          {successMsg && (
            <div style={{
              padding: '0.875rem 1rem',
              backgroundColor: 'hsl(var(--color-success) / 0.12)',
              color: 'hsl(142 71% 30%)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '1rem',
              border: '1px solid hsl(var(--color-success) / 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <CheckCircleIcon size={18} color="hsl(var(--color-success))" />
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
              {isLoading ? 'Iniciando sesión...' : 'Ingresar al Dashboard'}
            </button>
          </form>

          {/* Accesos Rápidos de Prueba para Demostración */}
          <div style={{ marginTop: '1.75rem', borderTop: '1px solid hsl(var(--color-border))', paddingTop: '1.25rem' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'hsl(var(--color-text-secondary))', marginBottom: '0.75rem', textAlign: 'center' }}>
              Cuentas de demostración rápida:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('emprendedor@quickpitch.com', 'emp123')}
                disabled={isLoading}
                style={{
                  padding: '0.625rem 0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid hsl(var(--color-border))',
                  backgroundColor: 'hsl(var(--color-bg-alt))',
                  cursor: 'pointer',
                  color: 'hsl(var(--color-text))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem',
                }}
              >
                <RocketIcon size={14} />
                Emprendedor
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('inversionista@quickpitch.com', 'inv123')}
                disabled={isLoading}
                style={{
                  padding: '0.625rem 0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid hsl(var(--color-border))',
                  backgroundColor: 'hsl(var(--color-bg-alt))',
                  cursor: 'pointer',
                  color: 'hsl(var(--color-text))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem',
                }}
              >
                <BriefcaseIcon size={14} />
                Inversionista
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@quickpitch.com', 'admin123')}
                disabled={isLoading}
                style={{
                  padding: '0.625rem 0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid hsl(var(--color-border))',
                  backgroundColor: 'hsl(var(--color-bg-alt))',
                  cursor: 'pointer',
                  color: 'hsl(var(--color-text))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem',
                }}
              >
                <ShieldIcon size={14} />
                Admin
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
