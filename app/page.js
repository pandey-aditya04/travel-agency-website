'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import SearchBar from '@/components/SearchBar';
import TripCard from '@/components/TripCard';
import SkeletonCard from '@/components/SkeletonCard';
import { supabase } from '@/lib/supabase';
import { Map, Headphones, Wallet, ShieldCheck, CheckCircle, MessageSquare, Plane, Ship, Star, Play, Send } from 'lucide-react';
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
    <main className="home-container">
      <Navbar />
      <HeroSlider />
      <SearchBar />

      {/* 1. Indian Escapes (Landscape Cards) */}
      <section className="container section-padding">
        <div className="section-header-v2">
          <div className="header-text">
            <p className="label-v2">Indian Escapes</p>
            <h2 className="title-v2">Explore Popular <em>Indian</em> Destinations</h2>
          </div>
          <Link href="/destinations?category=Indian Escapes" className="view-btn-v2">View All Indian Destinations</Link>
        </div>
        
        <div className="landscape-grid">
          {loading ? [1,2,3,4].map(i => <div key={i} className="skeleton-landscape"></div>) : 
            indianEscapes.slice(0, 4).map(pkg => (
              <div key={pkg.id} className="landscape-card">
                <img src={pkg.cover_image_url} alt={pkg.title} />
                <div className="card-overlay-v2">
                  <p className="card-days">{pkg.duration_days} Days</p>
                  <h4 className="card-title-v2">{pkg.title}</h4>
                  <Link href={`/package/${pkg.slug || pkg.id}`} className="view-pkg-btn">View Package Details</Link>
                </div>
              </div>
            ))
          }
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/destinations" className="blue-btn">View All Indian Destinations</Link>
        </div>
      </section>

      {/* 2. Stats Section (Full Width Image) */}
      <section className="stats-banner">
        <div className="stats-overlay"></div>
        <div className="container stats-content">
          <div className="stat-item-v2">
            <div className="icon-circle"><Plane size={24} /></div>
            <h3>500</h3>
            <p>Flight Booking</p>
          </div>
          <div className="stat-item-v2">
            <div className="icon-circle"><Ship size={24} /></div>
            <h3>250</h3>
            <p>Cruises Booking</p>
          </div>
          <div className="stat-item-v2">
            <div className="icon-circle"><Star size={24} /></div>
            <h3>750</h3>
            <p>Amazing Tour</p>
          </div>
          <div className="stat-item-v2">
            <div className="icon-circle"><Map size={24} /></div>
            <h3>150</h3>
            <p>Hotel Booking</p>
          </div>
        </div>
      </section>

      {/* 3. Divine Destinations (Centered Header) */}
      <section className="divine-section">
        <div className="container">
          <div className="divine-header">
            <p className="label-pink">Divine Destinations</p>
            <h2>Find Peace For Your Next Trip</h2>
            <p className="subtitle">Discover divine destinations that inspire faith, devotion, and inner peace.</p>
          </div>

          <div className="divine-grid">
            {divineDestinations.slice(0, 3).map(pkg => (
              <div key={pkg.id} className="horizontal-card">
                <img src={pkg.cover_image_url} alt={pkg.title} />
                <div className="h-card-content">
                  <h4>{pkg.title}</h4>
                  <p>{pkg.short_description?.substring(0, 60)}...</p>
                  <Link href={`/package/${pkg.slug || pkg.id}`}>Learn More →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us (Two Columns) */}
      <section className="why-section-v2">
        <div className="container why-grid-v2">
          <div className="why-left">
            <p className="label-pink">WHY CHOOSE US</p>
            <h2>We deliver seamless journeys</h2>
            <p className="desc">Choose us for trusted service, personalized tours, and unforgettable travel experiences.</p>
            
            <div className="check-list">
              <div className="check-item"><span>✓</span> Expertly crafted tour packages tailored to your needs</div>
              <div className="check-item"><span>✓</span> 24/7 customer support for a stress-free journey</div>
              <div className="check-item"><span>✓</span> Affordable pricing with no hidden costs</div>
              <div className="check-item"><span>✓</span> Trusted network of hotels, guides, and transport</div>
            </div>
            
            <Link href="/contact" className="contact-btn-blue">Contact Us</Link>
          </div>

          <div className="why-right">
            <div className="promo-card-v2">
              <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80" alt="Promo" />
              <div className="promo-overlay-v2">
                <p className="discover-label">discover</p>
                <p className="limited-text">It's Limited Seating! Hurry Up</p>
                <div className="off-box">
                  <span className="num">45</span>
                  <span className="perc">% OFF</span>
                </div>
                <p className="promo-tag">New Experiences in Thailand</p>
                <button className="book-now-btn">Book Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Video Section */}
      <section className="video-section">
        <div className="video-overlay"></div>
        <div className="container video-content">
          <p className="video-label">Our Video</p>
          <h2>Travel Tips And Advice</h2>
          <div className="play-btn-circle">
            <Play size={32} fill="#fff" />
          </div>
        </div>
      </section>

      {/* 6. Support & Newsletter Strip */}
      <section className="bottom-strip">
        <div className="container strip-grid">
          <div className="support-box">
            <div className="support-text">
              <h3>24/7 Customer Support</h3>
              <p>Contact us now to have all of your tour-related questions answered.</p>
            </div>
            <div className="support-actions">
              <div className="avatars">
                <img src="https://i.pravatar.cc/150?u=1" alt="agent" />
                <img src="https://i.pravatar.cc/150?u=2" alt="agent" />
                <img src="https://i.pravatar.cc/150?u=3" alt="agent" />
              </div>
              <button className="chat-btn">Chat Now</button>
            </div>
          </div>

          <div className="newsletter-box">
            <div className="newsletter-text">
              <h3>Sign Up for Our Newsletter</h3>
              <p>Save up to 50% on tours and trips. Get instant access to lower prices.</p>
            </div>
            <div className="newsletter-form-v2">
              <input type="email" placeholder="Submit Your Email" />
              <button className="send-btn"><Send size={18} /></button>
            </div>
            <img src="https://illustrations.popsy.co/amber/tourist-with-luggage.svg" className="tourist-img" alt="Tourist" />
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .home-container { 
          background-color: #fff; 
          background-image: url("https://www.transparenttextures.com/patterns/topography.png"); 
          background-attachment: fixed; 
          overflow-x: hidden;
        }
        .section-padding { padding: 100px 5vw; }
        
        /* Headers */
        .section-header-v2 { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px; }
        .label-v2 { color: #5B72EE; font-weight: 700; text-transform: uppercase; font-size: 0.9rem; margin-bottom: 10px; }
        .title-v2 { font-size: 2.5rem; font-weight: 800; color: #1A2D42; }
        .title-v2 em { color: #E8A020; font-style: normal; }
        .view-btn-v2 { background: #3B52E1; color: #fff; padding: 12px 25px; border-radius: 6px; font-weight: 600; }

        /* Landscape Grid */
        .landscape-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .landscape-card { position: relative; height: 260px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .landscape-card img { width: 100%; height: 100%; object-fit: cover; }
        .card-overlay-v2 { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; text-align: center; padding: 20px; }
        .card-days { font-size: 0.8rem; font-weight: 700; margin-bottom: 8px; text-transform: uppercase; }
        .card-title-v2 { font-size: 1.1rem; font-weight: 800; margin-bottom: 20px; line-height: 1.3; }
        .view-pkg-btn { font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.4); padding: 8px 18px; border-radius: 4px; background: rgba(255,255,255,0.1); backdrop-filter: blur(4px); }
        .blue-btn { display: inline-block; background: #3B52E1; color: #fff; padding: 14px 35px; border-radius: 8px; font-weight: 700; }

        /* Stats Banner */
        .stats-banner { 
          position: relative; 
          height: 450px; 
          background: url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80'); 
          background-size: cover; 
          background-position: center; 
          display: flex; 
          align-items: center; 
          margin: 80px 0;
        }
        .stats-overlay { position: absolute; inset: 0; background: rgba(13,27,42,0.6); }
        .stats-content { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; text-align: center; color: #fff; }
        .icon-circle { width: 60px; height: 60px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .stat-item-v2 h3 { font-size: 3.5rem; font-weight: 800; margin-bottom: 5px; }
        .stat-item-v2 p { font-size: 1.1rem; font-weight: 600; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; }

        /* Divine Section */
        .divine-section { padding: 100px 5vw; background: #fff; }
        .divine-header { text-align: center; max-width: 700px; margin: 0 auto 60px; }
        .label-pink { color: #E85D75; font-weight: 700; text-transform: uppercase; font-size: 0.9rem; margin-bottom: 10px; display: block; }
        .divine-header h2 { font-size: 2.8rem; font-weight: 800; color: #1A2D42; margin-bottom: 15px; }
        .divine-header .subtitle { color: #666; font-size: 1.1rem; }
        .divine-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        .horizontal-card { display: flex; background: #f9f9f9; border-radius: 12px; overflow: hidden; height: 160px; border: 1px solid #eee; }
        .horizontal-card img { width: 140px; height: 100%; object-fit: cover; }
        .h-card-content { padding: 20px; flex: 1; }
        .h-card-content h4 { font-size: 1.1rem; margin-bottom: 8px; color: #1A2D42; }
        .h-card-content p { font-size: 0.85rem; color: #666; margin-bottom: 12px; }
        .h-card-content a { font-size: 0.85rem; font-weight: 700; color: #3B52E1; }

        /* Why Choose Us V2 */
        .why-section-v2 { padding: 100px 5vw; background: #fdfdfd; }
        .why-grid-v2 { display: grid; grid-template-columns: 1.2fr 1fr; gap: 80px; align-items: center; }
        .why-left h2 { font-size: 3rem; font-weight: 900; color: #1A2D42; margin-bottom: 20px; line-height: 1.1; }
        .why-left .desc { font-size: 1.1rem; color: #666; margin-bottom: 35px; }
        .check-list { display: flex; flex-direction: column; gap: 15px; margin-bottom: 40px; }
        .check-item { display: flex; gap: 12px; font-weight: 600; color: #1A2D42; font-size: 1rem; }
        .check-item span { color: #FF6A35; font-weight: 900; }
        .contact-btn-blue { background: #3B52E1; color: #fff; padding: 15px 40px; border-radius: 8px; font-weight: 700; display: inline-block; }

        .why-right .promo-card-v2 { position: relative; border-radius: 20px; overflow: hidden; height: 500px; box-shadow: 0 30px 60px rgba(0,0,0,0.15); }
        .why-right .promo-card-v2 img { width: 100%; height: 100%; object-fit: cover; }
        .promo-overlay-v2 { position: absolute; inset: 0; background: rgba(0,0,0,0.2); padding: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #fff; }
        .discover-label { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.8rem; margin-bottom: 10px; }
        .limited-text { font-weight: 700; font-size: 1rem; opacity: 0.9; margin-bottom: 20px; }
        .off-box { display: flex; align-items: flex-end; margin-bottom: 15px; }
        .off-box .num { font-size: 6rem; font-weight: 900; color: #FF6A35; line-height: 1; }
        .off-box .perc { font-size: 2rem; font-weight: 800; margin-bottom: 15px; margin-left: 5px; }
        .promo-tag { font-size: 1.2rem; font-weight: 700; margin-bottom: 30px; }
        .book-now-btn { background: #FF6A35; color: #fff; padding: 12px 35px; border-radius: 6px; font-weight: 700; }

        /* Video Section */
        .video-section { 
          position: relative; 
          height: 600px; 
          background: url('https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1920&q=80'); 
          background-size: cover; 
          background-position: center; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          margin-bottom: 100px;
        }
        .video-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); }
        .video-content { position: relative; z-index: 2; text-align: center; color: #fff; }
        .video-label { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.5rem; margin-bottom: 10px; }
        .video-content h2 { font-size: 3.5rem; font-weight: 900; margin-bottom: 40px; }
        .play-btn-circle { width: 90px; height: 90px; background: #FF6A35; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; cursor: pointer; box-shadow: 0 0 0 15px rgba(255,106,53,0.2); transition: 0.3s; }
        .play-btn-circle:hover { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(255,106,53,0.3); }

        /* Bottom Strip */
        .bottom-strip { padding: 80px 5vw; background: #f4f7f6; border-top: 1px solid #eee; }
        .strip-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .support-box h3, .newsletter-box h3 { font-size: 1.8rem; font-weight: 800; color: #1A2D42; margin-bottom: 10px; }
        .support-box p, .newsletter-box p { color: #666; margin-bottom: 30px; max-width: 400px; }
        .support-actions { display: flex; align-items: center; gap: 20px; }
        .avatars { display: flex; }
        .avatars img { width: 45px; height: 45px; border-radius: 50%; border: 3px solid #fff; margin-left: -15px; }
        .avatars img:first-child { margin-left: 0; }
        .chat-btn { background: #1A2D42; color: #fff; padding: 12px 30px; border-radius: 6px; font-weight: 700; }

        .newsletter-box { position: relative; }
        .newsletter-form-v2 { position: relative; max-width: 400px; }
        .newsletter-form-v2 input { width: 100%; padding: 18px 25px; border-radius: 50px; border: 1px solid #ddd; outline: none; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .send-btn { position: absolute; right: 8px; top: 8px; bottom: 8px; width: 50px; background: #FF6A35; border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; }
        .tourist-img { position: absolute; right: -150px; top: -100px; width: 250px; pointer-events: none; }

        @media (max-width: 1200px) {
          .strip-grid { grid-template-columns: 1fr; gap: 60px; }
          .tourist-img { display: none; }
        }
        @media (max-width: 1024px) {
          .landscape-grid { grid-template-columns: 1fr 1fr; }
          .divine-grid { grid-template-columns: 1fr; }
          .why-grid-v2 { grid-template-columns: 1fr; }
          .stats-content { grid-template-columns: 1fr 1fr; gap: 30px; }
          .stat-item-v2 h3 { font-size: 2.5rem; }
        }
        @media (max-width: 600px) {
          .landscape-grid { grid-template-columns: 1fr; gap: 15px; }
          .title-v2 { font-size: clamp(1.5rem, 6vw, 2.2rem); }
          .section-padding { padding: 60px 5vw; }
          .stats-content { grid-template-columns: 1fr; }
          .stat-item-v2 h3 { font-size: 2.2rem; }
          .video-content h2 { font-size: 1.8rem; }
          .divine-header h2 { font-size: 2rem; }
          .why-left h2 { font-size: 2rem; }
          .section-header-v2 { flex-direction: column; align-items: flex-start; gap: 15px; }
        }
      `}</style>
    </main>
  );
}
