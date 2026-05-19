import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const STATUS_COLORS = {
  Approved: { bg: '#d1fae5', color: '#065f46' },
  Pending:  { bg: '#fef3c7', color: '#92400e' },
  Rejected: { bg: '#fee2e2', color: '#991b1b' },
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    Promise.all([api.getAdminDestinations(), api.getAdminStats()])
      .then(([dests, st]) => { setDestinations(dests); setStats(st); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    setActionLoading(id + status);
    try {
      const updated = await api.updateDestinationStatus(id, status);
      setDestinations((prev) => prev.map((d) => d.destination_id === id ? { ...d, post_status: updated.post_status } : d));
      setStats((prev) => {
        const old = destinations.find((d) => d.destination_id === id)?.post_status;
        return {
          ...prev,
          [old?.toLowerCase()]: Math.max(0, (prev[old?.toLowerCase()] || 0) - 1),
          [status.toLowerCase()]: (prev[status.toLowerCase()] || 0) + 1,
        };
      });
    } catch (err) { alert(err.message); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setActionLoading(id + 'delete');
    try {
      await api.deleteDestination(id);
      setDestinations((prev) => prev.filter((d) => d.destination_id !== id));
      setStats((prev) => {
        const old = destinations.find((d) => d.destination_id === id)?.post_status;
        return {
          ...prev,
          total: Math.max(0, (prev.total || 0) - 1),
          [old?.toLowerCase()]: Math.max(0, (prev[old?.toLowerCase()] || 0) - 1),
        };
      });
    } catch (err) { alert(err.message); }
    finally { setActionLoading(null); }
  };

  const filtered = destinations.filter((d) => {
    const matchStatus = filter === 'All' || d.post_status === filter;
    const matchSearch = !search || d.post_title.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-inner">
            <div>
              <span className="section-tag">Admin Panel</span>
              <h1 className="admin-title">Destination Management</h1>
              <p className="admin-subtitle">Review, approve, reject or delete community submissions</p>
            </div>
            <div className="admin-welcome">
              <span>Signed in as</span>
              <strong>{user?.full_name}</strong>
            </div>
          </div>

          {stats && (
            <div className="admin-stats-row">
              {[
                { label: 'Total', value: stats.total, color: '#6366f1' },
                { label: 'Pending', value: stats.pending, color: '#f59e0b' },
                { label: 'Approved', value: stats.approved, color: '#10b981' },
                { label: 'Rejected', value: stats.rejected, color: '#ef4444' },
                { label: 'Users', value: stats.users, color: '#8b5cf6' },
              ].map((s) => (
                <div key={s.label} className="admin-stat-card" style={{ borderTopColor: s.color }}>
                  <div className="admin-stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="admin-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container admin-body">
        <div className="admin-controls">
          <div className="admin-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              className="admin-search"
              placeholder="Search by title or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="admin-filter-tabs">
            {['All', 'Pending', 'Approved', 'Rejected'].map((s) => (
              <button
                key={s}
                className={`admin-tab ${filter === s ? 'active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s}
                <span className="admin-tab-count">
                  {s === 'All' ? destinations.length : destinations.filter((d) => d.post_status === s).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /><p>Loading destinations...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <h3>No destinations found</h3>
            <p>Try changing the filter or search term.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Country</th>
                  <th>Activity</th>
                  <th>Submitted By</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const sc = STATUS_COLORS[d.post_status] || STATUS_COLORS.Pending;
                  return (
                    <tr key={d.destination_id} className="admin-row">
                      <td>
                        <div className="admin-dest-info">
                          <img
                            src={d.image}
                            alt={d.post_title}
                            className="admin-dest-thumb"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=80&q=60'; }}
                          />
                          <div>
                            <div className="admin-dest-title">{d.post_title}</div>
                            <div className="admin-dest-id">{d.destination_id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{d.country}</td>
                      <td><span className="admin-activity">{d.activity_type}</span></td>
                      <td>{d.submitter_name || '—'}</td>
                      <td>{d.submission_date || '—'}</td>
                      <td>
                        <span className="admin-status-badge" style={{ background: sc.bg, color: sc.color }}>
                          {d.post_status}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          {d.post_status !== 'Approved' && (
                            <button
                              className="admin-btn approve"
                              disabled={!!actionLoading}
                              onClick={() => handleStatus(d.destination_id, 'Approved')}
                            >
                              {actionLoading === d.destination_id + 'Approved' ? '...' : 'Approve'}
                            </button>
                          )}
                          {d.post_status !== 'Rejected' && (
                            <button
                              className="admin-btn reject"
                              disabled={!!actionLoading}
                              onClick={() => handleStatus(d.destination_id, 'Rejected')}
                            >
                              {actionLoading === d.destination_id + 'Rejected' ? '...' : 'Reject'}
                            </button>
                          )}
                          <button
                            className="admin-btn delete"
                            disabled={!!actionLoading}
                            onClick={() => handleDelete(d.destination_id, d.post_title)}
                          >
                            {actionLoading === d.destination_id + 'delete' ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
