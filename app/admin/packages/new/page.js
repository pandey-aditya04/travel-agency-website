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
    price: '',
    original_price: '',
    short_description: '',
    discount_badge: '',
    featured: false,
    status: 'published'
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
                  <input type="number" value={basicInfo.price} onChange={e => setBasicInfo({...basicInfo, price: e.target.value})} placeholder="24999" />
                </div>
                <div className="f-group">
                  <label>Original Price (₹)</label>
                  <input type="number" value={basicInfo.original_price} onChange={e => setBasicInfo({...basicInfo, original_price: e.target.value})} placeholder="29999" />
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
                  <label>Cover Image URL (16:9 recommended)</label>
                  <div className="url-input-wrap">
                    <input value={images.cover_image_url} onChange={e => setImages({...images, cover_image_url: e.target.value})} placeholder="https://..." />
                    <button className="preview-btn">Preview</button>
                  </div>
                </div>
                <div className="f-group full">
                  <label>Gallery Images (Add URLs)</label>
                  <div className="gallery-inputs">
                    {images.gallery_urls.map((url, i) => (
                      <div key={i} className="gallery-url-row">
                        <input value={url} onChange={e => {
                          const newUrls = [...images.gallery_urls];
                          newUrls[i] = e.target.value;
                          setImages({...images, gallery_urls: newUrls});
                        }} />
                        <button onClick={() => setImages({...images, gallery_urls: images.gallery_urls.filter((_, idx) => idx !== i)})}><Trash2 size={16} /></button>
                      </div>
                    ))}
                    <button className="add-btn" onClick={() => setImages({...images, gallery_urls: [...images.gallery_urls, '']})}>
                      <Plus size={16} /> Add Photo
                    </button>
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
                <div className="review-item"><strong>Price:</strong> ₹{basicInfo.price}</div>
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
        
        .publish-now { background: var(--amber); color: var(--navy); padding: 15px 40px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; }
      `}</style>
    </div>
  );
}
