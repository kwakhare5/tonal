'use client';

declare global {
  interface Window {
    tonal: {
      TONES: Array<{ id: string; l: string; s: string }>;
      renderPill: (
        container: HTMLElement,
        state: PillState,
        toneId: ToneId,
        isPopoverOpen: boolean,
        callbacks: {
          onClick: () => void;
          onHover: (hovering: boolean) => void;
          onTogglePopover: () => void;
        }
      ) => void;
      createPopover: (
        activeId: string,
        onSelect: (toneId: string) => void,
        onClose: () => void,
        onMouseEnter: () => void,
        onMouseLeave: () => void
      ) => HTMLElement;
      showToast?: (root: HTMLElement, msg: string, type?: string) => void;
    };
  }
}

import React, { useState } from 'react';

type PillState = 'rest' | 'hover' | 'expanded' | 'loading' | 'done';
type ToneId = 'casual' | 'workChat' | 'formal';

const FALLBACKS: Record<ToneId, string> = {
  workChat: 'Hey team, please share the latest report as soon as possible. Thanks!',
  formal: 'Dear team,\n\nI hope this message finds you well. Could you please send over the latest report at your earliest convenience? Thank you in advance for your assistance.',
  casual: 'hey guys, can someone send over that report whenever you get a chance? thanks! 🙌'
};

const DRAFT_MESSAGES = [
  'hey need that report asap thx',
  'can you send the sales slides when free?',
  'following up on our quick meeting earlier'
];

