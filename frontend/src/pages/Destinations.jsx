import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import DestinationCard from '../components/DestinationCard';
import './Destinations.css';

const CONTINENTS = ['Africa', 'Asia', 'Europe', 'South America', 'Middle East', 'Oceania'];
const ACTIVITIES = [
  'Hiking & Trekking', 'Cultural Exploration', 'Adventure Sports', 'Nature & Wildlife',
  'Historical Sites', 'Desert Exploration', 'Beach & Coastal', 'Mountain Climbing',
  'Rural & Farm Stays', 'Photography & Scenery', 'Gastronomy & Food Tours', 'Wilderness Survival',
  'Spa & Hot Springs', 'Rainforest Exploration',
];
const DIFFICULTIES = ['Easy', 'Moderate', 'Challenging', 'Very Difficult', 'Expert'];
const SORTS = [
  { value: '', label: 'Recommended' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Viewed' },
  { value: 'newest', label: 'Newest First' },
  { value: 'cost_asc', label: 'Budget: Low → High' },
  { value: 'cost_desc', label: 'Budget: High → Low' },
];

export default function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const getParam = (key) => searchParams.get(key) || '';

  const [search, setSearch]         = useState(getParam('search'));
  const [continent, setContinent]   = useState(getParam('continent'));
  const [activity, setActivity]     = useState(getParam('activity_type'));
  const [difficulty, setDifficulty] = useState(getParam('difficulty_level'));
  const [sort, setSort]             = useState(getParam('sort'));
  const [maxCost, setMaxCost]       = useState(getParam('max_cost') || '');

  const fetchDestinations = useCallback(async (params) => {
    setLoading(true);
    try {
      const filtered = {};
      if (params.search) filtered.search = params.search;
      if (params.continent) filtered.continent = params.continent;
      if (params.activity) filtered.activity_type = params.activity;
      if (params.difficulty) filtered.difficulty_level = params.difficulty;
      if (params.sort) filtered.sort = params.sort;
      if (params.maxCost) filtered.max_cost = params.maxCost;
      const data = await api.getDestinations(filtered);
      setDestinations(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchDestinations({ search, continent, activity, difficulty, sort, maxCost });
  }, [search, continent, activity, difficulty, sort, maxCost, fetchDestinations]);

  const updateFilter = (key, value) => {
    const updates = { search, continent, activity, difficulty, sort, maxCost };
    updates[key] = value;
    if (key === 'search') setSearch(value);
    else if (key === 'continent') setContinent(value);
    else if (key === 'activity') setActivity(value);
    else if (key === 'difficulty') setDifficulty(value);
    else if (key === 'sort') setSort(value);
    else if (key === 'maxCost') setMaxCost(value);
  };

  const clearAll = () => {
    setSearch(''); setContinent(''); setActivity('');
    setDifficulty(''); setSort(''); setMaxCost('');
    setSearchParams({});
  };

  const activeCount = [continent, activity, difficulty, maxCost].filter(Boolean).length;

  return (
    <div className="destinations-page">
      {/* Header */}
      <div className="dest-page-header">
        <div className="container">
          <div className="dest-page-header-inner">
            <div>
              <span className="section-tag">Explore</span>
              <h1 className="dest-page-title">Hidden Destinations</h1>
              <p className="dest-page-subtitle">
                {loading ? 'Loading...' : `${destinations.length} destinations discovered by our community`}
              </p>
            </div>
          </div>

          {/* Search + Sort Bar */}
          <div className="dest-controls">
            <div className="search-wrapper dest-search">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search destinations, countries, activities..."
                value={search}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
              {search && (
                <button className="search-clear" onClick={() => updateFilter('search', '')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>

            <div className="dest-controls-right">
              <select
                className="form-input form-select sort-select"
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
              >
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>

              <button
                className={`btn btn-secondary filter-toggle ${activeCount > 0 ? 'has-filters' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filters
                {activeCount > 0 && <span className="filter-count">{activeCount}</span>}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="filter-panel animate-fadeIn">
              {/* Continent */}
              <div className="filter-group">
                <label className="filter-label">Continent</label>
                <div className="pill-filters">
                  <button className={`pill ${continent === '' ? 'active' : ''}`} onClick={() => updateFilter('continent', '')}>All</button>
                  {CONTINENTS.map((c) => (
                    <button key={c} className={`pill ${continent === c ? 'active' : ''}`} onClick={() => updateFilter('continent', continent === c ? '' : c)}>{c}</button>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="filter-group">
                <label className="filter-label">Activity Type</label>
                <div className="pill-filters">
                  <button className={`pill ${activity === '' ? 'active' : ''}`} onClick={() => updateFilter('activity', '')}>All</button>
                  {ACTIVITIES.map((a) => (
                    <button key={a} className={`pill ${activity === a ? 'active' : ''}`} onClick={() => updateFilter('activity', activity === a ? '' : a)}>{a}</button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="filter-group">
                <label className="filter-label">Difficulty Level</label>
                <div className="pill-filters">
                  <button className={`pill ${difficulty === '' ? 'active' : ''}`} onClick={() => updateFilter('difficulty', '')}>All</button>
                  {DIFFICULTIES.map((d) => (
                    <button key={d} className={`pill ${difficulty === d ? 'active' : ''}`} onClick={() => updateFilter('difficulty', difficulty === d ? '' : d)}>{d}</button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="filter-group filter-group-inline">
                <label className="filter-label">Max Budget (USD)</label>
                <div className="budget-filter">
                  <input
                    type="range" min="0" max="3000" step="50"
                    value={maxCost || 3000}
                    onChange={(e) => updateFilter('maxCost', e.target.value === '3000' ? '' : e.target.value)}
                    className="range-input"
                  />
                  <span className="budget-value">{maxCost ? `$${maxCost}` : 'Any'}</span>
                </div>
              </div>

              <div className="filter-footer">
                <button className="btn btn-secondary btn-sm" onClick={clearAll}>Clear All</button>
                <button className="btn btn-primary btn-sm" onClick={() => setShowFilters(false)}>
                  Show {destinations.length} Results
                </button>
              </div>
            </div>
          )}

          {/* Active filters */}
          {(continent || activity || difficulty || maxCost) && (
            <div className="active-filters">
              <span className="active-filters-label">Active:</span>
              {continent && <button className="active-filter-chip" onClick={() => updateFilter('continent', '')}>{continent} ×</button>}
              {activity  && <button className="active-filter-chip" onClick={() => updateFilter('activity', '')}>{activity} ×</button>}
              {difficulty && <button className="active-filter-chip" onClick={() => updateFilter('difficulty', '')}>{difficulty} ×</button>}
              {maxCost   && <button className="active-filter-chip" onClick={() => updateFilter('maxCost', '')}>Max ${maxCost} ×</button>}
              <button className="clear-all-btn" onClick={clearAll}>Clear All</button>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="container dest-grid-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p>Discovering hidden gems...</p>
          </div>
        ) : destinations.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No destinations found</h3>
            <p>Try adjusting your search or filters to discover more hidden gems.</p>
            <button className="btn btn-primary" onClick={clearAll}>Clear Filters</button>
          </div>
        ) : (
          <div className="dest-grid stagger-children">
            {destinations.map((dest) => (
              <div key={dest.destination_id} className="animate-fadeInUp">
                <DestinationCard destination={dest} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
