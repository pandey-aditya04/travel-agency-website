'use client';
import Link from 'next/link';
import { Package, LayoutDashboard, PlusCircle, LogOut, ChevronLeft } from 'lucide-react';

export default function AdminNavbar() {
  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    window.location.href = '/admin/login';
  };

  return (
    <nav className="admin-nav">
      <div className="admin-nav-container">
        <div className="admin-nav-left">
          <Link href="/admin/dashboard" className="admin-logo">
            <span className="logo-icon">RM</span>
            <span className="logo-text">Admin</span>
          </Link>
          <div className="admin-nav-divider"></div>
          <div className="admin-nav-links">
            <Link href="/admin/dashboard" className="admin-nav-link">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/upload" className="admin-nav-link">
              <PlusCircle size={18} />
              <span>New Package</span>
            </Link>
          </div>
        </div>
        
        <div className="admin-nav-right">
          <Link href="/" target="_blank" className="admin-nav-link site-link">
            <span>View Site</span>
          </Link>
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .admin-nav {
          background: #0D1B2A;
          color: white;
          height: 70px;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .admin-nav-container {
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
        }
        .admin-nav-left, .admin-nav-right {
          display: flex;
          align-items: center;
          gap: 30px;
        }
        .admin-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: white;
        }
        .logo-icon {
          background: var(--amber, #E8A020);
          color: #0D1B2A;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-weight: 900;
          font-size: 0.9rem;
        }
        .logo-text {
          font-weight: 800;
          font-size: 1.2rem;
          letter-spacing: -0.5px;
        }
        .admin-nav-divider {
          width: 1px;
          height: 30px;
          background: rgba(255,255,255,0.1);
        }
        .admin-nav-links {
          display: flex;
          gap: 10px;
        }
        .admin-nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          color: #A0AEC0;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 700;
          transition: all 0.2s ease;
        }
        .admin-nav-link:hover {
          color: white;
          background: rgba(255,255,255,0.05);
        }
        .site-link {
          background: rgba(255,255,255,0.05);
          color: white !important;
        }
        .admin-logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          color: #FF4D4D;
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        .admin-logout-btn:hover {
          background: #FF4D4D;
          color: white;
          border-color: #FF4D4D;
        }
        @media (max-width: 768px) {
          .admin-nav-links, .admin-nav-divider, .logo-text { display: none; }
          .admin-nav-container { padding: 0 15px; }
        }
      `}</style>
    </nav>
  );
}
