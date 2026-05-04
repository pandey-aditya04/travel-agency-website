'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
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

      <div className="container breadcrumbs">
        <Link href="/">Home</Link> / <Link href="/destinations">Destinations</Link> / <span>{pkg.title}</span>
      </div>

      <div className="container main-wrapper">
        <div className="content-side">
          {/* Main Image & Header */}
          <div className="main-card">
            <div className="main-image-box">
              <img src={pkg.cover_image_url} alt={pkg.title} />
              <div className="image-meta">
                <span><MapPin size={16} /> {pkg.destination}</span>
                <button className="wishlist-btn"><Star size={16} /> Get a quote</button>
              </div>
            </div>
            
            <div className="main-info">
              <h1 className="main-title">{pkg.title}</h1>
              <div className="quick-stats">
                <span className="duration"><Clock size={16} /> {pkg.duration_days} days</span>
              </div>
            </div>

            <div className="tabs-container">
              <h2 className="tab-title">Explore Tours</h2>
              <div className="description-box">
                <p>{pkg.short_description}</p>
                {pkg.long_description && <p>{pkg.long_description}</p>}
              </div>

              {/* Itinerary */}
              <div className="itinerary-section">
                <h3>Detailed Itinerary</h3>
                {pkg.itinerary?.map((item, i) => (
                  <div key={i} className="itinerary-step">
                    <div className="step-circle"></div>
                    <div className="step-content">
                      <h4>Day {item.day || i+1}: {item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Sidebar Form */}
        <aside className="sidebar-side">
          <div className="sticky-quote-card">
            <div className="price-header">
              <div className="price-val">₹{pkg.price_inr?.toLocaleString()} <span>/Per Person</span></div>
            </div>
            
            <div className="form-body">
              <h4>Get Free Quote</h4>
              <form onSubmit={handleEnquiry}>
                <div className="input-group">
                  <label>Travel Date</label>
                  <input type="date" name="travel_date" required />
                </div>
                
                <div className="pax-group">
                  <label>Pax</label>
                  <div className="stepper">
                    <span>Adult (18+ years)</span>
                    <div className="controls">
                      <button type="button">-</button>
                      <span>2</span>
                      <button type="button">+</button>
                    </div>
                  </div>
                  <div className="stepper">
                    <span>Child (0-12 years)</span>
                    <div className="controls">
                      <button type="button">-</button>
                      <span>0</span>
                      <button type="button">+</button>
                    </div>
                  </div>
                </div>

                <div className="contact-info">
                  <label>Contact Details</label>
                  <input type="text" name="full_name" placeholder="Your Fullname" required />
                  <input type="tel" name="phone" placeholder="Contact number" required />
                  <input type="text" name="departure" placeholder="Departure City" />
                </div>

                <button type="submit" className="quote-btn" disabled={leadStatus === 'loading'}>
                  {leadStatus === 'loading' ? 'Processing...' : 'Get Quote Now'}
                </button>
              </form>
            </div>
          </div>
        </aside>
      </div>

      <Footer />

      <style jsx>{`
        .pkg-detail-page { background: #f4f7f6; min-height: 100vh; padding-top: 80px; }
        .breadcrumbs { padding: 20px 5vw; font-size: 0.85rem; color: #888; }
        .breadcrumbs a { color: #555; text-decoration: none; }
        .breadcrumbs span { color: #222; font-weight: 600; }

        .main-wrapper { display: grid; grid-template-columns: 1fr 340px; gap: 40px; padding-bottom: 80px; }
        
        /* Left Side */
        .main-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .main-image-box { position: relative; height: 450px; }
        .main-image-box img { width: 100%; height: 100%; object-fit: cover; }
        .image-meta { position: absolute; bottom: 20px; left: 20px; right: 20px; display: flex; justify-content: space-between; align-items: center; }
        .image-meta span { background: #fff; padding: 6px 15px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 6px; }
        .wishlist-btn { background: #fff; border: none; padding: 6px 15px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; }

        .main-info { padding: 30px; border-bottom: 1px solid #eee; }
        .main-title { font-size: 2rem; font-weight: 800; color: #333; margin-bottom: 10px; }
        .quick-stats { color: #666; font-weight: 600; display: flex; gap: 20px; }

        .tabs-container { padding: 30px; }
        .tab-title { font-size: 1.4rem; font-weight: 800; color: #333; margin-bottom: 20px; }
        .description-box { color: #555; line-height: 1.7; font-size: 1rem; margin-bottom: 40px; }
        .description-box p { margin-bottom: 15px; }

        .itinerary-section h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 25px; }
        .itinerary-step { position: relative; padding-left: 30px; padding-bottom: 30px; }
        .itinerary-step:last-child { padding-bottom: 0; }
        .itinerary-step::before { content: ''; position: absolute; left: 4px; top: 10px; bottom: 0; width: 2px; background: #eee; }
        .itinerary-step:last-child::before { display: none; }
        .step-circle { position: absolute; left: 0; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #ff6a35; border: 2px solid #fff; box-shadow: 0 0 0 2px #ff6a35; }
        .step-content h4 { font-size: 1rem; font-weight: 700; margin-bottom: 8px; color: #222; }
        .step-content p { font-size: 0.9rem; color: #666; line-height: 1.6; }

        /* Sidebar Side */
        .sidebar-side { position: relative; }
        .sticky-quote-card { position: sticky; top: 100px; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border: 1px solid #eee; }
        
        .price-header { background: linear-gradient(to right, #ff8c42, #ff6a35); color: #fff; padding: 20px; text-align: center; }
        .price-val { font-size: 1.4rem; font-weight: 800; }
        .price-val span { font-size: 0.8rem; font-weight: 400; opacity: 0.9; }

        .form-body { padding: 25px; }
        .form-body h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; text-align: center; color: #333; }
        
        .input-group, .contact-info { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .input-group label, .contact-info label, .pax-group label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #999; margin-bottom: 5px; }
        
        input { width: 100%; padding: 12px; border: 1px solid #eee; border-radius: 6px; font-size: 0.9rem; background: #fafafa; outline: none; }
        input:focus { border-color: #ff6a35; background: #fff; }

        .pax-group { margin-bottom: 25px; }
        .stepper { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
        .stepper span { font-size: 0.85rem; color: #444; font-weight: 500; }
        .controls { display: flex; align-items: center; gap: 16px; }
        .controls button { width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid #ddd; background: #fff; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #333; transition: 0.2s; }
        .controls button:hover { border-color: #ff6a35; color: #ff6a35; }
        .controls span { width: 24px; text-align: center; font-weight: 700; color: #333; font-size: 1rem; }

        .quote-btn { width: 100%; background: #ff6a35; color: #fff; border: none; padding: 15px; border-radius: 8px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: 0.3s; margin-top: 10px; box-shadow: 0 4px 15px rgba(255,106,53,0.3); }
        .quote-btn:hover { background: #e85a2a; transform: translateY(-2px); }

        @media (max-width: 1024px) {
          .main-wrapper { grid-template-columns: 1fr; }
          .sidebar-side { order: -1; }
          .main-image-box { height: 300px; }
        }
      `}</style>
    </main>
  );
}
