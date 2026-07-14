'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import TonalMockup from '../components/TonalMockup';
import FaqSection from '../components/FaqSection';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar-container" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <a href="#" className="logo">
            <Image src="/icons/icon128.png" alt="Tonal Logo" width={20} height={20} style={{ borderRadius: 'var(--radius-xs)', marginRight: '4px' }} />
            <span>Tonal</span>
          </a>

          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>

          <div className="nav-actions">
            <a href="https://github.com/kwakhare5/Tonal" target="_blank" rel="noopener noreferrer" className="login-btn" style={{ fontSize: '13px', fontWeight: 500 }}>GitHub</a>
            <a href="/tonal-extension.zip" download className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <span className="badge badge-magenta" style={{ fontWeight: 600, marginBottom: 'var(--space-6)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Now supporting Gmail, Slack, and LinkedIn
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              Adjust your writing tone. Inline.
            </h1>
            <p className="hero-description">
              Transform casual drafts into polished communication directly inside your browser. No copying, no pasting, no extra tabs. Powered by Groq & Llama 3.3.
            </p>
            <div className="hero-cta">
              <a href="/tonal-extension.zip" download className="btn btn-primary btn-lg" style={{ padding: '14px 28px', fontSize: '15px', fontWeight: 600 }}>
                Get Tonal for Chrome — Free
              </a>
            </div>
            <div className="hero-rates" style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--gray-4)', marginTop: '16px', alignItems: 'center', fontFamily: 'var(--font-sans)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-magenta)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Sub-second Speed
              </span>
              <span>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-magenta)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Keystroke Privacy
              </span>
              <span>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-magenta)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Local Sandbox
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-glow"></div>
            <div className="hero-mockup-container">
              <TonalMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison / Problem Section */}
      <section className="comparison-section section-padding" id="features">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="badge badge-magenta" style={{ fontWeight: 600 }}>The Copy-Paste Tax</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 400 }}>
              Traditional AI tools break your writing flow
            </h2>
          </div>
          
          <div className="comp-grid">
            <div className="comp-col comp-col--problem">
              <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Traditional AI <span className="badge-status badge-status--problem">Problem</span>
              </h3>
              <ul className="comp-list">
                <li className="comp-item">
                  <span className="comp-icon comp-icon--cross">✕</span>
                  Open new browser tab
                </li>
                <li className="comp-item">
                  <span className="comp-icon comp-icon--cross">✕</span>
                  Go to ChatGPT / Claude
                </li>
                <li className="comp-item">
                  <span className="comp-icon comp-icon--cross">✕</span>
                  Write prompt + paste draft
                </li>
                <li className="comp-item">
                  <span className="comp-icon comp-icon--cross">✕</span>
                  Wait for output response
                </li>
                <li className="comp-item">
                  <span className="comp-icon comp-icon--cross">✕</span>
                  Select and copy result
                </li>
                <li className="comp-item">
                  <span className="comp-icon comp-icon--cross">✕</span>
                  Go back to original tab
                </li>
                <li className="comp-item">
                  <span className="comp-icon comp-icon--cross">✕</span>
                  Paste over draft
                </li>
              </ul>
            </div>
            
            <div className="comp-col comp-col--solution">
              <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Tonal Inline <span className="badge-status badge-status--solution">Solution</span>
              </h3>
              <ul className="comp-list" style={{ gap: '16px' }}>
                <li className="comp-item comp-item--strong">
                  <span className="comp-icon comp-icon--check">✓</span>
                  Click the floating Tonal Pill
                </li>
                <li className="comp-item comp-item--strong">
                  <span className="comp-icon comp-icon--check">✓</span>
                  Choose your desired tone
                </li>
                <li className="comp-item comp-item--strong">
                  <span className="comp-icon comp-icon--check">✓</span>
                  Text updates in-place. Zero interruptions.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Engine & Security Section */}
      <section className="engine-section section-padding" id="security">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="badge badge-magenta" style={{ fontWeight: 600 }}>The Engine</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 400 }}>
              Built for speed and absolute isolation
            </h2>
          </div>

          <div className="engine-grid">
            <div className="engine-col">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Sub-Second Latency</h3>
              <p>
                Tonal communicates directly with Groq LPU (Language Processing Unit) inference nodes. By executing Llama 3.3 70B models at hardware-accelerated speeds, rewrites are delivered in milliseconds. There is no waiting, spinning wheels, or delays.
              </p>
              <div className="engine-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Groq LPU Inference
                </span>
                <span>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>
                  Llama 3.3 70B
                </span>
              </div>
            </div>

            <div className="engine-col">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Complete Keystroke Privacy</h3>
              <p>
                Your writing stays yours. Tonal executes in an isolated Shadow DOM container inside your browser, meaning host scripts cannot read your inputs. Drafts are forwarded securely to the API proxy without ever being logged, stored, or used for model training.
              </p>
              <div className="engine-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Shadow DOM Sandbox
                </span>
                <span>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Zero Draft Logging
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />

      {/* Bottom CTA Section */}
      <section className="bottom-cta section-padding" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: '16px', fontWeight: 400 }}>
            Compose with perfect tone, in one tap
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', maxWidth: '500px', margin: '0 auto var(--space-8) auto', lineHeight: 1.6 }}>
            Download the extension bundle now and start adjusting your writing tone inline on Gmail, Slack, and LinkedIn.
          </p>
          <a href="/tonal-extension.zip" download className="btn btn-primary btn-lg" style={{ padding: '14px 28px', fontSize: '15px', fontWeight: 600 }}>
            Download Chrome Extension Zip
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-logo-col">
              <a href="#" className="logo">
                <Image src="/icons/icon128.png" alt="Tonal Logo" width={24} height={24} style={{ borderRadius: 'var(--radius-xs)', marginRight: '4px' }} />
                <span>Tonal</span>
              </a>
              <p className="footer-tagline">Open Source Inline AI Assistant</p>
            </div>
            
            <div className="footer-col">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li><a href="https://github.com/kwakhare5/Tonal" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
                <li><a href="https://github.com/kwakhare5/Tonal/blob/main/README.md" target="_blank" rel="noopener noreferrer">Documentation</a></li>
                <li><a href="https://github.com/kwakhare5/Tonal/issues" target="_blank" rel="noopener noreferrer">Report Issues</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Security</h4>
              <ul className="footer-links">
                <li><a href="#security">Shadow DOM Isolation</a></li>
                <li><a href="#security">Worker Encryption</a></li>
                <li><a href="https://github.com/kwakhare5/Tonal/blob/main/CONTEXT.md" target="_blank" rel="noopener noreferrer">Security Context</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Credits</h4>
              <ul className="footer-links">
                <li><a href="#">Groq LPU Inference</a></li>
                <li><a href="#">Llama 3.3 70B</a></li>
                <li><a href="#">Cloudflare Workers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <span>© 2026 Tonal Chrome Extension. Released under the MIT License.</span>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
