import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../utils/api';
import './Auth.css';

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };
  const strength = getStrength(form.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const data = await api.register({ full_name: form.name, email: form.email, password: form.password });
      login(data.token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-overlay" />
        <div className="auth-particles">
          {[...Array(12)].map((_, i) => <div key={i} className="auth-particle" style={{ '--i': i }} />)}
        </div>
      </div>

      <div className="auth-container auth-container-reg">
        <div className="auth-card animate-fadeInUp">
          <div className="auth-brand">
            <Link to="/" className="auth-logo">
              <span className="auth-logo-icon">🌍</span>
              <span className="auth-logo-text">ExploreWorld</span>
            </Link>
          </div>

          <div className="auth-header">
            <h1 className="auth-title">Join the community</h1>
            <p className="auth-subtitle">Share and discover hidden travel gems</p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrap">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                  type="text" name="name" autoComplete="name"
                  className="form-input with-icon" placeholder="Your full name"
                  value={form.name} onChange={handleChange} required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="input-icon-wrap">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input
                  type="email" name="email" autoComplete="email"
                  className="form-input with-icon" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  type={showPass ? 'text' : 'password'} name="password"
                  autoComplete="new-password"
                  className="form-input with-icon with-toggle"
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange} required
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {form.password && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1,2,3,4].map((n) => (
                      <div key={n} className="strength-bar" style={{ background: n <= strength ? strengthColors[strength] : 'var(--bg-surface)' }} />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-icon-wrap">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                <input
                  type={showPass ? 'text' : 'password'} name="confirm"
                  autoComplete="new-password"
                  className={`form-input with-icon ${form.confirm && form.confirm !== form.password ? 'input-error' : ''}`}
                  placeholder="Repeat your password"
                  value={form.confirm} onChange={handleChange}
                />
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p className="field-error">Passwords don't match</p>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? (
                <><span className="btn-spinner" /> Creating account...</>
              ) : (
                <>Create Account <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg></>
              )}
            </button>
          </form>

          <p className="auth-terms">
            By creating an account you agree to our{' '}
            <span className="auth-link">Terms of Service</span> and{' '}
            <span className="auth-link">Privacy Policy</span>.
          </p>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>

        <div className="auth-illustration">
          <div className="auth-feature-list">
            {[
              { icon: '🗺️', title: 'Global Community', desc: 'Connect with travellers from 50+ countries' },
              { icon: '📖', title: 'Rich Stories', desc: 'Read and write immersive travel narratives' },
              { icon: '🌱', title: 'Sustainable Travel', desc: 'Promote responsible tourism worldwide' },
              { icon: '🏆', title: 'Build Your Profile', desc: 'Track your contributions and destinations' },
            ].map((f, i) => (
              <div key={i} className="auth-feature animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="auth-feature-icon">{f.icon}</span>
                <div>
                  <div className="auth-feature-title">{f.title}</div>
                  <div className="auth-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
