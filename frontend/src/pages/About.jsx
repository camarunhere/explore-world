import { Link } from 'react-router-dom';
import './About.css';

const TEAM = [
  {
    name: 'Sofia Marchetti',
    role: 'Co-Founder & Community Lead',
    bio: 'Former anthropologist turned traveller. Sofia has visited 67 countries and believes every place has a story worth telling.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80',
    flag: '🇮🇹',
  },
  {
    name: 'James Okafor',
    role: 'Co-Founder & Platform Architect',
    bio: 'Software engineer and outdoor enthusiast from Lagos. James built the platform after failing to find information on West African hidden gems.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
    flag: '🇳🇬',
  },
  {
    name: 'Amara Diallo',
    role: 'Head of Content & Editorial',
    bio: 'Award-winning travel writer who has contributed to Lonely Planet and National Geographic Traveller.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&q=80',
    flag: '🇸🇳',
  },
  {
    name: 'Lena Fischer',
    role: 'Sustainability Advisor',
    bio: 'Environmental consultant with 12 years experience in responsible tourism policy across Europe and Southeast Asia.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80',
    flag: '🇩🇪',
  },
];

const VALUES = [
  {
    icon: '🌱',
    title: 'Sustainable Travel',
    desc: 'We champion responsible tourism that preserves ecosystems and respects local cultures. Every destination listing includes environmental sensitivity ratings.',
  },
  {
    icon: '🤝',
    title: 'Community First',
    desc: 'No paid promotions. No algorithm manipulation. Every destination on ExploreWorld was submitted and rated by real travellers — just like you.',
  },
  {
    icon: '🏘️',
    title: 'Local Impact',
    desc: 'By directing curious travellers to overlooked destinations, we support local economies that are often bypassed by mainstream tourism.',
  },
  {
    icon: '🔍',
    title: 'Radical Transparency',
    desc: 'Honest reviews, real difficulty ratings, and accurate cost estimates. We do not hide inconvenient truths about destinations.',
  },
  {
    icon: '🌍',
    title: 'Global Inclusivity',
    desc: 'Hidden gems exist on every continent. We actively seek out destinations in underrepresented regions — especially Africa, Central Asia and Oceania.',
  },
  {
    icon: '📖',
    title: 'Storytelling',
    desc: 'Travel is more than a checklist. We prioritise rich, narrative destination stories over bullet-point summaries.',
  },
];

const STATS = [
  { value: '30+', label: 'Hidden Destinations', icon: '📍' },
  { value: '6', label: 'Continents Covered', icon: '🌍' },
  { value: '1,200+', label: 'Community Members', icon: '👥' },
  { value: '4.8★', label: 'Average Destination Rating', icon: '⭐' },
];

export default function About() {
  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <div className="about-hero-overlay" />
          <img
            src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=75"
            alt="Hidden landscape"
            className="about-hero-img"
          />
        </div>
        <div className="container about-hero-inner">
          <span className="section-tag animate-fadeInUp">Our Story</span>
          <h1 className="about-hero-title animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            We Built the Platform
            <br /><span className="about-title-accent">We Wished Existed</span>
          </h1>
          <p className="about-hero-sub animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            ExploreWorld was born from a simple frustration: the world's most extraordinary
            destinations were invisible on every major travel platform — drowned out by
            paid promotions and algorithm-driven popularity contests.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="section about-mission">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-text">
              <span className="section-tag">Our Mission</span>
              <h2>Rebalancing the Tourism Economy</h2>
              <p>
                Modern travel platforms have created a paradox: the world has never been more
                connected, yet tourist dollars flow overwhelmingly to a handful of over-visited
                destinations — while hundreds of culturally rich, economically under-resourced
                communities remain invisible.
              </p>
              <p>
                ExploreWorld is a community-driven antidote. We built a platform where the
                currency is authentic experience, not advertising budget. Every destination on
                our platform was submitted by a traveller who actually went there — and every
                review was written by someone who wanted others to find what they found.
              </p>
              <p>
                We believe that <strong>well-distributed tourism</strong> — where visitors are
                guided to places that genuinely benefit from their presence — is one of the most
                powerful tools for global economic equity and cultural preservation.
              </p>
              <Link to="/destinations" className="btn btn-primary btn-lg about-cta-btn">
                Explore Hidden Gems
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="mission-visual">
              <div className="mission-img-stack">
                <img src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80" alt="traveller" className="mission-img mission-img-main" />
                <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80" alt="mountains" className="mission-img mission-img-secondary" />
              </div>
              <div className="mission-quote">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent-emerald)" className="quote-mark"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                <p>"The most extraordinary places in the world are the ones that nobody writes about yet. Our job is to change that."</p>
                <cite>— Sofia Marchetti, Co-Founder</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            {STATS.map((s, i) => (
              <div key={i} className="about-stat-card animate-fadeInUp" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="about-stat-icon">{s.icon}</span>
                <div className="about-stat-value">{s.value}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section about-values">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Stand For</span>
            <h2>Our Core Values</h2>
            <p>These principles guide every decision we make — from what destinations we feature to how we design the platform.</p>
          </div>
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <div key={i} className="value-card animate-fadeInUp" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="value-icon">{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section about-team">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The People</span>
            <h2>Meet the Team</h2>
            <p>A small, passionate team of travellers, technologists and storytellers.</p>
          </div>
          <div className="team-grid">
            {TEAM.map((m, i) => (
              <div key={i} className="team-card animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="team-avatar-wrap">
                  <img src={m.avatar} alt={m.name} className="team-avatar" />
                  <span className="team-flag">{m.flag}</span>
                </div>
                <h3 className="team-name">{m.name}</h3>
                <p className="team-role">{m.role}</p>
                <p className="team-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section about-process">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How We Operate</span>
            <h2>Community-Driven, Always</h2>
          </div>
          <div className="process-steps">
            {[
              { step: '01', title: 'Travellers Submit', desc: 'Anyone who has visited a hidden destination can submit it through our guided form. We ask for honest, detailed information — not marketing copy.' },
              { step: '02', title: 'Editorial Review', desc: 'Our small editorial team reviews every submission for accuracy, completeness, and environmental sensitivity before publishing.' },
              { step: '03', title: 'Community Rates', desc: 'Visitors can rate, review, and save destinations. Community ratings — not algorithms — determine visibility.' },
              { step: '04', title: 'Impact Measured', desc: 'We track view counts and community engagement to ensure less-visited regions receive the attention they deserve.' },
            ].map((p, i) => (
              <div key={i} className="process-step animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="process-num">{p.step}</div>
                <div className="process-content">
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="about-cta-inner">
            <div className="about-cta-glow" />
            <h2>Ready to Contribute?</h2>
            <p>Share a hidden destination, write a review, or simply start exploring. Every contribution makes the community stronger.</p>
            <div className="about-cta-btns">
              <Link to="/register" className="btn btn-primary btn-lg">Join the Community</Link>
              <Link to="/destinations" className="btn btn-outline btn-lg">Browse Destinations</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
