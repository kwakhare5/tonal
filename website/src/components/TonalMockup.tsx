'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

type PillState = 'rest' | 'hover' | 'expanded' | 'loading' | 'done' | 'error';
type ToneId = 'casual' | 'workChat' | 'formal';

interface ToneItem {
  id: ToneId;
  l: string;
  s: string;
}

const TONES_DATA: ToneItem[] = [
  { id: 'casual', l: 'Casual', s: 'texting' },
  { id: 'workChat', l: 'Work Chat', s: 'natural' },
  { id: 'formal', l: 'Formal', s: 'professional' },
];

const JARGON_MAP: Record<string, string> = {
  'circle back offline': 'Talk about this later in private.',
  'circle back': 'Talk about this later.',
  'offline': 'not right now.',
  'bandwidth constraints': 'Currently at full capacity.',
  'bandwidth': 'capacity or time.',
  'moving the needle': 'making real progress.',
  'touch base': 'contact each other.',
  'synergy': 'working well together.',
  'deep dive': 'examine thoroughly.',
  'low-hanging fruit': 'easy initial targets.',
};

const FALLBACKS: Record<ToneId, string> = {
  workChat: 'Hey team, please share the latest report as soon as possible. Thanks!',
  formal: 'Dear team,\n\nI hope this message finds you well. Could you please send over the latest report at your earliest convenience? Thank you in advance for your assistance.',
  casual: 'hey guys, can someone send over that report whenever you get a chance? thx! 🙌'
};

const DRAFT_MESSAGES = [
  'Hey team, let us circle back offline to align on bandwidth constraints before moving the needle on Q4 targets.',
  'can someone check why the staging server is throwing 500 errors?',
  'Excited to announce our team launched Tonal on Chrome Store today!',
  'Quick follow-up regarding our meeting yesterday. Do you have 10 mins to touch base?'
];

