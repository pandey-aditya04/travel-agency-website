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
        background: 'linear-gradient(rgba(26, 26, 46, 0.8), rgba(26, 26, 46, 0.8)), url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1920")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 0',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Our Destinations</h1>
          <p style={{ fontSize: '1.2rem', color: '#ccc' }}>Explore the beauty of India and the world</p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="container" style={{ padding: '60px 20px 0' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '20px',
          background: '#fff',
          padding: '20px 30px',
          borderRadius: '15px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  background: filter === cat ? 'var(--primary-color)' : '#f0f0f0',
                  color: filter === cat ? '#fff' : '#4a4a68'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '300px' }}>
            <input 
              type="text" 
              placeholder="Search destination..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 40px 10px 15px',
                borderRadius: '25px',
                border: '1px solid #ddd',
                background: '#f9f9f9'
              }}
            />
            <SearchIcon size={18} style={{ position: 'absolute', right: '15px', top: '10px', color: '#888' }} />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container" style={{ padding: '40px 20px 100px' }}>
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
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/not-found-4064375-3363936.png" alt="Not found" style={{ width: '200px', marginBottom: '20px' }} />
            <h3>No destinations found matching your criteria.</h3>
            <button onClick={() => {setFilter('All'); setSearchTerm('');}} className="btn btn-outline" style={{ marginTop: '20px' }}>Clear Filters</button>
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
