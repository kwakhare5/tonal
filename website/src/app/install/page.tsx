'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

export default function InstallPage() {
  const [copied, setCopied] = useState(false);

  const copyChromeUrl = () => {
    navigator.clipboard.writeText('chrome://extensions/');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />

      <main className="install-page-main">
        {/* Dynamic Ambient Sky Background Layer */}
        <div className="bg-ambient-layer">
          <div className="bg-ambient-clouds" />
          <div className="bg-ambient-grid" />
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
                <a 
                  href="/tonal-extension.zip" 
                  download 
                  className="btn btn-primary hero-cta-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download tonal-extension.zip
                </a>
              </div>
            </div>

            {/* 5-Card Bento Grid */}
            <div className="install-bento-grid">
              {/* Step 1 */}
              <div className="install-bento-card install-bento-card--featured">
                <div className="install-bento-header">
                  <span className="install-step-num">STEP 01</span>
                  <span className="badge-status badge-status--solution">Bundle</span>
                </div>
                <h3>1. Download tonal-extension.zip</h3>
                <p>
                  Click the download button above to save the latest release archive to your device.
                </p>
                <div style={{ marginTop: '16px' }}>
                  <a href="/tonal-extension.zip" download className="btn btn-secondary" style={{ height: '34px', fontSize: '12.5px' }}>
                    Save ZIP (~450 KB)
                  </a>
                </div>
              </div>

              {/* Step 2 */}
              <div className="install-bento-card">
                <div className="install-bento-header">
                  <span className="install-step-num">STEP 02</span>
                </div>
                <h3>2. Extract the Archive</h3>
                <p>
                  Locate the downloaded ZIP file and extract its contents into a permanent folder (e.g., inside your Documents folder).
                </p>
              </div>

              {/* Step 3 */}
              <div className="install-bento-card install-bento-card--highlight">
                <div className="install-bento-header">
                  <span className="install-step-num">STEP 03</span>
                  <span className="badge-status badge-status--solution">Chrome</span>
                </div>
                <h3>3. Open Chrome Extensions</h3>
                <p>
                  Open Google Chrome and navigate to <code className="install-code">chrome://extensions/</code> in your address bar.
                </p>
                <div style={{ marginTop: '16px' }}>
                  <button onClick={copyChromeUrl} className="btn btn-secondary" style={{ height: '34px', fontSize: '12.5px' }}>
                    {copied ? '✓ Copied to Clipboard!' : 'Copy chrome://extensions/'}
                  </button>
                </div>
              </div>

              {/* Step 4 */}
              <div className="install-bento-card">
                <div className="install-bento-header">
                  <span className="install-step-num">STEP 04</span>
                </div>
                <h3>4. Enable Developer Mode</h3>
                <p>
                  Toggle the <strong>Developer mode</strong> switch in the top-right corner of the Chrome extensions page to <strong>ON</strong>.
                </p>
              </div>

              {/* Step 5 */}
              <div className="install-bento-card install-bento-card--wide">
                <div className="install-bento-header">
                  <span className="install-step-num">STEP 05</span>
                  <span className="badge-status badge-status--solution">Ready</span>
                </div>
                <h3>5. Click Load Unpacked &amp; Select Folder</h3>
                <p>
                  Click the <strong>Load unpacked</strong> button in the top-left corner, select your extracted folder, and Tonal will instantly activate on Gmail, Slack, and LinkedIn!
                </p>
              </div>
            </div>

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
}