export const TonalMockup: React.FC = () => {
  const [text, setText] = useState(DRAFT_MESSAGES[0]);
  const [originalText, setOriginalText] = useState(DRAFT_MESSAGES[0]);
  const [pillState, setPillState] = useState<PillState>('rest');
  const [showPopover, setShowPopover] = useState(false);
  const [activeTone, setActiveTone] = useState<ToneId>('workChat');
  const [isTyping, setIsTyping] = useState(false);
  const [platform, setPlatform] = useState<'gmail' | 'slack' | 'linkedin'>('gmail');
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Corporate Jargon Decoder States inside Sandbox
  const [selectedJargon, setSelectedJargon] = useState<string | null>(null);
  const [decodedText, setDecodedText] = useState<string | null>(null);
  const [showDecodeFloat, setShowDecodeFloat] = useState(false);
  const [showDecodeCard, setShowDecodeCard] = useState(false);
  const [copied, setCopied] = useState(false);

  const typingSessionRef = useRef<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle text selection in textarea — Decode button appears ONLY when user selects text
  const handleSelectText = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selection = text.substring(start, end).trim();

    if (selection.length > 2) {
      setIsUserInteracting(true);
      setSelectedJargon(selection);
      const match = JARGON_MAP[selection.toLowerCase()];
      setDecodedText(match || `"${selection}" — Plain English translation.`);
      setShowDecodeFloat(true);
    } else {
      setShowDecodeFloat(false);
      setShowDecodeCard(false);
    }
  };

  const handleOpenDecodeCard = () => {
    setShowDecodeCard(true);
  };

  const handleCopyDecodedText = () => {
    if (!decodedText) return;
    navigator.clipboard.writeText(decodedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle tone rewrite execution
  const handleRewrite = useCallback(async (toneId: ToneId) => {
    setActiveTone(toneId);
    setShowPopover(false);
    setPillState('loading');
    setIsUserInteracting(true);

    const currentSessionId = ++typingSessionRef.current;
    const currentInputText = text.trim() || DRAFT_MESSAGES[0];
    setOriginalText(currentInputText);
    let targetResult = FALLBACKS[toneId] || currentInputText;

    try {
      const response = await fetch('https://tonal-proxy.kwakhare5.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentInputText, toneLevel: toneId, mode: 'convert', platform })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.converted) {
          targetResult = data.converted;
        }
      }
    } catch {
      targetResult = FALLBACKS[toneId] || currentInputText;
    }

    if (currentSessionId !== typingSessionRef.current) return;

    setIsTyping(true);
    let currentIdx = 0;
    const chars = targetResult.split('');

    setText('');
    const typingInterval = setInterval(() => {
      if (currentSessionId !== typingSessionRef.current) {
        clearInterval(typingInterval);
        return;
      }

      if (currentIdx < chars.length) {
        const nextChar = chars[currentIdx];
        setText((prev) => prev + nextChar);
        currentIdx++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setPillState('done');
      }
    }, 18);
  }, [text, platform]);

  const handleUndo = () => {
    typingSessionRef.current++;
    setIsTyping(false);
    setText(originalText);
    setPillState('expanded');
    setToastMessage('Rewriting undone');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handlePlatformChange = (newPlatform: 'gmail' | 'slack' | 'linkedin') => {
    typingSessionRef.current++;
    setIsTyping(false);
    setPlatform(newPlatform);
    setIsUserInteracting(true);
    setPillState('rest');
    setShowPopover(false);
    setShowDecodeCard(false);
    setText(DRAFT_MESSAGES[0]);
    setOriginalText(DRAFT_MESSAGES[0]);
  };

  const handleSend = () => {
    setToastMessage('Text rewritten successfully');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentToneLabel = TONES_DATA.find(t => t.id === activeTone)?.l || 'Work Chat';

  return (
    <div className={`composer-mockup composer-mockup--${platform}`}>
      {/* Dynamic App Bar */}
      <div className={`composer-header composer-header--${platform}`}>
        <div className="composer-dots">
          <span className="composer-dot composer-dot--red" />
          <span className="composer-dot composer-dot--yellow" />
          <span className="composer-dot composer-dot--green" />
        </div>

        {/* Platform Title Indicator */}
        <div className="composer-app-title">
          {platform === 'gmail' && (
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#444746', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="18" height="14" viewBox="0 0 256 193">
                <path fill="#4285f4" d="M58.182 192.05V93.14L27.507 65.077L0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455z"/>
                <path fill="#34a853" d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837l-27.026 25.798z"/>
                <path fill="#ea4335" d="m58.182 93.14l-4.174-38.647l4.174-36.989L128 69.868l69.818-52.364l4.669 34.992l-4.669 40.644L128 145.504z"/>
                <path fill="#fbbc04" d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945z"/>
                <path fill="#c5221f" d="m0 49.504l26.759 20.07L58.182 93.14V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23z"/>
              </svg>
              New Message — Gmail
            </span>
          )}
          {platform === 'slack' && (
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#D1D2D3', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="15" height="15" viewBox="0 0 128 128">
                <path fill="#de1c59" d="M27.255 80.719c0 7.33-5.978 13.317-13.309 13.317S.63 88.049.63 80.719s5.987-13.317 13.317-13.317h13.309zm6.709 0c0-7.33 5.987-13.317 13.317-13.317s13.317 5.986 13.317 13.317v33.335c0 7.33-5.986 13.317-13.317 13.317c-7.33 0-13.317-5.987-13.317-13.317zm0 0"/>
                <path fill="#35c5f0" d="M47.281 27.255c-7.33 0-13.317-5.978-13.317-13.309S39.951.63 47.281.63s13.317 5.987 13.317 13.317v13.309zm0 6.709c7.33 0 13.317 5.987 13.317 13.317s-5.986 13.317-13.317 13.317H13.946C6.616 60.598.63 54.612.63 47.281c0-7.33 5.987-13.317 13.317-13.317zm0 0"/>
                <path fill="#2eb57d" d="M100.745 47.281c0-7.33 5.978-13.317 13.309-13.317s13.317 5.987 13.317 13.317s-5.987 13.317-13.317 13.317h-13.309zm-6.709 0c0 7.33-5.987 13.317-13.317 13.317s-13.317-5.986-13.317-13.317V13.946C67.402 6.616 73.388.63 80.719.63c7.33 0 13.317 5.987 13.317 13.317zm0 0"/>
                <path fill="#ebb02e" d="M80.719 100.745c7.33 0 13.317 5.978 13.317 13.309s-5.987 13.317-13.317 13.317s-13.317-5.987-13.317-13.317v-13.309zm0-6.709c-7.33 0-13.317-5.987-13.317-13.317s5.986-13.317 13.317-13.317h33.335c7.33 0 13.317 5.986 13.317 13.317c0 7.33-5.987 13.317-13.317 13.317zm0 0"/>
              </svg>
              # general — Slack
            </span>
          )}
          {platform === 'linkedin' && (
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="15" height="15" viewBox="0 0 256 256">
                <path fill="#0a66c2" d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4c-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.91 39.91 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186zM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009s9.851-22.014 22.008-22.016c12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97zM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"/>
              </svg>
              Create a post — LinkedIn
            </span>
          )}
        </div>

        {/* Minimalist Flat Platform Switcher Tabs */}
        <div className={`segmented-control segmented-control--${platform}`}>
          <button
            type="button"
            className={`mockup-tab-btn ${platform === 'gmail' ? 'is-active' : ''}`}
            onClick={() => handlePlatformChange('gmail')}
          >
            Gmail
          </button>
          <button
            type="button"
            className={`mockup-tab-btn ${platform === 'slack' ? 'is-active' : ''}`}
            onClick={() => handlePlatformChange('slack')}
          >
            Slack
          </button>
          <button
            type="button"
            className={`mockup-tab-btn ${platform === 'linkedin' ? 'is-active' : ''}`}
            onClick={() => handlePlatformChange('linkedin')}
          >
            LinkedIn
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className={`composer-body composer-body--${platform}`}>
        {platform === 'gmail' && (
          <div className="composer-fields">
            <div className="composer-field">
              <span className="composer-field-label">To:</span>
              <span className="composer-field-value">team@company.com</span>
            </div>
            <div className="composer-field">
              <span className="composer-field-label">Subject:</span>
              <span className="composer-field-value">Quick update regarding the report</span>
            </div>
          </div>
        )}

        {platform === 'linkedin' && (
          <div className="composer-linkedin-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0A66C2', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
              KW
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>Karan Wakhare</div>
              <div style={{ fontSize: '12px', color: '#666666' }}>Post to Anyone ▾</div>
            </div>
          </div>
        )}

        <div className="composer-textarea-box">
          {/* Floating Decode Button (ui-spec.html & tonal.js compliant) */}
          {showDecodeFloat && (
            <div
              className="decode-float decode-float--active"
              onClick={handleOpenDecodeCard}
              style={{ position: 'absolute', top: '8px', right: '12px', zIndex: 40, cursor: 'pointer' }}
            >
              <span>Decode</span>
            </div>
          )}

          <textarea
            ref={textareaRef}
            className="composer-textarea"
            value={text}
            onSelect={handleSelectText}
            onMouseUp={handleSelectText}
            onKeyUp={handleSelectText}
            onChange={(e) => {
              setIsUserInteracting(true);
              setText(e.target.value);
              if (pillState === 'done') setPillState('expanded');
            }}
            placeholder="Type your message or highlight text to decode..."
          />

          {/* Decode Result Card (ui-spec.html & tonal.js compliant) */}
          {showDecodeCard && (
            <div className="decode-card decode-card--active" style={{ position: 'absolute', top: '36px', right: '12px', zIndex: 300 }}>
              <div className="decode-card-header">
                <span className="decode-card-tag">Plain English</span>
                <div className="decode-card-close" onClick={() => setShowDecodeCard(false)}>
                  <svg width="8" height="8" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
              <div className="decode-card-body">
                <div className="decode-card-text">{decodedText}</div>
                <div
                  className={`decode-card-copy ${copied ? 'decode-card-copy--copied' : ''}`}
                  onClick={handleCopyDecodedText}
                >
                  {copied ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      Copy
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Toast Notification (ui-spec.html compliant) */}
          {toastMessage && (
            <div className="toast toast--active toast--success">
              <div className="toast-dot toast-dot--success" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Extension UI Spec Hitbox & Pill Anchor */}
          <div
            className="t-hitbox"
            style={{
              position: 'absolute',
              right: '0px',
              bottom: '0px',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}
            onMouseEnter={() => {
              if (pillState === 'rest') {
                setPillState('expanded');
              }
            }}
            onMouseLeave={() => {
              setShowPopover(false);
              if (pillState === 'expanded' || pillState === 'hover') {
                setPillState('rest');
              }
            }}
          >
            {/* Popover Menu (ui-spec.html & tonal.js compliant) */}
            {showPopover && (
              <div className="popover popover--active" style={{ position: 'relative', bottom: '6px', marginBottom: '4px' }}>
                {TONES_DATA.map((t, idx) => (
                  <React.Fragment key={t.id}>
                    <div
                      className={`pop-item ${activeTone === t.id ? 'pop-item--active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRewrite(t.id);
                        setShowPopover(false);
                      }}
                      role="option"
                      aria-selected={activeTone === t.id}
                    >
                      <span className="pop-label">{t.l}</span>
                      {activeTone === t.id ? (
                        <span className="pop-check">✓</span>
                      ) : (
                        <span className="pop-sub">{t.s}</span>
                      )}
                    </div>
                    {idx < TONES_DATA.length - 1 && <div className="pop-divider" />}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Pill Element (ui-spec.html & tonal.js compliant) */}
            <div
              className={`t-pill t-pill--${pillState} ${showPopover ? 't-pill--popover-open' : ''}`}
              onClick={() => {
                setIsUserInteracting(true);
                if (pillState === 'rest') {
                  setPillState('expanded');
                } else if (pillState === 'done') {
                  handleUndo();
                } else if (pillState === 'expanded') {
                  setShowPopover((prev) => !prev);
                } else if (pillState !== 'loading') {
                  handleRewrite(activeTone);
                }
              }}
            >
              {pillState === 'rest' || pillState === 'hover' ? (
                <div className="pill-icon">
                  <div className="pill-logo" />
                </div>
              ) : pillState === 'loading' ? (
                <span className="pill-text">Converting<span className="pill-dots" /></span>
              ) : pillState === 'done' ? (
                <span className="pill-text">Undo</span>
              ) : (
                <>
                  <div className="pill-icon">
                    <div className="pill-logo" />
                  </div>
                  <span className="pill-text">{currentToneLabel}</span>
                  <div
                    className="pill-chev-wrap"
                    style={{ transform: showPopover ? 'rotate(180deg)' : 'none' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserInteracting(true);
                      setShowPopover((prev) => !prev);
                    }}
                  >
                    <svg width="7" height="5" viewBox="0 0 8 5" fill="none">
                      <path d="M1 1l3 3 3-3" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* App Footer Actions */}
      <div className={`composer-footer composer-footer--${platform}`}>
        <div className="composer-tools">
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0066FF' }}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Click tone pill to rewrite &bull; Select corporate text to decode
          </span>
        </div>

        {platform === 'gmail' && (
          <button type="button" className="composer-send-gmail" onClick={handleSend}>Send</button>
        )}
        {platform === 'slack' && (
          <button type="button" className="composer-send-slack" onClick={handleSend} aria-label="Send Slack message">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        )}
        {platform === 'linkedin' && (
          <button type="button" className="composer-send-linkedin" onClick={handleSend}>Post</button>
        )}
      </div>
    </div>
  );
};

export default TonalMockup;
