import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './DestinationDetail.css';

function StarRatingInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-input">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={`star-btn ${i <= (hover || value) ? 'lit' : ''}`}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        >★</button>
      ))}
      {value > 0 && <span className="star-label">{['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][value]}</span>}
    </div>
  );
}

function ReviewCard({ review, onHelpful }) {
  const stars = Math.round(review.rating);
  return (
    <div className="review-card animate-fadeInUp">
      <div className="review-header">
        <img src={review.user_avatar} alt={review.user_name} className="review-avatar" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name)}&background=10b981&color=fff`; }} />
        <div className="review-meta">
          <div className="review-author">{review.user_name}</div>
          <div className="review-date">{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        <div className="review-stars">
          {[1,2,3,4,5].map((i) => <span key={i} className={i <= stars ? 'star-filled' : 'star-empty'}>★</span>)}
        </div>
      </div>
      {review.title && <h4 className="review-title">{review.title}</h4>}
      <p className="review-content">{review.content}</p>
      <div className="review-footer">
        {review.visit_date && <span className="review-visit">Visited: {review.visit_date}</span>}
        <button className="helpful-btn" onClick={() => onHelpful(review.id)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
          Helpful ({review.helpful_count})
        </button>
      </div>
    </div>
  );
}

export default function DestinationDetail() {
  const { id } = useParams();
  const { user, getToken } = useAuth();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: '', content: '', visit_date: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getDestination(id), api.getReviews(id)])
      .then(([dest, revs]) => { setDestination(dest); setReviews(revs); })
      .catch(() => setDestination(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${destination.post_title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.deleteDestination(id);
      navigate('/destinations');
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!user) { navigate('/login'); return; }
    setSaving(true);
    try {
      await api.saveDestination(id);
      setSaved(true);
    } catch {} finally { setSaving(false); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (reviewForm.rating === 0) { setReviewError('Please select a rating.'); return; }
    if (!reviewForm.content.trim()) { setReviewError('Please write your review.'); return; }
    setReviewSubmitting(true); setReviewError('');
    try {
      const newReview = await api.createReview({ destination_id: id, ...reviewForm });
      setReviews((prev) => [newReview, ...prev]);
      setReviewSuccess(true);
      setShowReviewForm(false);
      setReviewForm({ rating: 0, title: '', content: '', visit_date: '' });
      // Update destination rating
      const updatedDest = await api.getDestination(id);
      setDestination(updatedDest);
    } catch (err) { setReviewError(err.message); }
    finally { setReviewSubmitting(false); }
  };

  const handleHelpful = async (reviewId) => {
    try {
      const updated = await api.markHelpful(reviewId);
      setReviews((prev) => prev.map((r) => r.id === reviewId ? { ...r, helpful_count: updated.helpful_count } : r));
    } catch {}
  };

  if (loading) return (
    <div className="loading-container" style={{ paddingTop: 'calc(var(--navbar-height) + 60px)' }}>
      <div className="spinner" />
      <p>Loading destination...</p>
    </div>
  );

  if (!destination) return (
    <div className="empty-state" style={{ paddingTop: 'calc(var(--navbar-height) + 60px)' }}>
      <div className="icon">🗺️</div>
      <h3>Destination not found</h3>
      <p>This destination may have been removed or the link may be incorrect.</p>
      <Link to="/destinations" className="btn btn-primary">Back to Destinations</Link>
    </div>
  );

  const gallery = destination.gallery || [destination.image];
  const diffColor = { Easy: '#34d399', Moderate: '#fbbf24', Challenging: '#f87171', 'Very Difficult': '#f87171', Expert: '#c084fc', 'Expert Only': '#c084fc' };

  return (
    <div className="detail-page">
      {/* ===== HERO IMAGE GALLERY ===== */}
      <div className="detail-gallery">
        <div className="detail-main-img-wrap">
          <img src={gallery[activeImg]} alt={destination.post_title} className="detail-main-img"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'; }} />
          <div className="detail-img-overlay" />
          {gallery.length > 1 && (
            <div className="gallery-thumbs">
              {gallery.map((img, i) => (
                <button key={i} className={`gallery-thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                  <img src={img} alt="" onError={(e) => { e.target.src = gallery[0]; }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="container detail-container">
        <div className="detail-layout">
          {/* Main Content */}
          <div className="detail-main">
            {/* Breadcrumb */}
            <div className="breadcrumbs">
              <Link to="/">Home</Link>
              <span className="sep">/</span>
              <Link to="/destinations">Destinations</Link>
              <span className="sep">/</span>
              <span className="current">{destination.post_title}</span>
            </div>

            {/* Badges */}
            <div className="detail-badges">
              {destination.is_hidden_gem && <span className="badge badge-hidden-gem">✦ Hidden Gem</span>}
              <span className="badge badge-continent">{destination.continent}</span>
              <span className="badge badge-activity">{destination.activity_type}</span>
              <span className="badge" style={{ background: `${diffColor[destination.difficulty_level]}20`, color: diffColor[destination.difficulty_level], border: `1px solid ${diffColor[destination.difficulty_level]}40` }}>
                {destination.difficulty_level}
              </span>
            </div>

            {/* Title */}
            <h1 className="detail-title">{destination.post_title}</h1>

            {/* Location + Rating */}
            <div className="detail-meta-row">
              <div className="detail-location">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {destination.region}, {destination.country}
              </div>
              <div className="detail-rating">
                <div className="stars">
                  {[1,2,3,4,5].map((i) => (
                    <span key={i} className={i <= Math.round(destination.avg_rating) ? 'star filled' : 'star empty'}>★</span>
                  ))}
                </div>
                <span className="rating-value">{destination.avg_rating || 'No ratings yet'}</span>
                <span className="rating-count">({destination.total_reviews} reviews)</span>
              </div>
              <div className="detail-submitter">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Shared by {destination.submitter_name}
              </div>
            </div>

            <div className="divider" />

            {/* Description */}
            <div className="detail-description">
              <p className="detail-lead">{destination.description_summary}</p>
              {destination.full_description && (
                <div className="detail-body">{destination.full_description}</div>
              )}
            </div>

            {/* Tags */}
            {destination.tags?.length > 0 && (
              <div className="detail-tags">
                <h4>Tags</h4>
                <div className="tags-list">
                  {destination.tags.map((tag, i) => (
                    <Link key={i} to={`/destinations?search=${tag}`} className="tag">{tag}</Link>
                  ))}
                </div>
              </div>
            )}

            {/* ===== REVIEWS ===== */}
            <div className="detail-reviews">
              <div className="reviews-header">
                <h2>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Traveller Reviews
                  {reviews.length > 0 && <span className="reviews-count">{reviews.length}</span>}
                </h2>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => user ? setShowReviewForm(!showReviewForm) : navigate('/login')}
                >
                  {showReviewForm ? 'Cancel' : '+ Write a Review'}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="review-form animate-scaleIn">
                  <h3>Share Your Experience</h3>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label className="form-label">Your Rating <span>*</span></label>
                      <StarRatingInput value={reviewForm.rating} onChange={(v) => setReviewForm({ ...reviewForm, rating: v })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Review Title</label>
                      <input className="form-input" placeholder="Summarise your experience" value={reviewForm.title}
                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Your Review <span>*</span></label>
                      <textarea className="form-input" rows={5} placeholder="Describe your experience in detail..."
                        value={reviewForm.content} onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">When did you visit?</label>
                      <input type="month" className="form-input" value={reviewForm.visit_date}
                        onChange={(e) => setReviewForm({ ...reviewForm, visit_date: e.target.value })} />
                    </div>
                    {reviewError && <div className="alert alert-error">{reviewError}</div>}
                    {reviewSuccess && <div className="alert alert-success">Review submitted successfully!</div>}
                    <button type="submit" className="btn btn-primary" disabled={reviewSubmitting}>
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 0' }}>
                  <div className="icon" style={{ fontSize: '2.5rem' }}>✍️</div>
                  <h3>No reviews yet</h3>
                  <p>Be the first to share your experience at this destination.</p>
                </div>
              ) : (
                <div className="reviews-list">
                  {reviews.map((r) => <ReviewCard key={r.id} review={r} onHelpful={handleHelpful} />)}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="detail-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-card-title">Trip Details</h3>
              <div className="trip-details">
                {[
                  { icon: '💰', label: 'Estimated Cost', value: `$${destination.estimated_cost_usd.toLocaleString()} USD` },
                  { icon: '📅', label: 'Best Time', value: destination.best_time_to_visit },
                  { icon: '⏱️', label: 'Duration', value: `${destination.avg_trip_duration_days} days avg.` },
                  { icon: '🎒', label: 'Accessibility', value: destination.accessibility },
                  { icon: '🏠', label: 'Accommodation', value: destination.accommodation_type },
                  { icon: '🌆', label: 'Nearest City', value: `${destination.nearest_major_city} (${destination.distance_from_major_city_km}km)` },
                  { icon: '🌿', label: 'Eco Sensitivity', value: destination.environmental_sensitivity },
                ].map((item, i) => (
                  <div key={i} className="trip-detail-row">
                    <span className="trip-detail-icon">{item.icon}</span>
                    <div>
                      <div className="trip-detail-label">{item.label}</div>
                      <div className="trip-detail-value">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sidebar-actions">
                <button
                  className={`btn ${saved ? 'btn-secondary' : 'btn-primary'} w-full`}
                  onClick={handleSave}
                  disabled={saving || saved}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  {saved ? `Saved (${destination.total_saves + 1})` : `Save Destination (${destination.total_saves})`}
                </button>
                {user?.role === 'admin' && (
                  <>
                    <Link to={`/destinations/${id}/edit`} className="btn w-full" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d', textAlign: 'center' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit Destination
                    </Link>
                    <button
                      className="btn w-full"
                      style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      {deleting ? 'Deleting...' : 'Delete Destination'}
                    </button>
                  </>
                )}
                <Link to="/destinations" className="btn btn-secondary w-full">
                  ← Back to Destinations
                </Link>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="sidebar-card">
              <h3 className="sidebar-card-title">Location</h3>
              <div className="map-placeholder">
                <div className="map-pin">📍</div>
                <div>
                  <div className="map-coords">
                    {destination.latitude.toFixed(4)}°N, {destination.longitude.toFixed(4)}°E
                  </div>
                  <div className="map-region">{destination.region}, {destination.country}</div>
                </div>
              </div>
              <div className="map-frame">
                <iframe
                  title="Location Map"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${destination.longitude - 1},${destination.latitude - 1},${destination.longitude + 1},${destination.latitude + 1}&layer=mapnik&marker=${destination.latitude},${destination.longitude}`}
                  style={{ width: '100%', height: '200px', border: 'none', borderRadius: '10px', filter: 'invert(0.9) hue-rotate(180deg)' }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Community Stats */}
            <div className="sidebar-card">
              <h3 className="sidebar-card-title">Community Stats</h3>
              <div className="community-stats">
                {[
                  { icon: '👁️', value: destination.total_views.toLocaleString(), label: 'Total Views' },
                  { icon: '⭐', value: destination.avg_rating || '—', label: 'Average Rating' },
                  { icon: '📝', value: destination.total_reviews, label: 'Reviews' },
                  { icon: '🔖', value: destination.total_saves, label: 'Saves' },
                ].map((s, i) => (
                  <div key={i} className="community-stat">
                    <span className="cs-icon">{s.icon}</span>
                    <span className="cs-value">{s.value}</span>
                    <span className="cs-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
