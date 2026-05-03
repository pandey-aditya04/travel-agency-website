'use client';
import { useState, useEffect } from 'react';
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
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [leadStatus, setLeadStatus] = useState('idle'); // idle, loading, success, error

  useEffect(() => {
    async function fetchPkg() {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('slug', params.slug)
        .eq('status', 'published')
        .single();
      
      if (error || !data) {
        setPkg(null);
      } else {
        setPkg(data);
      }
      setLoading(false);
    }
    fetchPkg();
  }, [params.slug]);

  if (loading) return <div className="loading-state">Loading your journey...</div>;
  if (!pkg) return notFound();

  const handleEnquiry = async (e) => {
    e.preventDefault();
    setLeadStatus('loading');
    
    const formData = new FormData(e.target);
    const data = {
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      travel_date: formData.get('travel_date'),
      adults: parseInt(formData.get('adults')),
      children: parseInt(formData.get('children')),
      budget: formData.get('budget'),
      special_requests: formData.get('special_requests'),
      package_id: pkg.id,
      package_title: pkg.title,
      package_price: pkg.price
    };

    try {
      const res = await fetch('/api/leads', {
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
              <span>{pkg.price.toLocaleString()}</span>
              {pkg.original_price && <del>₹{pkg.original_price.toLocaleString()}</del>}
            </div>
          </div>
          <div className="features-desktop">
            <div className="feature"><Calendar size={18} /> Flexible Dates</div>
            <div className="feature"><Users size={18} /> Small Groups</div>
            <div className="feature"><ShieldCheck size={18} /> Verified Stay</div>
          </div>
          <button className="cta-btn" onClick={() => setShowModal(true)}>
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

        {/* Sidebar / Desktop Pricing */}
        <aside className="sidebar">
          <div className="pricing-card">
            <h3>Plan Your Trip</h3>
            <p>Our travel experts are ready to customize this package for you.</p>
            <div className="sidebar-features">
              <div className="s-feature"><ShieldCheck size={16} /> 100% Safe Payments</div>
              <div className="s-feature"><MessageSquare size={16} /> 24/7 Local Support</div>
            </div>
            <button className="sidebar-cta" onClick={() => setShowModal(true)}>Book Now</button>
          </div>
        </aside>
      </div>

      {/* Lead Capture Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <button className="close-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
            {leadStatus === 'success' ? (
              <div className="success-ui">
                <div className="success-icon">✅</div>
                <h2>Enquiry Sent!</h2>
                <p>Our travel experts will call you within 2 hours to discuss your plan.</p>
                <button className="btn btn-primary" onClick={() => setShowModal(false)}>Awesome!</button>
              </div>
            ) : (
              <div className="modal-form-wrap">
                <h2>Let's Plan Your Trip</h2>
                <p className="subtitle">Filling this for: <strong>{pkg.title}</strong></p>
                <form onSubmit={handleEnquiry} className="lead-form">
                  <div className="form-grid">
                    <div className="f-group"><label>Full Name</label><input name="full_name" required placeholder="Ravi Kumar" /></div>
                    <div className="f-group"><label>WhatsApp Number</label><input name="phone" type="tel" required placeholder="+91 98765 43210" /></div>
                    <div className="f-group"><label>Email Address</label><input name="email" type="email" required placeholder="ravi@example.com" /></div>
                    <div className="f-group"><label>Travel Date</label><input name="travel_date" type="date" required /></div>
                    <div className="f-group"><label>Adults</label><input name="adults" type="number" defaultValue="2" min="1" /></div>
                    <div className="f-group"><label>Children</label><input name="children" type="number" defaultValue="0" min="0" /></div>
                    <div className="f-group full"><label>Budget Range</label>
                      <select name="budget">
                        <option>Under ₹15,000</option>
                        <option>₹15,000–₹30,000</option>
                        <option>₹30,000–₹60,000</option>
                        <option>Above ₹1,00,000</option>
                      </select>
                    </div>
                    <div className="f-group full"><label>Special Requests</label><textarea name="special_requests" placeholder="Honeymoon, dietary needs, etc."></textarea></div>
                  </div>
                  <button type="submit" className="submit-btn" disabled={leadStatus === 'loading'}>
                    {leadStatus === 'loading' ? 'Sending...' : 'Send My Enquiry →'}
                  </button>
                  {leadStatus === 'error' && <p className="error-msg">Something went wrong. Please try again.</p>}
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sticky Mobile CTA */}
      <div className="mobile-cta-bar">
        <div className="m-price">₹{pkg.price.toLocaleString()} <span>/ person</span></div>
        <button className="m-btn" onClick={() => setShowModal(true)}>Book Now</button>
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

        /* Sidebar */
        .sidebar { position: sticky; top: 170px; height: fit-content; }
        .pricing-card { background: var(--navy); color: #fff; padding: 32px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
        .pricing-card h3 { font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 10px; }
        .pricing-card p { color: rgba(255,255,255,0.7); font-size: 0.9rem; line-height: 1.6; margin-bottom: 25px; }
        .sidebar-features { display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px; }
        .s-feature { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--amber); font-weight: 600; }
        .sidebar-cta { width: 100%; background: var(--amber); color: var(--navy); border: none; padding: 15px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 1rem; }

        /* Modal */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(13,27,42,0.8); backdrop-filter: blur(10px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-card { background: #fff; width: 100%; max-width: 600px; border-radius: 20px; padding: 40px; position: relative; max-height: 90vh; overflow-y: auto; }
        .close-btn { position: absolute; top: 20px; right: 20px; background: none; border: none; color: var(--slate); cursor: pointer; }
        .modal-form-wrap h2 { font-family: var(--font-display); font-size: 1.8rem; margin-bottom: 5px; }
        .subtitle { color: var(--text-muted); margin-bottom: 30px; font-size: 0.9rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .f-group.full { grid-column: span 2; }
        .f-group label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--slate); margin-bottom: 8px; }
        .f-group input, .f-group select, .f-group textarea { width: 100%; padding: 12px; border: 1.5px solid var(--border); border-radius: 8px; outline: none; font-size: 0.95rem; }
        .f-group textarea { height: 80px; resize: none; }
        .submit-btn { width: 100%; background: var(--amber); color: var(--navy); border: none; padding: 16px; border-radius: 8px; font-weight: 700; font-size: 1rem; margin-top: 30px; cursor: pointer; }
        .success-ui { text-align: center; padding: 20px; }
        .success-icon { font-size: 4rem; margin-bottom: 20px; }

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
