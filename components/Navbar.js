'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = {
    'Indian Escapes': ['Kerala', 'Himachal', 'Rajasthan', 'Andaman'],
    'Overseas Adventures': ['Dubai', 'Bali', 'Switzerland', 'Maldives'],
    'Divine Destinations': ['Char Dham', 'Kedarnath', 'Varanasi']
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-content-wrap">
        <Link href="/" className="nav-logo">
          RM<span>YAATRA</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="nav-links">
          <li><Link href="/destinations" className="nav-link">Explore Now</Link></li>
          
          {Object.entries(categories).map(([label, items]) => (
            <li key={label} className="has-dropdown">
              <button className="nav-link">
                {label} <ChevronDown className="chevron" size={14} />
              </button>
              <div className="dropdown">
                {items.map(item => (
                  <Link 
                    key={item} 
                    href={`/destinations?category=${label}&destination=${item}`}
                  >
                    {item}
                  </Link>
                ))}
                <Link href={`/destinations?category=${label}`} className="view-all-drop">
                  View All
                </Link>
              </div>
            </li>
          ))}
          
          <li><Link href="/blog" className="nav-link">Tips & Tales</Link></li>
          <li><Link href="/contact" className="nav-link">Contact</Link></li>
          
          <li>
            <Link href="/dashboard" className="account-link">
              <User size={18} />
            </Link>
          </li>
          <li>
            <Link href="/destinations" className="nav-cta">
              Book A Trip
            </Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button className={`hamburger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <Link href="/destinations" onClick={() => setIsOpen(false)}>Explore Now</Link>
          
          {Object.entries(categories).map(([label, items]) => (
            <div key={label}>
              <div className="mobile-section">{label}</div>
              {items.map(item => (
                <Link 
                  key={item} 
                  href={`/destinations?category=${label}&destination=${item}`}
                  className="mobile-sub"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          ))}
          
          <Link href="/blog" onClick={() => setIsOpen(false)}>Tips & Tales</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link href="/dashboard" onClick={() => setIsOpen(false)}>My Account</Link>
          <Link href="/destinations" className="mobile-cta" onClick={() => setIsOpen(false)}>
            Book A Trip →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          padding: 0 5vw; display: flex; align-items: center; justify-content: center;
          height: 80px; background: rgba(13, 27, 42, 0.85);
          backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .navbar.scrolled {
          background: #0D1B2A;
          height: 70px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          border-bottom-color: rgba(232, 160, 32, 0.2);
        }
        .nav-content-wrap {
          width: 100%; max-width: 1400px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo {
          font-family: var(--font-display);
          font-size: 1.65rem; font-weight: 800;
          color: #FFFFFF !important; letter-spacing: 0.04em;
          text-decoration: none;
        }
        .nav-logo span { color: var(--primary-color); }
        
        .nav-links { display: flex; align-items: center; gap: 8px; list-style: none; }
        .nav-links > li { position: relative; }
        .nav-link {
          font-size: 0.9rem; font-weight: 600;
          color: rgba(255, 255, 255, 0.95) !important;
          padding: 10px 18px; border-radius: 10px;
          border: none; background: none; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .nav-link:hover {
          color: var(--primary-color) !important; background: rgba(255, 255, 255, 0.08);
        }
        
        .dropdown {
          position: absolute; top: calc(100% + 12px); left: 0;
          background: #1A2D42; border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px; min-width: 240px; padding: 12px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.4);
          opacity: 0; visibility: hidden; transform: translateY(-10px);
          transition: all 0.25s ease; pointer-events: none;
        }
        .nav-links li:hover .dropdown { opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto; }
        .dropdown a {
          display: block; padding: 10px 16px;
          color: rgba(255, 255, 255, 0.8); font-size: 0.88rem; font-weight: 500;
          border-radius: 8px; transition: all 0.2s;
        }
        .dropdown a:hover { background: rgba(232, 160, 32, 0.12); color: var(--primary-color); }
        .view-all-drop { border-top: 1px solid rgba(255,255,255,0.08); color: var(--primary-color) !important; font-weight: 700; margin-top: 6px; }
        
        .nav-cta {
          background: var(--primary-color); color: #0D1B2A !important;
          font-weight: 800; padding: 12px 26px; margin-left: 12px;
          border-radius: 30px; box-shadow: 0 8px 20px rgba(232, 160, 32, 0.3);
          transition: all 0.3s ease; font-size: 0.9rem;
          text-decoration: none;
        }
        .nav-cta:hover { transform: translateY(-2.5px); box-shadow: 0 12px 30px rgba(232, 160, 32, 0.45); background: var(--primary-light); }
        
        .account-link { color: #FFFFFF !important; padding: 10px; border-radius: 50%; transition: all 0.3s; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); }
        .account-link:hover { color: var(--primary-color) !important; background: rgba(255,255,255,0.12); transform: scale(1.05); }

        .hamburger { display: none; flex-direction: column; gap: 7px; cursor: pointer; background: none; border: none; z-index: 1001; }
        .hamburger span { display: block; width: 30px; height: 2.5px; background: #FFFFFF; border-radius: 2px; transition: 0.3s; }
        .hamburger.open span:nth-child(1) { transform: translateY(9.5px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-9.5px) rotate(-45deg); }

        .mobile-menu {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: #0D1B2A; padding: 110px 6vw 50px;
          transform: translateX(100%); transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 999; overflow-y: auto;
        }
        .mobile-menu.open { transform: translateX(0); }
        .mobile-menu-inner a { display: block; padding: 18px 0; color: #FFFFFF; font-size: 1.2rem; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.05); text-decoration: none; }
        .mobile-section { color: var(--primary-color); font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2.5px; margin: 35px 0 12px; }
        .mobile-sub { padding-left: 24px !important; font-size: 1rem !important; border: none !important; color: rgba(255,255,255,0.7) !important; }
        .mobile-cta { background: var(--primary-color); color: #0D1B2A !important; font-weight: 800; text-align: center; border-radius: 14px; margin-top: 40px; }

        @media (max-width: 1150px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
