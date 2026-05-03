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
      setFormData(data);
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

  const handleFileUpload = async (e, isGallery = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const fileData = new FormData();
        fileData.append('file', file);
        fileData.append('upload_preset', 'ml_default');

        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: fileData
        });
        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      }

      if (isGallery) {
        setFormData(prev => ({ ...prev, gallery_urls: [...prev.gallery_urls, ...uploadedUrls] }));
      } else {
        setFormData(prev => ({ ...prev, cover_image_url: uploadedUrls[0] }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const addHighlight = (e) => {
    if (e.key === 'Enter' && e.target.value) {
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

      alert(isEdit ? 'Package updated successfully!' : 'Package published successfully!');
      window.location.href = '/admin/dashboard';
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
            <h3 className="step-title"><Info /> Step 1: Basic Details (The Core Info)</h3>
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
                <input type="number" name="duration_days" value={formData.duration_days} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Price (INR)</label>
                <input type="number" name="price_inr" value={formData.price_inr} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Original Price (for discount)</label>
                <input type="number" name="original_price_inr" value={formData.original_price_inr} onChange={handleChange} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade">
            <h3 className="step-title"><ImageIcon /> Step 2: Media Upload (The Thumbnail & B-Roll)</h3>
            <div className="media-upload-area">
              <div className="form-group">
                <label>Cover Image (Thumbnail)</label>
                <div className="upload-box">
                  {formData.cover_image_url ? (
                    <div className="preview-image-container">
                        <img src={formData.cover_image_url} alt="Cover" />
                        <button onClick={() => setFormData({...formData, cover_image_url: ''})} className="remove-img"><Trash2 size={16}/></button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <Upload size={30} />
                      <span>Drag & drop or click to upload</span>
                      <input type="file" onChange={(e) => handleFileUpload(e, false)} />
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Gallery Images</label>
                <div className="upload-box">
                  <div className="upload-placeholder">
                    <Plus size={30} />
                    <span>Upload multiple images</span>
                    <input type="file" multiple onChange={(e) => handleFileUpload(e, true)} />
                  </div>
                </div>
                <div className="gallery-preview">
                  {formData.gallery_urls.map((url, i) => (
                    <div key={i} className="gallery-item">
                        <img src={url} alt="Gallery" />
                        <button onClick={() => setFormData({...formData, gallery_urls: formData.gallery_urls.filter((_, idx) => idx !== i)})} className="remove-img"><Trash2 size={14}/></button>
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
            <h3 className="step-title"><List /> Step 3: Itinerary & Description (The Content)</h3>
            <div className="content-area">
              <div className="form-group">
                <label>Itinerary (Day-by-Day breakdown)</label>
                <textarea name="itinerary" value={formData.itinerary} onChange={handleChange} rows="8" placeholder="Day 1: Arrival...&#10;Day 2: Exploration..."></textarea>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Inclusions</label>
                  <textarea name="inclusions" value={formData.inclusions} onChange={handleChange} rows="4"></textarea>
                </div>
                <div className="form-group">
                  <label>Exclusions</label>
                  <textarea name="exclusions" value={formData.exclusions} onChange={handleChange} rows="4"></textarea>
                </div>
              </div>
              <div className="form-group">
                <label>Highlights (Press Enter to add tags)</label>
                <div className="tags-input-container">
                    <div className="tags-list">
                        {formData.highlights.map((tag, i) => (
                            <span key={i} className="tag">{tag} <button onClick={() => removeHighlight(i)}>×</button></span>
                        ))}
                    </div>
                    <input type="text" onKeyDown={addHighlight} placeholder="e.g. Free Breakfast" />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade">
            <h3 className="step-title"><Settings /> Step 4: Preview & Publish (The Final Check)</h3>
            <div className="settings-area">
              <div className="settings-grid">
                <div className="form-group">
                  <label>Visibility Status</label>
                  <div className="toggle-container">
                    <button onClick={() => setFormData({...formData, status: 'Draft'})} className={formData.status === 'Draft' ? 'active' : ''}>Draft</button>
                    <button onClick={() => setFormData({...formData, status: 'Published'})} className={formData.status === 'Published' ? 'active' : ''}>Published</button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Discount Badge</label>
                  <input type="text" name="discount_badge" value={formData.discount_badge} onChange={handleChange} placeholder="e.g. 20% OFF" />
                </div>
                <div className="form-group featured-check">
                  <label><input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} /> Pin to Homepage</label>
                </div>
              </div>
              <div className="final-actions">
                <button onClick={handleSubmit} disabled={loading} className="btn btn-secondary">Save as Draft</button>
                <button onClick={() => {setFormData({...formData, status: 'Published'}); handleSubmit();}} disabled={loading} className="btn btn-primary">{isEdit ? 'Update Package' : 'Publish Package'}</button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main style={{ background: '#F0F2F5', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <AdminNavbar />
      
      <div className="admin-container">
        <div className="admin-layout">
          {/* Main Editor Section */}
          <div className="editor-card">
            <header className="editor-header">
              <h1>{isEdit ? 'Refine Your Journey' : 'Craft a New Adventure'}</h1>
              <p>Fill in the details below to create a compelling travel package.</p>
            </header>

            <div className="stepper-modern">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`step-item ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`} onClick={() => setStep(s)}>
                  <div className="step-circle">{step > s ? <Check size={16}/> : s}</div>
                  <span>Step {s}</span>
                </div>
              ))}
            </div>

            <div className="step-content">
              {renderStep()}
            </div>

            <footer className="editor-footer">
              <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className="btn-back">
                Previous
              </button>
              <div className="footer-right">
                {step < 4 ? (
                  <button onClick={() => setStep(s => s + 1)} className="btn-continue">
                    Continue to Step {step + 1}
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={loading} className="btn-publish">
                    {loading ? 'Processing...' : (isEdit ? 'Update Adventure' : 'Launch Adventure')}
                  </button>
                )}
              </div>
            </footer>
          </div>

          {/* Live Preview Sidebar */}
          <aside className="preview-sidebar">
            <div className="preview-sticky">
              <div className="preview-label"><Eye size={16}/> Live Preview</div>
              <div className="premium-card">
                <div className="card-media">
                  {formData.cover_image_url ? (
                    <img src={formData.cover_image_url} alt="Preview" />
                  ) : (
                    <div className="media-placeholder">
                      <ImageIcon size={40} />
                      <span>Thumbnail</span>
                    </div>
                  )}
                  {formData.discount_badge && <div className="card-badge">{formData.discount_badge}</div>}
                </div>
                <div className="card-info">
                  <span className="card-cat">{formData.category}</span>
                  <h3 className="card-title">{formData.title || 'Untitled Journey'}</h3>
                  <div className="card-loc"><MapPin size={14}/> {formData.destination || 'Global'}</div>
                  <div className="card-stats">
                    <div className="card-price">₹{formData.price_inr?.toLocaleString() || '0'}</div>
                    <div className="card-days">{formData.duration_days || '0'} Days</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .admin-container { max-width: 1400px; margin: 0 auto; padding: 40px 20px; }
        .admin-layout { display: grid; grid-template-columns: 1fr 400px; gap: 40px; align-items: start; }
        
        .editor-card { background: white; border-radius: 32px; padding: 50px; box-shadow: 0 20px 60px rgba(0,0,0,0.05); border: 1px solid #E5E7EB; }
        .editor-header h1 { font-size: 2.2rem; color: #111827; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px; }
        .editor-header p { color: #6B7280; margin-bottom: 40px; font-size: 1.1rem; }

        .stepper-modern { display: flex; gap: 10px; margin-bottom: 50px; background: #F3F4F6; padding: 8px; border-radius: 20px; }
        .step-item { flex: 1; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 12px; border-radius: 14px; cursor: pointer; transition: 0.3s; color: #9CA3AF; font-weight: 700; font-size: 0.9rem; }
        .step-item.active { background: white; color: #111827; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .step-item.completed { color: #10B981; }
        .step-circle { width: 28px; height: 28px; border-radius: 8px; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }
        
        .step-title { font-size: 1.4rem; font-weight: 800; color: #111827; margin-bottom: 30px; display: flex; align-items: center; gap: 12px; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .form-group { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        .full-width { grid-column: span 2; }
        
        label { font-size: 0.85rem; font-weight: 800; color: #4B5563; text-transform: uppercase; letter-spacing: 0.5px; }
        input, select, textarea { 
          width: 100%; padding: 16px 20px; border: 2px solid #F3F4F6; border-radius: 16px; 
          font-size: 1rem; color: #111827; transition: 0.3s; background: #F9FAFB;
        }
        input:focus, select:focus, textarea:focus { border-color: #E8A020; background: white; outline: none; box-shadow: 0 0 0 4px rgba(232, 160, 32, 0.1); }

        .editor-footer { display: flex; justify-content: space-between; margin-top: 60px; padding-top: 40px; border-top: 1px solid #F3F4F6; }
        .btn-back { padding: 14px 28px; border-radius: 14px; border: 2px solid #E5E7EB; background: white; font-weight: 700; cursor: pointer; transition: 0.3s; color: #6B7280; }
        .btn-back:hover { border-color: #111827; color: #111827; }
        .btn-continue { padding: 14px 32px; border-radius: 14px; background: #111827; color: white; font-weight: 700; border: none; cursor: pointer; transition: 0.3s; }
        .btn-publish { padding: 14px 32px; border-radius: 14px; background: #E8A020; color: white; font-weight: 700; border: none; cursor: pointer; box-shadow: 0 10px 20px rgba(232, 160, 32, 0.2); }
        .btn-continue:hover, .btn-publish:hover { transform: translateY(-2px); opacity: 0.9; }

        .preview-sidebar { position: sticky; top: 120px; }
        .preview-label { font-size: 0.8rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        
        .premium-card { background: white; border-radius: 28px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.1); border: 1px solid #E5E7EB; }
        .card-media { height: 260px; background: #F3F4F6; position: relative; }
        .card-media img { width: 100%; height: 100%; object-fit: cover; }
        .media-placeholder { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #D1D5DB; gap: 12px; }
        .card-badge { position: absolute; top: 20px; left: 20px; background: #E8A020; color: white; padding: 6px 14px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; }
        
        .card-info { padding: 24px; }
        .card-cat { font-size: 0.7rem; font-weight: 900; color: #E8A020; text-transform: uppercase; letter-spacing: 1.5px; }
        .card-title { font-size: 1.6rem; font-weight: 800; color: #111827; margin: 10px 0; }
        .card-loc { font-size: 0.9rem; color: #6B7280; display: flex; align-items: center; gap: 6px; margin-bottom: 24px; }
        .card-stats { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #F3F4F6; padding-top: 20px; }
        .card-price { font-size: 1.8rem; font-weight: 900; color: #111827; }
        .card-days { font-size: 0.9rem; font-weight: 700; color: #9CA3AF; }

        @media (max-width: 1200px) { .admin-layout { grid-template-columns: 1fr; } .preview-sidebar { display: none; } }
        @media (max-width: 768px) { 
          .editor-card { padding: 30px; border-radius: 24px; }
          .form-grid { grid-template-columns: 1fr; }
          .stepper-modern span { display: none; }
        }
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
