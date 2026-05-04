'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

// Replace the 4 removed icons with these inline SVG components:
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 1.96C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">Travel <span style={{color:'#E8A020'}}>Agency</span></div>
          <p className="footer-tagline">
            Your trusted partner for unforgettable journeys across India and the world. Discover the beauty of travel with Travel Agency.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-btn"><FacebookIcon /></a>
            <a href="#" className="social-btn"><InstagramIcon /></a>
            <a href="#" className="social-btn"><YoutubeIcon /></a>
            <a href="#" className="social-btn"><LinkedinIcon /></a>
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
              <span>info@travelagenc.vercel.app</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="footer-copy">© {new Date().getFullYear()} Travel Agency. All rights reserved.</p>
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
