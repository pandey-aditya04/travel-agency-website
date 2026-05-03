import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">RM<span>YAATRA</span></div>
          <p className="footer-tagline">
            Your trusted partner for unforgettable journeys. Discover India and the world with RM Yaatra Travels.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-btn"><Facebook size={18} /></a>
            <a href="#" className="social-btn"><Instagram size={18} /></a>
            <a href="#" className="social-btn"><Youtube size={18} /></a>
            <a href="#" className="social-btn"><Linkedin size={18} /></a>
          </div>
          <p className="subscribe-label">Subscribe to travel updates:</p>
          <div className="newsletter-form">
            <input type="email" className="newsletter-input" placeholder="your@email.com" />
            <button className="newsletter-btn"><Send size={18} /></button>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/destinations">All Destinations</Link></li>
            <li><Link href="/blog">Tips & Tales Blog</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/admin/login">Admin Login</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Our Services</h4>
          <ul>
            <li><Link href="/destinations?category=Indian Escapes">Indian Escapes</Link></li>
            <li><Link href="/destinations?category=Overseas Adventures">Overseas Adventures</Link></li>
            <li><Link href="/destinations?category=Divine Destinations">Divine Destinations</Link></li>
            <li><Link href="#">Flight Booking</Link></li>
            <li><Link href="#">Hotel Booking</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul className="contact-list">
            <li>
              <MapPin size={18} className="icon" />
              <span>Delhi Meerut Road, Piller No. 890, Muradnagar, Ghaziabad – 201206</span>
            </li>
            <li>
              <Phone size={18} className="icon" />
              <span>+91 95202 35209</span>
            </li>
            <li>
              <Mail size={18} className="icon" />
              <span>info@rmyaatravels.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="footer-copy">© {new Date().getFullYear()} RM Yaatra Travels. All rights reserved.</p>
        <div className="footer-links">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms & Conditions</Link>
          <Link href="#">Refund Policy</Link>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--secondary-color);
          padding: 80px 0 40px;
          color: #fff;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
          gap: 50px;
          margin-bottom: 60px;
        }
        .footer-logo {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
        }
        .footer-logo span { color: var(--primary-color); }
        .footer-tagline {
          color: rgba(255,255,255,0.6);
          font-size: 0.95rem;
          line-height: 1.7;
          max-width: 320px;
          margin-bottom: 25px;
        }
        .footer-socials {
          display: flex;
          gap: 12px;
          margin-bottom: 30px;
        }
        .social-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.6);
          transition: all 0.3s;
        }
        .social-btn:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
          background: rgba(232,160,32,0.1);
          transform: translateY(-3px);
        }
        
        .subscribe-label { font-size: 0.85rem; color: rgba(255,255,255,0.4); margin-bottom: 12px; }
        .newsletter-form { display: flex; gap: 8px; max-width: 300px; }
        .newsletter-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 10px 15px;
          color: #fff;
          font-size: 0.9rem;
          outline: none;
          transition: 0.3s;
        }
        .newsletter-input:focus { border-color: var(--primary-color); background: rgba(255,255,255,0.08); }
        .newsletter-btn {
          background: var(--primary-color);
          color: var(--secondary-color);
          padding: 10px 15px;
          border-radius: 8px;
          font-weight: 700;
        }
        
        .footer-col h4 {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--primary-color);
          margin-bottom: 25px;
        }
        .footer-col ul { display: flex; flex-direction: column; gap: 12px; }
        .footer-col ul li :global(a) {
          color: rgba(255,255,255,0.6);
          font-size: 0.95rem;
          transition: 0.3s;
        }
        .footer-col ul li :global(a:hover) { color: var(--primary-color); transform: translateX(5px); display: inline-block; }
        
        .contact-list li {
          display: flex;
          gap: 15px;
          color: rgba(255,255,255,0.6);
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .contact-list .icon { color: var(--primary-color); flex-shrink: 0; }

        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        .footer-copy { color: rgba(255,255,255,0.3); font-size: 0.85rem; }
        .footer-links { display: flex; gap: 25px; }
        .footer-links :global(a) { color: rgba(255,255,255,0.3); font-size: 0.85rem; }
        .footer-links :global(a:hover) { color: var(--primary-color); }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; }
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
