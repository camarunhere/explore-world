import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../utils/api';
import './Submit.css';

const CONTINENTS = ['Africa', 'Asia', 'Europe', 'South America', 'Middle East', 'Oceania'];
const ACTIVITIES = [
  'Hiking & Trekking', 'Cultural Exploration', 'Adventure Sports', 'Nature & Wildlife',
  'Historical Sites', 'Desert Exploration', 'Beach & Coastal', 'Mountain Climbing',
  'Rural & Farm Stays', 'Photography & Scenery', 'Gastronomy & Food Tours', 'Wilderness Survival',
  'Spa & Hot Springs', 'Rainforest Exploration',
];
const DIFFICULTIES = ['Easy', 'Moderate', 'Challenging', 'Very Difficult', 'Expert'];
const ACCOMM = ['Guesthouse', 'Camping', 'Eco-lodge', 'Homestay', 'Budget Hotel', 'Hostel', 'Boutique Hotel', 'None/Wild Camping'];
const BEST_TIMES = ['January–March', 'February–April', 'March–May', 'April–June', 'May–July', 'June–August', 'July–September', 'August–October', 'September–November', 'October–December', 'Year-round'];

const STEPS = [
  { id: 1, label: 'Location', icon: '📍' },
  { id: 2, label: 'Details', icon: '📝' },
  { id: 3, label: 'Story', icon: '✍️' },
  { id: 4, label: 'Logistics', icon: '🗺️' },
];

const EMPTY = {
  post_title: '', country: '', region: '', continent: '',
  activity_type: '', difficulty_level: '', best_time_to_visit: '',
  avg_trip_duration_days: '', estimated_cost_usd: '',
  description_summary: '', full_description: '',
  accessibility: '', accommodation_type: '', nearest_major_city: '',
  distance_from_major_city_km: '', environmental_sensitivity: 'Low',
  tags: '', image: '',
};

