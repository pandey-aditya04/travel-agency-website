'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { 
  Phone, MessageCircle, Mail, Calendar, 
  Search, Filter, Download, MoreVertical, 
  Clock, IndianRupee, User, ExternalLink
} from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setLeads(data);
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) {
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#E8A020';
      case 'contacted': return '#3B82F6';
      case 'confirmed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const filteredLeads = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  return (
    <main className="admin-leads-page">
      <Navbar />

      <div className="container dashboard-container">
        <header className="dash-header">
          <div>
            <h1>Leads Dashboard</h1>
            <p>Manage customer enquiries and trip bookings</p>
          </div>
          <div className="dash-actions">
            <button className="export-btn"><Download size={18} /> Export CSV</button>
          </div>
        </header>

        <div className="stats-row">
          <div className="stat-card">
            <div className="s-label">Total Leads</div>
            <div className="s-value">{leads.length}</div>
          </div>
          <div className="stat-card">
            <div className="s-label">New Enquiries</div>
            <div className="s-value">{leads.filter(l => l.status === 'new').length}</div>
          </div>
          <div className="stat-card">
            <div className="s-label">Confirmed</div>
            <div className="s-value">{leads.filter(l => l.status === 'confirmed').length}</div>
          </div>
        </div>

        <div className="leads-card">
          <div className="table-filters">
            <div className="search-box">
              <Search size={18} />
              <input placeholder="Search name, phone or email..." />
            </div>
            <div className="filter-group">
              <Filter size={18} />
              <select value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Customer Info</th>
                  <th>Trip Details</th>
                  <th>Travel Info</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '100px' }}>Loading leads...</td></tr>
                ) : filteredLeads.map(lead => (
                  <tr key={lead.id}>
                    <td>
                      <div className="c-info">
                        <strong>{lead.full_name}</strong>
                        <span>{lead.email}</span>
                        <div className="phone-row">
                          <Phone size={12} /> {lead.phone}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="t-info">
                        <strong>{lead.package_title}</strong>
                        <span className="price">₹{lead.package_price?.toLocaleString()}</span>
                      </div>
                    </td>
                    <td>
                      <div className="tr-info">
                        <span><Calendar size={12} /> {lead.travel_date}</span>
                        <span><User size={12} /> {lead.adults}A, {lead.children}C</span>
                      </div>
                    </td>
                    <td>
                      <select 
                        className="status-select" 
                        value={lead.status} 
                        onChange={e => updateStatus(lead.id, e.target.value)}
                        style={{ color: getStatusColor(lead.status), borderColor: getStatusColor(lead.status) }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-row">
                        <a 
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hi ${lead.full_name}, we received your enquiry for ${lead.package_title} at Travel Agency. Our team will assist you shortly!`} 
                          target="_blank" 
                          className="wa-btn"
                        >
                          <MessageCircle size={18} />
                        </a>
                        <button className="more-btn"><MoreVertical size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .admin-leads-page { background: #F9FAFB; min-height: 100vh; }
        .dashboard-container { padding: 100px 0; }
        
        .dash-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
        .dash-header h1 { font-family: var(--font-display); font-size: 2rem; color: var(--navy); margin-bottom: 5px; }
        .dash-header p { color: var(--slate); font-weight: 500; }
        
        .export-btn { background: #fff; border: 1.5px solid var(--border); padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s; }
        .export-btn:hover { border-color: var(--amber); color: var(--amber); }

        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 40px; }
        .stat-card { background: #fff; padding: 25px; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .s-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--slate); letter-spacing: 0.05em; margin-bottom: 10px; }
        .s-value { font-size: 2rem; font-weight: 800; color: var(--navy); }

        .leads-card { background: #fff; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden; }
        
        .table-filters { padding: 25px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .search-box { flex: 1; position: relative; }
        .search-box :global(svg) { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--slate); }
        .search-box input { width: 100%; padding: 12px 12px 12px 45px; border: 1.5px solid var(--border); border-radius: 10px; outline: none; transition: 0.3s; }
        .search-box input:focus { border-color: var(--amber); box-shadow: 0 0 0 4px rgba(232,160,32,0.1); }
        
        .filter-group { display: flex; align-items: center; gap: 12px; color: var(--slate); font-weight: 600; }
        .filter-group select { border: 1.5px solid var(--border); padding: 10px 15px; border-radius: 10px; outline: none; }

        .table-wrap { overflow-x: auto; }
        .leads-table { width: 100%; border-collapse: collapse; }
        .leads-table th { text-align: left; background: #F9FAFB; padding: 15px 25px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--slate); letter-spacing: 0.05em; }
        .leads-table td { padding: 20px 25px; border-bottom: 1px solid #F3F4F6; }
        
        .c-info { display: flex; flex-direction: column; gap: 4px; }
        .c-info strong { color: var(--navy); font-size: 1rem; }
        .c-info span { font-size: 0.85rem; color: var(--slate); }
        .phone-row { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--navy); font-weight: 600; margin-top: 4px; }
        
        .t-info { display: flex; flex-direction: column; gap: 4px; }
        .t-info strong { color: var(--navy); font-size: 0.95rem; }
        .price { font-size: 0.85rem; font-weight: 700; color: var(--amber); }
        
        .tr-info { display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem; color: var(--slate); font-weight: 500; }
        .tr-info span { display: flex; align-items: center; gap: 6px; }
        
        .status-select { background: #fff; border: 1.5px solid; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; outline: none; cursor: pointer; }
        
        .action-row { display: flex; gap: 10px; }
        .wa-btn { color: #10B981; background: #ECFDF5; padding: 8px; border-radius: 8px; display: flex; align-items: center; transition: 0.3s; }
        .wa-btn:hover { background: #10B981; color: #fff; }
        .more-btn { background: none; border: none; color: var(--slate); cursor: pointer; padding: 8px; }

        @media (max-width: 768px) {
          .stats-row { grid-template-columns: 1fr; }
          .table-filters { flex-direction: column; align-items: stretch; }
          .dash-header { flex-direction: column; align-items: flex-start; gap: 20px; }
        }
      `}</style>
      </main>
    );
}
