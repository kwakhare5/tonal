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

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Lock background scroll
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  // Handle click on backdrop
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
              alt="tonal Logo" 
              width={24} 
              height={24} 
              className="modal-logo"
            />
            <h3 className="modal-title">Install tonal for Chrome</h3>
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

        {/* Scrollable Content */}
        <div className="modal-body">
          <p className="modal-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
            Since tonal is open-source and run locally, you can install it manually in less than a minute by following these steps:
          </p>
          <InstallSteps />
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-primary modal-action-btn" onClick={onClose}>
            Got it, I&apos;m ready!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
