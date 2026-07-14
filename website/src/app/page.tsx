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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.05 }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar-container" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <a href="#" className="logo">
            <Image src="/icons/icon128.png" alt="Tonal Logo" width={20} height={20} style={{ borderRadius: 'var(--radius-xs)', marginRight: 'var(--space-1)' }} />
            <span>Tonal</span>
          </a>

          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>

          <div className="nav-actions">
            <a href="https://github.com/kwakhare5/Tonal" target="_blank" rel="noopener noreferrer" className="login-btn" style={{ fontSize: '13px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" style={{ verticalAlign: 'middle' }}>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </nav>

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
              <a href="/tonal-extension.zip" download className="btn btn-primary hero-cta-btn" style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '14px', fontWeight: 500 }}>
                Download for Chrome
              </a>
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
                Tonal Inline Integration <span className="badge-status badge-status--solution">Seamless</span>
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
              </ul>
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
                Tonal communicates directly with Groq LPU (Language Processing Unit) inference nodes. By executing Llama 3.3 70B models at hardware-accelerated speeds, rewrites are delivered in milliseconds. There is no waiting, spinning wheels, or delays.
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
                Your writing stays yours. Tonal executes in an isolated Shadow DOM container inside your browser, meaning host scripts cannot read your inputs. Drafts are forwarded securely to the API proxy without ever being logged, stored, or used for model training.
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

      {/* Bottom CTA Section */}
      <section className="bottom-cta section-padding reveal-on-scroll" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 52px)', marginBottom: 'var(--space-4)', fontWeight: 600 }}>
            Compose with perfect tone, in one tap
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px', maxWidth: '500px', margin: '0 auto var(--space-8) auto', lineHeight: 1.6 }}>
            Download the extension bundle now and start adjusting your writing tone inline on Gmail, Slack, and LinkedIn.
          </p>
          <a href="/tonal-extension.zip" download className="btn btn-primary" style={{ padding: 'var(--space-3) var(--space-6)', fontSize: '15px', fontWeight: 600 }}>
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
                <Image src="/icons/icon128.png" alt="Tonal Logo" width={24} height={24} style={{ borderRadius: 'var(--radius-xs)', marginRight: 'var(--space-1)' }} />
                <span>Tonal</span>
              </a>
              <p className="footer-tagline">Open Source Inline Assistant</p>
              <p className="footer-author" style={{ fontSize: '12px', color: 'var(--gray-4)', marginTop: 'var(--space-2)' }}>
                Created by <a href="https://github.com/kwakhare5" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-blue)', textDecoration: 'none' }}>Karan Wakhare</a>
              </p>
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
                <li><a href="https://groq.com" target="_blank" rel="noopener noreferrer">Groq LPU Inference</a></li>
                <li><a href="https://llama.meta.com" target="_blank" rel="noopener noreferrer">Llama 3.3 70B</a></li>
                <li><a href="https://workers.cloudflare.com" target="_blank" rel="noopener noreferrer">Cloudflare Workers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <span>© 2026 Tonal Chrome Extension. Built by Karan Wakhare. Released under the MIT License.</span>
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
