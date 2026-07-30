'use client';

import React, { useState } from 'react';

export default function InstallSteps({ variant = 'page' }: { variant?: 'page' | 'modal' }) {
  const [copied, setCopied] = useState(false);

  const copyChromeUrl = () => {
    navigator.clipboard.writeText('chrome://extensions/');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
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
      <div className={`install-steps-grid ${variant === 'modal' ? 'install-steps-grid--modal' : 'install-steps-grid--bento'}`}>
        {steps.map((step) => (
          <div key={step.num} className={`install-step-card ${variant === 'modal' ? 'install-step-card--modal' : 'install-step-card--bento'}`}>
            <div className="install-step-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="install-step-num">{step.num}</span>
              {step.hasCopy && (
                <button onClick={copyChromeUrl} className="modal-copy-btn">
                  {copied ? '✓ Copied!' : 'Copy Link'}
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
}
