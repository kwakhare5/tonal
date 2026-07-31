'use client';

import React, { useState } from 'react';

interface InstallStepsProps {
  variant?: 'page' | 'modal';
}

interface StepItem {
  num: string;
  title: string;
  desc: React.ReactNode;
  hasCopy?: boolean;
}

export const InstallSteps: React.FC<InstallStepsProps> = ({ variant = 'page' }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyChromeUrl = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText('chrome://extensions/');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps: StepItem[] = [
    {
      num: '01',
      title: 'Download Archive',
      desc: (
        <>
          Click download to save the latest release archive. The file <code className="install-code">tonal-extension.zip</code> will be saved to your computer.
        </>
      ),
    },
    {
      num: '02',
      title: 'Extract Files',
      desc: (
        <>
          Locate the downloaded ZIP file and extract it into a permanent folder (e.g., inside your Documents folder).
        </>
      ),
    },
    {
      num: '03',
      title: 'Open Extensions',
      hasCopy: true,
      desc: (
        <>
          Open Google Chrome and navigate to <code className="install-code">chrome://extensions/</code> in your address bar.
        </>
      ),
    },
    {
      num: '04',
      title: 'Developer Mode',
      desc: (
        <>
          Toggle the <strong>Developer mode</strong> switch in the top-right corner of the Chrome extensions page to <strong>ON</strong>.
        </>
      ),
    },
    {
      num: '05',
      title: 'Load Unpacked',
      desc: (
        <>
          Click the <strong>Load unpacked</strong> button in the top-left, select your extracted folder, and Tonal will instantly activate!
        </>
      ),
    },
  ];

  return (
    <div className={`install-steps-container install-steps-container--${variant}`}>
      <div className="install-steps-grid">
        {steps.map((step) => (
          <div key={step.num} className="install-step-card">
            <div className="install-step-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="install-step-num">{step.num}</span>
              {step.hasCopy && (
                <button type="button" onClick={handleCopyChromeUrl} className="modal-copy-btn">
                  {copied ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Copied!
                    </span>
                  ) : 'Copy Link'}
                </button>
              )}
            </div>
            <div className="install-step-body">
              <h3 className="install-step-title">{step.title}</h3>
              <p className="install-step-desc">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstallSteps;
