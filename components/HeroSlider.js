'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSlider = () => {
  const slides = [
    {
      category: "Indian Escapes",
      headline: "Discover India, Create Memories",
      cta: "Explore Now",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1920&fm=webp",
      link: "/destinations?category=Indian Escapes"
    },
    {
      category: "Overseas Adventures",
      headline: "Explore Worlds, Lifetime Adventures",
      cta: "Explore Now",
      image: "https://images.unsplash.com/photo-1531210483974-4f8c1f33fd35?auto=format&fit=crop&q=80&w=1920&fm=webp",
      link: "/destinations?category=Overseas Adventures"
    },
    {
      category: "Divine Destinations",
      headline: "Discover Spiritual Travel Bliss",
      cta: "Explore Now",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1920&fm=webp",
      link: "/destinations?category=Divine Destinations"
    }
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      {slides.map((slide, index) => (
        <div
          key={index}
          className="hero-slide"
          style={{
            backgroundImage: `url(${slide.image})`,
            opacity: index === current ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: index === current ? 1 : 0
          }}
        >
          <div className="hero-overlay"></div>
          <div className="container hero-content">
            <p className="hero-category animate-fade" style={{ animationDelay: '0.2s' }}>{slide.category}</p>
            <h1 className="hero-headline animate-fade" style={{ animationDelay: '0.4s' }}>{slide.headline}</h1>
            <Link 
              href={slide.link} 
              className="btn btn-primary animate-fade" 
              style={{ animationDelay: '0.6s', padding: '15px 40px', fontSize: '1.1rem' }}
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      ))}

      {/* Slider Controls */}
      <div style={{ position: 'absolute', bottom: '30px', right: '50px', zIndex: 10, display: 'flex', gap: '15px' }}>
        <button onClick={prevSlide} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <ChevronLeft />
        </button>
        <button onClick={nextSlide} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;
