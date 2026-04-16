import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../utils/api';
import './Profile.css';

function StarDisplay({ rating, size = 14 }) {
  return (
    <div className="stars-display" style={{ '--sz': `${size}px` }}>
      {[1,2,3,4,5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24"
          fill={n <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke="#f59e0b" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function Profile() {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '' });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setForm({ name: user.name || '', bio: user.bio || '' });
  }, [user, navigate]);

  useEffect(() => {
    if (tab === 'reviews' && user) {
      setReviewsLoading(true);
      api.getUserReviews(user.user_id)
        .then(setReviews)
        .catch(console.error)
        .finally(() => setReviewsLoading(false));
    }
  }, [tab, user]);

  if (!user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const updated = await api.updateProfile({ name: form.name, bio: form.bio });
      updateUser(updated);
      setEditing(false);
      setSaveMsg('Profile updated successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('Failed to save: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff&size=128&bold=true`;

  return (
    <div className="profile-page">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-hero-bg" />
        <div className="container">
          <div className="profile-hero-inner">
            <div className="profile-avatar-wrap">
              <img src={user.avatar || avatarUrl} alt={user.name} className="profile-avatar" />
              <div className="profile-avatar-badge">✦</div>
            </div>
            <div className="profile-hero-info">
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-email">{user.email}</p>
              {user.bio && <p className="profile-bio">{user.bio}</p>}
              <div className="profile-hero-stats">
                <div className="ph-stat">
                  <span className="ph-stat-value">{user.destinations_submitted || 0}</span>
                  <span className="ph-stat-label">Submissions</span>
                </div>
                <div className="ph-stat-div" />
                <div className="ph-stat">
                  <span className="ph-stat-value">{user.reviews_written || 0}</span>
                  <span className="ph-stat-label">Reviews</span>
                </div>
                <div className="ph-stat-div" />
                <div className="ph-stat">
                  <span className="ph-stat-value">{user.saved_destinations?.length || 0}</span>
                  <span className="ph-stat-label">Saved</span>
                </div>
              </div>
            </div>
            <div className="profile-hero-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(true); setTab('settings'); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit Profile
              </button>
              <button className="btn btn-outline btn-sm logout-btn" onClick={handleLogout}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs-bar">
        <div className="container">
          <div className="profile-tabs">
            {[
              { key: 'overview', label: 'Overview', icon: '◈' },
              { key: 'reviews', label: 'My Reviews', icon: '⭐' },
              { key: 'settings', label: 'Settings', icon: '⚙' },
            ].map((t) => (
              <button
                key={t.key}
                className={`profile-tab ${tab === t.key ? 'active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                <span className="tab-icon">{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container profile-content">
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="profile-grid">
            {/* Stats Cards */}
            <div className="profile-stats-section">
              <h2 className="profile-section-title">Activity Overview</h2>
              <div className="profile-stats-grid">
                {[
                  { icon: '📍', label: 'Destinations Submitted', value: user.destinations_submitted || 0, color: 'var(--accent-emerald)' },
                  { icon: '⭐', label: 'Reviews Written', value: user.reviews_written || 0, color: '#f59e0b' },
                  { icon: '💾', label: 'Places Saved', value: user.saved_destinations?.length || 0, color: '#6366f1' },
                  { icon: '🌍', label: 'Countries Explored', value: user.countries_visited || 0, color: '#ec4899' },
                ].map((s, i) => (
                  <div key={i} className="pstat-card">
                    <div className="pstat-icon" style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
                    <div className="pstat-value" style={{ color: s.color }}>{s.value}</div>
                    <div className="pstat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Preferences */}
            <div className="profile-prefs-section">
              <h2 className="profile-section-title">Travel Style</h2>
              <div className="pref-card">
                {user.travel_preferences?.preferred_activities?.length > 0 ? (
                  <>
                    <div className="pref-label">Favourite Activities</div>
                    <div className="pref-pills">
                      {user.travel_preferences.preferred_activities.map((a) => (
                        <span key={a} className="pref-pill">{a}</span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="pref-empty">
                    <p>No travel preferences set yet.</p>
                    <button className="btn btn-secondary btn-sm" onClick={() => setTab('settings')}>Update Preferences</button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="profile-quick-section">
              <h2 className="profile-section-title">Quick Actions</h2>
              <div className="quick-links">
                <Link to="/submit" className="quick-link-card">
                  <span className="quick-link-icon">✈️</span>
                  <div>
                    <div className="quick-link-title">Share a Discovery</div>
                    <div className="quick-link-desc">Submit a hidden destination</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="quick-link-arrow"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link to="/destinations" className="quick-link-card">
                  <span className="quick-link-icon">🗺️</span>
                  <div>
                    <div className="quick-link-title">Browse Destinations</div>
                    <div className="quick-link-desc">Discover hidden gems</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="quick-link-arrow"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {tab === 'reviews' && (
          <div className="profile-reviews-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">My Reviews ({reviews.length})</h2>
            </div>
            {reviewsLoading ? (
              <div className="loading-container"><div className="spinner" /><p>Loading reviews...</p></div>
            ) : reviews.length === 0 ? (
              <div className="empty-state">
                <div className="icon">⭐</div>
                <h3>No reviews yet</h3>
                <p>Start exploring destinations and share your experiences.</p>
                <Link to="/destinations" className="btn btn-primary">Discover Destinations</Link>
              </div>
            ) : (
              <div className="profile-reviews-list">
                {reviews.map((r) => (
                  <div key={r.id} className="pr-card">
                    <div className="pr-header">
                      <div>
                        <div className="pr-title">{r.title}</div>
                        <StarDisplay rating={r.rating} />
                      </div>
                      <div className="pr-date">{new Date(r.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                    </div>
                    <p className="pr-content">{r.content}</p>
                    <div className="pr-footer">
                      <span className="pr-helpful">👍 {r.helpful_count} found helpful</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div className="profile-settings">
            {saveMsg && (
              <div className={`auth-alert ${saveMsg.includes('Failed') ? 'auth-alert-error' : 'auth-alert-success'}`}>
                {saveMsg}
              </div>
            )}
            <div className="settings-card">
              <h2 className="settings-title">Profile Information</h2>
              <form onSubmit={handleSave} className="settings-form">
                <div className="form-group">
                  <label className="form-label">Display Name</label>
                  <input
                    type="text" className="form-input"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={user.email} disabled />
                  <p className="field-hint">Email cannot be changed.</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Bio <span className="optional">(optional)</span></label>
                  <textarea
                    className="form-input" rows={3}
                    placeholder="Tell the community about your travel style..."
                    value={form.bio}
                    onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                  />
                </div>
                <div className="settings-actions">
                  <button type="submit" className="btn btn-primary" disabled={saveLoading}>
                    {saveLoading ? <><span className="btn-spinner" /> Saving...</> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            <div className="settings-card settings-danger">
              <h2 className="settings-title">Account</h2>
              <p className="settings-desc">Manage your session and account preferences.</p>
              <button className="btn btn-outline logout-btn" onClick={handleLogout}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
