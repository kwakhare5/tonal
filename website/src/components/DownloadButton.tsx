'use client';

import React, { useState } from 'react';
import InstallGuideModal from './InstallGuideModal';

interface DownloadButtonProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  className, 
  children, 
  style,
  onClick 
}) => {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  return (
    <>
      <a 
        href="/tonal-extension.zip" 
        download 
        onClick={() => {
          setIsInstallModalOpen(true);
          onClick?.();
        }}
        className={className} 
        style={style}
      >
        {children}
      </a>
      <InstallGuideModal 
        isOpen={isInstallModalOpen} 
        onClose={() => setIsInstallModalOpen(false)} 
      />
    </>
  );
};

export default DownloadButton;
