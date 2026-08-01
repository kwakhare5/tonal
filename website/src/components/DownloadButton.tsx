'use client';

import React, { useState } from 'react';
import InstallGuideModal from './InstallGuideModal';

interface DownloadButtonProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  variant?: 'control' | 'value_focused';
  onClick?: () => void;
}

interface WindowWithGtag extends Window {
  gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  className, 
  children, 
  style,
  variant = 'control',
  onClick 
}) => {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  const handleClick = () => {
    // A/B Experiment tracking dispatch
    if (typeof window !== 'undefined') {
      const win = window as WindowWithGtag;
      if (typeof win.gtag === 'function') {
        win.gtag('event', 'install_click', {
          event_category: 'engagement',
          event_label: variant,
        });
      }
    }
    setIsInstallModalOpen(true);
    onClick?.();
  };

  return (
    <>
      <a 
        href="/tonal-extension.zip" 
        download 
        onClick={handleClick}
        className={className} 
        style={style}
        data-experiment-variant={variant}
      >
        {variant === 'value_focused' && typeof children === 'string'
          ? "Transform Your Tone In 1-Click — Add Free Extension"
          : children}
      </a>
      <InstallGuideModal 
        isOpen={isInstallModalOpen} 
        onClose={() => setIsInstallModalOpen(false)} 
      />
    </>
  );
};

export default DownloadButton;
