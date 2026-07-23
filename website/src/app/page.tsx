import React from 'react';
import Image from 'next/image';
import TonalMockup from '../components/TonalMockup';
import FaqSection from '../components/FaqSection';
import InstallSteps from '../components/InstallSteps';
import Navbar from '../components/Navbar';
import DownloadButton from '../components/DownloadButton';
import ScrollObserver from '../components/ScrollObserver';

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <Navbar />

      <main>
        <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <span className="badge badge-blue hero-badge" style={{ fontWeight: 600, marginBottom: 'var(--space-6)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Gmail, Slack, and LinkedIn
            </span>
            <h1 className="hero-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 6vw, 52px)', letterSpacing: '-0.02em', marginBottom: 'var(--space-6)', fontWeight: 700 }}>
              Adjust your tone <span className="text-highlight">without breaking focus</span>.
            </h1>
            <p className="hero-description hero-desc" style={{ fontSize: '16px', maxWidth: '520px', marginBottom: 'var(--space-8)' }}>
              Rewrite text directly inside any input field. Eliminate context switching and craft professional communication instantly.
            </p>
            <div className="hero-cta">
              <DownloadButton 
                className="btn btn-primary hero-cta-btn" 
                style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '14px', fontWeight: 500 }}
              >
                Download for Chrome
              </DownloadButton>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-glow"></div>
            <div className="hero-mockup-container hero-mockup-reveal">
              <TonalMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison / Problem Section */}
      <section className="comparison-section section-padding reveal-on-scroll" id="features">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="badge badge-red" style={{ fontWeight: 600 }}>The Copy-Paste Tax</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 46px)', fontWeight: 600 }}>
              Traditional AI tools break your writing flow
            </h2>
          </div>
          
          <div className="comp-grid">
            <div className="comp-col comp-col--problem">
              <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Traditional Workflows <span className="badge-status badge-status--problem">Friction</span>
              </h3>
              <ul className="comp-list">
                <li className="comp-item">
                  <span className="comp-icon comp-icon--cross">✕</span>
                  Disrupting focus to open external web applications
                </li>
                <li className="comp-item">
                  <span className="comp-icon comp-icon--cross">✕</span>
                  Manual copying, pasting, and formatting loss
                </li>
                <li className="comp-item">
                  <span className="comp-icon comp-icon--cross">✕</span>
                  Repetitive prompting to iterate on draft text
                </li>
                <li className="comp-item">
                  <span className="comp-icon comp-icon--cross">✕</span>
                  Interrupting the creative flow state
                </li>
              </ul>
            </div>
            
            <div className="comp-col comp-col--solution">
              <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                tonal Inline Integration <span className="badge-status badge-status--solution">Seamless</span>
              </h3>
              <ul className="comp-list" style={{ gap: '16px' }}>
                <li className="comp-item comp-item--strong">
                  <span className="comp-icon comp-icon--check">✓</span>
                  Instant execution directly inside active text inputs
                </li>
                <li className="comp-item comp-item--strong">
                  <span className="comp-icon comp-icon--check">✓</span>
                  No context switching or tab management needed
                </li>
                <li className="comp-item comp-item--strong">
                  <span className="comp-icon comp-icon--check">✓</span>
                  Preserves original formatting with native inline rewrites
                </li>
                <li className="comp-item comp-item--strong">
                  <span className="comp-icon comp-icon--check">✓</span>
                  One keystroke to activate, no mouse required
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* New Features Section */}
      <section className="features-grid-section section-padding reveal-on-scroll" id="new-features">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="badge badge-blue" style={{ fontWeight: 600 }}>What&apos;s New</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 46px)', fontWeight: 600 }}>
              Built for how you actually write
            </h2>
          </div>

          <div className="features-4-grid">
            {/* Keyboard Shortcut */}
            <div className="feature-card">
              <div className="feature-card-icon" style={{ background: 'var(--color-blue-bg)', color: 'var(--color-blue)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h4M6 14h12"/></svg>
              </div>
              <h3>Keyboard Shortcut</h3>
              <p>Press <strong>Ctrl+Shift+T</strong> to instantly open the tone picker on your active input — without touching your mouse or leaving the page.</p>
              <span className="feature-badge" style={{ background: 'var(--color-blue-bg)', color: 'var(--color-blue)' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Ctrl+Shift+T
              </span>
            </div>

            {/* Per-Site Memory */}
            <div className="feature-card">
              <div className="feature-card-icon" style={{ background: 'var(--color-purple-bg)', color: 'var(--color-purple)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <h3>Remembers Your Tone</h3>
              <p>tonal automatically saves your last selected tone for each site. Gmail, Slack, LinkedIn — each gets its own preference, silently applied on every visit.</p>
              <span className="feature-badge" style={{ background: 'var(--color-purple-bg)', color: 'var(--color-purple)' }}>
                Per-site memory
              </span>
            </div>

            {/* Works Offline */}
            <div className="feature-card">
              <div className="feature-card-icon" style={{ background: 'var(--color-green-bg)', color: 'var(--color-green)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
              </div>
              <h3>Works Offline</h3>
              <p>When the network is unavailable, tonal&apos;s built-in local engine applies 30+ word-swap rules per tone — no internet required, no interruption to your writing.</p>
              <span className="feature-badge" style={{ background: 'var(--color-green-bg)', color: 'var(--color-green)' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                No network needed
              </span>
            </div>

            {/* Undo History */}
            <div className="feature-card">
              <div className="feature-card-icon" style={{ background: 'var(--color-magenta-bg)', color: 'var(--color-magenta)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
              </div>
              <h3>Persistent Undo History</h3>
              <p>Every rewrite is saved locally. Restore any of your last 10 drafts with one tap — even after navigating away or closing the tab.</p>
              <span className="feature-badge" style={{ background: 'var(--color-magenta-bg)', color: 'var(--color-magenta)' }}>
                10-entry history
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Engine & Security Section */}
      <section className="engine-section section-padding reveal-on-scroll" id="security">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="badge badge-orange" style={{ fontWeight: 600 }}>The Engine</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 46px)', fontWeight: 600 }}>
              Built for speed and absolute isolation
            </h2>
          </div>

          <div className="engine-grid">
            <div className="engine-col">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>Sub-Second Latency</h3>
              <p>
                tonal communicates directly with Groq LPU (Language Processing Unit) inference nodes. By executing Llama 3.3 70B models at hardware-accelerated speeds, rewrites are delivered in milliseconds. There is no waiting, spinning wheels, or delays.
              </p>
              <div className="engine-meta" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--space-2)' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Groq LPU Inference
                </span>
                <span>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--space-2)' }}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>
                  Llama 3.3 70B
                </span>
              </div>
            </div>

            <div className="engine-col">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>Complete Keystroke Privacy</h3>
              <p>
                Your writing stays yours. tonal executes in an isolated Shadow DOM container inside your browser, meaning host scripts cannot read your inputs. Drafts are forwarded securely to the API proxy without ever being logged, stored, or used for model training.
              </p>
              <div className="engine-meta" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--space-2)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Shadow DOM Sandbox
                </span>
                <span>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--space-2)' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Zero Draft Logging
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />

      {/* Manual Installation Section */}
      <section className="installation-section section-padding reveal-on-scroll" id="install" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="badge badge-blue" style={{ fontWeight: 600 }}>Easy Setup</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 4vw, 46px)', fontWeight: 600 }}>
              Manual Installation Guide
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', marginTop: 'var(--space-3)' }}>
              Follow these simple steps to load the Chrome Extension locally in less than 60 seconds.
            </p>
          </div>
          
          <InstallSteps />
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bottom-cta bottom-cta--drenched section-padding reveal-on-scroll">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="bottom-cta-title">
            Compose with perfect tone, in one tap
          </h2>
          <p className="bottom-cta-desc">
            Download the extension bundle now and start adjusting your writing tone inline on Gmail, Slack, and LinkedIn.
          </p>
          <DownloadButton className="btn btn-primary bottom-cta-btn">
            Download Chrome Extension Zip
          </DownloadButton>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-logo-col">
              <a href="#" className="logo">
                <Image src="/icons/icon128.png" alt="tonal Logo" width={24} height={24} style={{ borderRadius: 'var(--radius-xs)', marginRight: 'var(--space-1)' }} />
                <span>tonal</span>
              </a>
              <p className="footer-tagline">Tone-aware writing, everywhere you type.</p>
              <p className="footer-author" style={{ fontSize: '12px', color: 'var(--gray-4)', marginTop: 'var(--space-2)' }}>
                Created by <a href="https://github.com/kwakhare5" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-blue)', textDecoration: 'none' }}>Karan Wakhare</a>
              </p>
            </div>
            
            <div className="footer-col">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li><a href="https://github.com/kwakhare5/tonal" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
                <li><a href="https://github.com/kwakhare5/tonal/blob/main/README.md" target="_blank" rel="noopener noreferrer">Documentation</a></li>
                <li><a href="https://github.com/kwakhare5/tonal/issues" target="_blank" rel="noopener noreferrer">Report Issues</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Security</h4>
              <ul className="footer-links">
                <li><a href="#security">Shadow DOM Isolation</a></li>
                <li><a href="#security">Worker Encryption</a></li>
                <li><a href="https://github.com/kwakhare5/tonal/blob/main/CONTEXT.md" target="_blank" rel="noopener noreferrer">Security Context</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Credits</h4>
              <ul className="footer-links">
                <li><a href="https://groq.com" target="_blank" rel="noopener noreferrer">Groq LPU Inference</a></li>
                <li><a href="https://llama.meta.com" target="_blank" rel="noopener noreferrer">Llama 3.3 70B</a></li>
                <li><a href="https://workers.cloudflare.com" target="_blank" rel="noopener noreferrer">Cloudflare Workers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <span>© 2026 tonal Chrome Extension. Built by Karan Wakhare. Released under the MIT License.</span>
          </div>
        </div>
      </footer>

      <ScrollObserver />
    </>
  );
}
