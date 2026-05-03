'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/auth';
import { Clock, MapPin, Check, X, Calendar, Users, Phone, Mail } from 'lucide-react';

export default function PackageDetail({ params }) {
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bookingData, setBookingData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    adults: 1,
    children: 0,
    travel_date: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPackage();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const currentUser = await getUser();
    if (currentUser) {
      setUser(currentUser);
      // Fetch profile for name/phone
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
      setBookingData(prev => ({
        ...prev,
        customer_name: profile?.full_name || '',
        customer_email: currentUser.email || '',
        customer_phone: profile?.phone || ''
      }));
    }
  };

  const fetchPackage = async () => {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('slug', params.slug)
      .single();
    
    if (data) setPkg(data);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('bookings').insert([{
      ...bookingData,
      package_id: pkg.id,
      user_id: user?.id || null,
      payment_status: 'Pending'
    }]);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Booking request sent successfully!');
      if (user) router.push('/dashboard');
      else router.push('/');
    }
    setSubmitting(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>;
  if (!pkg) return <div style={{ textAlign: 'center', padding: '100px' }}>Package Not Found</div>;

  return (
    <main>
      <Navbar />
      
      {/* Hero Header */}
      <section style={{ height: '500px', position: 'relative' }}>
        <img 
          src={pkg.cover_image_url} 
          alt={pkg.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '50px 0'
        }}>
          <div className="container" style={{ color: '#fff' }}>
            <span style={{ background: '#e8a020', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600' }}>
              {pkg.category}
            </span>
            <h1 style={{ fontSize: '3.5rem', margin: '15px 0' }}>{pkg.title}</h1>
            <div style={{ display: 'flex', gap: '30px', fontSize: '1.1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={20} color="#e8a020" /> {pkg.destination}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={20} color="#e8a020" /> {pkg.duration_days} Days</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '80px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '50px' }}>
        {/* Left Side: Details */}
        <div>
          <div style={{ background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: 'var(--shadow-sm)', marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Trip Highlights</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {pkg.highlights?.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4a4a68' }}>
                  <Check size={18} color="#10b981" /> {h}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Day-by-Day Itinerary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {pkg.itinerary?.split('\n').map((day, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flexShrink: 0, width: '40px', height: '40px', background: '#e8a020', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                    {i + 1}
                  </div>
                  <div style={{ padding: '5px 0' }}>
                    <p style={{ color: '#4a4a68' }}>{day}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <h3 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={20} color="#10b981" /> Inclusions</h3>
              <p style={{ color: '#666', whiteSpace: 'pre-wrap' }}>{pkg.inclusions}</p>
            </div>
            <div>
              <h3 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}><X size={20} color="#ef4444" /> Exclusions</h3>
              <p style={{ color: '#666', whiteSpace: 'pre-wrap' }}>{pkg.exclusions}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Booking Form */}
        <aside>
          <div style={{ background: '#1a1a2e', color: '#fff', padding: '40px', borderRadius: '15px', position: 'sticky', top: '120px' }}>
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '1rem', color: '#ccc' }}>Starting from</span>
              <h2 style={{ fontSize: '2.5rem', color: '#e8a020' }}>₹{pkg.price_inr.toLocaleString()}</h2>
              {pkg.original_price_inr && (
                <p style={{ color: '#888', textDecoration: 'line-through' }}>Was ₹{pkg.original_price_inr.toLocaleString()}</p>
              )}
            </div>

            <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.85rem', color: '#ccc' }}>Full Name</label>
                <input type="text" name="customer_name" value={bookingData.customer_name} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#252545', color: '#fff' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.85rem', color: '#ccc' }}>Email Address</label>
                <input type="email" name="customer_email" value={bookingData.customer_email} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#252545', color: '#fff' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.85rem', color: '#ccc' }}>Phone Number</label>
                <input 
                  type="tel" 
                  name="customer_phone" 
                  value={bookingData.customer_phone} 
                  onChange={handleInputChange} 
                  required 
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#252545', color: '#fff' }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.85rem', color: '#ccc' }}>Travel Date</label>
                <input 
                  type="date" 
                  name="travel_date" 
                  value={bookingData.travel_date} 
                  onChange={handleInputChange} 
                  required 
                  min={new Date().toISOString().split('T')[0]}
                  style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#252545', color: '#fff' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', color: '#ccc' }}>Adults</label>
                  <input type="number" name="adults" value={bookingData.adults} onChange={handleInputChange} min="1" style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#252545', color: '#fff' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', color: '#ccc' }}>Children</label>
                  <input type="number" name="children" value={bookingData.children} onChange={handleInputChange} min="0" style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#252545', color: '#fff' }} />
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '15px', marginTop: '10px' }}>
                {submitting ? 'Processing...' : 'Book This Trip'}
              </button>
            </form>

            {!user && (
              <p style={{ marginTop: '15px', fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>
                Login for a seamless experience and to track your booking.
              </p>
            )}

            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #333', textAlign: 'center' }}>
              <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1rem' }}>Need help with booking?</p>
              <a href="https://wa.me/919876543210" style={{ color: '#e8a020', fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Phone size={18} /> Chat with Expert
              </a>
            </div>
          </div>
        </aside>
      </section>

      <Footer />
    </main>
  );
}
