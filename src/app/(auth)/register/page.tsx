'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';

type Role = 'emprendedor' | 'inversionista' | null;

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      setError('Por favor selecciona un rol.');
      return;
    }

    setIsLoading(true);

    try {
      const dbRole = role === 'emprendedor' ? 'ENTREPRENEUR' : 'INVESTOR';
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: dbRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ocurrió un error al crear la cuenta.');
        return;
      }

      router.push('/login?registered=true');
    } catch (err) {
      setError('Ocurrió un error inesperado al crear la cuenta.');
    } finally {
      setIsLoading(false);
    }
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
            "Cada gran empresa comenzó como una idea y un paso de fe."
          </blockquote>
        </div>

        <div className={styles.decorativeElement} />
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>Crear una cuenta</h1>
            <p className={styles.subtitle}>
              Únete a QuickPitch y comienza tu viaje
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
                placeholder="Juan Pérez"
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
                placeholder="tu@correo.com"
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label>Rol</label>
              <div className={styles.roleSelector}>
                <div
                  className={`${styles.roleCard} ${
                    role === 'emprendedor' ? styles.roleCardSelected : ''
                  }`}
                  onClick={() => setRole('emprendedor')}
                >
                  <svg
                    className={styles.roleIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.5-.5a5.4 5.4 0 0 0 1-1.5c1.6-1.6 2.5-3.5 2.5-5.5v-1l-1-1h-1c-2 0-3.9.9-5.5 2.5a5.4 5.4 0 0 0-1.5 1l-.5.5Z" />
                    <path d="m12 15 3.5 3.5" />
                    <path d="M15 12h-3" />
                    <path d="M12 9V6" />
                    <path d="M15 15v3" />
                  </svg>
                  <span className={styles.roleTitle}>Emprendedor</span>
                  <span className={styles.roleDescription}>
                    Quiero presentar mi startup y buscar inversión
                  </span>
                </div>

                <div
                  className={`${styles.roleCard} ${
                    role === 'inversionista' ? styles.roleCardSelected : ''
                  }`}
                  onClick={() => setRole('inversionista')}
                >
                  <svg
                    className={styles.roleIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" x2="12" y1="2" y2="22" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <span className={styles.roleTitle}>Inversionista</span>
                  <span className={styles.roleDescription}>
                    Quiero descubrir startups y realizar inversiones
                  </span>
                </div>
              </div>
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
