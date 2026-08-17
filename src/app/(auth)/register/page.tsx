'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './register.module.css';
import { RocketIcon, BriefcaseIcon, LightningIcon } from '@/components/ui/icons';

type Role = 'emprendedor' | 'inversionista' | null;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'founder' || roleParam === 'entrepreneur') {
      setRole('emprendedor');
    } else if (roleParam === 'investor') {
      setRole('inversionista');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!role) {
      setError('Por favor selecciona si eres Emprendedor o Inversionista.');
      return;
    }

    setIsLoading(true);

    try {
      const dbRole = role === 'emprendedor' ? 'ENTREPRENEUR' : 'INVESTOR';
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          password, 
          role: dbRole 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ocurrió un error al crear la cuenta.');
        setIsLoading(false);
        return;
      }

      router.push('/login?registered=true');
    } catch (err) {
      setError('Ocurrió un error de red al crear la cuenta.');
      setIsLoading(false);
    }
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
            "Cada gran empresa comenzó como una idea audaz y una primera conversación."
          </blockquote>
        </div>

        <div className={styles.decorativeElement} />
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>Crear una cuenta</h1>
            <p className={styles.subtitle}>
              Únete a la incubadora QuickPitch
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className="input-group">
              <label htmlFor="name">Nombre Completo</label>
              <input
                id="name"
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Carlos Mendoza"
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="carlos@mitarug.com"
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label>Perfil en la Plataforma</label>
              <div className={styles.roleSelector}>
                <div
                  className={`${styles.roleCard} ${
                    role === 'emprendedor' ? styles.roleCardSelected : ''
                  }`}
                  onClick={() => setRole('emprendedor')}
                >
                  <RocketIcon size={24} color={role === 'emprendedor' ? 'hsl(var(--color-amber))' : 'currentColor'} />
                  <span className={styles.roleTitle}>Emprendedor</span>
                  <span className={styles.roleDescription}>
                    Presentar mi startup y buscar inversión
                  </span>
                </div>

                <div
                  className={`${styles.roleCard} ${
                    role === 'inversionista' ? styles.roleCardSelected : ''
                  }`}
                  onClick={() => setRole('inversionista')}
                >
                  <BriefcaseIcon size={24} color={role === 'inversionista' ? 'hsl(var(--color-amber))' : 'currentColor'} />
                  <span className={styles.roleTitle}>Inversionista</span>
                  <span className={styles.roleDescription}>
                    Descubrir proyectos y realizar inversiones
                  </span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña (mínimo 6 caracteres)</label>
              <input
                id="password"
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-accent btn-lg ${styles.submitButton}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className={styles.footer}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className={styles.link}>
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Cargando formulario...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
