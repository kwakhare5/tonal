import React from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import TonalMockup from '../components/TonalMockup';
import InstallSteps from '../components/InstallSteps';
import FaqSection from '../components/FaqSection';
import DownloadButton from '../components/DownloadButton';
import ScrollObserver from '../components/ScrollObserver';
import { ArchitectureSection } from '../components/ArchitectureSection';

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
                Inline for Gmail, Slack &amp; LinkedIn
              </div>

              <h1 className="hero-title">
                Adjust your tone<br />
                <span className="text-highlight">without breaking focus</span>.
              </h1>

              <p className="hero-description">
                Rewrite text directly inside{' '}
                <span className="platform-hover-text platform-hover-text--gmail">
                  <span className="platform-hover-icon">
                    <svg width="16" height="12" viewBox="0 0 256 193">
                      <path fill="#4285f4" d="M58.182 192.05V93.14L27.507 65.077L0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455z"/>
                      <path fill="#34a853" d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837l-27.026 25.798z"/>
                      <path fill="#ea4335" d="m58.182 93.14l-4.174-38.647l4.174-36.989L128 69.868l69.818-52.364l4.669 34.992l-4.669 40.644L128 145.504z"/>
                      <path fill="#fbbc04" d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945z"/>
                      <path fill="#c5221f" d="m0 49.504l26.759 20.07L58.182 93.14V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23z"/>
                    </svg>
                  </span>
                  Gmail
                </span>,{' '}
                <span className="platform-hover-text platform-hover-text--slack">
                  <span className="platform-hover-icon">
                    <svg width="14" height="14" viewBox="0 0 128 128">
                      <path fill="#de1c59" d="M27.255 80.719c0 7.33-5.978 13.317-13.309 13.317S.63 88.049.63 80.719s5.987-13.317 13.317-13.317h13.309zm6.709 0c0-7.33 5.987-13.317 13.317-13.317s13.317 5.986 13.317 13.317v33.335c0 7.33-5.986 13.317-13.317 13.317c-7.33 0-13.317-5.987-13.317-13.317zm0 0"/>
                      <path fill="#35c5f0" d="M47.281 27.255c-7.33 0-13.317-5.978-13.317-13.309S39.951.63 47.281.63s13.317 5.987 13.317 13.317v13.309zm0 6.709c7.33 0 13.317 5.987 13.317 13.317s-5.986 13.317-13.317 13.317H13.946C6.616 60.598.63 54.612.63 47.281c0-7.33 5.987-13.317 13.317-13.317zm0 0"/>
                      <path fill="#2eb57d" d="M100.745 47.281c0-7.33 5.978-13.317 13.309-13.317s13.317 5.987 13.317 13.317s-5.987 13.317-13.317 13.317h-13.309zm-6.709 0c0 7.33-5.987 13.317-13.317 13.317s-13.317-5.986-13.317-13.317V13.946C67.402 6.616 73.388.63 80.719.63c7.33 0 13.317 5.987 13.317 13.317zm0 0"/>
                      <path fill="#ebb02e" d="M80.719 100.745c7.33 0 13.317 5.978 13.317 13.309s-5.987 13.317-13.317 13.317s-13.317-5.987-13.317-13.317v-13.309zm0-6.709c-7.33 0-13.317-5.987-13.317-13.317s5.986-13.317 13.317-13.317h33.335c7.33 0 13.317 5.986 13.317 13.317c0 7.33-5.987 13.317-13.317 13.317zm0 0"/>
                    </svg>
                  </span>
                  Slack
                </span>, and{' '}
                <span className="platform-hover-text platform-hover-text--linkedin">
                  <span className="platform-hover-icon">
                    <svg width="14" height="14" viewBox="0 0 256 256">
                      <path fill="#0a66c2" d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4c-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.91 39.91 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186zM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009s9.851-22.014 22.008-22.016c12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97zM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"/>
                    </svg>
                  </span>
                  LinkedIn
                </span>{' '}
                in one click.
              </p>
            </div>

            {/* Interactive Mockup Frame */}
            <div className="hero-mockup-container">
              <TonalMockup />
            </div>
          </div>
        </section>

        {/* 3. Problem vs Solution Section ("Flow-State Writing") */}
        <section className="comparison-section section-padding reveal-on-scroll" id="features">
          <div className="container">
            <div className="section-header">
              <span className="badge badge-blue">Flow-State Writing</span>
              <h2 className="section-title">
                Stop wasting time switching tabs for simple rewrites
              </h2>
            </div>
            
            <div className="comp-grid">
              {/* Problem Column */}
              <div className="comp-col-unboxed">
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  Traditional AI Tools
                  <span className="badge-status badge-status--problem">High Friction</span>
                </h3>
                <ul className="comp-list">
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--cross">✕</span>
                    <span>Breaks momentum with 7-step tab switching and context loss</span>
                  </li>
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--cross">✕</span>
                    <span>Destroys focus every time a quick email needs professional polish</span>
                  </li>
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--cross">✕</span>
                    <span>Generates robotic AI fluff that demands heavy manual cleanup</span>
                  </li>
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--cross">✕</span>
                    <span>Exposes confidential drafts and credentials to external web apps</span>
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
                    <span>One-click floating tone pill embedded inside your active input</span>
                  </li>
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--check">✓</span>
                    <span>Zero context breaks—rewrites execute in-place under 500ms</span>
                  </li>
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--check">✓</span>
                    <span>Retains original formatting, line breaks, and list structures natively</span>
                  </li>
                  <li className="comp-item">
                    <span className="comp-icon comp-icon--check">✓</span>
                    <span>Instant shortcut (Ctrl+Shift+T) keeps your hands on the keys</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Sub-Second Engine & Architecture Section */}
        <ArchitectureSection />

        {/* 7. Manual Installation Section */}
        <section className="installation-section section-padding reveal-on-scroll" id="install">
          <div className="container">
            <div className="section-header">
              <span className="badge badge-blue">60-Second Install</span>
              <h2 className="section-title">
                Install in 5 simple steps
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', marginTop: '8px' }}>
                No Web Store delay needed. Load unpacked in Google Chrome in less than a minute.
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
              Upgrade your daily writing flow today
            </h2>
            <p className="bottom-cta-desc">
              Get the free extension bundle and start rewriting text inline across all your favorite web apps.
            </p>
            <DownloadButton className="btn btn-primary bottom-cta-btn">
              Download Extension — Free Forever
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
              <p className="footer-tagline">Inline tone-aware AI writing for modern web apps.</p>
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
                <li><a href="#install">Local Heuristic Fallback</a></li>
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
