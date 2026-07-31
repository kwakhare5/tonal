import React from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import TonalMockup from '../components/TonalMockup';
import InstallSteps from '../components/InstallSteps';
import FaqSection from '../components/FaqSection';
import DownloadButton from '../components/DownloadButton';
import ScrollObserver from '../components/ScrollObserver';
import { SpeedPrivacySection } from '../components/SpeedPrivacySection';

export const Home: React.FC = () => {
  return (
    <>
      {/* Background Layer */}
      <div className="bg-ambient-layer">
        <Image
          src="/Cloud.png"
          alt="Hero background"
          fill
          priority
          className="bg-ambient-img"
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>

      {/* Header Navbar */}
      <Navbar />

      <main id="main-content">
        {/* 1. Hero Section */}
        <section className="hero">
          <div className="container hero-content">
            <div className="hero-text">
              <div className="hero-announcement-badge">
                <span className="hero-announcement-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  New
                </span>
                Gmail, Slack, and LinkedIn Integration
              </div>

              <h1 className="hero-title">
                Adjust your tone<br />
                <span className="text-highlight">without breaking focus</span>.
              </h1>

              <p className="hero-description">
                Rewrite text directly inside Gmail, Slack, and LinkedIn in one click.
              </p>
            </div>

            {/* Interactive Mockup Frame */}
            <div className="hero-mockup-container">
              <TonalMockup />
            </div>
          </div>
        </section>

        {/* 3. Problem vs Solution Section ("Why Tonal") */}
        <section className="comparison-section section-padding reveal-on-scroll" id="features">
          <div className="container">
            <div className="section-header">
              <span className="badge badge-blue">Why Tonal</span>
              <h2 className="section-title">
                Traditional AI tools break your writing flow
              </h2>
            </div>
            
            <div className="comp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '48px' }}>
              {/* Problem Column */}
              <div className="comp-col-unboxed">
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  Traditional AI Tools
                  <span className="badge-status badge-status--problem">High Friction</span>
                </h3>
                <ul className="comp-list">
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--cross">✕</span>
                    <span>Forces you to switch tabs, copy text, open ChatGPT, paste, write a prompt, copy the response, switch tabs back, and paste it in</span>
                  </li>
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--cross">✕</span>
                    <span>Destroys focus and context every time you need a simple tone adjustment</span>
                  </li>
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--cross">✕</span>
                    <span>Produces generic, robotic AI copy that requires manual editing</span>
                  </li>
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--cross">✕</span>
                    <span>Exposes your text inputs to public web models and tracking</span>
                  </li>
                </ul>
              </div>
              
              {/* Solution Column */}
              <div className="comp-col-unboxed">
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  Tonal Extension Flow
                  <span className="badge-status badge-status--solution">Seamless</span>
                </h3>
                <ul className="comp-list">
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--check">✓</span>
                    <span>One click on the floating tone pill directly inside Gmail, Slack, or LinkedIn</span>
                  </li>
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--check">✓</span>
                    <span>Zero tab switches. Rewrites happen in-place in under 500 milliseconds</span>
                  </li>
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--check">✓</span>
                    <span>Preserves original text formatting with native inline replacement</span>
                  </li>
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--check">✓</span>
                    <span>One keyboard shortcut (Ctrl+Shift+T) to activate without touching your mouse</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Unified Capabilities & Architecture Split Section */}
        <SpeedPrivacySection />

        {/* 7. Manual Installation Section */}
        <section className="installation-section section-padding reveal-on-scroll" id="install">
          <div className="container">
            <div className="section-header">
              <span className="badge badge-blue">Quick Setup</span>
              <h2 className="section-title">
                Manual Installation Guide
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', marginTop: '8px' }}>
                Load the unpacked extension in Google Chrome in less than 60 seconds.
              </p>
            </div>
            
            <InstallSteps variant="page" />
          </div>
        </section>

        {/* 7. Frequently Asked Questions */}
        <FaqSection />

        {/* 8. Bottom Call to Action Section */}
        <section className="bottom-cta bottom-cta--drenched section-padding reveal-on-scroll">
          <div className="container text-center">
            <h2 className="bottom-cta-title">
              Ready to write 10x faster with complete privacy?
            </h2>
            <p className="bottom-cta-desc">
              Download the extension bundle now and start adjusting your writing tone inline on Gmail, Slack, and LinkedIn.
            </p>
            <DownloadButton className="btn btn-primary bottom-cta-btn">
              Download Extension — It&apos;s Free
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
                <Image 
                  src="/icons/icon128.png" 
                  alt="tonal Logo" 
                  width={24} 
                  height={24} 
                  style={{ borderRadius: 'var(--radius-xs)', marginRight: '4px' }} 
                />
                <span>tonal</span>
              </a>
              <p className="footer-tagline">Tone-aware writing, everywhere you type.</p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                Created by <a href="https://github.com/kwakhare5" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-blue)', textDecoration: 'none', fontWeight: 500 }}>Karan Wakhare</a>
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
              <h4>Security &amp; Privacy</h4>
              <ul className="footer-links">
                <li><a href="#security">Shadow DOM Isolation</a></li>
                <li><a href="#security">Worker Endpoint</a></li>
                <li><a href="https://github.com/kwakhare5/tonal/blob/main/CONTEXT.md" target="_blank" rel="noopener noreferrer">Security Context</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Stack &amp; Credits</h4>
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

      {/* Intersection Observer for smooth reveal animations */}
      <ScrollObserver />
    </>
  );
};

export default Home;
