'use client';
import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import AdminNavbar from '@/components/admin/AdminNavbar';
import StepIndicator from '@/components/admin/StepIndicator';
import { FormField, inputStyle, inputFocusStyle } from '@/components/admin/FormField';
import { 
  Check, Info, Image as ImageIcon, List, Settings, 
  MapPin, Eye, Plus, Trash2, ChevronRight 
} from 'lucide-react';

function FocusInput({ style, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}), ...style }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function FocusSelect({ children, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      {...props}
      style={{
        ...inputStyle,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235E7A94' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
        paddingRight: '36px',
        appearance: 'none',
        cursor: 'pointer',
        ...(focused ? inputFocusStyle : {})
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  );
}

function FocusTextarea({ style, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', ...(focused ? inputFocusStyle : {}), ...style }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export default function UploadPage({ params }) {
  const resolvedParams = use(params || {});
  const editId = resolvedParams?.id || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('id') : null);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Indian Escapes',
    destination: '',
    duration_days: '',
    price_inr: '',
    original_price_inr: '',
    short_description: '',
    cover_image_url: '',
    gallery_urls: [],
    itinerary: '',
    inclusions: '',
    exclusions: '',
    highlights: [],
    status: 'Draft',
    featured: false,
    discount_badge: ''
  });

  useEffect(() => {
    if (editId) {
      setIsEdit(true);
      fetchPackage(editId);
    }
  }, [editId]);

  const fetchPackage = async (id) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (data) {
      let itineraryStr = data.itinerary;
      if (Array.isArray(data.itinerary)) {
        itineraryStr = data.itinerary.map(item => `Day ${item.day}: ${item.title}\n${item.description}`).join('\n\n');
      }
      setFormData({ ...data, itinerary: itineraryStr || '' });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      setFormData(prev => ({ ...prev, [name]: val, slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: val }));
    }
  };

  const handleHighlightEnter = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      setFormData(prev => ({ ...prev, highlights: [...prev.highlights, e.target.value] }));
      e.target.value = '';
    }
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const endpoint = '/api/admin/packages';
      const method = isEdit ? 'PUT' : 'POST';
      const payload = isEdit ? { ...formData, id: editId } : formData;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save');

      alert(isEdit ? 'Changes saved successfully!' : 'Package published successfully!');
      if (!isEdit) window.location.href = '/admin/dashboard';
    } catch (err) {
      console.error('Save error:', err);
      alert('Error saving package: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="step-content-anim">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', color: '#0D1B2A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={20} color="#E8A020" /> Step 1: Basic Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label="Package Title" required>
                  <FocusInput name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Magical Kerala Backwaters Tour" />
                </FormField>
              </div>
              <FormField label="Category" required>
                <FocusSelect name="category" value={formData.category} onChange={handleChange}>
                  <option value="Indian Escapes">Indian Escapes</option>
                  <option value="Overseas Adventures">Overseas Adventures</option>
                  <option value="Divine Destinations">Divine Destinations</option>
                </FocusSelect>
              </FormField>
              <FormField label="Destination" required>
                <FocusInput name="destination" value={formData.destination} onChange={handleChange} placeholder="e.g. Alleppey, Kerala" />
              </FormField>
              <FormField label="Duration (Days)" required>
                <FocusInput type="number" name="duration_days" value={formData.duration_days} onChange={handleChange} placeholder="5" />
              </FormField>
              <FormField label="Price (INR)" required>
                <FocusInput type="number" name="price_inr" value={formData.price_inr} onChange={handleChange} placeholder="24999" />
              </FormField>
              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label="Original Price (Optional)" hint="Shown as strikethrough for discounts">
                  <FocusInput type="number" name="original_price_inr" value={formData.original_price_inr} onChange={handleChange} placeholder="32000" />
                </FormField>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content-anim">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', color: '#0D1B2A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={20} color="#E8A020" /> Step 2: Media Links
            </h3>
            <FormField label="Cover Image URL" hint="Main thumbnail for the package card">
              <FocusInput name="cover_image_url" value={formData.cover_image_url} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
            </FormField>
            
            <div style={{ marginTop: '30px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#374151', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Gallery Images</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <FocusInput id="new-gallery-url" placeholder="Paste gallery image URL..." style={{ flex: 1 }} onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setFormData({...formData, gallery_urls: [...formData.gallery_urls, e.target.value]});
                    e.target.value = '';
                  }
                }} />
                <button 
                  onClick={() => {
                    const el = document.getElementById('new-gallery-url');
                    if (el.value) {
                      setFormData({...formData, gallery_urls: [...formData.gallery_urls, el.value]});
                      el.value = '';
                    }
                  }}
                  style={{ background: '#0D1B2A', color: '#fff', padding: '0 20px', borderRadius: '8px', fontWeight: 600 }}
                >Add</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
                {formData.gallery_urls.map((url, i) => (
                  <div key={i} style={{ position: 'relative', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                    <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Gallery" />
                    <button 
                      onClick={() => setFormData({...formData, gallery_urls: formData.gallery_urls.filter((_, idx) => idx !== i)})}
                      style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(239,68,68,0.9)', color: '#fff', borderRadius: '4px', padding: '2px' }}
                    ><Trash2 size={12}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content-anim">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', color: '#0D1B2A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <List size={20} color="#E8A020" /> Step 3: Package Content
            </h3>
            <FormField label="Short Description" hint="Shown on trip cards and hover">
              <FocusTextarea name="short_description" value={formData.short_description} onChange={handleChange} rows="3" placeholder="A brief, catchy summary..." />
            </FormField>
            <FormField label="Detailed Itinerary" hint="Day-by-day breakdown (text format)">
              <FocusTextarea name="itinerary" value={formData.itinerary} onChange={handleChange} rows="6" placeholder="Day 1: Arrival...&#10;Day 2: Sightseeing..." />
            </FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormField label="Inclusions">
                <FocusTextarea name="inclusions" value={formData.inclusions} onChange={handleChange} rows="4" placeholder="Breakfast, Hotel, Guide..." />
              </FormField>
              <FormField label="Exclusions">
                <FocusTextarea name="exclusions" value={formData.exclusions} onChange={handleChange} rows="4" placeholder="Flights, Personal expenses..." />
              </FormField>
            </div>
            <div style={{ marginTop: '10px' }}>
              <FormField label="Highlights" hint="Press Enter to add tags">
                <div style={{ border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '8px', background: '#FAFAFA' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    {formData.highlights.map((tag, i) => (
                      <span key={i} style={{ background: '#E8A020', color: '#0D1B2A', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {tag} <button onClick={() => removeHighlight(i)} style={{ background: 'none', border: 'none', color: '#0D1B2A', cursor: 'pointer', fontSize: '1rem' }}>×</button>
                      </span>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    onKeyDown={handleHighlightEnter} 
                    placeholder="e.g. Free Breakfast" 
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                  />
                </div>
              </FormField>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-content-anim">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', color: '#0D1B2A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={20} color="#E8A020" /> Step 4: Final Settings
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormField label="Status">
                <div style={{ display: 'flex', gap: '8px', background: '#F3F4F6', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
                  <button 
                    onClick={() => setFormData({...formData, status: 'Draft'})} 
                    style={{ padding: '8px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: formData.status === 'Draft' ? '#fff' : 'transparent', fontWeight: 600, color: formData.status === 'Draft' ? '#0D1B2A' : '#6B7280', boxShadow: formData.status === 'Draft' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
                  >Draft</button>
                  <button 
                    onClick={() => setFormData({...formData, status: 'Published'})} 
                    style={{ padding: '8px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: formData.status === 'Published' ? '#fff' : 'transparent', fontWeight: 600, color: formData.status === 'Published' ? '#0D1B2A' : '#6B7280', boxShadow: formData.status === 'Published' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
                  >Published</button>
                </div>
              </FormField>
              <FormField label="Badge Text" hint="e.g. Best Seller, 20% OFF">
                <FocusInput name="discount_badge" value={formData.discount_badge} onChange={handleChange} placeholder="Best Seller" />
              </FormField>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '15px', background: '#F9FAFB', borderRadius: '12px', border: '1.5px solid #E5E7EB' }}>
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                  <span style={{ fontWeight: 600, color: '#0D1B2A' }}>Feature this package on the homepage</span>
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <AdminNavbar />
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 32px)',
        paddingTop: '90px'
      }}>
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#E8A020', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Admin Panel</p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: '#0D1B2A', letterSpacing: '-0.5px' }}>
            {isEdit ? 'Refine Your Journey' : 'Craft a New Adventure'}
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1.05rem', marginTop: '4px' }}>Design a compelling travel experience that will wow your customers.</p>
        </div>

        {/* Two Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 380px',
          gap: '32px',
          alignItems: 'start'
        }} className="upload-grid">
          
          {/* Form Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E5E7EB',
            padding: 'clamp(16px, 5vw, 48px)',
            boxShadow: '0 4px 24px rgba(13,27,42,0.04)'
          }} className="form-card-mobile">
            <div style={{ overflowX: 'auto', marginBottom: '10px' }}>
              <StepIndicator currentStep={step} />
            </div>

            <div style={{ minHeight: '300px' }}>
              {renderStep()}
            </div>

            {/* Navigation */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '48px', 
              paddingTop: '32px', 
              borderTop: '1px solid #F3F4F6' 
            }}>
              <button
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
                style={{
                  padding: '12px 28px',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '10px',
                  background: 'white',
                  color: '#4B5563',
                  fontWeight: '600',
                  cursor: step === 1 ? 'not-allowed' : 'pointer',
                  opacity: step === 1 ? 0.4 : 1,
                  transition: '0.2s'
                }}
              >← Previous</button>

              <div style={{ display: 'flex', gap: '12px' }}>
                {isEdit && (
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    style={{ padding: '12px 24px', background: '#10b981', color: '#fff', borderRadius: '10px', fontWeight: 600 }}
                  >{loading ? 'Saving...' : 'Quick Save'}</button>
                )}
                {step < 4 ? (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    style={{
                      padding: '12px 32px',
                      background: '#0D1B2A',
                      color: '#E8A020',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >Continue to Step {step + 1} <ChevronRight size={18}/></button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      padding: '12px 32px',
                      background: '#E8A020',
                      color: '#0D1B2A',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      boxShadow: '0 10px 20px rgba(232, 160, 32, 0.2)'
                    }}
                  >✦ {isEdit ? 'Update Package' : 'Publish Package'}</button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <aside style={{ position: 'sticky', top: '90px' }} className="preview-sticky">
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              <Eye size={16} /> Live Preview
            </div>
            
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 20px 40px rgba(13,27,42,0.06)' }}>
              <div style={{ height: '220px', background: '#F3F4F6', position: 'relative' }}>
                {formData.cover_image_url ? (
                  <img src={formData.cover_image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1', gap: '10px' }}>
                    <ImageIcon size={48} />
                    <span>Card Thumbnail</span>
                  </div>
                )}
                {formData.discount_badge && (
                  <div style={{ position: 'absolute', top: '15px', left: '15px', background: '#E8A020', color: '#0D1B2A', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800 }}>
                    {formData.discount_badge}
                  </div>
                )}
              </div>
              <div style={{ padding: '24px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#E8A020', textTransform: 'uppercase', letterSpacing: '1px' }}>{formData.category}</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0D1B2A', margin: '8px 0', lineHeight: 1.2 }}>{formData.title || 'Your Trip Title'}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.85rem', marginBottom: '20px' }}>
                  <MapPin size={14} /> {formData.destination || 'Destination Name'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #F3F4F6' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0D1B2A' }}>₹{formData.price_inr?.toLocaleString() || '0'}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>{formData.duration_days || '0'} Days</div>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '20px', padding: '15px', background: '#EFF6FF', borderRadius: '12px', color: '#1E40AF', fontSize: '0.8rem', display: 'flex', gap: '10px' }}>
              <Info size={16} style={{ flexShrink: 0 }} />
              <p>Trip cards with high-quality landscape images have <strong>300% higher click rates</strong>.</p>
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .step-content-anim { animation: fadeIn 0.4s ease forwards; }
        
        @media (max-width: 900px) {
          .upload-grid { grid-template-columns: 1fr !important; }
          .preview-sticky { position: static !important; margin-top: 40px; }
        }

        @media (max-width: 600px) {
          .upload-grid div[style*="gridTemplateColumns: 1fr 1fr"] { 
            grid-template-columns: 1fr !important; 
          }
          .upload-grid div[style*="display: flex; justify-content: space-between"] {
            flex-direction: column-reverse !important;
            gap: 15px;
          }
          .upload-grid div[style*="display: flex; gap: 12px"] {
            width: 100%;
          }
          .upload-grid button { width: 100%; }
        }
      `}</style>
    </div>
  );
}
