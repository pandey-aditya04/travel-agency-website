'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
          <li><Link href="/destinations">Explore Now</Link></li>
          
          {Object.entries(categories).map(([label, items]) => (
            <li key={label} className="has-dropdown">
              <button>
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
                <Link href={`/destinations?category=${label}`} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'var(--primary-color)', fontWeight: '700' }}>
                  View All
                </Link>
              </div>
            </li>
          ))}
          
          <li><Link href="/blog">Tips & Tales</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          
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
          backdrop-filter: blur(15px); border-bottom: 1px solid rgba(232, 160, 32, 0.1);
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          background: rgba(13, 27, 42, 0.98);
          height: 70px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .nav-content-wrap {
          width: 100%; max-width: 1400px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo {
          font-family: var(--font-display);
          font-size: 1.6rem; font-weight: 700;
          color: #fff; letter-spacing: 0.04em;
        }
        .nav-logo span { color: var(--primary-color); }
        
        .nav-links { display: flex; align-items: center; gap: 5px; list-style: none; }
        .nav-links > li { position: relative; }
        .nav-links > li > a, .nav-links > li > button {
          font-size: 0.88rem; font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          padding: 10px 15px; border-radius: 8px;
          border: none; background: none; cursor: pointer;
          display: flex; align-items: center; gap: 6px;
          transition: all 0.3s ease;
        }
        .nav-links > li > a:hover, .nav-links > li > button:hover {
          color: var(--primary-color); background: rgba(232, 160, 32, 0.1);
        }
        
        .dropdown {
          position: absolute; top: calc(100% + 10px); left: 0;
          background: var(--secondary-color); border: 1px solid rgba(232, 160, 32, 0.15);
          border-radius: 12px; min-width: 220px; padding: 10px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          opacity: 0; visibility: hidden; transform: translateY(-10px);
          transition: all 0.2s ease; pointer-events: none;
        }
        .nav-links li:hover .dropdown { opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto; }
        .dropdown a {
          display: block; padding: 10px 15px;
          color: rgba(255, 255, 255, 0.7); font-size: 0.85rem;
          border-radius: 8px; transition: all 0.2s;
        }
        .dropdown a:hover { background: rgba(232, 160, 32, 0.1); color: var(--primary-color); }
        
        .nav-cta {
          background: var(--primary-color) !important; color: var(--secondary-color) !important;
          font-weight: 700 !important; padding: 10px 22px !important;
          border-radius: 30px !important; box-shadow: 0 4px 15px rgba(232, 160, 32, 0.3);
        }
        .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(232, 160, 32, 0.4); }
        
        .account-link { color: #fff !important; }

        .hamburger { display: none; flex-direction: column; gap: 6px; cursor: pointer; background: none; border: none; z-index: 1001; }
        .hamburger span { display: block; width: 28px; height: 2px; background: #fff; border-radius: 2px; transition: 0.3s; }
        .hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

        .mobile-menu {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: var(--secondary-color); padding: 100px 5vw 40px;
          transform: translateX(100%); transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 999; overflow-y: auto;
        }
        .mobile-menu.open { transform: translateX(0); }
        .mobile-menu-inner a { display: block; padding: 15px 0; color: rgba(255,255,255,0.8); font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .mobile-section { color: var(--primary-color); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin: 25px 0 10px; }
        .mobile-sub { padding-left: 20px !important; font-size: 0.95rem !important; border: none !important; }
        .mobile-cta { background: var(--primary-color); color: var(--secondary-color) !important; font-weight: 700; text-align: center; border-radius: 12px; margin-top: 30px; }

        @media (max-width: 1100px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
