/**
 * Tonal Design System
 * Tokens, Icons, and Components
 */

window.Tonal = (function () {
  const SVGS = {
    LOGO: `<svg width="13" height="8" viewBox="0 0 72 44" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="18" width="72" height="8" rx="4" fill="#2C2C2E"/><rect x="0" y="18" width="39" height="8" rx="4" fill="white"/><circle cx="39" cy="22" r="16" fill="#F2F2F2"/><circle cx="39" cy="22" r="14.5" fill="white"/><circle cx="39" cy="22" r="9" fill="#1C1C1E"/><circle cx="39" cy="22" r="4" fill="#3A3A3C"/></svg>`,
    CHEV: `<svg width="7" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l3 3 3-3" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    CLOSE: `<svg width="8" height="8" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    COPY: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
    CHECK: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>`
  };

  const CSS = `
    :host {
      all: initial;
      display: block !important;
      position: absolute;
      top: 0; left: 0; width: 0; height: 0;
      z-index: 2147483647;
      pointer-events: none;

      
      /* ── TOKENS ────────────────────────────────────────────────── */
      --black:    #0F0F0F;
      --gray-1:   #1C1C1E;
      --gray-2:   #2C2C2E;
      --gray-3:   #3A3A3C;
      --gray-4:   #636366;
      --gray-5:   #AEAEB2;
      --gray-6:   #D1D1D6;
      --gray-7:   #E5E5EA;
      --gray-8:   #F2F2F7;
      --gray-9:   #F5F5F7;
      --white:    #FFFFFF;
      --green:    #34C759;
      --red:      #FF3B30;
      --orange:   #FF9F0A;

      --font: 'Geist', 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --mono: 'Geist Mono', 'DM Mono', 'SF Mono', ui-monospace, monospace;

      --r-sm:  6px;
      --r-md:  10px;
      --r-lg:  14px;
      --r-pill:100px;

      --sh-xs: 0 1px 2px rgba(0, 0, 0, .06);
      --sh-sm: 0 1px 4px rgba(0, 0, 0, .06), 0 4px 12px rgba(0, 0, 0, .06);
      --sh-md: 0 2px 8px rgba(0, 0, 0, .06), 0 12px 32px rgba(0, 0, 0, .08);
      --sh-lg: 0 8px 24px rgba(0, 0, 0, .1), 0 24px 64px rgba(0, 0, 0, .12);

      --ease-out:    cubic-bezier(0.2, 0, 0, 1);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
      --spring: var(--ease-spring);

      -webkit-font-smoothing: antialiased;
      font-family: var(--font);
      color: var(--black);
      font-size: 14px !important;
      line-height: 1.5 !important;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; border: none; font-family: inherit; line-height: inherit; outline: none; }
    
    :focus-visible { outline: 2px solid var(--gray-5) !important; outline-offset: 2px; }

    /* ── HITBOX ─────────────────────────────────────────────────── */
    .t-hitbox {
      position: absolute; right: -12px; bottom: -12px;
      padding: 12px; pointer-events: auto; cursor: pointer;
      display: flex; align-items: flex-end; justify-content: flex-end;
      z-index: 100;
    }

    .t-pill {
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--black); border-radius: var(--r-pill); cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,.16);
      transition: transform 0.15s var(--ease-out), background 0.15s, box-shadow 0.15s, width 0.2s var(--spring), height 0.2s var(--spring);
      pointer-events: none; overflow: hidden;
    }
    .t-pill--rest     { width: 30px; height: 16px; }
    .t-hitbox:hover .t-pill--rest { transform: scale(1.08); box-shadow: 0 2px 8px rgba(0,0,0,.2); }
    
    .t-pill--expanded { height: 24px; padding: 0 9px; gap: 5px; }
    .t-pill--loading  { height: 24px; padding: 0 9px; opacity: .55; }
    .t-pill--done     { height: 24px; padding: 0 10px; background: var(--green); box-shadow: 0 1px 4px rgba(52,199,89,.35); }
    .t-pill--error    { height: 24px; padding: 0 9px; background: var(--red); }

    .pill-icon { display: flex; align-items: center; justify-content: center; }
    .pill-icon svg { display: block; }
    .pill-text { font-size: 10px; font-weight: 700; color: var(--white); letter-spacing: 0.01em; white-space: nowrap; font-family: var(--font); line-height: 1; }
    
    .pill-dots::after { content: ''; display: inline-block; animation: dots 1.2s steps(4) infinite; }
    @keyframes dots { 0% { content: ''; } 25% { content: '.'; } 50% { content: '..'; } 75% { content: '...'; } }

    .pill-chev-wrap { 
      display: flex; align-items: center; justify-content: center; 
      width: 14px; height: 24px; transition: transform 0.15s var(--spring); 
      cursor: pointer; pointer-events: auto; position: relative;
    }
    .pill-chev-wrap::after { content: ''; position: absolute; top: 0; bottom: 0; left: -5px; right: -9px; z-index: 1; }

    /* ── POPOVER ────────────────────────────────────────────────── */
    .popover {
      position: absolute; bottom: calc(100% + 8px); right: 0;
      width: 192px; background: var(--white);
      border-radius: var(--r-lg); border: 1px solid var(--gray-7);
      box-shadow: var(--sh-lg); overflow: hidden;
      opacity: 0; transform: translateY(12px) scale(0.95);
      transition: all 0.2s var(--spring); pointer-events: none;
      display: flex; flex-direction: column; z-index: 1000;
      transform-origin: bottom right;
    }
    .popover--active { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
    .pop-item { display: flex; align-items: center; justify-content: space-between; padding: 11px 15px; cursor: pointer; transition: background .08s; width: 100%; }
    .pop-item:not(.pop-item--active):hover { background: var(--gray-9); }
    .pop-item--active { background: var(--black); cursor: default; }
    .pop-label { font-size: 13px; font-weight: 500; color: var(--black); }
    .pop-item--active .pop-label, .pop-item--active .pop-sub, .pop-item--active .pop-check { color: var(--white); }
    .pop-sub   { font-size: 10px; color: var(--gray-5); }
    .pop-check { font-size: 11px; color: var(--black); font-weight: 600; }
    .pop-divider { height: 1px; background: var(--gray-8); }

    /* ── DECODE FLOW ────────────────────────────────────────────── */
    .decode-float {
      position: absolute; display: inline-flex; align-items: center; justify-content: center;
      background: var(--black); color: var(--white);
      border-radius: var(--r-pill); padding: 6px 13px;
      font-size: 11px; font-weight: 600; cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,.18); letter-spacing: .01em;
      pointer-events: auto; opacity: 0; transform: scale(0.8) translateY(10px);
      transition: all 0.2s var(--spring), width 0.2s var(--spring); z-index: 2147483647;
      min-width: 68px;
    }
    .decode-float--active { opacity: 1; transform: scale(1) translateY(0); }

    .decode-card {
      position: absolute; width: 288px; background: var(--white);
      border-radius: var(--r-lg); border: 1px solid var(--gray-7);
      box-shadow: var(--sh-lg); overflow: hidden; pointer-events: auto;
      max-height: 420px; display: flex; flex-direction: column;
      opacity: 0; transform: translateY(20px);
      transition: all 0.2s var(--spring); z-index: 2147483647;
    }
    .decode-card--active { opacity: 1; transform: translateY(0); }
    
    .decode-card-header { padding: 11px 14px; border-bottom: 1px solid var(--gray-8); display: flex; align-items: center; justify-content: space-between; }
    .decode-card-tag { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--gray-4); }
    .decode-card-close { width: 18px; height: 18px; background: var(--gray-8); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--gray-4); cursor: pointer; }
    
    .decode-card-body { padding: 14px; overflow-y: auto; flex: 1; }
    .decode-card-text { font-size: 14px; color: var(--black); line-height: 1.55; margin-bottom: 14px; overflow-wrap: anywhere; }
    
    .decode-card-copy {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      background: var(--gray-9); border: 1px solid var(--gray-7); border-radius: var(--r-sm);
      padding: 6px 12px; font-size: 12px; font-weight: 500; color: var(--black);
      cursor: pointer; transition: all .15s ease;
    }
    .decode-card-copy:hover { background: var(--gray-8); border-color: var(--gray-6); }
    .decode-card-copy--copied { background: var(--green) !important; border-color: var(--green) !important; color: var(--white) !important; }

    /* ── TOAST ──────────────────────────────────────────────────── */
    .toast {
      position: fixed; left: 50%; bottom: 32px; transform: translateX(-50%) translateY(24px);
      display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px;
      border-radius: var(--r-pill); font-size: 12px; font-weight: 600;
      background: var(--black); box-shadow: 0 2px 12px rgba(0,0,0,.15); white-space: nowrap;
      opacity: 0; pointer-events: none; transition: transform 0.2s var(--spring), opacity 0.2s var(--spring); 
      z-index: 2147483647;
    }
    .toast--active { opacity: 1; transform: translateX(-50%) translateY(0); }
    .toast--exit { opacity: 0; transform: translateX(-50%) translateY(-12px); transition: all 0.3s ease; }
    
    .toast--success { color: var(--green); }
    .toast--error   { color: var(--red); }
    .toast--warn    { color: var(--orange); }
    .toast--info    { color: #FFFFFF; }

    .toast-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .toast-dot--success { background: var(--green); }
    .toast-dot--error   { background: var(--red); }
    .toast-dot--warn    { background: var(--orange); }
    .toast-dot--info    { background: #FFFFFF; }
  `;

  const TONES = [
    { id: 'casual', l: 'Casual', s: 'texting' },
    { id: 'workChat', l: 'Work Chat', s: 'natural' },
    { id: 'formal', l: 'Formal', s: 'professional' }
  ];

  function h(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'className') el.className = v;
      else if (k === 'textContent') el.textContent = v;
      else if (k === 'innerHTML') el.innerHTML = v;
      else if (k === 'style') el.style.cssText = v;
      else if (k.startsWith('on')) el.addEventListener(k.toLowerCase().substring(2), v);
      else el.setAttribute(k, v);
    });
    children.forEach(c => c && el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return el;
  }

  return {
    TONES, h, CSS,
    injectStyles: (root) => {
      const style = document.createElement('style');
      style.textContent = CSS;
      root.appendChild(style);
    },
    injectFonts: () => {
      if (document.getElementById('tonal-fonts')) return;
      const link = h('link', { id: 'tonal-fonts', rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap' });
      const geist = h('link', { id: 'tonal-geist', rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/geist@latest/dist/fonts/geist-sans/style.css' });
      const geistMono = h('link', { id: 'tonal-geist-mono', rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/geist@latest/dist/fonts/geist-mono/style.css' });
      document.head.appendChild(link);
      document.head.appendChild(geist);
      document.head.appendChild(geistMono);
    },
    renderPill: (container, state, toneId, isPopoverOpen, callbacks) => {
      const tone = TONES.find(t => t.id === toneId) || TONES[1];
      if (!container.dataset.tonalInited) {
        container.className = 't-hitbox';
        container.setAttribute('role', 'button');
        container.setAttribute('aria-label', 'Tonal AI Tone Selector');
        container.setAttribute('tabindex', '0');
        
        const pill = h('div', { className: 't-pill' });
        container.appendChild(pill);
        
        container.onclick = (e) => { if (!e.target.closest('.pill-chev-wrap')) callbacks.onClick(); };
        container.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); callbacks.onClick(); } };
        container.onmouseenter = () => callbacks.onHover(true);
        container.onmouseleave = () => callbacks.onHover(false);
        container.dataset.tonalInited = "true";
      }
      const pill = container.querySelector('.t-pill');
      if (!pill) return;
      
      pill.className = `t-pill t-pill--${state} ${isPopoverOpen ? 't-pill--popover-open' : ''}`;
      
      if (state === 'rest' || state === 'hover') {
        pill.innerHTML = `<div class="pill-icon">${SVGS.LOGO}</div>`;
      } else if (state === 'expanded') {
        const chevTransform = isPopoverOpen ? 'transform: rotate(180deg);' : '';
        pill.innerHTML = `<div class="pill-icon">${SVGS.LOGO}</div><span class="pill-text">${tone.l}</span><div class="pill-chev-wrap" tabindex="0" role="button" aria-label="Toggle tone menu" style="${chevTransform}">${SVGS.CHEV}</div>`;
        const chev = pill.querySelector('.pill-chev-wrap');
        if (chev) chev.onclick = (e) => { e.stopPropagation(); callbacks.onTogglePopover(); };
      } else if (state === 'loading') {
        pill.innerHTML = `<span class="pill-text">Converting<span class="pill-dots"></span></span>`;
      } else if (state === 'done') {
        pill.innerHTML = `<span class="pill-text">Undo</span>`;
      } else if (state === 'error') {
        pill.innerHTML = `<div class="pill-icon"><svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l12 12M13 1L1 13"/></svg></div><span class="pill-text" style="margin-left: 4px;">Retry</span>`;
      }
    },
    createPopover: (activeId, onSelect, onClose, onMouseEnter, onMouseLeave) => {
      const pop = h('div', { 
        className: 'popover', 
        role: 'listbox',
        'aria-label': 'Select tone level',
        onmouseenter: onMouseEnter, 
        onmouseleave: onMouseLeave 
      });
      TONES.forEach((tone, idx) => {
        const isActive = tone.id === activeId;
        const item = h('div', { 
          className: `pop-item ${isActive ? 'pop-item--active' : ''}`, 
          role: 'option',
          'aria-selected': isActive ? 'true' : 'false',
          tabindex: isActive ? '-1' : '0',
          onclick: (e) => { e.stopPropagation(); onSelect(tone.id); },
          onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(tone.id); } }
        },
          h('span', { className: 'pop-label', textContent: tone.l }),
          isActive ? h('span', { className: 'pop-check', textContent: '✓' }) : h('span', { className: 'pop-sub', textContent: tone.s })
        );
        pop.appendChild(item);
        if (idx < TONES.length - 1) pop.appendChild(h('div', { className: 'pop-divider' }));
      });
      pop.classList.add('popover--active');
      return pop;
    },
    createDecodeFloat: (onDecode) => {
      return h('div', { 
        className: 'decode-float', 
        role: 'button',
        'aria-label': 'Decode selected text',
        tabindex: '0',
        onclick: onDecode,
        onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDecode(); } }
      }, h('span', { textContent: 'Decode' }));
    },
    createDecodeCard: (text, onClose) => {
      const copyBtn = h('div', { 
        className: 'decode-card-copy', 
        role: 'button',
        'aria-label': 'Copy decoded text',
        tabindex: '0',
        innerHTML: `${SVGS.COPY} Copy` 
      });
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(text);
        copyBtn.className = 'decode-card-copy decode-card-copy--copied';
        copyBtn.innerHTML = `${SVGS.CHECK} Copied!`;
        setTimeout(() => {
          copyBtn.className = 'decode-card-copy';
          copyBtn.innerHTML = `${SVGS.COPY} Copy`;
        }, 2000);
      };
      copyBtn.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyBtn.click(); } };
 
      return h('div', { className: 'decode-card', role: 'dialog', 'aria-label': 'Decoding results' },
        h('div', { className: 'decode-card-header' },
          h('span', { className: 'decode-card-tag', textContent: 'Plain English' }),
          h('div', { 
            className: 'decode-card-close', 
            role: 'button',
            'aria-label': 'Close card',
            tabindex: '0',
            innerHTML: SVGS.CLOSE, 
            onclick: onClose,
            onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClose(); } }
          })
        ),
        h('div', { className: 'decode-card-body' },
          h('div', { className: 'decode-card-text', textContent: text }),
          copyBtn
        )
      );
    },
    showToast: (root, msg, type = 'success') => {
      const toast = h('div', { className: `toast toast--${type}` }, h('div', { className: `toast-dot toast-dot--${type}` }), h('span', { textContent: msg }));
      root.appendChild(toast);
      // Trigger entrance
      requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('toast--active'));
      });
      // Trigger exit
      setTimeout(() => { 
        toast.classList.remove('toast--active'); 
        toast.classList.add('toast--exit');
        setTimeout(() => toast.remove(), 300); 
      }, 3000);
    }
  };
})();
