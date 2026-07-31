'use client';

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
    description: 'Powered by Groq LPU hardware nodes running Llama 3.3 70B models for instant, sub-500ms rewrites.',
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
    description: 'Activate the tone selector over any text input without taking your hands off the keyboard.',
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
    description: 'Automatically remembers distinct tone preferences across Gmail, Slack, and LinkedIn independently.',
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
    description: 'Encapsulated Shadow DOM container prevents host page scripts from reading your drafts or keystrokes.',
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
    description: 'Switches to intelligent local transformation rules automatically if network connectivity drops.',
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
    title: '10-Draft Persistent Memory',
    description: 'Caches your last 10 rewrites in browser session memory for instant one-click restores.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7v6h6"/>
        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
      </svg>
    ),
  },
];

export const ArchitectureSection: React.FC = () => {
  return (
    <section className="features-grid-section section-padding reveal-on-scroll" id="new-features">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <span className="badge badge-purple">Sub-Second Engine</span>
          <h2 className="section-title">
            Built for zero latency, ironclad privacy, and seamless execution
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
                  <span 
                    className="kbd" 
                    title="Click to copy shortcut"
                    style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText('Ctrl+Shift+T');
                      const target = e.currentTarget;
                      target.innerText = 'Copied! ✓';
                      setTimeout(() => {
                        target.innerText = feature.badge;
                      }, 2000);
                    }}
                  >
                    {feature.badge}
                  </span>
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

export default ArchitectureSection;
