import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import SearchBar from '@/components/SearchBar';
import TripCard from '@/components/TripCard';
import { supabase } from '@/lib/supabase';
import { Map, Headphones, Wallet, ShieldCheck, CheckCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600;

async function getPackages() {
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('status', 'Published')
    .eq('featured', true);
  
  if (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
  return packages;
}

export default async function Home() {
  const featuredPackages = await getPackages();

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
        {indianEscapes.length > 0 ? (
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
        {overseasAdventures.length > 0 ? (
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
        {divineDestinations.length > 0 ? (
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

      <style jsx>{`
        .section-padding { padding: 100px 5vw; }
        .section-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; flex-wrap: wrap; margin-bottom: 50px; }
        .section-desc { color: var(--text-secondary); font-size: 1rem; max-width: 520px; margin-top: 10px; }
        
        .view-all-btn {
          font-size: .88rem; font-weight: 600; color: var(--primary-color);
          border: 1.5px solid var(--primary-color); padding: 10px 22px; border-radius: 8px;
          white-space: nowrap; transition: var(--transition);
        }
        .view-all-btn:hover { background: var(--primary-color); color: var(--secondary-color); }
        
        .empty-state { text-align: center; color: var(--text-secondary); padding: 50px; border: 1px dashed var(--border); border-radius: 14px; }

        /* Promo Banner */
        .promo-section { margin: 20px auto 100px; }
        .promo-banner { position: relative; border-radius: 20px; overflow: hidden; background: var(--secondary-color); min-height: 300px; display: flex; align-items: center; }
        .promo-bg { position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80'); background-size: cover; background-position: center; opacity: 0.25; }
        .promo-content { position: relative; z-index: 1; padding: 60px 8%; display: flex; align-items: center; justify-content: space-between; gap: 40px; width: 100%; flex-wrap: wrap; }
        .promo-text h2 { font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3.2rem); color: #fff; line-height: 1.1; margin-bottom: 10px; }
        .promo-text h2 span { color: var(--primary-color); }
        .promo-text p { color: rgba(255,255,255,0.6); font-size: 1.1rem; }
        .promo-text .label { color: var(--primary-color); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem; margin-bottom: 15px; }

        /* Stats Strip */
        .stats-strip { background: var(--secondary-color); padding: 80px 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; text-align: center; }
        .stat-num { font-family: var(--font-display); font-size: 3rem; font-weight: 700; color: var(--primary-color); }
        .stat-label { color: rgba(255,255,255,0.6); font-weight: 500; text-transform: uppercase; letter-spacing: 1px; font-size: 0.85rem; }

        /* Why Choose Us */
        .why-section { background: var(--white); padding: 100px 5vw; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
        .why-card { padding: 35px 25px; border-radius: 14px; border: 1px solid var(--border); transition: all 0.3s; }
        .why-card:hover { border-color: var(--primary-color); transform: translateY(-5px); box-shadow: 0 10px 30px rgba(232, 160, 32, 0.1); }
        .why-icon { width: 50px; height: 50px; border-radius: 12px; background: rgba(232, 160, 32, 0.1); display: flex; align-items: center; justify-content: center; color: var(--primary-color); margin-bottom: 20px; }
        .why-title { font-size: 1.1rem; margin-bottom: 10px; color: var(--secondary-color); }
        .why-desc { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; }

        /* Testimonials */
        .testi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .testi-card { background: var(--white); border-radius: 14px; border: 1px solid var(--border); padding: 35px; }
        .testi-stars { color: #FFD700; font-size: 1.1rem; margin-bottom: 15px; }
        .testi-quote { font-size: 1rem; font-style: italic; color: var(--text-primary); line-height: 1.7; margin-bottom: 25px; }
        .testi-author { display: flex; align-items: center; gap: 15px; }
        .testi-avatar { width: 45px; height: 45px; border-radius: 50%; background: var(--primary-color); color: var(--secondary-color); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; }
        .testi-name { font-weight: 700; font-size: 1rem; color: var(--secondary-color); }
        .testi-place { font-size: 0.85rem; color: var(--text-secondary); }

        /* CTA Strip */
        .cta-strip { background: var(--primary-color); padding: 60px 0; }
        .cta-content { display: flex; align-items: center; justify-content: space-between; gap: 30px; flex-wrap: wrap; }
        .cta-content h3 { font-family: var(--font-display); font-size: 2.2rem; color: var(--secondary-color); margin-bottom: 5px; }
        .cta-content p { color: rgba(13,27,42,0.7); font-weight: 500; font-size: 1.1rem; }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .promo-content { text-align: center; justify-content: center; }
          .cta-content { text-align: center; justify-content: center; }
          .section-padding { padding: 60px 5vw; }
          .promo-banner { min-height: auto; }
        }
      `}</style>
    </main>
  );
}
