'use client';
import { useState, useEffect } from 'react';
import { getUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Package, User, Settings, LogOut, Calendar, Download, Phone, MapPin, Clock } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const currentUser = await getUser();
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }
    setUser(currentUser);

    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();
    setProfile(profileData);

    // Fetch bookings
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*, packages(title, cover_image_url, duration_days)')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });
    setBookings(bookingsData || []);

    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  const renderBookings = () => (
    <div className="animate-fade">
      <h2 style={{ marginBottom: '2rem' }}>My Bookings</h2>
      {bookings.length > 0 ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {bookings.map(booking => (
            <div key={booking.id} style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '20px', alignItems: 'center', border: '1px solid #eee' }}>
              <img src={booking.packages?.cover_image_url} style={{ width: '120px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.2rem' }}>{booking.packages?.title}</h3>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: '700',
                    background: booking.payment_status === 'Completed' ? '#e6fffa' : '#fff9e6',
                    color: booking.payment_status === 'Completed' ? '#047481' : '#92400e'
                  }}>
                    {booking.payment_status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: '#666' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(booking.travel_date).toLocaleDateString()}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {booking.packages?.duration_days} Days</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Package size={14} /> {booking.adults} Adults, {booking.children} Kids</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn btn-outline" style={{ padding: '8px 15px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Download size={14} /> Itinerary
                </button>
                <button className="btn btn-secondary" style={{ padding: '8px 15px', fontSize: '0.85rem' }}>Support</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 0', background: '#fff', borderRadius: '20px' }}>
          <Package size={60} color="#eee" style={{ marginBottom: '20px' }} />
          <h3>No bookings found</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Ready for your next adventure?</p>
          <Link href="/destinations" className="btn btn-primary">Explore Destinations</Link>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="animate-fade">
      <h2 style={{ marginBottom: '2rem' }}>Profile & Settings</h2>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', maxWidth: '600px' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" defaultValue={profile?.full_name} style={{ background: '#f9f9f9' }} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" defaultValue={user?.email} disabled style={{ background: '#eee' }} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" defaultValue={profile?.phone} placeholder="+91 XXXX XXX XXX" />
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ marginBottom: '15px' }}>Saved Travelers</h4>
            {profile?.saved_travelers?.length > 0 ? (
                profile.saved_travelers.map((t, i) => (
                    <div key={i} style={{ padding: '10px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '10px', fontSize: '0.9rem' }}>
                        {t.name} ({t.relation})
                    </div>
                ))
            ) : (
                <p style={{ color: '#888', fontSize: '0.9rem' }}>No saved travelers yet.</p>
            )}
            <button type="button" className="btn btn-outline" style={{ marginTop: '10px', fontSize: '0.85rem' }}>+ Add Traveler</button>
          </div>

          <button type="button" className="btn btn-primary" style={{ marginTop: '20px' }}>Save Changes</button>
        </form>
      </div>
    </div>
  );

  return (
    <main>
      <Navbar />
      <div className="container" style={{ padding: '60px 20px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '50px' }}>
          {/* Sidebar */}
          <aside>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '120px' }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--primary-color)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '700', margin: '0 auto 15px' }}>
                  {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{profile?.full_name || 'Traveler'}</h3>
                <p style={{ fontSize: '0.85rem', color: '#888' }}>{user?.email}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => setActiveTab('bookings')}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '10px', 
                    background: activeTab === 'bookings' ? '#fff9e6' : 'transparent',
                    color: activeTab === 'bookings' ? 'var(--primary-color)' : '#4a4a68',
                    fontWeight: activeTab === 'bookings' ? '700' : '500',
                    border: 'none', textAlign: 'left'
                  }}
                >
                  <Package size={20} /> My Bookings
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '10px', 
                    background: activeTab === 'profile' ? '#fff9e6' : 'transparent',
                    color: activeTab === 'profile' ? 'var(--primary-color)' : '#4a4a68',
                    fontWeight: activeTab === 'profile' ? '700' : '500',
                    border: 'none', textAlign: 'left'
                  }}
                >
                  <Settings size={20} /> Profile & Settings
                </button>
                <button 
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '10px', color: '#ef4444', border: 'none', background: 'transparent', fontWeight: '500', marginTop: '20px' }}
                >
                  <LogOut size={20} /> Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div style={{ minHeight: '600px' }}>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading dashboard...</div>
            ) : activeTab === 'bookings' ? renderBookings() : renderProfile()}
          </div>
        </div>
      </div>

      <style jsx>{`
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-weight: 600; font-size: 0.9rem; color: #1a1a2e; }
        .form-group input { padding: 12px 15px; border: 1px solid #ddd; border-radius: 10px; font-family: inherit; }
      `}</style>
      <Footer />
    </main>
  );
}
