'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Package, User, Settings, LogOut, Calendar, Download, Phone, MapPin, Clock, Check, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings');
  const [message, setMessage] = useState({ type: '', text: '' });

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
      .select('*, packages(title, cover_image_url, duration_days, price_inr, destination)')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });
    setBookings(bookingsData || []);

    setLoading(false);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData(e.target);
    const updates = {
      full_name: formData.get('full_name'),
      phone: formData.get('phone'),
      updated_at: new Date()
    };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    setUpdating(false);
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setProfile({ ...profile, ...updates });
    }
  };

  const generatePDF = (booking) => {
    const doc = new jsPDF();
    const pkg = booking.packages;

    // Header
    doc.setFillColor(26, 26, 46);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(232, 160, 32);
    doc.setFontSize(24);
    doc.text('RM YAATRA TRAVELS', 20, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Official Booking Confirmation & Itinerary', 140, 25);

    // Booking Details Table
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Booking Summary', 20, 55);
    
    doc.autoTable({
      startY: 60,
      head: [['Field', 'Details']],
      body: [
        ['Booking ID', booking.id.substring(0, 8).toUpperCase()],
        ['Package Title', pkg.title],
        ['Destination', pkg.destination],
        ['Travel Date', new Date(booking.travel_date).toLocaleDateString()],
        ['Duration', `${pkg.duration_days} Days`],
        ['Travelers', `${booking.adults} Adults, ${booking.children} Kids`],
        ['Status', booking.payment_status],
        ['Customer Name', booking.customer_name],
        ['Total Amount', `INR ${pkg.price_inr.toLocaleString()}`]
      ],
      theme: 'striped',
      headStyles: { fillColor: [26, 26, 46], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    // Important Notes
    const finalY = doc.lastAutoTable.finalY || 150;
    doc.setFontSize(12);
    doc.text('Important Instructions:', 20, finalY + 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('- Please carry a valid Photo ID proof during the trip.', 20, finalY + 30);
    doc.text('- Reach the departure point at least 30 minutes before time.', 20, finalY + 37);
    doc.text('- For any assistance, call our 24/7 support at +91 98765 43210.', 20, finalY + 44);

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing RM Yaatra Travels. Have a safe journey!', 105, 285, { align: 'center' });

    doc.save(`Booking_${booking.id.substring(0, 8)}.pdf`);
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  const renderBookings = () => (
    <div className="animate-fade">
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Package color="var(--primary-color)"/> My Bookings</h2>
      {bookings.length > 0 ? (
        <div className="bookings-list" style={{ display: 'grid', gap: '20px' }}>
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card" style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '20px', alignItems: 'center', border: '1px solid #eee' }}>
              <img src={booking.packages?.cover_image_url} className="booking-img" style={{ width: '120px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{booking.packages?.title}</h3>
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
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={14} /> {booking.adults}A, {booking.children}K</span>
                </div>
              </div>
              <div className="booking-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                    onClick={() => generatePDF(booking)}
                    className="btn btn-outline" 
                    style={{ padding: '8px 15px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Download size={14} /> Itinerary
                </button>
                <Link href="/contact" className="btn btn-secondary" style={{ padding: '8px 15px', fontSize: '0.85rem', textAlign: 'center' }}>Support</Link>
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
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings color="var(--primary-color)"/> Profile & Settings</h2>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', maxWidth: '600px' }}>
        {message.text && (
            <div style={{ 
                padding: '15px', borderRadius: '10px', marginBottom: '25px', 
                background: message.type === 'success' ? '#e6fffa' : '#fee2e2',
                color: message.type === 'success' ? '#047481' : '#ef4444',
                display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600'
            }}>
                {message.type === 'success' ? <Check size={20}/> : <AlertCircle size={20}/>}
                {message.text}
            </div>
        )}

        <form onSubmit={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="full_name" defaultValue={profile?.full_name} style={{ background: '#fdfdfd', border: '2px solid #f0f0f0', borderRadius: '12px', padding: '15px' }} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={user?.email} disabled style={{ background: '#f5f5f5', border: '2px solid #f0f0f0', borderRadius: '12px', padding: '15px', cursor: 'not-allowed' }} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" defaultValue={profile?.phone} placeholder="+91 XXXX XXX XXX" style={{ background: '#fdfdfd', border: '2px solid #f0f0f0', borderRadius: '12px', padding: '15px' }} />
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={18}/> Saved Travelers</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {profile?.saved_travelers?.length > 0 ? (
                    profile.saved_travelers.map((t, i) => (
                        <div key={i} style={{ padding: '15px', background: '#f9f9f9', borderRadius: '12px', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontWeight: '700' }}>{t.name}</p>
                                <p style={{ color: '#888', fontSize: '0.8rem' }}>{t.relation}</p>
                            </div>
                            <button type="button" style={{ color: '#ef4444' }}><AlertCircle size={16}/></button>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#888', fontSize: '0.9rem', background: '#f9f9f9', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>No saved travelers yet.</p>
                )}
            </div>
            <button type="button" className="btn btn-outline" style={{ marginTop: '15px', fontSize: '0.85rem', width: '100%', padding: '12px' }}>+ Add New Traveler</button>
          </div>

          <button type="submit" disabled={updating} className="btn btn-primary" style={{ marginTop: '30px', padding: '15px' }}>
            {updating ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <main>
      <Navbar />
      <div className="container" style={{ padding: '60px 20px 100px' }}>
        <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '50px' }}>
          {/* Sidebar */}
          <aside>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '25px', boxShadow: 'var(--shadow-md)', position: 'sticky', top: '120px' }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ width: '90px', height: '90px', background: 'var(--primary-color)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '800', margin: '0 auto 15px', boxShadow: '0 8px 20px rgba(232, 160, 32, 0.3)' }}>
                  {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '5px', fontWeight: '800' }}>{profile?.full_name || 'Traveler'}</h3>
                <p style={{ fontSize: '0.9rem', color: '#888' }}>{user?.email}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  onClick={() => setActiveTab('bookings')}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '15px', 
                    background: activeTab === 'bookings' ? '#1a1a2e' : 'transparent',
                    color: activeTab === 'bookings' ? '#fff' : '#4a4a68',
                    fontWeight: activeTab === 'bookings' ? '700' : '600',
                    border: 'none', textAlign: 'left', transition: 'all 0.3s ease'
                  }}
                >
                  <Package size={20} /> My Bookings
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '15px', 
                    background: activeTab === 'profile' ? '#1a1a2e' : 'transparent',
                    color: activeTab === 'profile' ? '#fff' : '#4a4a68',
                    fontWeight: activeTab === 'profile' ? '700' : '600',
                    border: 'none', textAlign: 'left', transition: 'all 0.3s ease'
                  }}
                >
                  <Settings size={20} /> Profile & Settings
                </button>
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f0f0f0' }}>
                    <button 
                    onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '15px', color: '#ef4444', border: 'none', background: 'transparent', fontWeight: '700', width: '100%', textAlign: 'left' }}
                    >
                    <LogOut size={20} /> Sign Out
                    </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div style={{ minHeight: '600px' }}>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="loader"></div>
                    <p style={{ marginTop: '20px', color: '#888' }}>Loading your dashboard...</p>
                </div>
            ) : activeTab === 'bookings' ? renderBookings() : renderProfile()}
          </div>
        </div>
      </div>

      <style jsx>{`
        .form-group { display: flex; flex-direction: column; gap: 10px; }
        .form-group label { font-weight: 700; font-size: 0.95rem; color: #1a1a2e; }
        .loader { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .dashboard-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
          aside div { position: relative !important; top: 0 !important; }
          .booking-card { flex-direction: column; text-align: center; }
          .booking-img { width: 100% !important; height: 200px !important; }
          .booking-actions { width: 100%; flex-direction: row !important; }
          .booking-actions .btn { flex: 1; }
        }
      `}</style>
      <Footer />
    </main>
  );
}
