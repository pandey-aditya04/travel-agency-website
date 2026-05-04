'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <Link href='/' className={styles.logo}>
        Travel <span className={styles.accent}>Agency</span>
      </Link>
      <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}
        aria-label='Toggle menu'>
        <span /><span /><span />
      </button>
      <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
        <li><Link href='/destinations'>Explore</Link></li>
        <li className={styles.dropdown}>
          <button>Indian Escapes ▾</button>
          <div className={styles.dropdownMenu}>
            <Link href='/destinations?category=Indian Escapes&destination=Kerala'>Kerala</Link>
            <Link href='/destinations?category=Indian Escapes&destination=Himachal'>Himachal</Link>
            <Link href='/destinations?category=Indian Escapes&destination=Rajasthan'>Rajasthan</Link>
            <Link href='/destinations?category=Indian Escapes&destination=Andaman'>Andaman</Link>
          </div>
        </li>
        <li className={styles.dropdown}>
          <button>Overseas ▾</button>
          <div className={styles.dropdownMenu}>
            <Link href='/destinations?category=Overseas Adventures&destination=Dubai'>Dubai</Link>
            <Link href='/destinations?category=Overseas Adventures&destination=Bali'>Bali</Link>
            <Link href='/destinations?category=Overseas Adventures&destination=Switzerland'>Switzerland</Link>
            <Link href='/destinations?category=Overseas Adventures&destination=Maldives'>Maldives</Link>
          </div>
        </li>
        <li className={styles.dropdown}>
          <button>Divine ▾</button>
          <div className={styles.dropdownMenu}>
            <Link href='/destinations?category=Divine Destinations&destination=Char Dham'>Char Dham</Link>
            <Link href='/destinations?category=Divine Destinations&destination=Kedarnath'>Kedarnath</Link>
            <Link href='/destinations?category=Divine Destinations&destination=Varanasi'>Varanasi</Link>
          </div>
        </li>
        <li><Link href='/dashboard'>My Account</Link></li>
        <li><Link href='/destinations' className={styles.ctaBtn}>Book A Trip</Link></li>
      </ul>
    </nav>
  );
}
