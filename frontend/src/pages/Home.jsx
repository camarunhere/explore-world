import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import DestinationCard from '../components/DestinationCard';
import './Home.css';

const ACTIVITY_ICONS = {
  'Hiking & Trekking': '🥾',
  'Cultural Exploration': '🏛️',
  'Adventure Sports': '🏄',
  'Nature & Wildlife': '🦁',
  'Historical Sites': '🏰',
  'Desert Exploration': '🏜️',
  'Beach & Coastal': '🏝️',
  'Mountain Climbing': '⛰️',
  'Rural & Farm Stays': '🌾',
  'Photography & Scenery': '📸',
  'Gastronomy & Food Tours': '🍷',
  'Wilderness Survival': '🏕️',
};

const CONTINENTS = [
  { name: 'Africa', emoji: '🌍', desc: 'Wild savannahs, ancient cultures' },
  { name: 'Asia', emoji: '🌏', desc: 'Mystical temples, cloud forests' },
  { name: 'Europe', emoji: '🏛️', desc: 'Medieval villages, hidden trails' },
  { name: 'South America', emoji: '🌿', desc: 'Rainforests, mountain markets' },
  { name: 'Middle East', emoji: '🏜️', desc: 'Desert canyons, ancient cities' },
  { name: 'Oceania', emoji: '🌊', desc: 'Wild fjords, alpine wilderness' },
];

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (start === end) return;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function Home() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const requests = user
      ? Promise.all([api.getFeatured(), api.getStats()])
      : Promise.all([Promise.resolve([]), api.getStats()]);
    requests
      .then(([feat, st]) => { setFeatured(feat); setStats(st); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/destinations?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="home">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-video-overlay" />
          <div className="hero-gradient" />
          {/* Floating particles */}
          <div className="hero-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{ '--i': i }} />
            ))}
          </div>
        </div>

        <div className="hero-content container">
          <div className="hero-badge animate-fadeInUp">
            <span className="pulse-dot" />
            Community-Driven • 30+ Hidden Destinations
          </div>

          <h1 className="hero-title animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Discover the World's
            <br />
            <span className="hero-title-gradient">Hidden Gems</span>
          </h1>

          <p className="hero-subtitle animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Go beyond the tourist trail. Find authentic, off-the-beaten-path destinations
            shared by real travellers — not algorithms.
          </p>

          {/* Search Bar */}
          <form className="hero-search animate-fadeInUp" style={{ animationDelay: '0.3s' }} onSubmit={handleSearch}>
            <div className="hero-search-inner">
              <svg className="hero-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Search destinations, activities, or countries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="hero-search-input"
              />
              <button type="submit" className="hero-search-btn btn btn-primary">
                Explore
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div className="hero-search-suggestions">
              {['Waterfall', 'Cave', 'Desert', 'Alpine', 'Coffee', 'Volcanic'].map((s) => (
                <button key={s} type="button" className="suggestion-pill"
                  onClick={() => { setSearch(s); navigate(`/destinations?search=${s}`); }}>
                  {s}
                </button>
              ))}
            </div>
          </form>

          {/* Hero Stats */}
          {stats && (
            <div className="hero-stats animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="hero-stat">
                <span className="hero-stat-value"><Counter target={stats.total_destinations} />+</span>
                <span className="hero-stat-label">Hidden Destinations</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value"><Counter target={stats.total_continents} /></span>
                <span className="hero-stat-label">Continents</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value"><Counter target={stats.total_reviews} />+</span>
                <span className="hero-stat-label">Authentic Reviews</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">100%</span>
                <span className="hero-stat-label">Community Driven</span>
              </div>
            </div>
          )}
        </div>

        <div className="hero-scroll">
          <div className="scroll-indicator">
            <span>Scroll to Explore</span>
            <div className="scroll-arrow" />
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2>Travel Differently</h2>
            <p>ExploreWorld connects curious travellers with authentic hidden destinations through community storytelling.</p>
          </div>
          <div className="steps-grid">
            {[
              { icon: '🔍', step: '01', title: 'Discover', desc: 'Browse curated hidden destinations across all continents, filtered by activity type, difficulty, or region.' },
              { icon: '📖', step: '02', title: 'Read Stories', desc: 'Explore immersive narratives written by travellers who have actually been there — honest, detailed, and authentic.' },
              { icon: '⭐', step: '03', title: 'Rate & Review', desc: 'Share your experience to help others. Your reviews shape the discoverability of hidden gems.' },
              { icon: '✈️', step: '04', title: 'Share Destinations', desc: 'Know a place nobody talks about? Submit it to the community and put it on the map.' },
            ].map((item, i) => (
              <div key={i} className="step-card animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="step-number">{item.step}</div>
                <div className="step-icon">{item.icon}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED DESTINATIONS ===== */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Top Rated</span>
            <h2>Featured Hidden Gems</h2>
            <p>The highest-rated destinations shared by our community — each one a true off-the-beaten-path experience.</p>
          </div>

          {!user ? (
            <div className="empty-state" style={{ padding: '48px 24px', background: 'var(--bg-secondary, #f9fafb)', borderRadius: 16, border: '1px solid var(--border, #e5e7eb)' }}>
              <div className="icon" style={{ fontSize: '2.5rem' }}>🔒</div>
              <h3>Sign in to explore featured destinations</h3>
              <p>Create a free account to discover hidden gems from around the world.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
                <Link to="/login" className="btn btn-primary">Sign In</Link>
                <Link to="/register" className="btn btn-secondary">Create Account</Link>
              </div>
            </div>
          ) : loading ? (
            <div className="loading-container">
              <div className="spinner" />
              <p>Loading destinations...</p>
            </div>
          ) : (
            <div className="featured-grid stagger-children">
              {featured.slice(0, 6).map((dest) => (
                <div key={dest.destination_id} className="animate-fadeInUp">
                  <DestinationCard destination={dest} featured />
                </div>
              ))}
            </div>
          )}

          <div className="section-footer">
            <Link to="/destinations" className="btn btn-outline btn-lg">
              View All Destinations
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CONTINENTS ===== */}
      <section className="section continents-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">By Continent</span>
            <h2>Explore by Region</h2>
            <p>Hidden destinations span every continent — from the Arctic tundra to the Patagonian steppe.</p>
          </div>
          <div className="continents-grid">
            {CONTINENTS.map((c, i) => (
              <Link
                key={c.name}
                to={`/destinations?continent=${encodeURIComponent(c.name)}`}
                className="continent-card animate-fadeInUp"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="continent-emoji">{c.emoji}</span>
                <h3 className="continent-name">{c.name}</h3>
                <p className="continent-desc">{c.desc}</p>
                <span className="continent-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACTIVITIES ===== */}
      <section className="section activities-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">By Activity</span>
            <h2>Find Your Adventure</h2>
            <p>Filter destinations by the type of experience you're seeking.</p>
          </div>
          <div className="activities-grid">
            {Object.entries(ACTIVITY_ICONS).map(([name, icon], i) => (
              <Link
                key={name}
                to={`/destinations?activity_type=${encodeURIComponent(name)}`}
                className="activity-card animate-fadeInUp"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="activity-icon">{icon}</span>
                <span className="activity-name">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== IMPACT BANNER ===== */}
      <section className="impact-section">
        <div className="container">
          <div className="impact-inner">
            <div className="impact-text">
              <span className="section-tag">Our Mission</span>
              <h2>Tourism That Gives Back</h2>
              <p>
                ExploreWorld was built to address the imbalance in modern tourism.
                Major platforms push popular destinations while hundreds of culturally rich,
                economically underdeveloped locations remain invisible. We're changing that —
                one hidden gem at a time.
              </p>
              <div className="impact-points">
                {[
                  { icon: '🌱', text: 'Promotes sustainable, decentralised tourism' },
                  { icon: '🏘️', text: 'Supports local communities through visibility' },
                  { icon: '🚫', text: 'No algorithm-driven promotion — all community-curated' },
                  { icon: '🌿', text: 'Encourages responsible travel & environmental care' },
                ].map((p, i) => (
                  <div key={i} className="impact-point">
                    <span>{p.icon}</span>
                    <span>{p.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn btn-primary btn-lg">Learn More About Us</Link>
            </div>
            <div className="impact-visual">
              <div className="impact-stats-grid">
                {stats && [
                  { value: stats.total_destinations, suffix: '+', label: 'Destinations', icon: '📍' },
                  { value: stats.hidden_gems, suffix: '', label: 'Hidden Gems', icon: '✦' },
                  { value: Math.round(stats.total_views / 1000), suffix: 'K+', label: 'Total Views', icon: '👁' },
                  { value: stats.total_reviews, suffix: '+', label: 'Reviews', icon: '⭐' },
                ].map((s, i) => (
                  <div key={i} className="impact-stat-card">
                    <span className="impact-stat-icon">{s.icon}</span>
                    <div className="impact-stat-value">
                      <Counter target={s.value} />{s.suffix}
                    </div>
                    <div className="impact-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-glow" />
            <span className="section-tag">Join the Community</span>
            <h2>Know a Hidden Gem?</h2>
            <p>
              Every extraordinary destination starts with someone brave enough to go first —
              and generous enough to share the path. Add your discovery to the map.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                Share Your Discovery
              </Link>
              <Link to="/destinations" className="btn btn-secondary btn-lg">
                Browse Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
