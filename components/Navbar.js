'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = {
    'Indian Escapes': ['Kerala', 'Himachal', 'Rajasthan', 'Andaman'],
    'Overseas Adventures': ['Dubai', 'Bali', 'Switzerland', 'Maldives'],
    'Divine Destinations': ['Char Dham', 'Kedarnath', 'Varanasi']
  };

  return (
    <nav className="nav-container">
      <div className="container nav-content">
        <Link href="/" className="logo" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
          <span style={{ fontSize: '1.4rem', color: '#1a1a2e', letterSpacing: '2px' }}>RM</span>
          <span style={{ fontSize: '1.1rem', color: '#e8a020', letterSpacing: '4px' }}>YAATRA</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links">
          <Link href="/destinations" className="nav-link">Explore Now</Link>
          
          {Object.entries(categories).map(([label, items]) => (
            <div key={label} className="dropdown">
              <span className="nav-link" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {label} <ChevronDown size={14} />
              </span>
              <div className="dropdown-menu">
                {items.map(item => (
                  <Link 
                    key={item} 
                    href={`/destinations?category=${label}&destination=${item}`} 
                    className="dropdown-item"
                  >
                    {item}
                  </Link>
                ))}
                <div style={{ borderTop: '1px solid #f0f0f0', marginTop: '10px' }}>
                  <Link href={`/destinations?category=${label}`} className="dropdown-item" style={{ color: '#e8a020', fontWeight: '700' }}>View All</Link>
                </div>
              </div>
            </div>
          ))}

          <Link href="/dashboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} /> My Account
          </Link>
          <Link href="/destinations" className="btn btn-primary" style={{ padding: '10px 25px', fontSize: '0.9rem' }}>Book A Trip</Link>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ display: 'none' }}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div style={{ 
            position: 'fixed', top: '80px', left: 0, right: 0, bottom: 0, background: '#fff', 
            zIndex: 1000, padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '20px'
          }}>
            <Link href="/destinations" className="nav-link" onClick={() => setIsOpen(false)} style={{ fontSize: '1.2rem', fontWeight: '700' }}>Explore Now</Link>
            <Link href="/dashboard" className="nav-link" onClick={() => setIsOpen(false)} style={{ fontSize: '1.2rem', fontWeight: '700' }}>My Account</Link>
            <Link href="/blog" className="nav-link" onClick={() => setIsOpen(false)} style={{ fontSize: '1.2rem', fontWeight: '700' }}>Tips & Tales</Link>
            <Link href="/contact" className="nav-link" onClick={() => setIsOpen(false)} style={{ fontSize: '1.2rem', fontWeight: '700' }}>Reach Us</Link>
            <Link href="/destinations" className="btn btn-primary" onClick={() => setIsOpen(false)} style={{ textAlign: 'center', padding: '15px' }}>Book A Trip</Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .nav-container {
          background: #fff;
          border-bottom: 1px solid #f0f0f0;
          height: 80px;
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1001;
        }
        @media (max-width: 1150px) {
          .nav-links {
            display: none;
          }
          .mobile-toggle {
            display: block !important;
            background: none;
            border: none;
            color: #1a1a2e;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
