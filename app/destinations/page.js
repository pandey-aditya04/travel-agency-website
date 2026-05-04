import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Destinations() {
  const destinations = [
    { name: 'Bali - Indonesia', slug: 'bali-indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
    { name: 'Bangkok - Thailand', slug: 'bangkok-thailand', image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=800&q=80' },
    { name: 'Bhutan', slug: 'bhutan', image: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4?auto=format&fit=crop&w=800&q=80' },
    { name: 'Canada', slug: 'canada', image: 'https://images.unsplash.com/photo-1503614472-8c97d4d18d71?auto=format&fit=crop&w=800&q=80' },
    { name: 'Dubai - UAE', slug: 'dubai-uae', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
    { name: 'Egypt', slug: 'egypt', image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80' }
  ];

  return (
    <main className="destinations-page">
      <Navbar />
      
      <section className="dest-hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1>Our Destinations</h1>
          <p>Explore the beauty of India and the world</p>
        </div>
      </section>

      <div className="container grid-wrapper">
        <div className="dest-grid">
          {destinations.map((dest, i) => (
            <div key={i} className="dest-card">
              <img src={dest.image} alt={dest.name} className="dest-img" />
              <div className="dest-overlay">
                <h3 className="dest-name">{dest.name}</h3>
                <Link href={`/destination/${dest.slug}`} className="explore-btn">
                  Explore Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .destinations-page { background: #0D1B2A; min-height: 100vh; padding-bottom: 100px; }
        
        .dest-hero { 
          position: relative; 
          height: 350px; 
          background: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80'); 
          background-size: cover; 
          background-position: center; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          margin-bottom: 60px;
          margin-top: 80px;
        }
        .dest-hero .hero-overlay { position: absolute; inset: 0; background: rgba(13,27,42,0.6); }
        .dest-hero .hero-content { position: relative; z-index: 2; text-align: center; color: #fff; }
        .dest-hero h1 { font-size: 4rem; font-weight: 800; margin-bottom: 10px; }
        .dest-hero p { font-size: 1.2rem; opacity: 0.8; }

        .grid-wrapper { padding: 0 5vw; }
        
        .dest-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
        }

        .dest-card {
          position: relative;
          height: 400px;
          border-radius: 12px;
          overflow: hidden;
          background: #1A2D42;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .dest-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.6;
          transition: 0.5s;
        }

        .dest-card:hover .dest-img {
          transform: scale(1.1);
          opacity: 0.4;
        }

        .dest-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(to top, rgba(13,27,42,0.8), transparent);
        }

        .dest-name {
          color: #fff;
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 20px;
          text-align: center;
        }

        .explore-btn {
          padding: 8px 24px;
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 4px;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: 0.3s;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(5px);
        }

        .explore-btn:hover {
          background: #fff;
          color: #0D1B2A;
          border-color: #fff;
        }

        @media (max-width: 1024px) {
          .dest-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .dest-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
