'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './navbar.module.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className="container">
        <div className={styles.navContainer}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" stroke="none" />
            </svg>
            QuickPitch
          </Link>

          {/* Desktop Nav Links */}
          <div className={styles.navLinks}>
            <Link href="#como-funciona" className={styles.navLink}>
              Cómo Funciona
            </Link>
            <Link href="#emprendedores" className={styles.navLink}>
              Para Emprendedores
            </Link>
            <Link href="#inversionistas" className={styles.navLink}>
              Para Inversionistas
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className={styles.actions}>
            <Link href="/login" className="btn btn-outline">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="btn btn-accent">
              Comenzar Gratis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className={styles.mobileMenuBtn} onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className={`${styles.mobileMenu} ${styles.isOpen}`}>
          <div className="container">
            <div className={styles.mobileNavLinks}>
              <Link href="#como-funciona" className={styles.navLink} onClick={toggleMobileMenu}>
                Cómo Funciona
              </Link>
              <Link href="#emprendedores" className={styles.navLink} onClick={toggleMobileMenu}>
                Para Emprendedores
              </Link>
              <Link href="#inversionistas" className={styles.navLink} onClick={toggleMobileMenu}>
                Para Inversionistas
              </Link>
            </div>
            <div className={styles.mobileActions}>
              <Link href="/login" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                Iniciar Sesión
              </Link>
              <Link href="/register" className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }}>
                Comenzar Gratis
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
