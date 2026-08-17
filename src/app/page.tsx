import Link from 'next/link';
import Navbar from '@/components/navbar';
import styles from './page.module.css';
import { 
  RocketIcon, 
  BriefcaseIcon, 
  ClockIcon, 
  CreditCardIcon, 
  LockIcon, 
  CalendarIcon, 
  VideoIcon, 
  ShieldIcon, 
  ArrowRightIcon,
  CheckCircleIcon,
  LightningIcon
} from '@/components/ui/icons';

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className={`${styles.hero} section`}>
          <div className="container">
            <div className={styles.heroContent}>
              <div className="badge badge-amber" style={{ marginBottom: '1rem' }}>
                Incubadora & Matchmaking en Tiempo Real
              </div>
              <h1 className={`${styles.heroTitle} animate-fade-in-up delay-1`}>
                Presenta tu startup en 3 minutos y levanta capital
              </h1>
              <p className={`${styles.heroSubtitle} animate-fade-in-up delay-2`}>
                Conectamos fundadores e inversionistas en salas de pitch en vivo con cronómetro estricto. Recibe compromisos de micro-inversión al instante con trazabilidad inmutable.
              </p>
              <div className={`${styles.heroActions} animate-fade-in-up delay-3`}>
                <Link href="/register?role=founder" className="btn btn-accent btn-lg">
                  <RocketIcon size={20} />
                  Soy Emprendedor
                </Link>
                <Link href="/register?role=investor" className="btn btn-outline btn-lg">
                  <BriefcaseIcon size={20} />
                  Soy Inversionista
                </Link>
              </div>
              <div className={`${styles.heroStats} animate-fade-in-up delay-4`}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>180s</span>
                  <span className={styles.statLabel}>Duración de Pitch</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>Dual</span>
                  <span className={styles.statLabel}>Stripe & Binance Pay</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>AES-256</span>
                  <span className={styles.statLabel}>Cifrado de Decks</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="como-funciona" className="section">
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
              <div className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>Metodología</div>
              <h2 className={styles.sectionTitle}>Cómo Funciona QuickPitch</h2>
              <p style={{ marginTop: '0.5rem', color: 'hsl(var(--color-text-secondary))' }}>
                Un proceso ágil y transparente diseñado para maximizar el valor en el menor tiempo posible.
              </p>
            </div>

            <div className={styles.steps}>
              {/* Step 1 */}
              <div className={`${styles.stepCard} animate-fade-in-up delay-1`}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepIconContainer}>
                    <LockIcon size={24} color="hsl(var(--color-amber))" />
                  </div>
                  <span className="badge-amber">01</span>
                </div>
                <h3 className={styles.stepTitle}>1. Sube tu Pitch Deck Cifrado</h3>
                <p className={styles.stepDesc}>
                  Registra tu startup y sube tu presentación en PDF. Cada archivo es cifrado automáticamente con AES-256-GCM y solo accesible por inversionistas acreditados con reserva.
                </p>
              </div>

              {/* Step 2 */}
              <div className={`${styles.stepCard} animate-fade-in-up delay-2`}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepIconContainer}>
                    <ClockIcon size={24} color="hsl(var(--color-amber))" />
                  </div>
                  <span className="badge-amber">02</span>
                </div>
                <h3 className={styles.stepTitle}>2. Presenta en 3 Minutos</h3>
                <p className={styles.stepDesc}>
                  Entra a la sala de video con cronómetro sincronizado vía WebSockets. Al llegar el contador a cero, el micrófono se silencia y comienza la ronda de preguntas o decisión.
                </p>
              </div>

              {/* Step 3 */}
              <div className={`${styles.stepCard} animate-fade-in-up delay-3`}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepIconContainer}>
                    <CreditCardIcon size={24} color="hsl(var(--color-amber))" />
                  </div>
                  <span className="badge-amber">03</span>
                </div>
                <h3 className={styles.stepTitle}>3. Recibe Micro-Inversión</h3>
                <p className={styles.stepDesc}>
                  El inversionista formaliza su aporte en USD mediante Stripe o en USDT vía Binance Pay. Cada operación queda sellada en el log de auditoría HMAC-SHA256.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Para Emprendedores */}
        <section id="emprendedores" className="section" style={{ backgroundColor: 'hsl(var(--color-bg-alt))' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div>
                <div className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>Para Fundadores</div>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'hsl(var(--color-navy))', marginBottom: '1rem' }}>
                  Acelera tu levantamiento de capital sin perder tiempo
                </h2>
                <p style={{ color: 'hsl(var(--color-text-secondary))', marginBottom: '1.75rem', lineHeight: 1.7 }}>
                  QuickPitch elimina las reuniones interminables y te pone frente a inversionistas con intención real de invertir.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircleIcon size={22} color="hsl(var(--color-success))" />
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Pitch Decks Protegidos</h4>
                      <p style={{ fontSize: '0.875rem', color: 'hsl(var(--color-text-secondary))' }}>Tus documentos confidenciales nunca se almacenan en texto plano.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircleIcon size={22} color="hsl(var(--color-success))" />
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Integración con Google Calendar</h4>
                      <p style={{ fontSize: '0.875rem', color: 'hsl(var(--color-text-secondary))' }}>Sincronización instantánea con recordatorios y enlaces de sala directos.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircleIcon size={22} color="hsl(var(--color-success))" />
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Múltiples Pasarelas de Recaudación</h4>
                      <p style={{ fontSize: '0.875rem', color: 'hsl(var(--color-text-secondary))' }}>Recibe aportes tanto de inversionistas tradicionales como de fondos cripto.</p>
                    </div>
                  </div>
                </div>

                <Link href="/register?role=founder" className="btn btn-primary btn-lg">
                  Registrar mi Startup
                  <ArrowRightIcon size={18} />
                </Link>
              </div>

              <div style={{
                backgroundColor: 'hsl(var(--color-surface))',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                border: '1px solid hsl(var(--color-border))',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <RocketIcon size={24} color="hsl(var(--color-navy))" />
                    <div>
                      <h4 style={{ fontWeight: 800 }}>EcoTech Solutions</h4>
                      <span className="badge badge-success">Aprobada en Incubadora</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, color: 'hsl(var(--color-navy))', fontSize: '1.25rem' }}>$500,000 USD</span>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'hsl(var(--color-bg-alt))', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--color-text-muted))', textTransform: 'uppercase', fontWeight: 600 }}>Próxima Presentación</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'hsl(var(--color-navy))', marginTop: '4px' }}>
                    Quick Pitch en Vivo — Sala #104
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-amber">CleanTech</span>
                  <span className="badge badge-navy">Sesión 180s</span>
                  <span className="badge badge-navy">Deck Cifrado</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Para Inversionistas */}
        <section id="inversionistas" className="section">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div style={{
                backgroundColor: 'hsl(var(--color-navy))',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                color: 'white',
                boxShadow: 'var(--shadow-xl)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <ShieldIcon size={24} color="hsl(var(--color-amber))" />
                  <span style={{ color: 'hsl(var(--color-amber))', fontWeight: 700, fontSize: '0.875rem' }}>
                    Auditoría Criptográfica
                  </span>
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
                  Trazabilidad Inmutable con HMAC-SHA256
                </h3>
                <p style={{ color: 'hsl(215 20% 80%)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Cada compromiso de inversión genera un hash criptográfico encadenado al bloque anterior. La integridad de las transacciones se verifica matemáticamente en tiempo real.
                </p>

                <div style={{
                  backgroundColor: 'hsl(var(--color-navy-light))',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: 'hsl(var(--color-amber))',
                  border: '1px solid hsl(var(--color-navy-mid))',
                  wordBreak: 'break-all'
                }}>
                  hash: 8f9b2c1e4a7d...3e01f (INTEGRITY VERIFIED)
                </div>
              </div>

              <div>
                <div className="badge badge-amber" style={{ marginBottom: '0.75rem' }}>Para Inversionistas</div>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'hsl(var(--color-navy))', marginBottom: '1rem' }}>
                  Deal Flow depurado con decisiones en minutos
                </h2>
                <p style={{ color: 'hsl(var(--color-text-secondary))', marginBottom: '1.75rem', lineHeight: 1.7 }}>
                  Accede a startups evaluadas y aprobadas por el comité de la incubadora. Evalúa presentaciones concisas y formaliza tickets o micro-inversiones al instante.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircleIcon size={22} color="hsl(var(--color-success))" />
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Pases de Acceso Demo Day</h4>
                      <p style={{ fontSize: '0.875rem', color: 'hsl(var(--color-text-secondary))' }}>Tickets para eventos en vivo y acceso exclusivo a pitch decks.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircleIcon size={22} color="hsl(var(--color-success))" />
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Flexibilidad de Pago</h4>
                      <p style={{ fontSize: '0.875rem', color: 'hsl(var(--color-text-secondary))' }}>Invierte mediante tarjeta de crédito o con stablecoins USDT.</p>
                    </div>
                  </div>
                </div>

                <Link href="/register?role=investor" className="btn btn-accent btn-lg">
                  Explorar Oportunidades
                  <ArrowRightIcon size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="caracteristicas" className="section" style={{ backgroundColor: 'hsl(var(--color-bg-alt))' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
              <div className="badge badge-navy" style={{ marginBottom: '0.75rem' }}>Tecnología</div>
              <h2 className={styles.sectionTitle}>Arquitectura Robusta y Escalable</h2>
              <p style={{ marginTop: '0.5rem', color: 'hsl(var(--color-text-secondary))' }}>
                Construido con estándares modernos de ingeniería de software y seguridad.
              </p>
            </div>

            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <VideoIcon size={32} color="hsl(var(--color-amber))" />
                <h3 className={styles.featureTitle}>Video WebRTC & WebSockets</h3>
                <p className={styles.featureDesc}>
                  Transmisión de audio y video con cronómetro de servidor de alta precisión para evitar desincronizaciones.
                </p>
              </div>

              <div className={styles.featureCard}>
                <CreditCardIcon size={32} color="hsl(var(--color-amber))" />
                <h3 className={styles.featureTitle}>Pasarelas FIAT & Cripto</h3>
                <p className={styles.featureDesc}>
                  Procesamiento en USD mediante Stripe y en activos digitales mediante la API de Binance Pay.
                </p>
              </div>

              <div className={styles.featureCard}>
                <LockIcon size={32} color="hsl(var(--color-amber))" />
                <h3 className={styles.featureTitle}>Cifrado Simétrico AES-256-GCM</h3>
                <p className={styles.featureDesc}>
                  Protección de documentos confidenciales con vectores de inicialización (IV) únicos y etiquetas de autenticación.
                </p>
              </div>

              <div className={styles.featureCard}>
                <CalendarIcon size={32} color="hsl(var(--color-amber))" />
                <h3 className={styles.featureTitle}>Sincronización de Calendario</h3>
                <p className={styles.featureDesc}>
                  Generación de enlaces a Google Calendar con parámetros de sesión y enlace directo a la sala.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className="container">
            <h2 className={styles.ctaTitle}>¿Listo para comenzar en QuickPitch?</h2>
            <p className={styles.ctaSubtitle}>
              Únete a la incubadora y presenta tu proyecto o descubre las startups más prometedoras.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-accent btn-lg">
                Crear Cuenta Gratis
              </Link>
              <Link href="/login" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div>
              <Link href="/" className={styles.footerLogo}>
                <LightningIcon size={20} color="hsl(var(--color-amber))" />
                QuickPitch
              </Link>
              <p className={styles.copyright}>© 2026 QuickPitch. Plataforma de Matchmaking e Incubadora de Startups.</p>
            </div>
            <div className={styles.footerLinks}>
              <Link href="/login" className={styles.footerLink}>
                Ingresar
              </Link>
              <Link href="/register" className={styles.footerLink}>
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
