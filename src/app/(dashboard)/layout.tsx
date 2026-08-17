'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import styles from './dashboard.module.css';
import { 
  RocketIcon, 
  BriefcaseIcon, 
  ShieldIcon, 
  VideoIcon, 
  CreditCardIcon, 
  LightningIcon,
  PlusIcon
} from '@/components/ui/icons';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const { data: sessionData } = useSession();
  const userName = sessionData?.user?.name || 'Usuario';
  const userEmail = sessionData?.user?.email || '';
  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';
  const userRole = (sessionData?.user as { role?: string })?.role || '';
  const roleLabel =
    userRole === 'ENTREPRENEUR'
      ? 'Emprendedor'
      : userRole === 'INVESTOR'
      ? 'Inversionista'
      : userRole === 'ADMIN'
      ? 'Administrador'
      : 'Miembro';

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems =
    userRole === 'ENTREPRENEUR'
      ? [
          { name: 'Panel Principal', href: '/entrepreneur', icon: <RocketIcon size={18} /> },
          { name: 'Mis Startups', href: '/entrepreneur#startups', icon: <BriefcaseIcon size={18} /> },
          { name: 'Sesiones de Pitch', href: '/entrepreneur#sesiones', icon: <VideoIcon size={18} /> },
        ]
      : userRole === 'INVESTOR'
      ? [
          { name: 'Panel Inversionista', href: '/investor', icon: <BriefcaseIcon size={18} /> },
          { name: 'Explorar Startups', href: '/investor#startups', icon: <RocketIcon size={18} /> },
          { name: 'Mis Inversiones', href: '/investor#inversiones', icon: <CreditCardIcon size={18} /> },
        ]
      : userRole === 'ADMIN'
      ? [
          { name: 'Panel Administrativo', href: '/admin', icon: <ShieldIcon size={18} /> },
          { name: 'Auditoría Criptográfica', href: '/admin#auditoria', icon: <ShieldIcon size={18} /> },
        ]
      : [
          { name: 'Panel Principal', href: '/entrepreneur', icon: <RocketIcon size={18} /> },
        ];

  return (
    <div className={styles.layout}>
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.sidebarOverlayOpen : ''}`} 
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <LightningIcon size={22} color="hsl(var(--color-amber))" />
            QuickPitch
          </Link>
        </div>

        <nav className={styles.nav}>
          <div style={{ padding: '0 0.75rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--color-text-muted))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Navegación
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>{userInitials}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRole}>{roleLabel}</span>
            </div>
          </div>
          <button 
            type="button"
            className={styles.logoutBtn} 
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button type="button" className={styles.mobileToggle} onClick={toggleSidebar} aria-label="Abrir menú">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
            <h1 className={styles.pageTitle}>Plataforma QuickPitch</h1>
          </div>
          
          <div className={styles.topbarRight}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge badge-navy" style={{ fontSize: '0.8125rem' }}>
                {roleLabel}
              </span>
              <div className={styles.avatar} title={userEmail}>
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
}
