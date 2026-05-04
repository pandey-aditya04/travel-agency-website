'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';

const HeroSlider = () => {
  const slides = [
    {
      badge: "✦ Indian Escapes",
      headline: <>Discover <span>India</span>,<br/>Create Memories</>,
      sub: "Seamless travel across India's most breathtaking destinations — curated just for you.",
      image: "https://images.unsplash.com/photo-1524492707947-2f85a64b67ad?auto=format&fit=crop&w=1920&q=80", // Taj Mahal
      link: "/destinations?category=Indian Escapes"
    },
    {
      badge: "✦ Overseas Adventures",
      headline: <>Explore <span>Worlds</span>,<br/>Beyond Boundaries</>,
      sub: "Experience the pinnacle of luxury and adventure in iconic global destinations.",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1920&q=80", // Venice / Overseas
      link: "/destinations?category=Overseas Adventures"
    },
    {
      badge: "✦ Divine Destinations",
      headline: <>Sacred <span>Journeys</span>,<br/>Divine Peace</>,
      sub: "Find spiritual travel bliss with sacred journeys to India's most divine pilgrimage sites.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80", // Sacred Temple/Ganges
      link: "/destinations?category=Divine Destinations"
    }
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const goSlide = (n) => setCurrent(n);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <div className="hero-slides">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === current ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
      </div>

      <div className="hero-content">
        <div className="hero-badge fade-up" style={{ animationDelay: '0.1s' }}>
          {slides[current].badge}
        </div>
        <h1 className="hero-title fade-up" style={{ animationDelay: '0.2s' }}>
          {slides[current].headline}
        </h1>
        <p className="hero-sub fade-up" style={{ animationDelay: '0.3s' }}>
          {slides[current].sub}
        </p>
        <div className="hero-actions fade-up" style={{ animationDelay: '0.4s' }}>
          <Link href={slides[current].link} className="btn btn-primary">
            ✦ Explore Packages
          </Link>
          <button className="btn-outline-white">
            Watch Journey <Play size={16} fill="currentColor" />
          </button>
        </div>
      </div>

      <div className="hero-dots">
        {slides.map((_, index) => (
          <button 
            key={index} 
            className={`hero-dot ${index === current ? 'active' : ''}`} 
            onClick={() => goSlide(index)}
          />
        ))}
      </div>

      <div className="scroll-hint">
        <div className="scroll-line"></div>
        <span>Scroll</span>
      </div>

      <style jsx>{`
        .hero {
          position: relative; height: 100vh; min-height: 600px;
          display: flex; align-items: center; overflow: hidden;
          background: #0D1B2A;
        }
        .hero-slides { position: absolute; inset: 0; }
        .hero-slide {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          opacity: 0; transition: opacity 1.5s ease-in-out;
        }
        .hero-slide.active { opacity: 1; }
        .hero-slide::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(13,27,42,0.80) 0%, rgba(13,27,42,0.30) 60%, transparent 100%);
        }
        
        .hero-content {
          position: relative; z-index: 2;
          padding: 0 5vw; width: 100%; max-width: 800px;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(232, 160, 32, 0.2); border: 1px solid rgba(232, 160, 32, 0.4);
          color: #F5C35A; font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 6px 16px; border-radius: 20px; margin-bottom: 25px;
          backdrop-filter: blur(8px);
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700; line-height: 1.1; color: #fff;
          margin-bottom: 20px;
        }
        .hero-title :global(span) { color: var(--primary-color); }
        .hero-sub {
          font-size: 1.1rem; color: rgba(255, 255, 255, 0.85);
          line-height: 1.7; max-width: 520px; margin-bottom: 35px;
        }
        .hero-actions { display: flex; gap: 15px; flex-wrap: wrap; }
        
        .btn-outline-white {
          background: transparent; color: #fff;
          font-weight: 600; font-size: 0.95rem;
          padding: 13px 28px; border-radius: 8px;
          border: 1.5px solid rgba(255,255,255,0.4); cursor: pointer;
          display: inline-flex; align-items: center; gap: 10px;
          transition: all 0.3s; backdrop-filter: blur(4px);
        }
        .btn-outline-white:hover { border-color: var(--primary-color); color: var(--primary-color); background: rgba(232,160,32,0.05); }

        .hero-dots {
          position: absolute; bottom: 40px; left: 5vw;
          display: flex; gap: 10px; z-index: 2;
        }
        .hero-dot {
          width: 10px; height: 10px; border-radius: 5px;
          background: rgba(255,255,255,0.3); border: none; cursor: pointer;
          transition: all 0.3s ease;
        }
        .hero-dot.active { width: 35px; background: var(--primary-color); }

        .scroll-hint {
          position: absolute; bottom: 40px; right: 5vw; z-index: 2;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.5); font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .scroll-line {
          width: 1px; height: 50px; background: rgba(255,255,255,0.2);
          position: relative; overflow: hidden;
        }
        .scroll-line::after {
          content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 50%;
          background: var(--primary-color); animation: scrollLine 2s infinite;
        }
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }

        @media (max-width: 1024px) {
          .scroll-hint { display: none; }
        }

        @media (max-width: 768px) {
          .hero-content { text-align: left; }
          .hero-actions { flex-direction: column; width: 100%; }
          .hero-actions > :global(a), .hero-actions > button { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;
