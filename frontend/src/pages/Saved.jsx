import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import './Saved.css';

const DIFF_COLOR = {
  Easy: '#34d399', Moderate: '#fbbf24', Challenging: '#f87171',
  'Very Difficult': '#f87171', Expert: '#c084fc',
};

function CompareTable({ destinations, onClose }) {
  const rows = [
    { label: 'Country',      key: (d) => d.country },
    { label: 'Continent',    key: (d) => d.continent },
    { label: 'Activity',     key: (d) => d.activity_type },
    { label: 'Difficulty',   key: (d) => <span style={{ color: DIFF_COLOR[d.difficulty_level] || '#888', fontWeight: 600 }}>{d.difficulty_level}</span> },
    { label: 'Rating',       key: (d) => d.avg_rating ? `⭐ ${d.avg_rating}` : 'No ratings' },
    { label: 'Reviews',      key: (d) => d.total_reviews },
    { label: 'Est. Cost',    key: (d) => `$${d.estimated_cost_usd?.toLocaleString()} USD` },
    { label: 'Duration',     key: (d) => `${d.avg_trip_duration_days} days` },
    { label: 'Best Time',    key: (d) => d.best_time_to_visit },
    { label: 'Accessibility',key: (d) => d.accessibility },
    { label: 'Accommodation',key: (d) => d.accommodation_type || '—' },
    { label: 'Eco Sensitivity', key: (d) => d.environmental_sensitivity },
    { label: 'Status',       key: (d) => d.post_status },
  ];

  return (
    <div className="compare-overlay" onClick={onClose}>
      <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
        <div className="compare-modal-header">
          <h2>Destination Comparison</h2>
          <button className="compare-close" onClick={onClose}>✕</button>
        </div>
        <div className="compare-scroll">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="compare-label-col"></th>
                {destinations.map((d) => (
                  <th key={d.destination_id}>
                    <img src={d.image} alt={d.post_title} className="compare-thumb"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&q=60'; }} />
                    <div className="compare-dest-name">{d.post_title}</div>
                    <div className="compare-dest-country">{d.country}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="compare-row-label">{row.label}</td>
                  {destinations.map((d) => (
                    <td key={d.destination_id} className="compare-row-val">{row.key(d)}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="compare-row-label"></td>
                {destinations.map((d) => (
                  <td key={d.destination_id} className="compare-row-val">
                    <Link to={`/destinations/${d.destination_id}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Saved() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    api.getSaved()
      .then(setDestinations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const handleUnsave = async (destId) => {
    setRemoving(destId);
    try {
      await api.toggleSave(destId);
      setDestinations((prev) => prev.filter((d) => d.destination_id !== destId));
      setSelected((prev) => prev.filter((x) => x !== destId));
    } catch (err) { alert(err.message); }
    finally { setRemoving(null); }
  };

  const compareDestinations = destinations.filter((d) => selected.includes(d.destination_id));

  return (
    <div className="saved-page">
      <div className="saved-header">
        <div className="container">
          <span className="section-tag">My Collection</span>
          <h1 className="saved-title">Saved Destinations</h1>
          <p className="saved-subtitle">
            {loading ? 'Loading...' : `${destinations.length} destination${destinations.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>
      </div>

      <div className="container saved-body">
        {loading ? (
          <div className="loading-container"><div className="spinner" /><p>Loading saved destinations...</p></div>
        ) : destinations.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔖</div>
            <h3>No saved destinations yet</h3>
            <p>Browse destinations and click "Save Destination" to build your collection.</p>
            <Link to="/destinations" className="btn btn-primary">Browse Destinations</Link>
          </div>
        ) : (
          <>
            {destinations.length >= 2 && (
              <div className="compare-hint">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>
                Select up to 3 destinations to compare them side by side.
              </div>
            )}

            <div className="saved-grid">
              {destinations.map((dest) => {
                const isSelected = selected.includes(dest.destination_id);
                const isDisabled = !isSelected && selected.length >= 3;
                return (
                  <div key={dest.destination_id} className={`saved-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}>
                    <div className="saved-card-select">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => toggleSelect(dest.destination_id)}
                        className="compare-checkbox"
                      />
                      {isSelected && <span className="selected-badge">#{selected.indexOf(dest.destination_id) + 1}</span>}
                    </div>

                    <Link to={`/destinations/${dest.destination_id}`}>
                      <div className="saved-card-img-wrap">
                        <img src={dest.image} alt={dest.post_title} className="saved-card-img"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'; }} />
                        <div className="saved-card-overlay" />
                        {dest.is_hidden_gem && <span className="saved-gem-badge">✦ Hidden Gem</span>}
                      </div>
                    </Link>

                    <div className="saved-card-body">
                      <div className="saved-card-meta">
                        <span className="saved-card-continent">{dest.continent}</span>
                        <span className="saved-card-activity">{dest.activity_type}</span>
                      </div>
                      <Link to={`/destinations/${dest.destination_id}`}>
                        <h3 className="saved-card-title">{dest.post_title}</h3>
                      </Link>
                      <p className="saved-card-location">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {dest.country}
                      </p>

                      <div className="saved-card-stats">
                        <span>⭐ {dest.avg_rating || 'New'}</span>
                        <span>💰 ${dest.estimated_cost_usd?.toLocaleString()}</span>
                        <span>⏱ {dest.avg_trip_duration_days}d</span>
                        <span style={{ color: DIFF_COLOR[dest.difficulty_level] || '#888' }}>{dest.difficulty_level}</span>
                      </div>

                      <div className="saved-card-actions">
                        <Link to={`/destinations/${dest.destination_id}`} className="btn btn-primary btn-sm">View Details</Link>
                        <button
                          className="btn btn-sm unsave-btn"
                          onClick={() => handleUnsave(dest.destination_id)}
                          disabled={removing === dest.destination_id}
                        >
                          {removing === dest.destination_id ? '...' : '✕ Unsave'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Compare Bar */}
      {selected.length >= 2 && (
        <div className="compare-bar animate-fadeInUp">
          <div className="compare-bar-inner container">
            <div className="compare-bar-items">
              {compareDestinations.map((d) => (
                <div key={d.destination_id} className="compare-bar-item">
                  <img src={d.image} alt={d.post_title}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=80&q=60'; }} />
                  <span>{d.post_title}</span>
                  <button onClick={() => toggleSelect(d.destination_id)}>✕</button>
                </div>
              ))}
              {selected.length < 3 && (
                <div className="compare-bar-empty">+ Add one more to compare</div>
              )}
            </div>
            <div className="compare-bar-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => setSelected([])}>Clear</button>
              <button className="btn btn-primary" onClick={() => setShowCompare(true)}>
                Compare {selected.length} Destinations
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompare && (
        <CompareTable destinations={compareDestinations} onClose={() => setShowCompare(false)} />
      )}
    </div>
  );
}
