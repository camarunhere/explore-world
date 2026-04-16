import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <span>🌍</span>
                <span className="footer-logo-text">Explore<span>World</span></span>
              </Link>
              <p className="footer-tagline">
                Discover the world's hidden gems through authentic, community-driven storytelling. Go beyond the tourist trail.
              </p>
              <div className="footer-socials">
                <a href="#" className="social-btn" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                </a>
                <a href="#" className="social-btn" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" className="social-btn" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#070b14"/></svg>
                </a>
              </div>
            </div>

            {/* Explore */}
            <div className="footer-col">
              <h4 className="footer-col-title">Explore</h4>
              <ul className="footer-links">
                <li><Link to="/destinations">All Destinations</Link></li>
                <li><Link to="/destinations?continent=Africa">Africa</Link></li>
                <li><Link to="/destinations?continent=Asia">Asia</Link></li>
                <li><Link to="/destinations?continent=Europe">Europe</Link></li>
                <li><Link to="/destinations?continent=South America">South America</Link></li>
                <li><Link to="/destinations?continent=Middle East">Middle East</Link></li>
              </ul>
            </div>

            {/* Activities */}
            <div className="footer-col">
              <h4 className="footer-col-title">Activities</h4>
              <ul className="footer-links">
                <li><Link to="/destinations?activity_type=Hiking %26 Trekking">Hiking & Trekking</Link></li>
                <li><Link to="/destinations?activity_type=Cultural Exploration">Cultural Exploration</Link></li>
                <li><Link to="/destinations?activity_type=Adventure Sports">Adventure Sports</Link></li>
                <li><Link to="/destinations?activity_type=Nature %26 Wildlife">Nature & Wildlife</Link></li>
                <li><Link to="/destinations?activity_type=Historical Sites">Historical Sites</Link></li>
                <li><Link to="/destinations?activity_type=Desert Exploration">Desert Exploration</Link></li>
              </ul>
            </div>

            {/* Platform */}
            <div className="footer-col">
              <h4 className="footer-col-title">Platform</h4>
              <ul className="footer-links">
                <li><Link to="/about">About ExploreWorld</Link></li>
                <li><Link to="/submit">Share a Destination</Link></li>
                <li><Link to="/register">Join the Community</Link></li>
                <li><a href="#">Sustainability Pledge</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">
            © 2025 ExploreWorld. Built to promote sustainable, decentralised tourism.
          </p>
          <p className="footer-mission">
            <span className="mission-dot">●</span>
            Supporting hidden destinations &amp; local communities worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
