'use client';

import React from 'react';

export default function InstallSteps() {
  const steps = [
    {
      num: 1,
      title: 'Download Bundle',
      desc: (
        <>
          Click download to save the latest release. The file <code className="install-code">tonal-extension.zip</code> will be saved to your device.
        </>
      ),
    },
    {
      num: 2,
      title: 'Extract Files',
      desc: (
        <>
          Locate the ZIP archive and extract/unzip it into a permanent folder on your drive (e.g., in your Documents folder).
        </>
      ),
    },
    {
      num: 3,
      title: 'Open Extensions',
      desc: (
        <>
          Open a new tab in Google Chrome and type <code className="install-code">chrome://extensions/</code> in the address bar.
        </>
      ),
    },
    {
      num: 4,
      title: 'Developer Mode',
      desc: (
        <>
          Locate the <strong>Developer mode</strong> toggle switch in the top-right corner of the dashboard, and toggle it <strong>ON</strong>.
        </>
      ),
    },
    {
      num: 5,
      title: 'Load Unpacked',
      desc: (
        <>
          Click the <strong>Load unpacked</strong> button in the top-left, select the folder where you extracted the files, and click OK.
        </>
      ),
    },
  ];

  return (
    <div className="install-steps-container">
      <div className="install-steps-grid">
        {steps.map((step) => (
          <div key={step.num} className="install-step-card reveal-on-scroll">
            <div className="install-step-header">
              <span className="install-step-number">0{step.num}</span>
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
