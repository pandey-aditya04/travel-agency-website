'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import SearchBar from '@/components/SearchBar';
import TripCard from '@/components/TripCard';
import SkeletonCard from '@/components/SkeletonCard';
import { supabase } from '@/lib/supabase';
import { Map, Headphones, Wallet, ShieldCheck, CheckCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('status', 'Published')
        .eq('featured', true);
      
      if (!error && data) {
        setFeaturedPackages(data);
      }
      setLoading(false);
    }
    fetchPackages();
  }, []);

  const indianEscapes = featuredPackages.filter(p => p.category === 'Indian Escapes');
  const overseasAdventures = featuredPackages.filter(p => p.category === 'Overseas Adventures');
  const divineDestinations = featuredPackages.filter(p => p.category === 'Divine Destinations');

  return (
    <main style={{ backgroundColor: 'var(--background-color)' }}>
      <Navbar />
      <HeroSlider />
      <SearchBar />

      {/* Indian Escapes Section */}
      <section className="container section-padding">
        <div className="section-header">
          <div>
            <p className="section-label">✦ Indian Escapes</p>
            <h2 className="section-title">Explore Popular <em>Indian</em> Destinations</h2>
            <p className="section-desc">Discover India's most loved destinations filled with culture, beauty, and adventure.</p>
          </div>
          <Link href="/destinations?category=Indian Escapes" className="view-all-btn">View All</Link>
        </div>
        {loading ? (
          <div className="grid">
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : indianEscapes.length > 0 ? (
          <div className="grid">
            {indianEscapes.map(pkg => <TripCard key={pkg.id} pkg={pkg} />)}
          </div>
        ) : (
          <div className="empty-state">No featured Indian escapes at the moment.</div>
        )}
      </section>

      {/* Promo Banner */}
      <div className="container promo-section">
        <div className="promo-banner">
          <div className="promo-bg"></div>
          <div className="promo-content">
            <div className="promo-text">
              <p className="label">🔥 Limited Time Offer</p>
              <h2>Up to <span>80% OFF</span> on<br/>Selected Destinations</h2>
              <p>Book your dream vacation today and save big on travel packages.</p>
            </div>
            <div className="promo-cta">
              <Link href="/destinations" className="btn btn-primary">Discover Deals ✦</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Overseas Adventures Section */}
      <section className="container section-padding">
        <div className="section-header">
          <div>
            <p className="section-label">✦ Overseas Adventures</p>
            <h2 className="section-title">Most Popular <em>Overseas</em> Picks</h2>
            <p className="section-desc">Travel beyond borders with unforgettable international adventure tours.</p>
          </div>
          <Link href="/destinations?category=Overseas Adventures" className="view-all-btn">View All</Link>
        </div>
        {loading ? (
          <div className="grid">
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : overseasAdventures.length > 0 ? (
          <div className="grid">
            {overseasAdventures.map(pkg => <TripCard key={pkg.id} pkg={pkg} />)}
          </div>
        ) : (
          <div className="empty-state">No featured overseas adventures at the moment.</div>
        )}
      </section>

      {/* Stats Strip */}
      <div className="stats-strip">
        <div className="container stats-grid">
          {[
            { num: "500+", label: "Flight Bookings" },
            { num: "200+", label: "Cruises Booked" },
            { num: "1000+", label: "Amazing Tours" },
            { num: "800+", label: "Hotel Bookings" }
          ].map((stat, i) => (
            <div key={i} className="stat-item">
              <div className="stat-num">{stat.num}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Divine Destinations Section */}
      <section className="container section-padding">
        <div className="section-header">
          <div>
            <p className="section-label">✦ Divine Destinations</p>
            <h2 className="section-title">Find <em>Peace</em> For Your Next Trip</h2>
            <p className="section-desc">Holy destinations that inspire faith, devotion, and inner peace.</p>
          </div>
          <Link href="/destinations?category=Divine Destinations" className="view-all-btn">View All</Link>
        </div>
        {loading ? (
          <div className="grid">
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : divineDestinations.length > 0 ? (
          <div className="grid">
            {divineDestinations.map(pkg => <TripCard key={pkg.id} pkg={pkg} />)}
          </div>
        ) : (
          <div className="empty-state">No featured divine destinations at the moment.</div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="why-section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <div>
              <p className="section-label">✦ Why Choose Us</p>
              <h2 className="section-title">We Deliver <em>Seamless</em> Journeys</h2>
            </div>
          </div>
          <div className="why-grid">
            {[
              { icon: <Map />, title: "Expertly Crafted", desc: "Every tour tailored to your specific travel needs and budget." },
              { icon: <Headphones />, title: "24/7 Support", desc: "Always there for you — before, during, and after your journey." },
              { icon: <Wallet />, title: "Affordable Pricing", desc: "Best value for money. Transparent pricing with no hidden costs." },
              { icon: <ShieldCheck />, title: "Trusted Network", desc: "Vetted hotels, experienced guides, and reliable transport." },
              { icon: <CheckCircle />, title: "Great Experience", desc: "Personalized touches that make every trip unforgettable." }
            ].map((item, i) => (
              <div key={i} className="why-card">
                <div className="why-icon">{item.icon}</div>
                <h4 className="why-title">{item.title}</h4>
                <p className="why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container section-padding">
        <div className="section-header">
          <div>
            <p className="section-label">✦ Testimonials</p>
            <h2 className="section-title">What Our <em>Happy</em> Clients Say</h2>
          </div>
        </div>
        <div className="testi-grid">
          {[
            { name: "Akash Kumar", place: "Mumbai, India", quote: "Thanks to RM Yaatra, we had the most relaxing holiday in the Maldives. Every detail was handled with care." },
            { name: "Shivi Sharma", place: "New Delhi, India", quote: "The team is incredibly professional and made our Rajasthan trip absolutely magical. Best travel agency!" },
            { name: "Ravi Tiwari", place: "Lucknow, India", quote: "The Char Dham Yatra package was beyond expectations. Smooth logistics and knowledgeable guides." }
          ].map((t, i) => (
            <div key={i} className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-quote">"{t.quote}"</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.name[0]}</div>
                <div>
                  <p className="testi-name">{t.name}</p>
                  <p className="testi-place">{t.place}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Strip */}
      <div className="cta-strip">
        <div className="container cta-content">
          <div>
            <h3>Ready to Start Your Journey?</h3>
            <p>Get expert assistance and exclusive deals 24/7 on WhatsApp.</p>
          </div>
          <a href="https://wa.me/919520235209" className="btn btn-secondary" style={{ backgroundColor: '#0D1B2A', color: '#fff' }}>
            <MessageSquare size={20} fill="#fff" /> Chat on WhatsApp
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
