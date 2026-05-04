import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Clock, ChevronRight } from 'lucide-react';

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
    <Link href={`/package/${slug || pkg.id}`} className="trip-card-link">
      <div className="trip-card">
        <div className="card-img-wrap">
          <Image 
            src={cover_image_url || 'https://via.placeholder.com/600x400?text=RM+Yaatra+Travels'} 
            alt={title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="card-image"
          />
          {discount_badge ? (
            <span className="card-badge">{discount_badge}</span>
          ) : (
            category === 'Divine Destinations' && <span className="card-badge" style={{ background: '#0D1B2A', color: '#fff' }}>Divine</span>
          )}
          <span className="card-rating">
            <Star size={12} fill="#E8A020" color="#E8A020" /> 4.9
          </span>
        </div>
        
        <div className="card-body">
          <p className="card-category">{category}</p>
          <h3 className="card-title">{title}</h3>
          <p className="card-location">
            <MapPin size={14} color="#E8A020" /> {destination}
          </p>
          
          <div className="card-footer">
            <div className="card-price">
              <strong style={{ color: '#0D1B2A' }}>₹{price_inr?.toLocaleString() || 'N/A'}</strong>
              {original_price_inr && <del style={{ fontSize: '0.8rem', color: '#9ca3af', marginLeft: '6px' }}>₹{original_price_inr.toLocaleString()}</del>}
            </div>
            <span className="card-duration">
              <Clock size={12} color="#E8A020" /> {duration_days} Days
            </span>
          </div>
          
          <button className="card-btn" style={{ fontWeight: '700' }}>
            Explore Now <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
