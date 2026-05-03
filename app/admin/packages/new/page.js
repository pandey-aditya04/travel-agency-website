'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Plus, Trash2, Image as ImageIcon, CheckCircle, 
  ChevronRight, ChevronLeft, MapPin, Tag, Clock, 
  IndianRupee, Save, Send
} from 'lucide-react';

export default function NewPackagePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [basicInfo, setBasicInfo] = useState({
    title: '',
    slug: '',
    category: 'Indian Escapes',
    destination: '',
    duration_days: 5,
    price_inr: '',
    original_price_inr: '',
    short_description: '',
    discount_badge: '',
    featured: false,
    status: 'Published'
  });

  const [images, setImages] = useState({
    cover_image_url: '',
    gallery_urls: []
  });

  const [itinerary, setItinerary] = useState([
    { day: 1, title: '', description: '', activities: [], meals: [], accommodation: '' }
  ]);

  const [details, setDetails] = useState({
    highlights: [],
    inclusions: [],
    exclusions: []
  });

  // Helper to auto-slugify title
  const handleTitleChange = (val) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setBasicInfo({ ...basicInfo, title: val, slug });
  };

  const addItineraryDay = () => {
    setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '', activities: [], meals: [], accommodation: '' }]);
  };

  const removeItineraryDay = (index) => {
    const newItinerary = itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 }));
    setItinerary(newItinerary);
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...itinerary];
    newItinerary[index][field] = value;
    setItinerary(newItinerary);
  };

  const uploadImage = async (file) => {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST', body: form
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const url = await uploadImage(file);
      if (type === 'cover') {
        setImages({ ...images, cover_image_url: url });
      } else {
        setImages({ ...images, gallery_urls: [...images.gallery_urls, url] });
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const fullPackage = {
      ...basicInfo,
      ...images,
      itinerary,
      highlights: details.highlights,
      inclusions: details.inclusions,
      exclusions: details.exclusions,
    };

    try {
      const res = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPackage)
      });
      if (res.ok) {
        alert('Package published successfully!');
        router.push('/admin/dashboard');
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      alert(err.message);
    }
    setIsSubmitting(false);
  };

  return (
    <main className="admin-wizard-page">
      <Navbar />

      <div className="container wizard-container">
        <header className="wizard-header">
          <h1>Trip Upload Wizard</h1>
          <div className="stepper">
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} className={`step ${step === s ? 'active' : ''} ${step > s ? 'done' : ''}`}>
                {step > s ? <CheckCircle size={18} /> : s}
                <span>{['Info', 'Images', 'Itinerary', 'Details', 'Publish'][s-1]}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="wizard-card">
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div className="step-content">
              <h2>Step 1: Basic Information</h2>
              <div className="form-grid">
                <div className="f-group full">
                  <label>Package Title</label>
                  <input value={basicInfo.title} onChange={e => handleTitleChange(e.target.value)} placeholder="e.g. Magical Kashmir Adventure" />
                </div>
                <div className="f-group">
                  <label>Slug (Auto-generated)</label>
                  <input value={basicInfo.slug} onChange={e => setBasicInfo({...basicInfo, slug: e.target.value})} />
                </div>
                <div className="f-group">
                  <label>Category</label>
                  <select value={basicInfo.category} onChange={e => setBasicInfo({...basicInfo, category: e.target.value})}>
                    <option>Indian Escapes</option>
                    <option>Overseas Adventures</option>
                    <option>Divine Destinations</option>
                  </select>
                </div>
                <div className="f-group">
                  <label>Destination</label>
                  <input value={basicInfo.destination} onChange={e => setBasicInfo({...basicInfo, destination: e.target.value})} placeholder="e.g. Srinagar, Kashmir" />
                </div>
                <div className="f-group">
                  <label>Duration (Days)</label>
                  <input type="number" value={basicInfo.duration_days} onChange={e => setBasicInfo({...basicInfo, duration_days: e.target.value})} />
                </div>
                <div className="f-group">
                  <label>Selling Price (₹)</label>
                  <input type="number" value={basicInfo.price_inr} onChange={e => setBasicInfo({...basicInfo, price_inr: e.target.value})} placeholder="24999" />
                </div>
                <div className="f-group">
                  <label>Original Price (₹)</label>
                  <input type="number" value={basicInfo.original_price_inr} onChange={e => setBasicInfo({...basicInfo, original_price_inr: e.target.value})} placeholder="29999" />
                </div>
                <div className="f-group full">
                  <label>Short Description</label>
                  <textarea value={basicInfo.short_description} onChange={e => setBasicInfo({...basicInfo, short_description: e.target.value})} placeholder="Brief overview of the trip..."></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: IMAGES */}
          {step === 2 && (
            <div className="step-content">
              <h2>Step 2: Media & Gallery</h2>
              <div className="image-upload-zone">
                <div className="f-group full">
                  <label>Cover / Thumbnail Image (16:9 landscape)</label>
                  <div className="upload-btn-wrap">
                    <input type="file" onChange={e => handleFileChange(e, 'cover')} accept="image/*" id="cover-upload" hidden />
                    <label htmlFor="cover-upload" className="upload-trigger">
                      <ImageIcon size={20} /> {images.cover_image_url ? 'Change Image' : 'Select Cover Photo'}
                    </label>
                    {images.cover_image_url && <div className="upload-preview"><img src={images.cover_image_url} alt="Cover" /></div>}
                  </div>
                </div>
                
                <div className="f-group full">
                  <label>Gallery Photos (Add multiple)</label>
                  <div className="gallery-upload-grid">
                    {images.gallery_urls.map((url, i) => (
                      <div key={i} className="gallery-preview-card">
                        <img src={url} alt="Gallery" />
                        <button onClick={() => setImages({...images, gallery_urls: images.gallery_urls.filter((_, idx) => idx !== i)})} className="remove-img">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <div className="gallery-add-card">
                      <input type="file" onChange={e => handleFileChange(e, 'gallery')} accept="image/*" id="gallery-upload" hidden />
                      <label htmlFor="gallery-upload">
                        <Plus size={24} />
                        <span>Add Photo</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ITINERARY */}
          {step === 3 && (
            <div className="step-content">
              <h2>Step 3: Day-by-Day Itinerary</h2>
              <div className="itinerary-builder">
                {itinerary.map((day, i) => (
                  <div key={i} className="itinerary-day-card">
                    <div className="day-card-header">
                      <h3>Day {day.day}</h3>
                      <button onClick={() => removeItineraryDay(i)}><Trash2 size={16} /></button>
                    </div>
                    <div className="form-grid">
                      <div className="f-group full"><label>Day Title</label><input value={day.title} onChange={e => handleItineraryChange(i, 'title', e.target.value)} placeholder="Arrival & Local Sightseeing" /></div>
                      <div className="f-group full"><label>Activities (Comma separated)</label><input value={day.activities.join(', ')} onChange={e => handleItineraryChange(i, 'activities', e.target.value.split(',').map(s => s.trim()))} /></div>
                      <div className="f-group full"><label>Plan / Description</label><textarea value={day.description} onChange={e => handleItineraryChange(i, 'description', e.target.value)}></textarea></div>
                    </div>
                  </div>
                ))}
                <button className="add-day-btn" onClick={addItineraryDay}>+ Add Another Day</button>
              </div>
            </div>
          )}

          {/* STEP 4: DETAILS */}
          {step === 4 && (
            <div className="step-content">
              <h2>Step 4: Highlights & Inclusions</h2>
              <div className="form-grid">
                <div className="f-group full">
                  <label>Trip Highlights (Press Enter to add)</label>
                  <input placeholder="e.g. Shikara Ride, Snowfall" onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setDetails({...details, highlights: [...details.highlights, e.target.value]});
                      e.target.value = '';
                    }
                  }} />
                  <div className="tag-cloud">{details.highlights.map((t, i) => <span key={i} className="tag">{t} <Trash2 size={12} onClick={() => setDetails({...details, highlights: details.highlights.filter((_, idx) => idx !== i)})} /></span>)}</div>
                </div>
                <div className="f-group full">
                  <label>Inclusions</label>
                  <textarea placeholder="Line by line..." onBlur={e => setDetails({...details, inclusions: e.target.value.split('\n')})}></textarea>
                </div>
                <div className="f-group full">
                  <label>Exclusions</label>
                  <textarea placeholder="Line by line..." onBlur={e => setDetails({...details, exclusions: e.target.value.split('\n')})}></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PREVIEW & PUBLISH */}
          {step === 5 && (
            <div className="step-content preview-step">
              <h2>Step 5: Review & Publish</h2>
              <div className="final-review">
                <div className="review-item"><strong>Title:</strong> {basicInfo.title}</div>
                <div className="review-item"><strong>Slug:</strong> {basicInfo.slug}</div>
                <div className="review-item"><strong>Price:</strong> ₹{basicInfo.price_inr}</div>
                <div className="review-item"><strong>Itinerary:</strong> {itinerary.length} Days planned</div>
              </div>
              <div className="publish-actions">
                <button className="save-draft" onClick={() => handleSave('draft')}>Save Draft</button>
                <button className="publish-now" onClick={() => handleSave('published')} disabled={isSubmitting}>
                  {isSubmitting ? 'Publishing...' : 'Publish Trip ✦'}
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="wizard-footer">
          <button className="back-btn" disabled={step === 1} onClick={() => setStep(step - 1)}>
            <ChevronLeft size={20} /> Back
          </button>
          {step < 5 && (
            <button className="next-btn" onClick={() => setStep(step + 1)}>
              Next <ChevronRight size={20} />
            </button>
          )}
        </footer>
      </div>

      <Footer />

      <style jsx>{`
        .admin-wizard-page { background: #F9FAFB; min-height: 100vh; }
        .wizard-container { max-width: 900px; padding: 100px 0; }
        .wizard-header { margin-bottom: 40px; text-align: center; }
        .wizard-header h1 { font-family: var(--font-display); font-size: 2.2rem; color: #1A2D42; margin-bottom: 30px; }
        
        .stepper { display: flex; justify-content: center; gap: 40px; }
        .step { display: flex; flex-direction: column; align-items: center; gap: 10px; color: #637085; font-weight: 600; font-size: 0.85rem; }
        .step.active { color: var(--navy); }
        .step.done { color: #10B981; }
        
        .wizard-card { background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid var(--border); }
        .step-content h2 { font-size: 1.4rem; margin-bottom: 30px; color: var(--navy); }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .f-group.full { grid-column: span 2; }
        .f-group label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--slate); margin-bottom: 8px; }
        .f-group input, .f-group select, .f-group textarea { width: 100%; padding: 12px; border: 1.5px solid var(--border); border-radius: 8px; outline: none; font-size: 0.95rem; }
        .f-group textarea { height: 100px; resize: none; }
        
        .gallery-inputs { display: flex; flex-direction: column; gap: 10px; }
        .gallery-url-row { display: flex; gap: 10px; }
        .add-btn { background: #F3F4F6; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; }
        
        .itinerary-day-card { border: 1px solid var(--border); padding: 20px; border-radius: 12px; margin-bottom: 20px; }
        .day-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .add-day-btn { width: 100%; background: var(--navy); color: var(--amber); padding: 15px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; }
        
        .tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .tag { background: #F3F4F6; padding: 4px 10px; border-radius: 4px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; }
        
        .wizard-footer { display: flex; justify-content: space-between; margin-top: 40px; }
        .back-btn { background: none; border: none; font-weight: 700; color: var(--slate); cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .next-btn { background: var(--navy); color: #fff; padding: 12px 30px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        
        .image-upload-zone { display: flex; flex-direction: column; gap: 30px; }
        .upload-btn-wrap { display: flex; align-items: center; gap: 20px; }
        .upload-trigger { background: #F3F4F6; border: 2px dashed var(--border); padding: 15px 25px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 600; color: var(--slate); transition: 0.3s; }
        .upload-trigger:hover { border-color: var(--amber); color: var(--amber); background: #fff; }
        .upload-preview { width: 120px; height: 67px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
        .upload-preview img { width: 100%; height: 100%; object-fit: cover; }

        .gallery-upload-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 15px; margin-top: 10px; }
        .gallery-preview-card { position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); }
        .gallery-preview-card img { width: 100%; height: 100%; object-fit: cover; }
        .remove-img { position: absolute; top: 5px; right: 5px; background: rgba(239, 68, 68, 0.9); color: #fff; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        
        .gallery-add-card label { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #F9FAFB; border: 2px dashed var(--border); border-radius: 12px; cursor: pointer; transition: 0.3s; padding: 20px 0; }
        .gallery-add-card label:hover { border-color: var(--amber); background: #fff; }
        .gallery-add-card span { font-size: 0.75rem; font-weight: 700; color: var(--slate); margin-top: 5px; }

        .publish-now { background: var(--amber); color: var(--navy); padding: 15px 40px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; }
      `}</style>
      </main>
    );
}
