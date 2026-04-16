import { Link } from 'react-router-dom';
import './DestinationCard.css';

function StarRating({ rating, size = 'sm' }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`star ${i <= full ? 'filled' : i === full + 1 && half ? 'half' : 'empty'}`}>
          {i <= full ? '★' : i === full + 1 && half ? '⯨' : '☆'}
        </span>
      ))}
    </div>
  );
}

function difficultyClass(level) {
  const map = {
    'Easy': 'easy', 'Moderate': 'moderate',
    'Challenging': 'challenging', 'Very Difficult': 'challenging',
    'Expert': 'expert', 'Expert Only': 'expert',
  };
  return map[level] || 'moderate';
}

export default function DestinationCard({ destination, featured = false }) {
  const {
    destination_id, post_title, country, continent, activity_type,
    difficulty_level, avg_rating, total_reviews, total_saves, estimated_cost_usd,
    avg_trip_duration_days, image, tags, is_hidden_gem, description_summary,
    best_time_to_visit, submitter_name
  } = destination;

  return (
    <Link to={`/destinations/${destination_id}`} className={`dest-card ${featured ? 'dest-card-featured' : ''}`}>
      {/* Image */}
      <div className="dest-card-img-wrap">
        <img
          src={image}
          alt={post_title}
          className="dest-card-img"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'; }}
        />
        <div className="dest-card-img-overlay" />
        {is_hidden_gem && (
          <div className="dest-card-gem-badge">
            <span>✦</span> Hidden Gem
          </div>
        )}
        <div className={`dest-card-difficulty badge-difficulty-${difficultyClass(difficulty_level)}`}>
          {difficulty_level}
        </div>
        <div className="dest-card-saves">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          {total_saves}
        </div>
      </div>

      {/* Body */}
      <div className="dest-card-body">
        <div className="dest-card-meta">
          <span className="dest-card-continent">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            {continent}
          </span>
          <span className="dest-card-activity">{activity_type}</span>
        </div>

        <h3 className="dest-card-title">{post_title}</h3>
        <p className="dest-card-location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {country}
        </p>

        {featured && (
          <p className="dest-card-desc">{description_summary}</p>
        )}

        <div className="dest-card-stats">
          <div className="dest-card-rating">
            <StarRating rating={avg_rating} />
            <span className="rating-value">{avg_rating || 'New'}</span>
            <span className="rating-count">({total_reviews})</span>
          </div>
        </div>

        <div className="dest-card-footer">
          <div className="dest-card-info">
            <span className="info-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {avg_trip_duration_days}d
            </span>
            <span className="info-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              ${estimated_cost_usd.toLocaleString()}
            </span>
          </div>
          <span className="dest-card-cta">
            Explore
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
