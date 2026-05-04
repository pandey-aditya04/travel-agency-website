'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TripCard from '@/components/TripCard';
import SkeletonCard from '@/components/SkeletonCard';
import { supabase } from '@/lib/supabase';
import { Filter, Search as SearchIcon } from 'lucide-react';

import { Suspense } from 'react';

function DestinationsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Indian Escapes', 'Overseas Adventures', 'Divine Destinations'];

  useEffect(() => {
    fetchPackages();
  }, [filter]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      let query = supabase.from('packages').select('*');
      
      // Filter by published status
      query = query.eq('status', 'Published');

      if (filter !== 'All') {
        query = query.eq('category', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPackages(data || []);
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      <Navbar />
      
      {/* Header */}
      <section style={{ 
        background: 'linear-gradient(rgba(13, 27, 42, 0.85), rgba(13, 27, 42, 0.85)), url("https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=1920")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 0 80px',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div className="container">
          <p style={{ color: 'var(--primary-color)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', fontSize: '0.85rem' }}>✦ Discover The World</p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: '800' }}>Our Destinations</h1>
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>From the spiritual Ghats of Varanasi to the luxury of Maldives — find your next escape with Travel Agency.</p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="container" style={{ marginTop: '-40px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '24px 32px',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(13, 27, 42, 0.15)',
          border: '1px solid rgba(13, 27, 42, 0.05)'
        }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '30px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  background: filter === cat ? 'var(--primary-color)' : '#f3f4f6',
                  color: filter === cat ? '#0D1B2A' : '#4b5563',
                  transition: 'all 0.3s ease',
                  border: filter === cat ? 'none' : '1px solid transparent'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="search-box" style={{ position: 'relative', flexGrow: 1, maxWidth: '400px' }}>
            <input 
              type="text" 
              placeholder="Search destination..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 45px 14px 20px',
                borderRadius: '30px',
                border: '1.5px solid #e5e7eb',
                background: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.3s'
              }}
            />
            <SearchIcon size={20} style={{ position: 'absolute', right: '18px', top: '14px', color: '#9ca3af' }} />
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 1024px) {
            .search-box { maxWidth: 100% !important; }
          }
        `}</style>
      </section>

      {/* Results */}
      <section className="container" style={{ padding: '60px 20px 120px' }}>
        {loading ? (
          <div className="grid">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className="grid">
            {filteredPackages.map(pkg => <TripCard key={pkg.id} pkg={pkg} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/not-found-4064375-3363936.png" alt="Not found" style={{ width: '280px', marginBottom: '30px', opacity: '0.8' }} />
            <h3 style={{ fontSize: '1.8rem', color: '#1f2937', marginBottom: '10px' }}>No destinations found</h3>
            <p style={{ color: '#6b7280', marginBottom: '30px' }}>We couldn't find any trips matching your filters. Try clearing them!</p>
            <button onClick={() => {setFilter('All'); setSearchTerm('');}} className="btn btn-primary">Clear All Filters</button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

export default function Destinations() {
  return (
    <Suspense fallback={<div>Loading Destinations...</div>}>
      <DestinationsContent />
    </Suspense>
  );
}
