'use client';
import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const SearchBar = () => {
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    adults: 1,
    children: 0
  });

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', formData);
    // Redirect to destinations with query params
    window.location.href = `/destinations?destination=${formData.destination}&date=${formData.date}&adults=${formData.adults}&children=${formData.children}`;
  };

  return (
    <div className="container">
      <form className="search-container" onSubmit={handleSearch}>
        <div className="search-field">
          <label><MapPin size={14} style={{ marginRight: '5px' }} /> Destination</label>
          <select 
            value={formData.destination} 
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
          >
            <option value="">Where to?</option>
            <optgroup label="Indian Escapes">
              <option value="Andaman">Andaman</option>
              <option value="Kashmir">Kashmir</option>
              <option value="Kerala">Kerala</option>
            </optgroup>
            <optgroup label="Overseas">
              <option value="Bali">Bali</option>
              <option value="Dubai">Dubai</option>
              <option value="Europe">Europe</option>
            </optgroup>
          </select>
        </div>

        <div className="search-field">
          <label><Calendar size={14} style={{ marginRight: '5px' }} /> Travel Date</label>
          <input 
            type="date" 
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <div className="search-field">
          <label><Users size={14} style={{ marginRight: '5px' }} /> Adults</label>
          <input 
            type="number" 
            min="1" 
            value={formData.adults}
            onChange={(e) => setFormData({...formData, adults: e.target.value})}
          />
        </div>

        <div className="search-field">
          <label><Users size={14} style={{ marginRight: '5px' }} /> Children</label>
          <input 
            type="number" 
            min="0" 
            value={formData.children}
            onChange={(e) => setFormData({...formData, children: e.target.value})}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '0 40px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={20} /> Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
