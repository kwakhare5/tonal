'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import InstallSteps from '../../components/InstallSteps';
import DownloadButton from '../../components/DownloadButton';

export const InstallPage: React.FC = () => {
  return (
    <>
      <Navbar />

      <main className="install-page-main">
        {/* Dynamic Ambient Sky Background Layer */}
        <div className="bg-ambient-layer">
          <div className="bg-animated-dots" />
        </div>

        <section className="section-padding">
          <div className="container">
            {/* Header */}
            <div className="section-header" style={{ maxWidth: '720px' }}>
              <span className="badge badge-blue">
                Easy Setup · 60 Seconds
              </span>
              <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '16px' }}>
                How to Install Tonal
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
                Tonal runs 100% locally in your browser for absolute privacy. Follow these 5 quick steps to load the Chrome extension.
              </p>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <DownloadButton className="btn btn-primary hero-cta-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download tonal-extension.zip
                </DownloadButton>
              </div>
            </div>

            {/* Reusable InstallSteps Component */}
            <InstallSteps variant="page" />

            {/* Back Home CTA */}
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link href="/" className="btn btn-secondary">
                ← Back to Landing Page
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default InstallPage;
