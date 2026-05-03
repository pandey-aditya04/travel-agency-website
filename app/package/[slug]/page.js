'use client';
import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { 
  Clock, MapPin, Check, X, Calendar, Users, 
  ChevronDown, Star, Camera, IndianRupee, MessageSquare, 
  ShieldCheck, Info, Map
} from 'lucide-react';

export default function PackagePage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('CRITICAL: NEXT_PUBLIC_SUPABASE_URL is missing! Check your Vercel/Local env vars.');
  }
  const [activeDay, setActiveDay] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [leadStatus, setLeadStatus] = useState('idle'); // idle, loading, success, error

  useEffect(() => {
    async function fetchPkg() {
      if (!slug) return;
      console.log('Fetching package for identifier:', slug);
      
      let query = supabase.from('packages').select('*');
      
      // Check if slug is a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      
      if (isUUID) {
        query = query.eq('id', slug);
      } else {
        query = query.eq('slug', slug);
      }

      const { data, error } = await query.single();
      
      if (error || !data) {
        console.error('Fetch error:', error);
        setPkg(null);
      } else {
        console.log('Package loaded:', data.title);
        setPkg(data);
      }
      setLoading(false);
    }
    fetchPkg();
  }, [slug]);

  if (loading) return <div className="loading-state">Loading your journey...</div>;
  if (!pkg) return notFound();

  const scrollToForm = () => {
    document.querySelector('.sidebar')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnquiry = async (e) => {
    e.preventDefault();
    setLeadStatus('loading');
    
    const formData = new FormData(e.target);
    const data = {
      customer_name: formData.get('full_name'),
      customer_email: formData.get('email'),
      customer_phone: formData.get('phone'),
      travel_date: formData.get('travel_date'),
      travelers_count: parseInt(formData.get('travelers')),
      message: formData.get('special_requests'),
      package_id: pkg.id,
      package_title: pkg.title
    };

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) setLeadStatus('success');
      else throw new Error('Failed to send');
    } catch (err) {
      setLeadStatus('error');
    }
  };

  return (
    <main className="pkg-detail-page">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="pkg-hero">
        <div className="hero-overlay"></div>
        <img src={pkg.cover_image_url} alt={pkg.title} className="hero-img" />
        <div className="container hero-content">
          <div className="badge">{pkg.category}</div>
          <h1 className="title">{pkg.title}</h1>
          <div className="meta">
            <span><MapPin size={18} /> {pkg.destination}</span>
            <span><Clock size={18} /> {pkg.duration_days} Days</span>
            <span><Star size={18} fill="#E8A020" /> 4.9 (120+ Reviews)</span>
          </div>
        </div>
      </section>

      {/* 2. Sticky Overview Bar */}
      <div className="overview-bar">
        <div className="container bar-content">
          <div className="price-box">
            <span className="label">Starts from</span>
            <div className="price">
              <IndianRupee size={20} /> 
              <span>{pkg.price_inr?.toLocaleString()}</span>
              {pkg.original_price_inr && <del>₹{pkg.original_price_inr.toLocaleString()}</del>}
            </div>
          </div>
          <div className="features-desktop">
            <div className="feature"><Calendar size={18} /> Flexible Dates</div>
            <div className="feature"><Users size={18} /> Small Groups</div>
            <div className="feature"><ShieldCheck size={18} /> Verified Stay</div>
          </div>
          <button className="cta-btn" onClick={scrollToForm}>
            I'm Interested ✦
          </button>
        </div>
      </div>

      <div className="container main-layout">
        <div className="content-left">
          {/* 3. Highlights */}
          <section className="section">
            <h2 className="section-title"><Info size={22} /> Package Highlights</h2>
            <div className="highlights-grid">
              {pkg.highlights?.map((h, i) => (
                <div key={i} className="highlight-card">
                  <Check size={16} className="check-icon" /> {h}
                </div>
              ))}
            </div>
          </section>

          {/* 4. Description */}
          <section className="section">
            <h2 className="section-title"><MessageSquare size={22} /> Overview</h2>
            <p className="description-text">{pkg.short_description}</p>
          </section>

          {/* 5. Itinerary */}
          <section className="section">
            <h2 className="section-title"><Map size={22} /> Detailed Itinerary</h2>
            <div className="itinerary-list">
              {pkg.itinerary?.map((item, i) => (
                <div key={i} className={`itinerary-item ${activeDay === i ? 'active' : ''}`}>
                  <button className="itinerary-header" onClick={() => setActiveDay(activeDay === i ? -1 : i)}>
                    <div className="day-badge">Day {item.day || i+1}</div>
                    <span className="itinerary-title">{item.title}</span>
                    <ChevronDown className="chevron" size={20} />
                  </button>
                  <div className="itinerary-body">
                    <p className="itinerary-desc">{item.description}</p>
                    {item.activities && (
                      <div className="itinerary-activities">
                        <strong>Activities:</strong>
                        <ul>{item.activities.map((a, j) => <li key={j}>{a}</li>)}</ul>
                      </div>
                    )}
                    <div className="itinerary-meta">
                      {item.meals && <span>🍴 {item.meals.join(', ')}</span>}
                      {item.accommodation && <span>🏨 {item.accommodation}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Gallery */}
          {pkg.gallery_urls?.length > 0 && (
            <section className="section">
              <h2 className="section-title"><Camera size={22} /> Photo Gallery</h2>
              <div className="gallery-grid">
                {pkg.gallery_urls.map((url, i) => (
                  <div key={i} className="gallery-item">
                    <img src={url} alt={`Gallery ${i}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 7. Inclusions & Exclusions */}
          <section className="section inc-exc-grid">
            <div className="card inclusions">
              <h3>✅ Inclusions</h3>
              <ul>
                {pkg.inclusions?.map((item, i) => <li key={i}><Check size={14} /> {item}</li>)}
              </ul>
            </div>
            <div className="card exclusions">
              <h3>❌ Exclusions</h3>
              <ul>
                {pkg.exclusions?.map((item, i) => <li key={i}><X size={14} /> {item}</li>)}
              </ul>
            </div>
          </section>
        </div>

        {/* Sidebar / Inline Booking Form */}
        <aside className="sidebar">
          <div className="booking-sidebar-card">
            <div className="booking-header">
              <h3>Plan Your Trip</h3>
              <p>Our travel experts are ready to customize this package for you.</p>
            </div>
            
            {leadStatus === 'success' ? (
              <div className="success-ui-inline">
                <div className="success-icon">✅</div>
                <h4>Enquiry Sent!</h4>
                <p>We'll contact you within 2 hours.</p>
                <button className="btn btn-primary" onClick={() => setLeadStatus('idle')}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleEnquiry} className="sidebar-form">
                <div className="f-group"><label>Full Name</label><input name="full_name" required placeholder="Ravi Kumar" /></div>
                <div className="f-group"><label>WhatsApp Number</label><input name="phone" type="tel" required placeholder="+91 98765 43210" /></div>
                <div className="f-group"><label>Email Address</label><input name="email" type="email" required placeholder="ravi@example.com" /></div>
                <div className="f-group"><label>Travel Date</label><input name="travel_date" type="date" required /></div>
                <div className="f-group"><label>Number of Travelers</label><input name="travelers" type="number" defaultValue="2" min="1" /></div>
                <div className="f-group"><label>Special Requests</label><textarea name="special_requests" placeholder="Honeymoon, dietary needs, etc."></textarea></div>
                
                <button type="submit" className="submit-btn-sidebar" disabled={leadStatus === 'loading'}>
                  {leadStatus === 'loading' ? 'Sending...' : 'Request Free Quote →'}
                </button>
                {leadStatus === 'error' && <p className="error-msg">Failed. Try again.</p>}
              </form>
            )}

            <div className="sidebar-trust">
              <div className="s-feature"><ShieldCheck size={16} /> 100% Safe Payments</div>
              <div className="s-feature"><MessageSquare size={16} /> 24/7 Local Support</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="mobile-cta-bar">
        <div className="m-price">₹{pkg.price_inr?.toLocaleString()} <span>/ person</span></div>
        <button className="m-btn" onClick={scrollToForm}>Book Now</button>
      </div>

      <Footer />

      <style jsx>{`
        .loading-state { height: 100vh; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 1.5rem; color: var(--navy); }
        
        /* Hero */
        .pkg-hero { position: relative; height: 70vh; min-height: 500px; display: flex; align-items: flex-end; overflow: hidden; }
        .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, rgba(13,27,42,0.8)); z-index: 1; }
        .hero-content { position: relative; z-index: 2; padding-bottom: 60px; color: #fff; }
        .badge { display: inline-block; background: var(--amber); color: var(--navy); padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.8rem; margin-bottom: 15px; }
        .title { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 20px; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
        .meta { display: flex; gap: 30px; font-weight: 500; font-size: 1rem; color: rgba(255,255,255,0.9); }
        .meta span { display: flex; align-items: center; gap: 8px; }

        /* Overview Bar */
        .overview-bar { position: sticky; top: 70px; background: #fff; border-bottom: 1px solid var(--border); z-index: 900; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .bar-content { height: 80px; display: flex; align-items: center; justify-content: space-between; }
        .price-box .label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
        .price { display: flex; align-items: center; gap: 6px; font-size: 1.6rem; font-weight: 800; color: var(--navy); }
        .price del { font-size: 1rem; color: #999; font-weight: 400; margin-left: 10px; }
        .features-desktop { display: flex; gap: 30px; }
        .feature { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: var(--slate); }
        .cta-btn { background: var(--amber); color: var(--navy); padding: 12px 30px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(232,160,32,0.4); }

        /* Layout */
        .main-layout { display: grid; grid-template-columns: 1fr 350px; gap: 60px; padding: 60px 0; }
        .section { margin-bottom: 60px; }
        .section-title { font-family: var(--font-display); font-size: 1.6rem; margin-bottom: 25px; display: flex; align-items: center; gap: 12px; color: var(--navy); }
        
        .highlights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .highlight-card { background: #fff; border: 1px solid var(--border); padding: 12px 16px; border-radius: 8px; display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: var(--text); }
        .check-icon { color: #10B981; }
        .description-text { font-size: 1.05rem; line-height: 1.8; color: var(--text-muted); white-space: pre-line; }

        /* Itinerary */
        .itinerary-list { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
        .itinerary-item { border-bottom: 1px solid var(--border); }
        .itinerary-header { width: 100%; display: flex; align-items: center; gap: 20px; padding: 20px; background: #fff; border: none; cursor: pointer; transition: 0.2s; }
        .day-badge { background: var(--navy); color: var(--amber); padding: 4px 12px; border-radius: 4px; font-weight: 700; font-size: 0.8rem; }
        .itinerary-title { flex: 1; text-align: left; font-weight: 700; font-size: 1.05rem; color: var(--navy); }
        .itinerary-body { max-height: 0; overflow: hidden; padding: 0 20px; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); background: #F9FAFB; }
        .itinerary-item.active .itinerary-body { max-height: 500px; padding: 20px; }
        .itinerary-item.active .chevron { transform: rotate(180deg); }
        .itinerary-desc { line-height: 1.7; color: var(--text-muted); margin-bottom: 15px; }
        .itinerary-meta { display: flex; gap: 20px; font-size: 0.85rem; font-weight: 600; color: var(--slate); }

        /* Gallery */
        .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
        .gallery-item { border-radius: 12px; overflow: hidden; height: 150px; }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .gallery-item:hover img { transform: scale(1.1); }

        /* Inc / Exc */
        .inc-exc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .card { padding: 30px; border-radius: 16px; height: 100%; }
        .inclusions { background: #F0FDF4; border: 1px solid #DCFCE7; }
        .exclusions { background: #FEF2F2; border: 1px solid #FEE2E2; }
        .card h3 { font-size: 1.1rem; margin-bottom: 20px; }
        .card ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .card li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; line-height: 1.4; color: var(--text); }

        /* Sidebar Booking Card */
        .sidebar { position: sticky; top: 100px; height: fit-content; z-index: 10; }
        .booking-sidebar-card { background: #fff; border: 1px solid var(--border); border-radius: 20px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.08); }
        .booking-header { background: var(--navy); color: #fff; padding: 25px; text-align: center; }
        .booking-header h3 { font-family: var(--font-display); font-size: 1.3rem; margin-bottom: 8px; }
        .booking-header p { font-size: 0.85rem; color: rgba(255,255,255,0.7); line-height: 1.5; }
        
        .sidebar-form { padding: 25px; display: flex; flex-direction: column; gap: 15px; }
        .success-ui-inline { padding: 40px 25px; text-align: center; }
        .success-ui-inline .success-icon { font-size: 3rem; margin-bottom: 15px; }
        .success-ui-inline h4 { font-size: 1.2rem; margin-bottom: 10px; color: var(--navy); }
        .success-ui-inline p { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px; }

        .submit-btn-sidebar { background: var(--amber); color: var(--navy); border: none; padding: 15px; border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: 0.3s; margin-top: 10px; }
        .submit-btn-sidebar:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(232,160,32,0.4); }
        
        .sidebar-trust { padding: 20px 25px; background: #F9FAFB; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 12px; }
        .s-feature { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; color: var(--slate); font-weight: 600; }
        
        .f-group label { display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--slate); margin-bottom: 6px; }
        .f-group input, .f-group textarea { width: 100%; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 8px; outline: none; font-size: 0.9rem; transition: 0.3s; }
        .f-group input:focus, .f-group textarea:focus { border-color: var(--amber); }
        .f-group textarea { height: 70px; resize: none; }

        .error-msg { color: #EF4444; font-size: 0.8rem; text-align: center; margin-top: 10px; font-weight: 600; }

        /* Mobile Bar */
        .mobile-cta-bar { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 15px 5vw; border-top: 1px solid var(--border); z-index: 1000; box-shadow: 0 -10px 30px rgba(0,0,0,0.1); justify-content: space-between; align-items: center; }
        .m-price { font-weight: 800; font-size: 1.4rem; color: var(--navy); }
        .m-price span { font-size: 0.8rem; color: var(--text-muted); font-weight: 400; }
        .m-btn { background: var(--amber); color: var(--navy); padding: 12px 25px; border-radius: 8px; border: none; font-weight: 700; }

        @media (max-width: 1024px) {
          .main-layout { grid-template-columns: 1fr; }
          .sidebar { display: none; }
          .features-desktop { display: none; }
        }
        @media (max-width: 768px) {
          .mobile-cta-bar { display: flex; }
          .overview-bar { display: none; }
          .inc-exc-grid { grid-template-columns: 1fr; }
          .gallery-grid { grid-template-columns: 1fr 1fr; }
          .highlights-grid { grid-template-columns: 1fr; }
          .pkg-hero { height: 50vh; }
          .form-grid { grid-template-columns: 1fr; }
          .f-group.full { grid-column: span 1; }
        }
      `}</style>
    </main>
  );
}
