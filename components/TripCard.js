'use client';
import Link from 'next/link';
import { Clock, MapPin, Star } from 'lucide-react';

const TripCard = ({ pkg }) => {
  const {
    title,
    slug,
    destination,
    duration_days,
    price_inr,
    original_price_inr,
    cover_image_url,
    discount_badge,
    category
  } = pkg;

  return (
    <div className="card" style={{ position: 'relative' }}>
      {discount_badge && (
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          background: '#e8a020',
          color: '#fff',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: '600',
          zIndex: 2
        }}>
          {discount_badge}
        </div>
      )}
      
      <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
        <img 
          src={cover_image_url || 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="card-image"
        />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(26, 26, 46, 0.8)',
          color: '#fff',
          padding: '4px 12px',
          borderRadius: '15px',
          fontSize: '0.75rem',
          backdropFilter: 'blur(5px)'
        }}>
          {category}
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#e8a020', fontSize: '0.9rem', fontWeight: '600' }}>
            <Star size={14} fill="#e8a020" /> 4.9 (120+ Reviews)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#4a4a68', fontSize: '0.85rem' }}>
            <Clock size={14} /> {duration_days} Days
          </span>
        </div>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#1a1a2e' }}>{title}</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#4a4a68', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <MapPin size={14} /> {destination}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1a1a2e' }}>₹{price_inr.toLocaleString()}</span>
            {original_price_inr && (
              <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: '#888', marginLeft: '10px' }}>
                ₹{original_price_inr.toLocaleString()}
              </span>
            )}
          </div>
          <Link href={`/package/${slug}`} className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
            View Details
          </Link>
        </div>
      </div>

      <style jsx>{`
        .card:hover img {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default TripCard;
