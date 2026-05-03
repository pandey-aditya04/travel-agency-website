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

      <style jsx>{`
        .trip-card-link { text-decoration: none; display: block; }
        .trip-card {
          background: #fff; border-radius: 14px; overflow: hidden;
          border: 1px solid #E5E0D8; box-shadow: 0 2px 12px rgba(13,27,42,.07);
          transition: all 0.25s cubic-bezier(.4,0,.2,1);
          height: 100%; display: flex; flexDirection: column;
        }
        .trip-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(13,27,42,.18);
          border-color: rgba(232,160,32,.3);
        }
        .card-img-wrap { position: relative; height: 220px; overflow: hidden; }
        .card-img-wrap img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s ease;
        }
        .trip-card:hover .card-img-wrap img { transform: scale(1.06); }
        
        .card-badge {
          position: absolute; top: 14px; left: 14px;
          background: var(--primary-color); color: #0D1B2A;
          font-size: .72rem; font-weight: 700; letter-spacing: .06em;
          text-transform: uppercase; padding: 4px 12px; border-radius: 20px;
          z-index: 2;
        }
        .card-badge.blue { background: #1A6EBF; color: #fff; }
        
        .card-rating {
          position: absolute; bottom: 12px; right: 12px;
          background: rgba(13,27,42,.75); backdrop-filter: blur(6px);
          color: #fff; font-size: .78rem; font-weight: 600;
          padding: 4px 12px; border-radius: 20px;
          display: flex; align-items: center; gap: 6px;
          z-index: 2;
        }
        
        .card-body { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; }
        .card-category {
          font-size: .72rem; font-weight: 600; letter-spacing: .08em;
          text-transform: uppercase; color: var(--primary-color); margin-bottom: 10px;
        }
        .card-title {
          font-family: var(--font-display); font-size: 1.15rem; font-weight: 700;
          line-height: 1.35; color: #0D1B2A; margin-bottom: 10px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .card-location {
          font-size: .88rem; color: #637085;
          display: flex; align-items: center; gap: 6px; margin-bottom: 20px;
        }
        
        .card-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 15px; border-top: 1px solid #E5E0D8; margin-top: auto;
          margin-bottom: 15px;
        }
        .card-price strong {
          font-family: var(--font-display); font-size: 1.25rem;
          font-weight: 700; color: #0D1B2A;
        }
        .card-price del { font-size: .85rem; color: #637085; margin-left: 8px; }
        .card-duration {
          font-size: .8rem; color: #637085; background: #F7F4EF;
          padding: 4px 12px; border-radius: 20px; font-weight: 600;
          display: flex; align-items: center; gap: 4px;
        }
        
        .card-btn {
          width: 100%; background: #0D1B2A; color: #fff;
          font-size: .85rem; font-weight: 600; padding: 12px;
          border-radius: 8px; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.3s ease;
        }
        .trip-card:hover .card-btn { background: var(--primary-color); color: #0D1B2A; }
      `}</style>
    </Link>
  );
};

export default TripCard;
