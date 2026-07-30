'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import InstallSteps from './InstallSteps';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstallGuideModal({ isOpen, onClose }: InstallGuideModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={handleBackdropClick} aria-modal="true" role="dialog">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <Image 
              src="/icons/icon128.png" 
              alt="Tonal Logo" 
              width={26} 
              height={26} 
              className="modal-logo"
            />
            <div>
              <h3 className="modal-title">Install Tonal for Chrome</h3>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Easy 60-second local setup</span>
            </div>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose} 
            aria-label="Close installation guide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Scrollable Content with 5-Card Bento Grid */}
        <div className="modal-body">
          <InstallSteps variant="modal" />
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ padding: '16px 28px', borderTop: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFCFF' }}>
          <a href="/tonal-extension.zip" download style={{ fontSize: '13px', color: 'var(--color-blue)', textDecoration: 'none', fontWeight: 500 }}>
            ↓ Re-download Zip Archive
          </a>
          <button className="btn btn-primary hero-cta-btn" onClick={onClose} style={{ height: '36px', padding: '6px 18px', fontSize: '13px' }}>
            Got it, I&apos;m ready!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
