'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <Navbar />
      <section style={{ 
        background: 'linear-gradient(rgba(26, 26, 46, 0.8), rgba(26, 26, 46, 0.8)), url("https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&q=80&w=1920")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 0',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Reach Us</h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '700px', margin: '0 auto' }}>Have questions? We are here to help you plan your perfect getaway.</p>
        </div>
      </section>

      <section className="container" style={{ padding: '80px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '60px' }}>
          {/* Info Side */}
          <div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '30px', fontWeight: '800' }}>Get in Touch</h2>
            <p style={{ color: '#666', marginBottom: '40px', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Whether you are looking for a custom itinerary or have a question about an existing package, our travel experts are ready to assist.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '50px', height: '50px', background: '#fff9e6', color: 'var(--primary-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700' }}>Call Us</h4>
                  <p style={{ color: '#666' }}>+91 98765 43210</p>
                  <p style={{ color: '#666', fontSize: '0.85rem' }}>Mon - Sat, 9:00 AM - 8:00 PM</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '50px', height: '50px', background: '#fff9e6', color: 'var(--primary-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700' }}>Email Us</h4>
                  <p style={{ color: '#666' }}>hello@rmyaatravels.com</p>
                  <p style={{ color: '#666', fontSize: '0.85rem' }}>We reply within 24 hours</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '50px', height: '50px', background: '#fff9e6', color: 'var(--primary-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700' }}>Visit Us</h4>
                  <p style={{ color: '#666' }}>123 Travel Tower, MG Road</p>
                  <p style={{ color: '#666' }}>New Delhi, India 110001</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div style={{ background: '#fff', padding: '50px', borderRadius: '30px', boxShadow: 'var(--shadow-lg)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: '80px', height: '80px', background: '#e6fffa', color: '#047481', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Send size={40} />
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Message Sent!</h3>
                <p style={{ color: '#666' }}>Thank you for reaching out. One of our travel experts will contact you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-outline" style={{ marginTop: '30px' }}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="John Doe" required style={{ width: '100%', padding: '15px', border: '2px solid #f0f0f0', borderRadius: '12px' }} />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="john@example.com" required style={{ width: '100%', padding: '15px', border: '2px solid #f0f0f0', borderRadius: '12px' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select required style={{ width: '100%', padding: '15px', border: '2px solid #f0f0f0', borderRadius: '12px' }}>
                    <option>General Inquiry</option>
                    <option>Booking Support</option>
                    <option>Custom Itinerary Request</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea rows="5" placeholder="How can we help you?" required style={{ width: '100%', padding: '15px', border: '2px solid #f0f0f0', borderRadius: '12px' }}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '18px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Send size={20} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      
      {/* Map Placeholder */}
      <section style={{ height: '400px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin /> Interactive Map Integration Point</p>
      </section>

      <Footer />
    </main>
  );
}
