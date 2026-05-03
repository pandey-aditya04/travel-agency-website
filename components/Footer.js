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

    </footer>
  );
};

export default Footer;
