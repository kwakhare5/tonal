'use client';

import React, { useState } from 'react';

type PillState = 'rest' | 'hover' | 'expanded' | 'loading' | 'done';
type ToneId = 'casual' | 'workChat' | 'formal';

interface ToneOption {
  id: ToneId;
  label: string;
  sub: string;
  fallback: string;
}

import { TONES as CONFIG_TONES } from '@tonal-core/config.cjs';

const FALLBACKS: Record<ToneId, string> = {
  workChat: 'Hey team, please share the latest report as soon as possible. Thanks!',
  formal: 'Dear team,\n\nI hope this message finds you well. Could you please send over the latest report at your earliest convenience? Thank you in advance for your assistance.',
  casual: 'hey guys, can someone send over that report whenever you get a chance? thanks! 🙌'
};

const TONES: ToneOption[] = (CONFIG_TONES as Array<{id: string, l: string, s: string}>).map(t => ({
  id: t.id as ToneId,
  label: t.l,
  sub: t.s,
  fallback: FALLBACKS[t.id as ToneId] || 'Converted text here.'
}));

const INITIAL_TEXT = 'hey need that report asap thx';

// Real SVGs from extension
const SVGS = {
  LOGO: (
    <svg width="13" height="8" viewBox="0 0 72 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="18" width="72" height="8" rx="4" fill="#2C2C2E" />
      <rect x="0" y="18" width="39" height="8" rx="4" fill="white" />
      <circle cx="39" cy="22" r="16" fill="#F2F2F2" />
      <circle cx="39" cy="22" r="14.5" fill="white" />
      <circle cx="39" cy="22" r="9" fill="#1C1C1E" />
      <circle cx="39" cy="22" r="4" fill="#3A3A3C" />
    </svg>
  ),
  CHEV: (
    <svg width="7" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1l3 3 3-3" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

interface MockTonalPillProps {
  pillState: PillState;
  setPillState: React.Dispatch<React.SetStateAction<PillState>>;
  showPopover: boolean;
  activeTone: ToneId;
  currentToneObj: ToneOption;
}

function MockTonalPill({
  pillState,
  setPillState,
  showPopover,
  activeTone,
  currentToneObj
}: MockTonalPillProps) {
  return (
    <>
      {/* Popover */}
      {showPopover && (
        <div className="popover-container" style={{ bottom: '34px' }}>
          <div className="popover popover--active" style={{ opacity: 1, pointerEvents: 'auto', transform: 'none' }}>
            {TONES.map((t, idx) => (
              <React.Fragment key={t.id}>
                <button
                  type="button"
                  className={`pop-item ${activeTone === t.id ? 'pop-item--active' : ''}`}
                  onClick={() => {}}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="pop-label">{t.label}</span>
                  </div>
                  {activeTone === t.id ? (
                    <span className="pop-check" style={{ color: 'white' }}>✓</span>
                  ) : (
                    <span className="pop-sub">{t.sub}</span>
                  )}
                </button>
                {idx < TONES.length - 1 && <div className="pop-divider" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Tonal Pill */}
      <div
        className="t-hitbox"
        style={{ position: 'relative', right: 0, bottom: 0, padding: 0 }}
        onMouseEnter={() => {
          if (pillState === 'rest') setPillState('hover');
        }}
        onMouseLeave={() => {
          if (pillState === 'hover') setPillState('rest');
        }}
        onClick={() => {}}
      >
        <div
          className={`t-pill t-pill--${pillState}`}
          style={{
            width: pillState === 'rest' || pillState === 'hover' ? '30px' : undefined,
            height: pillState === 'rest' || pillState === 'hover' ? '16px' : '24px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: pillState === 'done' ? 'var(--color-green)' : 'var(--black)',
          }}
        >
          {(pillState === 'rest' || pillState === 'hover' || pillState === 'expanded') && (
            <div className="pill-icon">{SVGS.LOGO}</div>
          )}
          {pillState === 'expanded' && (
            <>
              <span className="pill-text" style={{ marginLeft: '4px', marginRight: '4px', lineHeight: 1 }}>
                {currentToneObj.label}
              </span>
              <div
                className="pill-chev-wrap"
                style={{
                  transform: showPopover ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease',
                }}
              >
                {SVGS.CHEV}
              </div>
            </>
          )}
          {pillState === 'loading' && (
            <span className="pill-text pill-dots" style={{ padding: '0 8px' }}>Converting</span>
          )}
          {pillState === 'done' && (
            <span className="pill-text" style={{ padding: '0 8px' }}>Undo</span>
          )}
        </div>
      </div>
    </>
  );
}

export default function TonalMockup() {
  const [text, setText] = useState(INITIAL_TEXT);
  const [pillState, setPillState] = useState<PillState>('rest');
  const [showPopover, setShowPopover] = useState(false);
  const [activeTone, setActiveTone] = useState<ToneId>('workChat');
  const [isTyping, setIsTyping] = useState(false);
  const [platform, setPlatform] = useState<'gmail' | 'slack'>('gmail');
  // Motion Graphic Loop Effect
  React.useEffect(() => {
    let isCancelled = false;

    const runLoop = async () => {
      while (!isCancelled) {
        // State 0: Wait before starting
        await new Promise(r => setTimeout(r, 1000));
        if (isCancelled) return;

        // State 1: Reset everything
        setText('');
        setPillState('rest');
        setShowPopover(false);
        setActiveTone('workChat');
        
        await new Promise(r => setTimeout(r, 800));
        if (isCancelled) return;

        // State 2: Type out initial draft
        const draft = 'hey need that report asap thx';
        for (let i = 0; i <= draft.length; i++) {
          if (isCancelled) return;
          setText(draft.slice(0, i));
          await new Promise(r => setTimeout(r, 30));
        }

        await new Promise(r => setTimeout(r, 600));
        if (isCancelled) return;

        // State 3: Pill hover
        setPillState('hover');
        await new Promise(r => setTimeout(r, 400));
        if (isCancelled) return;

        // State 4: Pill expand
        setPillState('expanded');
        await new Promise(r => setTimeout(r, 600));
        if (isCancelled) return;

        // State 5: Show tone options
        setShowPopover(true);
        await new Promise(r => setTimeout(r, 800));
        if (isCancelled) return;

        // State 6: Select "Formal" tone
        const targetTone = 'formal';
        setActiveTone(targetTone);
        await new Promise(r => setTimeout(r, 300));
        if (isCancelled) return;

        // State 7: Trigger API call simulation
        setShowPopover(false);
        setPillState('loading');
        
        const matched = TONES.find(t => t.id === targetTone) || TONES[0];
        let targetResult = matched.fallback;

        try {
          // Cloudflare Worker backend
          const response = await fetch('https://tonal-proxy.kwakhare5.workers.dev/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: draft, toneLevel: targetTone, mode: 'convert', platform: platform })
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.text) targetResult = data.text;
          }
        } catch (e) {
          console.warn('API connection failed, falling back to scripted response', e);
        }

        if (isCancelled) return;

        // State 8: Typing animation for the result
        setIsTyping(true);
        setText('');
        for (let i = 0; i <= targetResult.length; i++) {
          if (isCancelled) return;
          setText(targetResult.slice(0, i));
          await new Promise(r => setTimeout(r, 15));
        }
        
        setIsTyping(false);
        setPillState('done');
        
        // State 9: Rest and admire the work
        await new Promise(r => setTimeout(r, 4000));
      }
    };

    runLoop();

    return () => {
      isCancelled = true;
    };
  }, [platform]);

  const currentToneObj = TONES.find(t => t.id === activeTone) || TONES[0];

  return (
    <div className="composer-mockup">
      {/* Window Header */}
      <div className="composer-header" style={{ padding: '10px 16px', background: 'var(--gray-9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-light)' }}>
        {/* macOS colored dots */}
        <div className="composer-dots" style={{ display: 'flex', gap: '6px', width: '42px' }}>
          <div className="composer-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F56' }}></div>
          <div className="composer-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }}></div>
          <div className="composer-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27C93F' }}></div>
        </div>

        {/* Center Toggle */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: 'var(--radius-full)', gap: '2px' }}>
          <button
            type="button"
            onClick={() => setPlatform('gmail')}
            style={{
              background: platform === 'gmail' ? 'var(--white)' : 'transparent',
              color: platform === 'gmail' ? 'var(--black)' : 'var(--gray-4)',
              boxShadow: platform === 'gmail' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              border: 'none'
            }}
          >
            Gmail
          </button>
          <button
            type="button"
            onClick={() => setPlatform('slack')}
            style={{
              background: platform === 'slack' ? 'var(--white)' : 'transparent',
              color: platform === 'slack' ? 'var(--black)' : 'var(--gray-4)',
              boxShadow: platform === 'slack' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              border: 'none'
            }}
          >
            Slack
          </button>
        </div>

        {/* Balance Spacer */}
        <div style={{ width: '42px' }}></div>
      </div>

      {/* Platform content adapters */}
      {platform === 'gmail' && (
        <>
          <div className="composer-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '340px', padding: '16px' }}>
            <div className="composer-fields" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '12px' }}>
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
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message..."
                disabled={isTyping || pillState === 'loading'}
              />

              {/* Floating Pill and Popover Wrapper */}
              <div className="mock-pill-anchor" style={{ position: 'absolute', right: '0', bottom: '0' }}>
                <MockTonalPill
                  pillState={pillState}
                  setPillState={setPillState}
                  showPopover={showPopover}
                  activeTone={activeTone}
                  currentToneObj={currentToneObj}
                />
              </div>
            </div>
          </div>

          {/* Gmail Footer */}
          <div className="composer-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--gray-9)', borderTop: '1px solid var(--color-border-light)' }}>
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
          <div className="composer-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '340px', padding: '16px', background: 'var(--white)' }}>
            {/* Channel header info */}
            <div className="composer-fields" style={{ display: 'flex', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '12px', alignItems: 'center', gap: '8px' }}>
              <span className="composer-field-value" style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: '14px' }}># marketing-team</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>| Status updates & planning</span>
            </div>

            {/* Slack Editor rounded container */}
            <div className="composer-textarea-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', marginTop: '16px', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px', background: 'var(--white)' }}>
              <textarea
                className="composer-textarea"
                style={{ width: '100%', border: 'none', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--color-text-primary)', lineHeight: 1.4, resize: 'none', background: 'transparent', flexGrow: 1, minHeight: '100px', paddingBottom: '32px' }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Send a message to #marketing-team..."
                disabled={isTyping || pillState === 'loading'}
              />

              {/* Floating Pill inside Slack editor */}
              <div className="mock-pill-anchor" style={{ position: 'absolute', right: '10px', bottom: '48px' }}>
                <MockTonalPill
                  pillState={pillState}
                  setPillState={setPillState}
                  showPopover={showPopover}
                  activeTone={activeTone}
                  currentToneObj={currentToneObj}
                />
              </div>

              {/* Slack bottom toolbar inside editor */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border-light)', paddingTop: '8px', marginTop: '4px' }}>
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
    </div>
  );
}