export default function Submit() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="submit-page">
        <div className="container submit-auth-gate">
          <div className="submit-gate-card animate-fadeInUp">
            <span className="gate-icon">🔒</span>
            <h2>Sign in to Share</h2>
            <p>You need an account to submit a hidden destination to the community.</p>
            <div className="gate-btns">
              <Link to="/login" state={{ from: '/submit' }} className="btn btn-primary">Sign In</Link>
              <Link to="/register" className="btn btn-secondary">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="submit-page">
        <div className="container submit-success-wrap">
          <div className="submit-success animate-fadeInUp">
            <div className="success-animation">
              <div className="success-ring" />
              <span className="success-icon">✦</span>
            </div>
            <h2>Destination Submitted!</h2>
            <p>Thank you for sharing your discovery. Our team will review and publish it shortly.</p>
            <div className="success-btns">
              <Link to="/destinations" className="btn btn-primary">Browse Destinations</Link>
              <button className="btn btn-secondary" onClick={() => { setForm(EMPTY); setStep(1); setSuccess(false); }}>
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.post_title.trim()) e.post_title = 'Title is required';
      if (!form.country.trim()) e.country = 'Country is required';
      if (!form.continent) e.continent = 'Please select a continent';
    }
    if (step === 2) {
      if (!form.activity_type) e.activity_type = 'Please select an activity type';
      if (!form.difficulty_level) e.difficulty_level = 'Please select a difficulty';
    }
    if (step === 3) {
      if (!form.description_summary.trim() || form.description_summary.length < 40)
        e.description_summary = 'Please write at least 40 characters';
      if (!form.full_description.trim() || form.full_description.length < 100)
        e.full_description = 'Please write at least 100 characters for the full story';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep((s) => s + 1); };
  const prev = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        avg_trip_duration_days: Number(form.avg_trip_duration_days) || 0,
        estimated_cost_usd: Number(form.estimated_cost_usd) || 0,
        distance_from_major_city_km: Number(form.distance_from_major_city_km) || 0,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      await api.createDestination(payload);
      setSuccess(true);
    } catch (err) {
      setErrors({ submit: err.message || 'Submission failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="submit-page">
      {/* Hero */}
      <div className="submit-hero">
        <div className="container">
          <span className="section-tag">Share Your Discovery</span>
          <h1 className="submit-hero-title">Put a Hidden Gem on the Map</h1>
          <p className="submit-hero-sub">Your discovery could inspire thousands. Share the details and help travellers find extraordinary, off-the-beaten-path experiences.</p>
        </div>
      </div>

      <div className="container submit-container">
        {/* Progress */}
        <div className="submit-progress-wrap">
          <div className="submit-steps">
            {STEPS.map((s) => (
              <div key={s.id} className={`submit-step ${step >= s.id ? 'reached' : ''} ${step === s.id ? 'active' : ''}`}>
                <div className="step-dot">
                  {step > s.id
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : <span>{s.icon}</span>
                  }
                </div>
                <span className="step-label">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="submit-progress-bar">
            <div className="submit-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {errors.submit && (
          <div className="auth-alert auth-alert-error" style={{ maxWidth: 680, margin: '0 auto 16px' }}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="submit-form">

          {/* STEP 1: Location */}
          {step === 1 && (
            <div className="submit-step-content animate-fadeInUp">
              <div className="submit-step-header">
                <span className="step-num">01</span>
                <div>
                  <h2>Location Details</h2>
                  <p>Tell us where this hidden gem is located.</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group form-col-2">
                  <label className="form-label">Destination Title <span className="req">*</span></label>
                  <input type="text" className={`form-input ${errors.post_title ? 'input-error' : ''}`}
                    placeholder="e.g. The Hidden Waterfalls of Luang Prabang"
                    value={form.post_title} onChange={(e) => set('post_title', e.target.value)} />
                  {errors.post_title && <p className="field-error">{errors.post_title}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Country <span className="req">*</span></label>
                  <input type="text" className={`form-input ${errors.country ? 'input-error' : ''}`}
                    placeholder="e.g. Laos"
                    value={form.country} onChange={(e) => set('country', e.target.value)} />
                  {errors.country && <p className="field-error">{errors.country}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Region / Province</label>
                  <input type="text" className="form-input" placeholder="e.g. Luang Prabang Province"
                    value={form.region} onChange={(e) => set('region', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Continent <span className="req">*</span></label>
                  <select className={`form-input form-select ${errors.continent ? 'input-error' : ''}`}
                    value={form.continent} onChange={(e) => set('continent', e.target.value)}>
                    <option value="">Select continent...</option>
                    {CONTINENTS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  {errors.continent && <p className="field-error">{errors.continent}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Nearest Major City</label>
                  <input type="text" className="form-input" placeholder="e.g. Luang Prabang"
                    value={form.nearest_major_city} onChange={(e) => set('nearest_major_city', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Distance from City (km)</label>
                  <input type="number" className="form-input" placeholder="e.g. 25"
                    value={form.distance_from_major_city_km} onChange={(e) => set('distance_from_major_city_km', e.target.value)} />
                </div>

                <div className="form-group form-col-2">
                  <label className="form-label">Cover Image URL</label>
                  <input type="url" className="form-input" placeholder="https://images.unsplash.com/..."
                    value={form.image} onChange={(e) => set('image', e.target.value)} />
                  <p className="field-hint">Paste an Unsplash or direct image URL for the destination cover photo.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Details */}
          {step === 2 && (
            <div className="submit-step-content animate-fadeInUp">
              <div className="submit-step-header">
                <span className="step-num">02</span>
                <div>
                  <h2>Trip Details</h2>
                  <p>Help travellers plan their visit with key trip information.</p>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Activity Type <span className="req">*</span></label>
                  <select className={`form-input form-select ${errors.activity_type ? 'input-error' : ''}`}
                    value={form.activity_type} onChange={(e) => set('activity_type', e.target.value)}>
                    <option value="">Select activity...</option>
                    {ACTIVITIES.map((a) => <option key={a}>{a}</option>)}
                  </select>
                  {errors.activity_type && <p className="field-error">{errors.activity_type}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty Level <span className="req">*</span></label>
                  <div className="pill-select">
                    {DIFFICULTIES.map((d) => (
                      <button key={d} type="button"
                        className={`pill-select-item ${form.difficulty_level === d ? 'active' : ''}`}
                        onClick={() => set('difficulty_level', d)}>{d}</button>
                    ))}
                  </div>
                  {errors.difficulty_level && <p className="field-error">{errors.difficulty_level}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Best Time to Visit</label>
                  <select className="form-input form-select"
                    value={form.best_time_to_visit} onChange={(e) => set('best_time_to_visit', e.target.value)}>
                    <option value="">Select...</option>
                    {BEST_TIMES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Trip Duration (days)</label>
                  <input type="number" min="1" max="60" className="form-input" placeholder="e.g. 3"
                    value={form.avg_trip_duration_days} onChange={(e) => set('avg_trip_duration_days', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Cost (USD)</label>
                  <input type="number" min="0" className="form-input" placeholder="Total budget in USD"
                    value={form.estimated_cost_usd} onChange={(e) => set('estimated_cost_usd', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Accommodation Type</label>
                  <select className="form-input form-select"
                    value={form.accommodation_type} onChange={(e) => set('accommodation_type', e.target.value)}>
                    <option value="">Select...</option>
                    {ACCOMM.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>

                <div className="form-group form-col-2">
                  <label className="form-label">Accessibility Info</label>
                  <input type="text" className="form-input" placeholder="e.g. Requires 4WD vehicle, no paved roads"
                    value={form.accessibility} onChange={(e) => set('accessibility', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Environmental Sensitivity</label>
                  <div className="pill-select">
                    {['Low', 'Medium', 'High'].map((l) => (
                      <button key={l} type="button"
                        className={`pill-select-item ${form.environmental_sensitivity === l ? 'active' : ''}`}
                        onClick={() => set('environmental_sensitivity', l)}>{l}</button>
                    ))}
                  </div>
                </div>

                <div className="form-group form-col-2">
                  <label className="form-label">Tags</label>
                  <input type="text" className="form-input" placeholder="waterfall, remote, jungle, photography (comma-separated)"
                    value={form.tags} onChange={(e) => set('tags', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Story */}
          {step === 3 && (
            <div className="submit-step-content animate-fadeInUp">
              <div className="submit-step-header">
                <span className="step-num">03</span>
                <div>
                  <h2>Tell Your Story</h2>
                  <p>Share your authentic experience to inspire other travellers.</p>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group form-col-2">
                  <label className="form-label">Short Summary <span className="req">*</span></label>
                  <textarea rows={3} className={`form-input ${errors.description_summary ? 'input-error' : ''}`}
                    placeholder="A brief, evocative summary of the destination (min. 40 characters)..."
                    value={form.description_summary}
                    onChange={(e) => set('description_summary', e.target.value)} />
                  <div className="char-count">{form.description_summary.length} / 200</div>
                  {errors.description_summary && <p className="field-error">{errors.description_summary}</p>}
                </div>

                <div className="form-group form-col-2">
                  <label className="form-label">Full Story <span className="req">*</span></label>
                  <textarea rows={12} className={`form-input ${errors.full_description ? 'input-error' : ''}`}
                    placeholder="Write your full travel story here. Describe the journey, what makes this place special, tips for visitors, what to expect... (min. 100 characters)"
                    value={form.full_description}
                    onChange={(e) => set('full_description', e.target.value)} />
                  <div className="char-count">{form.full_description.length} characters</div>
                  {errors.full_description && <p className="field-error">{errors.full_description}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {step === 4 && (
            <div className="submit-step-content animate-fadeInUp">
              <div className="submit-step-header">
                <span className="step-num">04</span>
                <div>
                  <h2>Review & Submit</h2>
                  <p>Double-check your submission before sending it to the community.</p>
                </div>
              </div>

              <div className="review-summary">
                <div className="rs-section">
                  <h3 className="rs-title">📍 Location</h3>
                  <div className="rs-grid">
                    <div className="rs-item"><span className="rs-label">Title</span><span className="rs-val">{form.post_title || '—'}</span></div>
                    <div className="rs-item"><span className="rs-label">Country</span><span className="rs-val">{form.country || '—'}</span></div>
                    <div className="rs-item"><span className="rs-label">Continent</span><span className="rs-val">{form.continent || '—'}</span></div>
                    <div className="rs-item"><span className="rs-label">Region</span><span className="rs-val">{form.region || '—'}</span></div>
                  </div>
                </div>
                <div className="rs-section">
                  <h3 className="rs-title">📝 Trip Details</h3>
                  <div className="rs-grid">
                    <div className="rs-item"><span className="rs-label">Activity</span><span className="rs-val">{form.activity_type || '—'}</span></div>
                    <div className="rs-item"><span className="rs-label">Difficulty</span><span className="rs-val">{form.difficulty_level || '—'}</span></div>
                    <div className="rs-item"><span className="rs-label">Duration</span><span className="rs-val">{form.avg_trip_duration_days ? `${form.avg_trip_duration_days} days` : '—'}</span></div>
                    <div className="rs-item"><span className="rs-label">Cost</span><span className="rs-val">{form.estimated_cost_usd ? `$${form.estimated_cost_usd}` : '—'}</span></div>
                  </div>
                </div>
                <div className="rs-section">
                  <h3 className="rs-title">✍️ Story Preview</h3>
                  <p className="rs-preview">{form.description_summary || 'No summary provided.'}</p>
                </div>
              </div>

              <div className="submit-notice">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Your submission will be reviewed by our team before going live. We typically review within 24–48 hours.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="submit-nav">
            {step > 1 && (
              <button type="button" className="btn btn-secondary" onClick={prev}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < STEPS.length ? (
              <button type="button" className="btn btn-primary" onClick={next}>
                Continue
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            ) : (
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="btn-spinner" /> Submitting...</> : <>Submit Destination ✦</>}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
