'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import InstallSteps from './InstallSteps';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={handleBackdropClick} aria-modal="true" role="dialog">
      <div className="modal-container" aria-labelledby="modal-title" aria-describedby="modal-subtitle">
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
              <h3 id="modal-title" className="modal-title">Install Tonal for Chrome</h3>
              <span id="modal-subtitle" className="modal-subtitle">Easy 60-second local setup</span>
            </div>
          </div>
          <button 
            type="button"
            className="modal-close-btn" 
            onClick={onClose} 
            aria-label="Close installation guide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content with 5-Card Bento Grid */}
        <div className="modal-body">
          <InstallSteps variant="modal" />
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <a href="/tonal-extension.zip" download className="modal-download-link">
            ↓ Re-download Zip Archive
          </a>
          <button type="button" className="btn btn-primary hero-cta-btn" onClick={onClose}>
            Got it, I&apos;m ready!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default InstallGuideModal;
