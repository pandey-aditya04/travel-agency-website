'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Edit, Trash2, ExternalLink, Package, Users, 
  MessageSquare, Check, Calendar, Phone, Mail, 
  ChevronDown, ChevronUp, User, Baby, MapPin, X 
} from 'lucide-react';

export default function AdminDashboard() {
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, totalBookings: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('packages');
  const [expandedBooking, setExpandedBooking] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch packages
    const { data: pkgs } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Fetch bookings
    const { data: bks } = await supabase
      .from('bookings')
      .select('*, packages(title)')
      .order('created_at', { ascending: false });

    if (pkgs) {
      setPackages(pkgs);
      setStats(prev => ({
        ...prev,
        total: pkgs.length,
        published: pkgs.filter(p => p.status === 'Published').length,
        drafts: pkgs.filter(p => p.status === 'Draft').length
      }));
    }

    if (bks) {
      setBookings(bks);
      setStats(prev => ({ ...prev, totalBookings: bks.length }));
    }

    setLoading(false);
  };

  const deletePackage = async (id) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (!error) fetchData();
  };

  const updateBookingStatus = async (id, status) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (!error) fetchData();
  };

  return (
    <main>
      <Navbar />
      <div className="container" style={{ padding: '60px 20px 100px' }}>
        <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}>Master Admin Panel</h1>
            <p style={{ color: '#666', marginTop: '10px' }}>Welcome back, Manage your travel empire here.</p>
          </div>
          <div style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: 'max-content' }}>
            <Link href="/admin/upload" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 30px', width: '100%' }}>
                <Plus size={22} /> New Package
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '30px', background: '#f0f0f0', width: 'fit-content', padding: '5px', borderRadius: '15px' }}>
            <button 
                onClick={() => setActiveTab('packages')} 
                style={{ 
                    padding: '12px 30px', 
                    borderRadius: '12px', 
                    fontWeight: '700',
                    background: activeTab === 'packages' ? '#fff' : 'transparent',
                    color: activeTab === 'packages' ? 'var(--primary-color)' : '#666',
                    boxShadow: activeTab === 'packages' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
                }}
            >
                Packages
            </button>
            <button 
                onClick={() => setActiveTab('bookings')} 
                style={{ 
                    padding: '12px 30px', 
                    borderRadius: '12px', 
                    fontWeight: '700',
                    background: activeTab === 'bookings' ? '#fff' : 'transparent',
                    color: activeTab === 'bookings' ? 'var(--primary-color)' : '#666',
                    boxShadow: activeTab === 'bookings' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
                }}
            >
                Bookings
            </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '4rem' }}>
          <div className="stat-card">
            <div className="stat-header">
              <Package color="#e8a020" size={28} />
              <span className="stat-num">{stats.total}</span>
            </div>
            <p className="stat-label">Total Packages</p>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <Check color="#10b981" size={28} />
              <span className="stat-num">{stats.published}</span>
            </div>
            <p className="stat-label">Published</p>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <Edit color="#888" size={28} />
              <span className="stat-num">{stats.drafts}</span>
            </div>
            <p className="stat-label">Drafts</p>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <Users color="#4a4a68" size={28} />
              <span className="stat-num">{stats.totalBookings}</span>
            </div>
            <p className="stat-label">Interested Leads</p>
          </div>
        </div>

        {activeTab === 'packages' ? (
            <div className="table-responsive" style={{ background: '#fff', borderRadius: '25px', overflowX: 'auto', boxShadow: 'var(--shadow-lg)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                    <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                    <th style={{ padding: '25px' }}>Trip Package</th>
                    <th style={{ padding: '25px' }}>Category</th>
                    <th style={{ padding: '25px' }}>Price (INR)</th>
                    <th style={{ padding: '25px' }}>Status</th>
                    <th style={{ padding: '25px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                    <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center' }}>Loading trip data...</td></tr>
                    ) : packages.length > 0 ? (
                    packages.map(pkg => (
                        <tr key={pkg.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '20px 25px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <img src={pkg.cover_image_url} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                            <div>
                            <p style={{ fontWeight: '800', color: 'var(--secondary-color)' }}>{pkg.title}</p>
                            <p style={{ fontSize: '0.85rem', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12}/> {pkg.destination}</p>
                            </div>
                        </td>
                        <td style={{ padding: '20px 25px', fontSize: '0.95rem', fontWeight: '600', color: '#4a4a68' }}>{pkg.category}</td>
                        <td style={{ padding: '20px 25px', fontWeight: '800', fontSize: '1.1rem' }}>₹{pkg.price_inr.toLocaleString()}</td>
                        <td style={{ padding: '20px 25px' }}>
                            <span style={{ 
                                padding: '6px 16px', 
                                borderRadius: '20px', 
                                fontSize: '0.8rem',
                                background: pkg.status === 'Published' ? '#e6fffa' : '#fff9e6',
                                color: pkg.status === 'Published' ? '#047481' : '#d97706',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                            {pkg.status}
                            </span>
                        </td>
                        <td style={{ padding: '20px 25px' }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                            <Link href={`/package/${pkg.slug}`} target="_blank" style={{ color: '#4a4a68' }}><ExternalLink size={20} /></Link>
                            <Link href={`/admin/upload?id=${pkg.id}`} style={{ color: 'var(--primary-color)' }}><Edit size={20} /></Link>
                            <button onClick={() => deletePackage(pkg.id)} style={{ color: '#ef4444' }}><Trash2 size={20} /></button>
                            </div>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#888' }}>No trip packages found. Create your first one!</td></tr>
                    )}
                </tbody>
                </table>
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '25px' }}>Loading interested leads...</div>
                ) : bookings.length > 0 ? (
                    bookings.map(bk => (
                        <div key={bk.id} style={{ 
                            background: '#fff', 
                            borderRadius: '20px', 
                            overflow: 'hidden', 
                            boxShadow: 'var(--shadow-md)',
                            border: expandedBooking === bk.id ? '2px solid var(--primary-color)' : '1px solid #f0f0f0'
                        }}>
                            <div 
                                onClick={() => setExpandedBooking(expandedBooking === bk.id ? null : bk.id)}
                                style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: '20px' }}
                            >
                                <div className="booking-header-main" style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div>
                                        <p style={{ fontWeight: '800', fontSize: '1.1rem' }}>{bk.customer_name}</p>
                                        <p style={{ fontSize: '0.85rem', color: '#888' }}>{new Date(bk.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="header-divider" style={{ borderLeft: '1px solid #eee', paddingLeft: '30px' }}>
                                        <p style={{ fontSize: '0.8rem', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>Interest</p>
                                        <p style={{ fontWeight: '700' }}>{bk.packages?.title || bk.destination}</p>
                                    </div>
                                    <div className="header-divider" style={{ borderLeft: '1px solid #eee', paddingLeft: '30px' }}>
                                        <p style={{ fontSize: '0.8rem', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>Status</p>
                                        <span style={{ 
                                            padding: '4px 12px', 
                                            borderRadius: '15px', 
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            background: bk.status === 'Completed' ? '#e6fffa' : bk.status === 'Cancelled' ? '#fee2e2' : '#fff9e6',
                                            color: bk.status === 'Completed' ? '#047481' : bk.status === 'Cancelled' ? '#b91c1c' : '#d97706'
                                        }}>
                                            {bk.status}
                                        </span>
                                    </div>
                                </div>
                                {expandedBooking === bk.id ? <ChevronUp /> : <ChevronDown />}
                            </div>

                            {expandedBooking === bk.id && (
                                <div className="booking-expanded" style={{ padding: '0 25px 25px', borderTop: '1px solid #f0f0f0', paddingTop: '25px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', marginBottom: '10px' }}>Contact Information</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                <p style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' }}><Phone size={16} color="var(--primary-color)"/> {bk.customer_phone}</p>
                                                <p style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' }}><Mail size={16} color="var(--primary-color)"/> {bk.customer_email}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', marginBottom: '10px' }}>Message / Requirements</h4>
                                            <p style={{ background: '#f9f9f9', padding: '15px', borderRadius: '12px', fontSize: '0.95rem' }}>
                                                {bk.message || "No specific message provided."}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', marginBottom: '10px' }}>Trip Details</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                                    <Calendar size={20} style={{ marginBottom: '5px' }} />
                                                    <p style={{ fontSize: '0.7rem', color: '#888' }}>Date</p>
                                                    <p style={{ fontWeight: '700' }}>{new Date(bk.travel_date).toLocaleDateString()}</p>
                                                </div>
                                                <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                                    <User size={20} style={{ marginBottom: '5px' }} />
                                                    <p style={{ fontSize: '0.7rem', color: '#888' }}>Adults</p>
                                                    <p style={{ fontWeight: '700' }}>{bk.adults}</p>
                                                </div>
                                                <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                                    <Baby size={20} style={{ marginBottom: '5px' }} />
                                                    <p style={{ fontSize: '0.7rem', color: '#888' }}>Children</p>
                                                    <p style={{ fontWeight: '700' }}>{bk.children}</p>
                                                </div>
                                                <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                                    <Check size={20} style={{ marginBottom: '5px' }} />
                                                    <p style={{ fontSize: '0.7rem', color: '#888' }}>Status</p>
                                                    <p style={{ fontWeight: '700' }}>{bk.payment_status}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="booking-actions" style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => updateBookingStatus(bk.id, 'Completed')} className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>Mark as Handled</button>
                                            <button onClick={() => updateBookingStatus(bk.id, 'Cancelled')} className="btn btn-outline" style={{ flex: 1, padding: '12px', borderColor: '#ef4444', color: '#ef4444' }}>Reject Lead</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '25px', color: '#888' }}>No interested leads yet. Start marketing!</div>
                )}
            </div>
        )}
      </div>

      <style jsx>{`
        .stat-card { background: #fff; padding: 30px; borderRadius: 20px; boxShadow: var(--shadow-md); transition: transform 0.3s ease; }
        .stat-card:hover { transform: translateY(-5px); }
        .stat-header { display: flex; justifyContent: space-between; alignItems: center; marginBottom: 15px; }
        .stat-num { font-size: 2.2rem; font-weight: 800; color: var(--secondary-color); }
        .stat-label { color: #666; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; }

        @media (max-width: 1024px) {
          .booking-header-main { gap: 15px !important; }
          .header-divider { border-left: none !important; padding-left: 0 !important; }
          .admin-header { flex-direction: column; align-items: flex-start !important; }
        }
        @media (max-width: 768px) {
          .booking-expanded { grid-template-columns: 1fr !important; gap: 30px !important; }
          .booking-actions { flex-direction: column !important; }
        }
      `}</style>
      <Footer />
    </main>
  );
}
