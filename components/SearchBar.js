'use client';
import { useState } from 'react';
import { Search, MapPin, Calendar, Users, Minus, Plus } from 'lucide-react';

const SearchBar = () => {
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/destinations?destination=${destination}&date=${travelDate}&adults=${adults}&children=${children}`;
  };

  const Stepper = ({ value, onChange, min, label, icon: Icon }) => (
    <div className="search-field">
      <label><Icon size={14} className="label-icon" /> {label}</label>
      <div className="stepper-wrap">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="step-btn">
          <Minus size={14} />
        </button>
        <span className="step-value">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} className="step-btn">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="container">
      <form className="search-card" onSubmit={handleSearch}>
        <div className="search-field">
          <label><MapPin size={14} className="label-icon" /> Destination</label>
          <select 
            value={destination} 
            onChange={(e) => setDestination(e.target.value)}
            className="search-input"
          >
            <option value="">Where to?</option>
            <optgroup label="Indian Escapes">
              <option value="Kerala">Kerala</option>
              <option value="Himachal">Himachal</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Andaman">Andaman</option>
            </optgroup>
            <optgroup label="Overseas Adventures">
              <option value="Dubai">Dubai</option>
              <option value="Bali">Bali</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Maldives">Maldives</option>
            </optgroup>
            <optgroup label="Divine Destinations">
              <option value="Char Dham">Char Dham</option>
              <option value="Kedarnath">Kedarnath</option>
              <option value="Varanasi">Varanasi</option>
            </optgroup>
          </select>
        </div>

        <div className="search-field">
          <label><Calendar size={14} className="label-icon" /> Travel Date</label>
          <input 
            type="date" 
            min={new Date().toISOString().split('T')[0]}
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="search-input"
          />
        </div>

        <Stepper 
          label="Adults" 
          value={adults} 
          onChange={setAdults} 
          min={1} 
          icon={Users} 
        />

        <Stepper 
          label="Children" 
          value={children} 
          onChange={setChildren} 
          min={0} 
          icon={Users} 
        />

        <div className="search-action">
          <button type="submit" className="search-submit">
            <Search size={18} /> <span>Search</span>
          </button>
        </div>
      </form>

      <style jsx>{`
        .search-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 28px 32px;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr 0.8fr;
          gap: 20px;
          align-items: flex-end;
          margin-top: -60px;
          position: relative;
          z-index: 10;
          box-shadow: 0 10px 40px rgba(13, 27, 42, 0.12);
          border: 1px solid rgba(13, 27, 42, 0.05);
        }
        
        .search-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .search-field label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #637085;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .label-icon { color: var(--primary-color); }
        
        .search-input {
          border: 1.5px solid #E5E0D8;
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 0.9rem;
          color: #1A2D42;
          width: 100%;
          outline: none;
          transition: all 0.2s;
          background: #fff;
        }
        
        .search-input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(232, 160, 32, 0.12);
        }
        
        .stepper-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1.5px solid #E5E0D8;
          border-radius: 8px;
          height: 44px;
          overflow: hidden;
        }
        
        .step-btn {
          background: none;
          border: none;
          width: 35px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #1A2D42;
          transition: all 0.2s;
        }
        
        .step-btn:hover { background: #F7F4EF; color: var(--primary-color); }
        
        .step-value {
          font-weight: 600;
          font-size: 0.95rem;
          color: #1A2D42;
        }
        
        .search-submit {
          background: var(--primary-color);
          color: #0D1B2A;
          font-weight: 700;
          height: 44px;
          width: 100%;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 16px rgba(232, 160, 32, 0.35);
        }
        
        .search-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(232, 160, 32, 0.45);
          background: var(--primary-light);
        }

        @media (max-width: 1024px) {
          .search-card { grid-template-columns: 1fr 1fr; }
          .search-action { grid-column: span 2; }
        }
        
        @media (max-width: 600px) {
          .search-card { grid-template-columns: 1fr; padding: 24px; margin-top: -30px; }
          .search-action { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
