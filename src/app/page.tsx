import Link from 'next/link';
import Navbar from '@/components/navbar';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className={`${styles.hero} section`}>
          <div className="container">
            <div className={styles.heroContent}>
              <h1 className={`${styles.heroTitle} animate-fade-in-up delay-1`}>
                Conecta tu startup con inversionistas en minutos
              </h1>
              <p className={`${styles.heroSubtitle} animate-fade-in-up delay-2`}>
                Presenta tu proyecto en sesiones de 3 minutos con cronómetro en vivo. Recibe micro-inversiones al instante — en dólares o criptomonedas.
              </p>
              <div className={`${styles.heroActions} animate-fade-in-up delay-3`}>
                <Link href="/register?role=founder" className="btn btn-accent btn-lg">
                  Soy Emprendedor
                </Link>
                <Link href="/register?role=investor" className="btn btn-outline btn-lg">
                  Soy Inversionista
                </Link>
              </div>
              <div className={`${styles.heroStats} animate-fade-in-up delay-4`}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>500+</span>
                  <span className={styles.statLabel}>Startups</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>$2.3M</span>
                  <span className={styles.statLabel}>Invertidos</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>1,200+</span>
                  <span className={styles.statLabel}>Pitches</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="como-funciona" className="section">
          <div className="container">
            <h2 className={styles.sectionTitle}>Cómo Funciona</h2>
            <div className={styles.steps}>
              {/* Step 1 */}
              <div className={`${styles.stepCard} animate-fade-in-up delay-1`}>
                <div className={styles.stepHeader}>
                  <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span className="badge-amber">01</span>
                </div>
                <h3 className={styles.stepTitle}>Sube tu Pitch Deck</h3>
                <p className={styles.stepDesc}>
                  Crea tu perfil, agrega tu startup y sube tu presentación cifrada de forma segura.
                </p>
              </div>

              {/* Step 2 */}
              <div className={`${styles.stepCard} animate-fade-in-up delay-2`}>
                <div className={styles.stepHeader}>
                  <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                  <span className="badge-amber">02</span>
                </div>
                <h3 className={styles.stepTitle}>Presenta en 3 Minutos</h3>
                <p className={styles.stepDesc}>
                  Entra a una sala de video en vivo con cronómetro estricto. Sin rodeos, directo al punto.
                </p>
              </div>

              {/* Step 3 */}
              <div className={`${styles.stepCard} animate-fade-in-up delay-3`}>
                <div className={styles.stepHeader}>
                  <svg className={styles.stepIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  <span className="badge-amber">03</span>
                </div>
                <h3 className={styles.stepTitle}>Recibe Inversión</h3>
                <p className={styles.stepDesc}>
                  El inversionista decide al instante. Pago con Stripe o criptomonedas vía Binance Pay.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="caracteristicas" className="section" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Todo lo que necesitas para lanzar tu startup</h2>
            <div className={styles.featuresGrid}>
              
              {/* Feature 1 */}
              <div className={styles.featureCard}>
                <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <h3 className={styles.featureTitle}>Salas de Video WebRTC</h3>
                <p className={styles.featureDesc}>
                  Videoconferencia en tiempo real con audio y video HD. Cronómetro centralizado que mantiene la disciplina.
                </p>
              </div>

              {/* Feature 2 */}
              <div className={styles.featureCard}>
                <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
                <h3 className={styles.featureTitle}>Pagos Duales</h3>
                <p className={styles.featureDesc}>
                  Acepta inversiones en USD vía Stripe o en criptomonedas vía Binance Pay. Tú eliges.
                </p>
              </div>

              {/* Feature 3 */}
              <div className={styles.featureCard}>
                <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0110 0v4"></path>
                </svg>
                <h3 className={styles.featureTitle}>Seguridad Total</h3>
                <p className={styles.featureDesc}>
                  Tus presentaciones cifradas con AES-256. Control de acceso por roles y auditoría de cada transacción.
                </p>
              </div>

              {/* Feature 4 */}
              <div className={styles.featureCard}>
                <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <h3 className={styles.featureTitle}>Agenda Inteligente</h3>
                <p className={styles.featureDesc}>
                  Sincroniza automáticamente con Google Calendar. Nunca te pierdas una sesión de pitch.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className="container">
            <h2 className={styles.ctaTitle}>¿Listo para hacer tu Quick Pitch?</h2>
            <p className={styles.ctaSubtitle}>
              Únete a cientos de emprendedores que ya están conectando con inversionistas
            </p>
            <Link href="/register" className="btn btn-accent btn-lg">
              Crear Cuenta Gratis
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div>
              <Link href="/" className={styles.footerLogo}>
                <svg className={styles.logoIcon} style={{color: 'var(--color-amber)', width: '20px', height: '20px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" stroke="none" />
                </svg>
                QuickPitch
              </Link>
              <p className={styles.copyright}>© 2026 QuickPitch. Todos los derechos reservados.</p>
            </div>
            <div className={styles.footerLinks}>
              <Link href="/terminos" className={styles.footerLink}>
                Términos
              </Link>
              <Link href="/privacidad" className={styles.footerLink}>
                Privacidad
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