export default function TonalMockup() {
  const [text, setText] = useState(DRAFT_MESSAGES[0]);
  const [pillState, setPillState] = useState<PillState>('rest');
  const [showPopover, setShowPopover] = useState(false);
  const [activeTone, setActiveTone] = useState<ToneId>('workChat');
  const [isTyping, setIsTyping] = useState(false);
  const [platform, setPlatform] = useState<'gmail' | 'slack' | 'linkedin'>('gmail');
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const [tonalLoaded, settonalLoaded] = useState(false);
  const pillRef = React.useRef<HTMLDivElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Auto-cycle draft messages every 5 seconds if user is idle
  React.useEffect(() => {
    if (isUserInteracting || isTyping || pillState === 'loading' || showPopover) return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % DRAFT_MESSAGES.length;
      setText(DRAFT_MESSAGES[index]);
      setPillState('rest');
    }, 5000);

    return () => clearInterval(interval);
  }, [isUserInteracting, isTyping, pillState, showPopover]);

  // Client-side load of tonal.js
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-expect-error - tonal.js is a plain JavaScript script file
      import('../extension_shared/tonal.js').then(() => {
        settonalLoaded(true);
      });
    }
  }, []);

  // Handle tone rewrite execution on user click
  const handleRewrite = React.useCallback(async (toneId: ToneId) => {
    setActiveTone(toneId);
    setShowPopover(false);
    setPillState('loading');

    const currentInputText = text.trim() || DRAFT_MESSAGES[0];
    let targetResult = FALLBACKS[toneId] || currentInputText;

    try {
      const response = await fetch('https://tonal-proxy.kwakhare5.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentInputText, toneLevel: toneId, mode: 'convert', platform })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.text) targetResult = data.text;
      }
    } catch (e) {
      console.warn('API connection offline, using client fallback', e);
    }

    // Typewriter reveal of rewritten text
    setIsTyping(true);
    setText('');
    for (let i = 0; i <= targetResult.length; i++) {
      setText(targetResult.slice(0, i));
      await new Promise(r => setTimeout(r, 14));
    }
    setIsTyping(false);
    setPillState('done');
    if (typeof window !== 'undefined' && window.tonal?.showToast) {
      window.tonal.showToast(document.body, `Rewritten to ${toneId}`, 'success');
    }
  }, [text, platform]);

  // Sync Pill Rendering
  React.useEffect(() => {
    const container = pillRef.current;
    if (!container || typeof window === 'undefined' || !window.tonal) return;

    container.innerHTML = '';
    const wrapper = document.createElement('div');
    container.appendChild(wrapper);

    window.tonal.renderPill(
      wrapper,
      pillState,
      activeTone,
      showPopover,
      {
        onClick: () => {
          if (pillState === 'rest' || pillState === 'hover') {
            setPillState('expanded');
          } else if (pillState === 'expanded') {
            setShowPopover(prev => !prev);
          } else if (pillState === 'done') {
            setText(DRAFT_MESSAGES[0]);
            setPillState('rest');
            if (window.tonal.showToast) {
              window.tonal.showToast(document.body, 'Reset to original', 'success');
            }
          }
        },
        onHover: (hovering: boolean) => {
          if (pillState === 'rest' && hovering) setPillState('hover');
          if (pillState === 'hover' && !hovering) setPillState('rest');
        },
        onTogglePopover: () => {
          setShowPopover(prev => !prev);
        }
      }
    );

    wrapper.style.position = 'relative';
    wrapper.style.right = '0';
    wrapper.style.bottom = '0';
    wrapper.style.padding = '0';
    wrapper.style.zIndex = '1';
  }, [pillState, activeTone, showPopover, platform, tonalLoaded]);

  // Sync Popover Rendering
  React.useEffect(() => {
    const container = popoverRef.current;
    if (!container || typeof window === 'undefined' || !window.tonal) return;

    container.innerHTML = '';
    if (showPopover) {
      const pop = window.tonal.createPopover(
        activeTone,
        (toneId: string) => {
          handleRewrite(toneId as ToneId);
        },
        () => {
          setShowPopover(false);
        },
        () => {},
        () => {}
      );
      container.appendChild(pop);
      pop.style.position = 'absolute';
      pop.style.bottom = 'calc(100% + 8px)';
      pop.style.right = '0';
    }
  }, [showPopover, activeTone, platform, tonalLoaded, text, handleRewrite]);

  return (
    <div className={`composer-mockup composer-mockup--${platform}`}>
      {/* Window Header */}
      <div className={`composer-header composer-header--${platform}`}>
        {/* macOS colored dots */}
        <div className="composer-dots" style={{ display: 'flex', gap: '6px', width: '42px' }}>
          <div className="composer-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F56' }}></div>
          <div className="composer-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }}></div>
          <div className="composer-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27C93F' }}></div>
        </div>

        {/* Center Segmented Toggle */}
        <div className={`segmented-control segmented-control--${platform}`}>
          <button
            type="button"
            className={`mockup-tab-btn ${platform === 'gmail' ? 'is-active' : ''}`}
            onClick={() => setPlatform('gmail')}
          >
            Gmail
          </button>
          <button
            type="button"
            className={`mockup-tab-btn ${platform === 'slack' ? 'is-active' : ''}`}
            onClick={() => setPlatform('slack')}
          >
            Slack
          </button>
          <button
            type="button"
            className={`mockup-tab-btn ${platform === 'linkedin' ? 'is-active' : ''}`}
            onClick={() => setPlatform('linkedin')}
          >
            LinkedIn
          </button>
        </div>

        {/* Balance Spacer */}
        <div style={{ width: '42px' }}></div>
      </div>

      {/* Platform content adapters */}
      {platform === 'gmail' && (
        <>
          <div className="composer-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
            <div className="composer-fields" style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '8px' }}>
              <div className="composer-field" style={{ display: 'flex', fontSize: '13px', alignItems: 'center', gap: '8px' }}>
                <span className="composer-field-label" style={{ color: 'var(--color-text-muted)', width: '48px', flexShrink: 0 }}>To</span>
                <span className="composer-field-value" style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>team-leads@company.com</span>
              </div>
              <div className="composer-field" style={{ display: 'flex', fontSize: '13px', alignItems: 'center', gap: '8px' }}>
                <span className="composer-field-label" style={{ color: 'var(--color-text-muted)', width: '48px', flexShrink: 0 }}>Subject</span>
                <span className="composer-field-value" style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Status Report Updates</span>
              </div>
            </div>
            
            <div className="composer-textarea-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', marginTop: '12px' }}>
              <textarea
                className="composer-textarea"
                style={{ width: '100%', border: 'none', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--color-text-primary)', lineHeight: 1.5, resize: 'none', background: 'transparent', flexGrow: 1, minHeight: '120px' }}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setIsUserInteracting(true);
                }}
                onFocus={() => setIsUserInteracting(true)}
                placeholder="Type your message..."
                disabled={isTyping || pillState === 'loading'}
              />

              {/* Floating Pill and Popover Wrapper */}
              <div className="mock-pill-anchor" style={{ position: 'absolute', right: '0', bottom: '0' }}>
                <div style={{ position: 'relative' }}>
                  <div ref={popoverRef} />
                  <div ref={pillRef} />
                </div>
              </div>
            </div>
          </div>

          {/* Gmail Footer */}
          <div className="composer-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--gray-9)' }}>
            <button type="button" className="composer-send-btn" style={{ background: '#1a73e8', color: 'var(--white)', border: 'none', borderRadius: '4px', padding: '8px 16px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              Send Message
            </button>
            <div className="composer-tools" style={{ display: 'flex', gap: '16px', alignItems: 'center', color: 'var(--gray-4)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            </div>
          </div>
        </>
      )}

      {platform === 'slack' && (
        <>
          <div className="composer-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', background: 'var(--white)' }}>
            {/* Channel header info */}
            <div className="composer-fields" style={{ display: 'flex', paddingBottom: '8px', alignItems: 'center', gap: '8px' }}>
              <span className="composer-field-value" style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '14px' }}># marketing-team</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>| Status updates & planning</span>
            </div>

            {/* Slack Editor rounded container */}
            <div className="composer-textarea-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', marginTop: '16px', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px', background: 'var(--white)' }}>
              <textarea
                className="composer-textarea"
                style={{ width: '100%', border: 'none', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--color-text-primary)', lineHeight: 1.4, resize: 'none', background: 'transparent', flexGrow: 1, minHeight: '100px', paddingBottom: '32px' }}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setIsUserInteracting(true);
                }}
                onFocus={() => setIsUserInteracting(true)}
                placeholder="Send a message to #marketing-team..."
                disabled={isTyping || pillState === 'loading'}
              />

              {/* Floating Pill inside Slack editor */}
              <div className="mock-pill-anchor" style={{ position: 'absolute', right: '10px', bottom: '48px' }}>
                <div style={{ position: 'relative' }}>
                  <div ref={popoverRef} />
                  <div ref={pillRef} />
                </div>
              </div>

              {/* Slack bottom toolbar inside editor */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', marginTop: '4px' }}>
                <div className="composer-tools" style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--gray-4)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/></svg>
                </div>
                {/* Green Slack Send button icon */}
                <button type="button" style={{ background: '#007a5a', color: 'white', border: 'none', borderRadius: '4px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {platform === 'linkedin' && (
        <>
          <div className="composer-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', background: 'var(--white)' }}>
            {/* InMail header */}
            <div className="composer-fields" style={{ display: 'flex', paddingBottom: '8px', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0A66C2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text-primary)' }}>Priya Mehta</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Product Manager at Acme Corp · 2nd</div>
              </div>
            </div>

            {/* InMail message box */}
            <div className="composer-textarea-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', marginTop: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px' }}>Message</div>
              <textarea
                className="composer-textarea"
                style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '6px', outline: 'none', padding: '10px 12px', fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--color-text-primary)', lineHeight: 1.5, resize: 'none', background: 'transparent', flexGrow: 1, minHeight: '120px' }}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setIsUserInteracting(true);
                }}
                onFocus={() => setIsUserInteracting(true)}
                placeholder="Write a message to Priya..."
                disabled={isTyping || pillState === 'loading'}
              />

              {/* Floating Pill */}
              <div className="mock-pill-anchor" style={{ position: 'absolute', right: '6px', bottom: '6px' }}>
                <div style={{ position: 'relative' }}>
                  <div ref={popoverRef} />
                  <div ref={pillRef} />
                </div>
              </div>
            </div>
          </div>

          {/* LinkedIn InMail Footer */}
          <div className="composer-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '10px 16px', background: 'var(--gray-9)', gap: '8px' }}>
            <button type="button" style={{ background: 'transparent', color: 'var(--gray-4)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Discard</button>
            <button type="button" style={{ background: '#0A66C2', color: 'white', border: 'none', borderRadius: '20px', padding: '6px 14px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}
