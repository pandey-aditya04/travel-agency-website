'use client';
import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TripCard from '@/components/TripCard';
import { supabase } from '@/lib/supabase';
import { MapPin } from 'lucide-react';

export default function DestinationPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destinationName, setDestinationName] = useState('');

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      
      // Convert slug to a readable name (e.g., bangkok-thailand -> Bangkok - Thailand)
      const name = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      setDestinationName(name);

      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('status', 'Published')
        .ilike('destination', `%${name.split(' ')[0]}%`); // Simple match logic

      if (!error && data) {
        setPackages(data);
      }
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  return (
    <main className="destination-detail-page">
      <Navbar />

      <section className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1>{destinationName}</h1>
        </div>
      </section>

      <div className="container content-grid">
        <div className="grid">
          {loading ? (
            <p>Loading trips...</p>
          ) : packages.length > 0 ? (
            packages.map(pkg => <TripCard key={pkg.id} pkg={pkg} />)
          ) : (
            <p className="empty">No packages found for this destination yet.</p>
          )}
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .destination-detail-page { min-height: 100vh; background: #fff; }
        .hero-banner { 
          position: relative; 
          height: 350px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          background: url('https://images.unsplash.com/photo-1513415277900-a62401e19be4?auto=format&fit=crop&w=1920&q=80'); // Fallback mountain/forest
          background-size: cover;
          background-position: center;
          margin-top: 80px;
        }
        .hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); }
        .hero-content { position: relative; z-index: 2; text-align: center; color: #fff; }
        .hero-content h1 { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; text-shadow: 0 4px 15px rgba(0,0,0,0.3); }

        .content-grid { padding: 60px 5vw; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
        .empty { text-align: center; grid-column: 1/-1; padding: 100px 0; color: #999; }
      `}</style>
    </main>
  );
}
