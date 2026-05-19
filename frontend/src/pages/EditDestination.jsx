import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
const STATUSES = ['Pending', 'Approved', 'Rejected'];

export default function EditDestination() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.getDestination(id)
      .then((dest) => {
        setForm({
          post_title: dest.post_title || '',
          country: dest.country || '',
          region: dest.region || '',
          continent: dest.continent || '',
          activity_type: dest.activity_type || '',
          difficulty_level: dest.difficulty_level || '',
          best_time_to_visit: dest.best_time_to_visit || '',
          avg_trip_duration_days: dest.avg_trip_duration_days || '',
          estimated_cost_usd: dest.estimated_cost_usd || '',
          description_summary: dest.description_summary || '',
          full_description: dest.full_description || '',
          accessibility: dest.accessibility || '',
          accommodation_type: dest.accommodation_type || '',
          nearest_major_city: dest.nearest_major_city || '',
          distance_from_major_city_km: dest.distance_from_major_city_km || '',
          environmental_sensitivity: dest.environmental_sensitivity || 'Medium',
          tags: Array.isArray(dest.tags) ? dest.tags.join(', ') : dest.tags || '',
          image: dest.image || '',
          is_hidden_gem: dest.is_hidden_gem || false,
          post_status: dest.post_status || 'Pending',
        });
      })
      .catch(() => setError('Failed to load destination.'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.post_title.trim() || !form.country.trim() || !form.activity_type) {
      setError('Title, Country and Activity Type are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.updateDestination(id, {
        ...form,
        avg_trip_duration_days: Number(form.avg_trip_duration_days) || 0,
        estimated_cost_usd: Number(form.estimated_cost_usd) || 0,
        distance_from_major_city_km: Number(form.distance_from_major_city_km) || 0,
      });
      setSuccess(true);
      setTimeout(() => navigate(`/destinations/${id}`), 1200);
    } catch (err) {
      setError(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-container" style={{ paddingTop: 120 }}><div className="spinner" /></div>;

  return (
    <div className="submit-page">
      <div className="submit-hero">
        <div className="container">
          <span className="section-tag">Admin</span>
          <h1 className="submit-hero-title">Edit Destination</h1>
          <p className="submit-hero-sub">Update the details for this destination. Changes are saved immediately.</p>
        </div>
      </div>

      <div className="container submit-container">
        {error && <div className="auth-alert auth-alert-error" style={{ maxWidth: 780, margin: '0 auto 20px' }}>{error}</div>}
        {success && <div className="auth-alert" style={{ maxWidth: 780, margin: '0 auto 20px', background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7', borderRadius: 10, padding: '12px 16px' }}>Saved! Redirecting...</div>}

        <form onSubmit={handleSubmit} className="submit-form" style={{ maxWidth: 780 }}>

          {/* Status & Hidden Gem */}
          <div className="submit-step-content animate-fadeInUp">
            <div className="submit-step-header">
              <span className="step-num">⚙</span>
              <div><h2>Admin Controls</h2><p>Status and visibility settings.</p></div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Post Status</label>
                <div className="pill-select">
                  {STATUSES.map((s) => (
                    <button key={s} type="button"
                      className={`pill-select-item ${form.post_status === s ? 'active' : ''}`}
                      onClick={() => set('post_status', s)}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Hidden Gem</label>
                <div className="pill-select">
                  {[true, false].map((v) => (
                    <button key={String(v)} type="button"
                      className={`pill-select-item ${form.is_hidden_gem === v ? 'active' : ''}`}
                      onClick={() => set('is_hidden_gem', v)}>{v ? 'Yes' : 'No'}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="submit-step-content animate-fadeInUp">
            <div className="submit-step-header">
              <span className="step-num">📍</span>
              <div><h2>Location</h2></div>
            </div>
            <div className="form-grid">
              <div className="form-group form-col-2">
                <label className="form-label">Title <span className="req">*</span></label>
                <input className="form-input" value={form.post_title} onChange={(e) => set('post_title', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Country <span className="req">*</span></label>
                <input className="form-input" value={form.country} onChange={(e) => set('country', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Region</label>
                <input className="form-input" value={form.region} onChange={(e) => set('region', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Continent</label>
                <select className="form-input form-select" value={form.continent} onChange={(e) => set('continent', e.target.value)}>
                  <option value="">Select...</option>
                  {CONTINENTS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Nearest Major City</label>
                <input className="form-input" value={form.nearest_major_city} onChange={(e) => set('nearest_major_city', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Distance from City (km)</label>
                <input type="number" className="form-input" value={form.distance_from_major_city_km} onChange={(e) => set('distance_from_major_city_km', e.target.value)} />
              </div>
              <div className="form-group form-col-2">
                <label className="form-label">Cover Image URL</label>
                <input className="form-input" value={form.image} onChange={(e) => set('image', e.target.value)} />
                {form.image && <img src={form.image} alt="preview" style={{ marginTop: 10, height: 120, borderRadius: 8, objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />}
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="submit-step-content animate-fadeInUp">
            <div className="submit-step-header">
              <span className="step-num">📝</span>
              <div><h2>Trip Details</h2></div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Activity Type <span className="req">*</span></label>
                <select className="form-input form-select" value={form.activity_type} onChange={(e) => set('activity_type', e.target.value)}>
                  <option value="">Select...</option>
                  {ACTIVITIES.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <div className="pill-select">
                  {DIFFICULTIES.map((d) => (
                    <button key={d} type="button"
                      className={`pill-select-item ${form.difficulty_level === d ? 'active' : ''}`}
                      onClick={() => set('difficulty_level', d)}>{d}</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Best Time to Visit</label>
                <select className="form-input form-select" value={form.best_time_to_visit} onChange={(e) => set('best_time_to_visit', e.target.value)}>
                  <option value="">Select...</option>
                  {BEST_TIMES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Duration (days)</label>
                <input type="number" className="form-input" value={form.avg_trip_duration_days} onChange={(e) => set('avg_trip_duration_days', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Estimated Cost (USD)</label>
                <input type="number" className="form-input" value={form.estimated_cost_usd} onChange={(e) => set('estimated_cost_usd', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Accommodation</label>
                <select className="form-input form-select" value={form.accommodation_type} onChange={(e) => set('accommodation_type', e.target.value)}>
                  <option value="">Select...</option>
                  {ACCOMM.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group form-col-2">
                <label className="form-label">Accessibility</label>
                <input className="form-input" value={form.accessibility} onChange={(e) => set('accessibility', e.target.value)} />
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
                <label className="form-label">Tags (comma-separated)</label>
                <input className="form-input" value={form.tags} onChange={(e) => set('tags', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="submit-step-content animate-fadeInUp">
            <div className="submit-step-header">
              <span className="step-num">✍️</span>
              <div><h2>Description</h2></div>
            </div>
            <div className="form-grid">
              <div className="form-group form-col-2">
                <label className="form-label">Short Summary</label>
                <textarea rows={3} className="form-input" value={form.description_summary} onChange={(e) => set('description_summary', e.target.value)} />
              </div>
              <div className="form-group form-col-2">
                <label className="form-label">Full Description</label>
                <textarea rows={10} className="form-input" value={form.full_description} onChange={(e) => set('full_description', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="submit-nav">
            <Link to={`/destinations/${id}`} className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="btn-spinner" /> Saving...</> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
