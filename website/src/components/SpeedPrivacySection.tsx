import React from 'react';

interface FeatureItem {
  id: string;
  badge: string;
  badgeType: 'blue' | 'purple' | 'green' | 'orange' | 'magenta' | 'kbd';
  accentColor: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'speed',
    badge: '<500ms Speed',
    badgeType: 'blue',
    accentColor: '#0066FF',
    title: 'Sub-Second Acceleration',
    description: 'Direct communication with Groq LPU hardware running Llama 3.3 70B models for instant, under-500ms rewrites.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    id: 'shortcut',
    badge: 'Ctrl+Shift+T',
    badgeType: 'kbd',
    accentColor: '#6C56FC',
    title: 'Keyboard Shortcut',
    description: 'Trigger the tone selector inline over any active input field without taking your hands off the keyboard.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/>
      </svg>
    ),
  },
  {
    id: 'domain',
    badge: 'Domain Memory',
    badgeType: 'green',
    accentColor: '#10B981',
    title: 'Per-Site Tone Memory',
    description: 'Automatically remembers your preferred tone per hostname across Gmail, Slack, and LinkedIn independently.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
        <path d="M2 12h20"/>
      </svg>
    ),
  },
  {
    id: 'security',
    badge: 'Shadow DOM',
    badgeType: 'orange',
    accentColor: '#F59E0B',
    title: 'Shadow DOM Isolation',
    description: 'Text inputs are encapsulated inside a closed Shadow DOM container, protecting keystrokes from host page scripts.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    id: 'offline',
    badge: 'Offline Fallback',
    badgeType: 'blue',
    accentColor: '#0066FF',
    title: 'Local Heuristic Engine',
    description: 'Instantly switches to zero-latency local transformation rules if network connectivity drops.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 1l22 22"/>
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
        <path d="M10.71 5.05A16 16 0 0 1 22.58 9"/>
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
        <circle cx="12" cy="19" r="1"/>
      </svg>
    ),
  },
  {
    id: 'history',
    badge: '10-Draft History',
    badgeType: 'purple',
    accentColor: '#6C56FC',
    title: '10-Draft History',
    description: 'Caches your last 10 rewrites in browser session memory so you can restore prior drafts instantly.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7v6h6"/>
        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
      </svg>
    ),
  },
];

export const SpeedPrivacySection: React.FC = () => {
  return (
    <section className="features-grid-section section-padding reveal-on-scroll" id="new-features">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <span className="badge badge-purple">Architecture</span>
          <h2 className="section-title">
            Engineered for pure speed, total privacy, and effortless flow
          </h2>
        </div>

        <div className="eng-compact-grid">
          {FEATURES.map((feature) => (
            <div key={feature.id} id={`eng-feature-${feature.id}`} className="eng-minimal-item">
              <div className="eng-minimal-header">
                <div
                  className="eng-minimal-icon"
                  style={{
                    background: `${feature.accentColor}14`,
                    color: feature.accentColor,
                  }}
                >
                  {feature.icon}
                </div>
              </div>
              <h3 className="eng-minimal-title">
                <span>{feature.title}</span>
                {feature.badgeType === 'kbd' ? (
                  <span className="kbd">{feature.badge}</span>
                ) : (
                  <span className={`badge-status badge-status--${feature.badgeType}`}>{feature.badge}</span>
                )}
              </h3>
              <p className="eng-minimal-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
