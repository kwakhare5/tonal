'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import DownloadButton from './DownloadButton';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      if (window.scrollY > 100 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${mobileMenuOpen ? 'navbar--open' : ''}`}>
        <div className="container navbar-container" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <a href="#" className="logo" onClick={handleNavLinkClick}>
            <Image src="/icons/icon128.png" alt="tonal Logo" width={20} height={20} style={{ borderRadius: 'var(--radius-xs)', marginRight: 'var(--space-1)' }} />
            <span>tonal</span>
          </a>

          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#install">Install</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>

          <div className="nav-actions">
            <DownloadButton className="btn btn-primary nav-cta-btn" style={{ height: '32px', minHeight: '32px', padding: '4px 14px', fontSize: '12px', fontWeight: 600 }}>
              Download
            </DownloadButton>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              className="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown Panel */}
      <div className={`nav-mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}>
        <ul className="nav-mobile-list">
          <li><a href="#features" onClick={handleNavLinkClick}>Features</a></li>
          <li><a href="#security" onClick={handleNavLinkClick}>Security</a></li>
          <li><a href="#install" onClick={handleNavLinkClick}>Install Guide</a></li>
          <li><a href="#faq" onClick={handleNavLinkClick}>FAQ</a></li>
          <li>
            <a 
              href="https://github.com/kwakhare5/tonal" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleNavLinkClick}
              className="nav-mobile-github-btn"
            >
              <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>View Source on GitHub</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div className="nav-mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
