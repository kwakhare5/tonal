'use client';
import React, { useState } from 'react';
import InstallGuideModal from './InstallGuideModal';

export default function DownloadButton({ 
  className, 
  children, 
  style 
}: { 
  className?: string; 
  children: React.ReactNode; 
  style?: React.CSSProperties;
}) {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  return (
    <>
      <a 
        href="/tonal-extension.zip" 
        download 
        onClick={() => setIsInstallModalOpen(true)}
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
}
