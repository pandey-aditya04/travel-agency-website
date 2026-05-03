'use client';
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
    <Link href={`/package/${slug}`} className="trip-card-link">
      <div className="trip-card">
        <div className="card-img-wrap">
          <img 
            src={cover_image_url || 'https://via.placeholder.com/600x400?text=RM+Yaatra+Travels'} 
            alt={title} 
            loading="lazy"
          />
          {discount_badge ? (
            <span className="card-badge">{discount_badge}</span>
          ) : (
            category === 'Divine Destinations' && <span className="card-badge blue">Peace</span>
          )}
          <span className="card-rating">
            <Star size={12} fill="#FFD700" color="#FFD700" /> 4.9
          </span>
        </div>
        
        <div className="card-body">
          <p className="card-category">{category}</p>
          <h3 className="card-title">{title}</h3>
          <p className="card-location">
            <MapPin size={14} /> {destination}
          </p>
          
          <div className="card-footer">
            <div className="card-price">
              <strong>₹{price_inr.toLocaleString()}</strong>
              {original_price_inr && <del>₹{original_price_inr.toLocaleString()}</del>}
            </div>
            <span className="card-duration">
              <Clock size={12} /> {duration_days} Days
            </span>
          </div>
          
          <button className="card-btn">
            View Details <ChevronRight size={14} />
          </button>
        </div>
      </div>

    </Link>
  );
};

export default TripCard;
