'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Upload, Check, Info, List, Settings, Image as ImageIcon, Eye, Plus, Trash2, MapPin } from 'lucide-react';

function UploadTripContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
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
    discount_badge: '',
    slug: ''
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
      // If itinerary is an array, convert to string for the textarea
      let itineraryStr = data.itinerary;
      if (Array.isArray(data.itinerary)) {
        itineraryStr = data.itinerary.map(item => `Day ${item.day}: ${item.title}\n${item.description}`).join('\n\n');
      }
      setFormData({ ...data, itinerary: itineraryStr });
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
      
      // Convert itinerary string back to array if possible, or keep as string
      // The current schema might expect a string or an array. 
      // Most of our previous code used arrays for the frontend display.
      // We'll send it as is for now, but ensure it's not broken.
      
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
          <div className="animate-fade">
            <h3 className="step-title"><Info size={24} /> Step 1: Basic Details</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Package Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Magical Kerala Backwaters" required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Indian Escapes">Indian Escapes</option>
                  <option value="Overseas Adventures">Overseas Adventures</option>
                  <option value="Divine Destinations">Divine Destinations</option>
                </select>
              </div>
              <div className="form-group">
                <label>Destination</label>
                <input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="e.g. Alleppey, Kerala" required />
              </div>
              <div className="form-group">
                <label>Duration (Days)</label>
                <input type="number" name="duration_days" value={formData.duration_days} onChange={handleChange} placeholder="5" required />
              </div>
              <div className="form-group">
                <label>Price (INR)</label>
                <input type="number" name="price_inr" value={formData.price_inr} onChange={handleChange} placeholder="24999" required />
              </div>
              <div className="form-group">
                <label>Original Price (Optional)</label>
                <input type="number" name="original_price_inr" value={formData.original_price_inr} onChange={handleChange} placeholder="32000" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade">
            <h3 className="step-title"><ImageIcon size={24} /> Step 2: Media Links</h3>
            <div className="media-link-area">
              <div className="form-group">
                <label>Cover Image URL (Thumbnail)</label>
                <div className="url-input-box">
                  <input 
                    type="text" 
                    name="cover_image_url" 
                    value={formData.cover_image_url} 
                    onChange={handleChange} 
                    placeholder="Paste image URL here (https://...)" 
                  />
                  {formData.cover_image_url && (
                    <div className="url-preview-mini">
                      <img src={formData.cover_image_url} alt="Cover Preview" />
                      <button onClick={() => setFormData({...formData, cover_image_url: ''})} className="clear-url"><Trash2 size={14}/></button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-group" style={{ marginTop: '30px' }}>
                <label>Add Gallery Image URL</label>
                <div className="url-add-group">
                  <input 
                    type="text" 
                    id="new-gallery-url" 
                    placeholder="Paste gallery image URL..." 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setFormData({...formData, gallery_urls: [...formData.gallery_urls, e.target.value]});
                        e.target.value = '';
                      }
                    }}
                  />
                  <button className="add-btn" onClick={() => {
                    const el = document.getElementById('new-gallery-url');
                    if (el.value) {
                      setFormData({...formData, gallery_urls: [...formData.gallery_urls, el.value]});
                      el.value = '';
                    }
                  }}><Plus size={20}/></button>
                </div>
                <div className="gallery-link-previews">
                  {formData.gallery_urls.map((url, i) => (
                    <div key={i} className="gallery-link-item">
                      <img src={url} alt="Gallery" />
                      <button onClick={() => setFormData({...formData, gallery_urls: formData.gallery_urls.filter((_, idx) => idx !== i)})} className="remove-link"><Trash2 size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade">
            <h3 className="step-title"><List size={24} /> Step 3: Package Content</h3>
            <div className="content-area">
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Short Description (Hero Intro)</label>
                <textarea name="short_description" value={formData.short_description} onChange={handleChange} rows="3" placeholder="Briefly describe the trip's vibe..."></textarea>
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Detailed Itinerary (Text Format)</label>
                <textarea name="itinerary" value={formData.itinerary} onChange={handleChange} rows="6" placeholder="Day 1: Arrival...&#10;Day 2: Exploration..."></textarea>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>What's Included</label>
                  <textarea name="inclusions" value={formData.inclusions} onChange={handleChange} rows="4" placeholder="Breakfast, Hotel, Guide..."></textarea>
                </div>
                <div className="form-group">
                  <label>What's Excluded</label>
                  <textarea name="exclusions" value={formData.exclusions} onChange={handleChange} rows="4" placeholder="Flights, Personal expenses..."></textarea>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '24px' }}>
                <label>Highlights (Press Enter to add tags)</label>
                <div className="modern-tags-input">
                  <div className="tags-chips">
                    {formData.highlights.map((tag, i) => (
                      <span key={i} className="chip">{tag} <button onClick={() => removeHighlight(i)}>×</button></span>
                    ))}
                  </div>
                  <input type="text" onKeyDown={handleHighlightEnter} placeholder="e.g. Free Breakfast" />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade">
            <h3 className="step-title"><Settings size={24} /> Step 4: Final Settings</h3>
            <div className="settings-area">
              <div className="settings-grid">
                <div className="form-group">
                  <label>Package Status</label>
                  <div className="toggle-v2">
                    <button onClick={() => setFormData({...formData, status: 'Draft'})} className={formData.status === 'Draft' ? 'active' : ''}>Draft</button>
                    <button onClick={() => setFormData({...formData, status: 'Published'})} className={formData.status === 'Published' ? 'active' : ''}>Published</button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Discount Badge (Text)</label>
                  <input type="text" name="discount_badge" value={formData.discount_badge} onChange={handleChange} placeholder="e.g. 20% OFF" />
                </div>
                <div className="form-group flex-row">
                  <label className="checkbox-label">
                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                    <span>Featured on Homepage</span>
                  </label>
                </div>
              </div>
              <div className="final-actions">
                <p className="summary-info">Your package will be saved as <strong>{formData.status}</strong>.</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="admin-page-bg">
      <AdminNavbar />
      
      <div className="admin-container">
        <div className="admin-layout">
          {/* Left: Multi-step Form */}
          <div className="editor-card">
            <header className="editor-header">
              <div className="header-top">
                <div className="status-badge">{isEdit ? 'Editing Package' : 'New Package'}</div>
                {isEdit && (
                  <button onClick={handleSubmit} disabled={loading} className="quick-save-btn">
                    {loading ? 'Saving...' : 'Quick Save Changes'}
                  </button>
                )}
              </div>
              <h1>{isEdit ? 'Refine Your Journey' : 'Craft a New Adventure'}</h1>
              <p>Design a compelling travel experience that will wow your customers.</p>
            </header>

            <div className="stepper-v2">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`step-box ${step === s ? 'active' : ''} ${step > s ? 'done' : ''}`} onClick={() => setStep(s)}>
                  <div className="step-num">{step > s ? <Check size={16}/> : s}</div>
                  <div className="step-label">Step {s}</div>
                </div>
              ))}
            </div>

            <div className="form-container-body">
              {renderStep()}
            </div>

            <footer className="editor-footer">
              <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className="btn-outline-admin">
                Previous
              </button>
              <div className="footer-right">
                {step < 4 ? (
                  <button onClick={() => setStep(s => s + 1)} className="btn-next-admin">
                    Continue to Step {step + 1}
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={loading} className="btn-finish-admin">
                    {loading ? 'Processing...' : (isEdit ? 'Save Changes' : 'Launch Package')}
                  </button>
                )}
              </div>
            </footer>
          </div>

          {/* Right: Live Preview */}
          <aside className="preview-column">
            <div className="preview-sticky">
              <div className="preview-header"><Eye size={16}/> LIVE PREVIEW</div>
              <div className="preview-card-v2">
                <div className="preview-media">
                  {formData.cover_image_url ? (
                    <img src={formData.cover_image_url} alt="Preview" />
                  ) : (
                    <div className="media-empty">
                      <ImageIcon size={48} />
                      <span>Thumbnail Preview</span>
                    </div>
                  )}
                  {formData.discount_badge && <div className="p-badge">{formData.discount_badge}</div>}
                </div>
                <div className="preview-info">
                  <span className="p-cat">{formData.category}</span>
                  <h3 className="p-title">{formData.title || 'Your Package Title'}</h3>
                  <div className="p-loc"><MapPin size={14}/> {formData.destination || 'Destination'}</div>
                  <div className="p-stats">
                    <div className="p-price">₹{formData.price_inr?.toLocaleString() || '0'}</div>
                    <div className="p-days">{formData.duration_days || '0'} Days</div>
                  </div>
                </div>
              </div>
              <div className="preview-tips">
                <Info size={14}/> Tip: High-quality images convert 3x better.
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .admin-page-bg { background: #f8fafc; min-height: 100vh; padding-bottom: 80px; font-family: 'Inter', sans-serif; }
        .admin-container { max-width: 1400px; margin: 0 auto; padding: 40px 20px; }
        .admin-layout { display: grid; grid-template-columns: 1fr 400px; gap: 40px; }

        .editor-card { background: #fff; border-radius: 24px; padding: 50px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #e2e8f0; }
        .editor-header { margin-bottom: 40px; }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .status-badge { display: inline-block; padding: 4px 12px; background: #f1f5f9; color: #64748b; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .quick-save-btn { background: #10b981; color: #fff; border: none; padding: 8px 18px; border-radius: 10px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: 0.3s; }
        .quick-save-btn:hover { background: #059669; transform: translateY(-2px); }
        
        .editor-header h1 { font-size: 2.2rem; font-weight: 800; color: #0f172a; margin-bottom: 10px; letter-spacing: -0.5px; }
        .editor-header p { color: #64748b; font-size: 1.1rem; }

        /* Stepper */
        .stepper-v2 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 50px; background: #f8fafc; padding: 8px; border-radius: 16px; }
        .step-box { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; border-radius: 12px; cursor: pointer; transition: 0.3s; color: #94a3b8; font-weight: 700; }
        .step-box.active { background: #fff; color: #0f172a; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .step-box.done { color: #10b981; }
        .step-num { width: 26px; height: 26px; border-radius: 6px; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }

        /* Form */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
        .full-width { grid-column: span 2; }
        label { font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
        input, select, textarea { 
          width: 100%; padding: 14px 18px; border: 1.5px solid #e2e8f0; border-radius: 12px; 
          font-size: 0.95rem; color: #0f172a; transition: 0.3s; background: #fcfdfe;
          min-height: 52px;
        }
        textarea { height: auto; min-height: 100px; }
        input:focus, select:focus, textarea:focus { border-color: #E8A020; background: #fff; outline: none; box-shadow: 0 0 0 4px rgba(232, 160, 32, 0.1); }

        /* URL Input Area */
        .url-input-box { position: relative; }
        .url-preview-mini { position: absolute; right: 8px; top: 8px; bottom: 8px; width: 60px; border-radius: 8px; overflow: hidden; }
        .url-preview-mini img { width: 100%; height: 100%; object-fit: cover; }
        .clear-url { position: absolute; inset: 0; background: rgba(0,0,0,0.5); color: #fff; display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
        .url-preview-mini:hover .clear-url { opacity: 1; }

        .url-add-group { display: flex; gap: 10px; }
        .add-btn { background: #0f172a; color: #fff; width: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .gallery-link-previews { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 10px; margin-top: 15px; }
        .gallery-link-item { position: relative; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
        .gallery-link-item img { width: 100%; height: 100%; object-fit: cover; }
        .remove-link { position: absolute; top: 4px; right: 4px; background: rgba(239, 68, 68, 0.9); color: #fff; border-radius: 4px; padding: 2px; }

        /* Tags */
        .modern-tags-input { border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 10px; background: #fcfdfe; }
        .tags-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
        .chip { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 6px; }
        .chip button { color: #94a3b8; font-size: 1.2rem; }
        .modern-tags-input input { border: none; padding: 5px; background: transparent; box-shadow: none; min-height: auto; width: 100%; }

        /* Toggle */
        .toggle-v2 { display: flex; gap: 5px; background: #f1f5f9; padding: 4px; border-radius: 10px; width: fit-content; }
        .toggle-v2 button { padding: 8px 20px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; transition: 0.3s; color: #64748b; }
        .toggle-v2 button.active { background: #fff; color: #0f172a; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

        .checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .checkbox-label input { width: 18px; height: 18px; min-height: auto; }

        /* Footer */
        .editor-footer { display: flex; justify-content: space-between; margin-top: 60px; padding-top: 40px; border-top: 1px solid #f1f5f9; }
        .btn-outline-admin { padding: 14px 28px; border-radius: 12px; border: 1.5px solid #e2e8f0; background: #fff; font-weight: 700; color: #64748b; }
        .btn-outline-admin:hover { border-color: #0f172a; color: #0f172a; }
        .btn-next-admin { padding: 14px 32px; border-radius: 12px; background: #0f172a; color: #fff; font-weight: 700; }
        .btn-finish-admin { padding: 14px 32px; border-radius: 12px; background: #E8A020; color: #fff; font-weight: 700; box-shadow: 0 10px 20px rgba(232, 160, 32, 0.2); }

        /* Preview Sidebar */
        .preview-sticky { position: sticky; top: 120px; }
        .preview-header { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
        .preview-card-v2 { background: #fff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
        .preview-media { height: 240px; background: #f8fafc; position: relative; }
        .preview-media img { width: 100%; height: 100%; object-fit: cover; }
        .media-empty { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #cbd5e1; gap: 10px; }
        .p-badge { position: absolute; top: 15px; left: 15px; background: #E8A020; color: #fff; padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 800; }
        .preview-info { padding: 25px; }
        .p-cat { font-size: 0.65rem; font-weight: 900; color: #E8A020; text-transform: uppercase; letter-spacing: 1px; }
        .p-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 10px 0; line-height: 1.2; }
        .p-loc { font-size: 0.85rem; color: #64748b; display: flex; align-items: center; gap: 6px; margin-bottom: 20px; }
        .p-stats { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 15px; }
        .p-price { font-size: 1.6rem; font-weight: 900; color: #0f172a; }
        .p-days { font-size: 0.85rem; font-weight: 700; color: #94a3b8; }
        .preview-tips { margin-top: 20px; font-size: 0.8rem; color: #64748b; font-style: italic; display: flex; align-items: center; gap: 8px; padding: 0 10px; }

        @media (max-width: 1200px) { .admin-layout { grid-template-columns: 1fr; } .preview-column { display: none; } }
        @media (max-width: 768px) { .editor-card { padding: 30px; } .form-grid { grid-template-columns: 1fr; } .step-label { display: none; } }
      `}</style>
      <Footer />
    </main>
  );
}

export default function UploadTrip() {
  return (
    <Suspense fallback={<div>Loading Wizard...</div>}>
      <UploadTripContent />
    </Suspense>
  );
}
