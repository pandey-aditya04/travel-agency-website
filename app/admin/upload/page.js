'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
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
    let error;
    
    if (isEdit) {
      const { error: err } = await supabase
        .from('packages')
        .update(formData)
        .eq('id', editId);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('packages')
        .insert([formData]);
      error = err;
    }
    
    setLoading(false);
    if (error) {
      alert('Error saving package: ' + error.message);
    } else {
      alert(isEdit ? 'Package updated successfully!' : 'Package published successfully!');
      window.location.href = '/admin/dashboard';
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
    <main>
      <Navbar />
      <div className="container" style={{ padding: '60px 20px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr', gap: '50px' }}>
          {/* Wizard Area */}
          <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: 'var(--shadow-md)' }}>
            <h1 style={{ marginBottom: '20px' }}>{isEdit ? 'Edit Trip Package' : 'Create New Trip Package'}</h1>
            <div className="stepper">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`step ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                  <div className="step-num">{step > s ? <Check size={18}/> : s}</div>
                  <span className="step-label">Step {s}</span>
                </div>
              ))}
            </div>

            {renderStep()}

            <div className="wizard-navigation">
              <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className="btn btn-outline">Back</button>
              {step < 4 && <button onClick={() => setStep(s => s + 1)} className="btn btn-secondary">Continue</button>}
            </div>
          </div>

          {/* Live Preview Area */}
          <aside>
            <div style={{ position: 'sticky', top: '120px' }}>
              <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Eye size={20}/> Live Card Preview</h4>
              <div className="card-preview-container">
                <div className="card">
                    <div className="card-img-preview">
                        {formData.cover_image_url ? <img src={formData.cover_image_url} alt="Preview" /> : <div className="img-placeholder">Thumbnail</div>}
                        {formData.discount_badge && <span className="badge">{formData.discount_badge}</span>}
                    </div>
                    <div className="card-content">
                        <p className="cat">{formData.category}</p>
                        <h3 className="title">{formData.title || 'Your Trip Title'}</h3>
                        <p className="dest"><MapPin size={14}/> {formData.destination || 'Location'}</p>
                        <div className="footer">
                            <span className="price">₹{formData.price_inr || '0'}</span>
                            <span className="days">{formData.duration_days || '0'} Days</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .stepper { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 60px; 
          border-bottom: 1px solid #f0f0f0; 
          padding-bottom: 30px; 
          position: relative;
        }
        .step { 
          display: flex; 
          flex-direction: column;
          align-items: center; 
          gap: 12px; 
          color: #ccc; 
          position: relative;
          z-index: 1;
          flex: 1;
        }
        .step.active { color: var(--primary-color); }
        .step.active .step-num { border-color: var(--primary-color); background: #fff; box-shadow: 0 0 0 4px #fff9e6; }
        .step.completed { color: #10b981; }
        .step.completed .step-num { background: #10b981; border-color: #10b981; color: #fff; }
        .step-num { 
          width: 45px; 
          height: 45px; 
          border-radius: 50%; 
          border: 2px solid currentColor; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 1.1rem; 
          font-weight: 700;
          background: #fff;
          transition: all 0.3s ease;
        }
        .step-label { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        
        .step-title { 
          margin-bottom: 2.5rem; 
          display: flex; 
          align-items: center; 
          gap: 15px; 
          font-size: 1.8rem; 
          color: var(--secondary-color);
          font-weight: 800;
        }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .form-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 5px; }
        .full-width { grid-column: span 2; }
        label { font-weight: 700; font-size: 0.95rem; color: #4a4a68; }
        input, select, textarea { 
          width: 100%;
          padding: 15px; 
          border: 2px solid #f0f0f0; 
          border-radius: 12px; 
          font-family: inherit; 
          font-size: 1rem; 
          transition: all 0.2s ease;
          background: #fdfdfd;
        }
        input:focus, select:focus, textarea:focus { 
          border-color: var(--primary-color); 
          background: #fff;
          outline: none; 
          box-shadow: 0 4px 15px rgba(232, 160, 32, 0.1);
        }
        
        .upload-box { 
          position: relative; 
          border: 2px dashed #e0e0e0; 
          border-radius: 20px; 
          padding: 60px 40px; 
          text-align: center; 
          transition: all 0.3s ease;
          background: #fafafa;
        }
        .upload-box:hover { border-color: var(--primary-color); background: #fff9e6; }
        .upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 15px; color: #888; }
        .upload-placeholder span { font-weight: 600; }
        .upload-placeholder input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
        
        .preview-image-container { position: relative; width: 100%; height: 250px; border-radius: 15px; overflow: hidden; box-shadow: var(--shadow-md); }
        .preview-image-container img { width: 100%; height: 100%; object-fit: cover; }
        .remove-img { position: absolute; top: 15px; right: 15px; background: rgba(239, 68, 68, 0.9); color: #fff; border: none; padding: 8px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        
        .gallery-preview { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 15px; margin-top: 20px; }
        .gallery-item { position: relative; height: 100px; border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-sm); }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
        
        .tags-input-container { border: 2px solid #f0f0f0; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; gap: 15px; background: #fdfdfd; }
        .tags-list { display: flex; flex-wrap: wrap; gap: 10px; }
        .tag { background: #1a1a2e; color: #fff; padding: 6px 15px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .tag button { background: none; border: none; color: #e8a020; cursor: pointer; font-size: 1.2rem; line-height: 1; padding: 0; }
        
        .toggle-container { display: flex; background: #f0f0f0; padding: 6px; border-radius: 14px; width: fit-content; }
        .toggle-container button { border: none; padding: 10px 25px; border-radius: 10px; cursor: pointer; background: none; font-weight: 700; transition: all 0.3s ease; }
        .toggle-container button.active { background: #fff; color: var(--primary-color); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        
        .wizard-navigation { display: flex; justify-content: space-between; margin-top: 50px; padding-top: 30px; border-top: 1px solid #f0f0f0; }
        .final-actions { display: flex; gap: 20px; margin-top: 40px; }
        
        .card-preview-container { transform: scale(1); background: #fff; border-radius: 20px; padding: 10px; box-shadow: var(--shadow-lg); }
        .card { border: none; box-shadow: none; width: 100%; }
        .card-img-preview { height: 220px; background: #f5f5f5; position: relative; border-radius: 15px; overflow: hidden; margin-bottom: 15px; }
        .card-img-preview img { width: 100%; height: 100%; object-fit: cover; }
        .img-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ccc; gap: 10px; font-weight: 600; }
        .badge { position: absolute; top: 15px; left: 15px; background: var(--primary-color); color: #fff; padding: 6px 15px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; }
        .card-content { padding: 5px 10px; }
        .cat { color: var(--primary-color); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
        .title { margin: 10px 0; font-size: 1.4rem; font-weight: 800; color: var(--secondary-color); line-height: 1.2; }
        .dest { font-size: 0.9rem; color: #666; display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
        .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; border-top: 1px solid #f0f0f0; padding-top: 20px; }
        .price { font-weight: 900; font-size: 1.5rem; color: var(--secondary-color); }
        .days { font-size: 0.9rem; font-weight: 600; color: #888; }
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
