import Link from 'next/link';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1a1a2e', color: '#fff', padding: '5rem 0 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          {/* Brand Column */}
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>RM <span style={{ color: '#e8a020' }}>YAATRA</span></h2>
            <p style={{ color: '#ccc', marginBottom: '2rem' }}>
              Your trusted partner for unforgettable journeys. Discover India and the world with RM Yaatra Travels.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ background: '#333', padding: '10px', borderRadius: '50%' }}><Globe size={20} /></a>
              <a href="#" style={{ background: '#333', padding: '10px', borderRadius: '50%' }}><Mail size={20} /></a>
              <a href="#" style={{ background: '#333', padding: '10px', borderRadius: '50%' }}><Globe size={20} /></a>
              <a href="#" style={{ background: '#333', padding: '10px', borderRadius: '50%' }}><Mail size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Quick Links</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link href="/about" style={{ color: '#ccc' }}>About Us</Link></li>
              <li><Link href="/destinations" style={{ color: '#ccc' }}>Destinations</Link></li>
              <li><Link href="/blog" style={{ color: '#ccc' }}>Tips & Tales</Link></li>
              <li><Link href="/contact" style={{ color: '#ccc' }}>Contact Us</Link></li>
              <li><Link href="/admin/login" style={{ color: '#ccc' }}>Admin Login</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Our Services</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li style={{ color: '#ccc' }}>Indian Escapes</li>
              <li style={{ color: '#ccc' }}>Overseas Adventures</li>
              <li style={{ color: '#ccc' }}>Divine Destinations</li>
              <li style={{ color: '#ccc' }}>Flight Booking</li>
              <li style={{ color: '#ccc' }}>Hotel Booking</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Contact Us</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#ccc' }}>
                <MapPin size={20} color="#e8a020" />
                123 Travel Street, New Delhi, India
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#ccc' }}>
                <Phone size={20} color="#e8a020" />
                +91 98765 43210
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#ccc' }}>
                <Mail size={20} color="#e8a020" />
                info@rmyaatravels.com
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #333', paddingTop: '2rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
          <p>© {new Date().getFullYear()} RM Yaatra Travels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
