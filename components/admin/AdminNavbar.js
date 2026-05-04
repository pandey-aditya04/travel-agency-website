'use client';
import Link from 'next/link';

export default function AdminNavbar() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      minHeight: '64px',
      background: '#0D1B2A',
      borderBottom: '1px solid rgba(232,160,32,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 24px',
      flexWrap: 'wrap',
      gap: '15px'
    }} className="admin-navbar">
      {/* Logo */}
      <Link href='/admin' style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: '#E8A020',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: '800', fontSize: '0.9rem', color: '#0D1B2A'
        }}>TA</div>
        <div>
          <div style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '0.95rem', lineHeight: 1.2 }}>Travel Agency</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</div>
        </div>
      </Link>

      {/* Center nav */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '5px' }} className="admin-nav-links">
        <Link href='/admin/dashboard' style={navLinkStyle}>⊞ Dashboard</Link>
        <Link href='/admin/upload' style={{ ...navLinkStyle, color: '#E8A020' }}>⊕ New Package</Link>
        <Link href='/admin/leads' style={navLinkStyle}>📋 Leads</Link>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link href='/' style={navLinkStyle} target='_blank' className="view-site-link">View Site ↗</Link>
        <button style={{
          background: 'rgba(239,68,68,0.12)', color: '#EF4444',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '7px', padding: '7px 14px',
          fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer'
        }}>→ Logout</button>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .admin-navbar { justify-content: center !important; height: auto !important; }
          .admin-nav-links { width: 100%; justify-content: center; }
          .view-site-link { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

const navLinkStyle = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: '0.85rem',
  fontWeight: '500',
  padding: '7px 12px',
  borderRadius: '7px',
  textDecoration: 'none',
  transition: 'all 0.2s'
};
