/**
 * TONAL MASTER ENGINE v4.8.0
 * Final Design System Parity | Glassmorphism | Motion Profile
 */

window.Tonal = (function() {
  const SVGS = {
    LOGO: `<svg width="13" height="8" viewBox="0 0 72 44" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="18" width="72" height="8" rx="4" fill="#3A3A3C"/><rect x="0" y="18" width="39" height="8" rx="4" fill="white"/><circle cx="39" cy="22" r="15" fill="white"/><circle cx="39" cy="22" r="9" fill="#0F0F0F"/></svg>`,
    LOGO_SM: `<svg width="11" height="7" viewBox="0 0 72 44" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="18" width="72" height="8" rx="4" fill="#3A3A3C"/><rect x="0" y="18" width="39" height="8" rx="4" fill="white"/><circle cx="39" cy="22" r="15" fill="white"/><circle cx="39" cy="22" r="9" fill="#0F0F0F"/></svg>`,
    CHEV: `<svg width="7" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity:.6"><path d="M1 1l3 3 3-3" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');

    :host {
      --black: #0F0F0F; --white: #FFFFFF; --green: #34C759; --red: #FF3B30;
      --gray-1: #1C1C1E; --gray-2: #2C2C2E; --gray-3: #3A3A3C; --gray-4: #636366;
      --gray-5: #AEAEB2; --gray-6: #D1D1D6; --gray-7: #E5E5EA; --gray-8: #F2F2F7; --gray-9: #F5F5F7;
      --font: 'DM Sans', -apple-system, sans-serif;
      --r-sm: 6px; --r-md: 10px; --r-lg: 14px; --r-xl: 20px; --r-pill: 100px;
      --sh-xs: 0 1px 2px rgba(0, 0, 0, .06);
      --sh-sm: 0 4px 12px rgba(0, 0, 0, .06);
      --sh-lg: 0 24px 64px rgba(0, 0, 0, .12), 0 1px 4px rgba(0, 0, 0, .06);
      --ease-out: cubic-bezier(0.2, 0, 0, 1);
      --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .t-pill {
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--black); border-radius: var(--r-pill); cursor: pointer;
      transition: all 0.35s var(--ease-out); user-select: none; position: relative;
      font-family: var(--font); box-sizing: border-box; overflow: hidden;
    }
    .t-pill:active { transform: scale(0.94); }

    .t-pill--rest { width: 30px; height: 16px; }
    .t-pill--expanded { height: 24px; padding: 0 10px; gap: 6px; }
    .t-pill--loading { height: 24px; padding: 0 10px; opacity: 0.7; }
    .t-pill--done { height: 24px; padding: 0 11px; background: var(--green); }
    .t-pill--error { height: 24px; padding: 0 10px; background: var(--red); }

    .pill-text { font-size: 10px; font-weight: 700; color: var(--white); letter-spacing: 0.02em; white-space: nowrap; }
    .pill-chev-wrap { 
      display: flex; align-items: center; justify-content: center; 
      width: 24px; height: 24px; margin-right: -9px; 
      transition: transform 0.4s var(--spring); 
    }
    .t-pill--popover-open .pill-chev-wrap { transform: rotate(180deg); }
    .t-pill--popover-open .pill-chev-wrap svg { opacity: 1 !important; }

    .popover { 
      position: absolute; bottom: calc(100% + 8px); right: 0;
      width: 192px; background: var(--white); border-radius: var(--r-lg);
      border: 1px solid var(--gray-7); box-shadow: var(--sh-lg); 
      overflow: hidden; opacity: 0; transform: translateY(12px) scale(0.92); 
      transition: all 0.4s var(--spring); pointer-events: none; font-family: var(--font);
      display: flex; flex-direction: column; z-index: 1000; transform-origin: bottom right;
    }
    .popover--active { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
    
    .pop-item { 
      display: flex; align-items: center; justify-content: space-between; 
      padding: 11px 15px; cursor: pointer; transition: background 0.15s, transform 0.3s var(--ease-out), opacity 0.3s; 
      background: var(--white); box-sizing: border-box; width: 100%;
      opacity: 0; transform: translateY(8px);
    }
    .popover--active .pop-item { opacity: 1; transform: translateY(0); }
    .pop-item:nth-child(1) { transition-delay: 0.05s; }
    .pop-item:nth-child(3) { transition-delay: 0.1s; } 
    .pop-item:nth-child(5) { transition-delay: 0.15s; }

    .pop-item:not(.pop-item--active):hover { background: #F5F5F7; }
    .pop-item--active { background: var(--black); cursor: default; }
    
    .pop-label { font-size: 13px; font-weight: 500; color: var(--black); }
    .pop-item--active .pop-label { color: var(--white); }
    .pop-sub { font-size: 10px; color: #AEAEB2; }
    .pop-item--active .pop-sub { color: var(--white); }
    .pop-check { font-size: 11px; color: var(--black); font-weight: 600; }
    .pop-item--active .pop-check { color: var(--white); }
    .pop-divider { height: 1px; background: #F2F2F7; opacity: 0; transition: opacity 0.3s; }
    .popover--active .pop-divider { opacity: 1; }

    .pill-dots::after { content: ''; display: inline-block; animation: dots 1.2s steps(4) infinite; }
    @keyframes dots { 0% { content: ''; } 25% { content: '.'; } 50% { content: '..'; } 75% { content: '...'; } }

    .decode-float {
      position: absolute; background: var(--black); color: var(--white);
      padding: 6px 13px; border-radius: var(--r-pill); font-size: 11px;
      font-weight: 600; cursor: pointer; z-index: 2147483647;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .18); font-family: var(--font);
      letter-spacing: .01em; opacity: 0; transform: translateY(10px); 
      transition: all 0.3s var(--spring); pointer-events: auto;
    }
    .decode-float--active { opacity: 1; transform: translateY(0); }
    .decode-float:active { transform: scale(0.95); }

    .decode-card {
      position: absolute; width: 288px; background: var(--white);
      border-radius: var(--r-lg); border: 1px solid var(--gray-7);
      box-shadow: var(--sh-lg); z-index: 2147483647;
      font-family: var(--font); overflow: hidden;
      opacity: 0; transform: translateY(20px); transition: all 0.4s var(--spring);
      pointer-events: auto;
    }
    .decode-card--active { opacity: 1; transform: translateY(0); }

    .decode-card-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 11px 14px; border-bottom: 1px solid var(--gray-8);
    }
    .decode-card-tag { font-size: 10px; font-weight: 700; color: var(--gray-4); text-transform: uppercase; letter-spacing: .08em; }
    .decode-card-close { 
      width: 18px; height: 18px; background: var(--gray-8); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; color: var(--gray-4); cursor: pointer; opacity: 0.8; transition: opacity 0.2s; 
    }
    .decode-card-close:hover { opacity: 1; }

    .decode-card-body { padding: 14px; display: flex; flex-direction: column; gap: 14px; }
    .decode-card-text { font-size: 14px; color: var(--black); line-height: 1.55; margin-bottom: 14px; font-weight: 400; }
    .decode-card-copy {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px; align-self: flex-start;
      padding: 6px 12px; border-radius: 6px; background: var(--gray-9); border: 1px solid var(--gray-7);
      font-size: 12px; font-weight: 500; color: var(--black); cursor: pointer;
      transition: all 0.15s ease;
    }
    .decode-card-copy:hover { background: var(--gray-8); border-color: var(--gray-6); }
    .decode-card-copy--copied { background: var(--green) !important; border-color: var(--green) !important; color: var(--white) !important; }
    .decode-card-copy svg { width: 12px; height: 12px; }

    .toast {
      position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(20px);
      display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px;
      border-radius: var(--r-pill); font-size: 12px; font-weight: 600;
      background: var(--black); box-shadow: var(--sh-lg);
      z-index: 2147483647; opacity: 0; transition: all 0.4s var(--spring);
      pointer-events: none; font-family: var(--font); color: var(--white);
    }
    .toast--active { opacity: 1; transform: translateX(-50%) translateY(0); }
    .toast--success { color: #4ade80; }
    .toast--error { color: #f87171; }
    .toast--warn { color: #fbbf24; }
    .toast--info { color: #e8e8ff; }

    .toast-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .toast--success .toast-dot { background: #4ade80; }
    .toast--error .toast-dot { background: #f87171; }
    .toast--warn .toast-dot { background: #fbbf24; }
    .toast--info .toast-dot { background: #8888ff; }
  `;

  const TONES = [
    { id: 'casual', l: 'Casual', s: 'texting' },
    { id: 'workChat', l: 'Work Chat', s: 'professional' },
    { id: 'formal', l: 'Formal', s: 'professional' }
  ];

  function h(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'className') el.className = v;
      else if (k === 'innerHTML') el.innerHTML = v;
      else if (k === 'textContent') el.textContent = v;
      else if (k === 'style') el.style.cssText = v;
      else if (k.startsWith('on')) el.addEventListener(k.toLowerCase().substring(2), v);
      else el.setAttribute(k, v);
    });
    children.forEach(c => c && el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return el;
  }

  return {
    TONES, h,
    injectStyles: (root) => {
      const style = document.createElement('style');
      style.textContent = CSS;
      root.appendChild(style);
    },
    
    renderPill(container, state, toneId, callbacks) {
      const tone = TONES.find(t => t.id === toneId) || TONES[1];
      container.className = `t-pill t-pill--${state}`;
      container.innerHTML = ''; 
      
      const content = h('div', { style: 'display:contents' });
      if (state === 'rest') {
        content.innerHTML = SVGS.LOGO;
      } else if (state === 'expanded') {
        content.appendChild(h('div', { style: 'display:flex;align-items:center;justify-content:center;', innerHTML: SVGS.LOGO_SM }));
        content.appendChild(h('span', { className: 'pill-text', textContent: tone.l }));
        const chev = h('div', { 
          className: 'pill-chev-wrap', 
          innerHTML: SVGS.CHEV,
          onclick: (e) => { e.stopPropagation(); callbacks.onTogglePopover(); }
        });
        content.appendChild(chev);
      } else if (state === 'loading') {
        content.appendChild(h('span', { className: 'pill-text pill-dots', textContent: 'Converting' }));
      } else if (state === 'done') {
        content.appendChild(h('span', { className: 'pill-text', textContent: 'Undo' }));
      } else if (state === 'error') {
        content.appendChild(h('span', { className: 'pill-text', textContent: 'Failed' }));
      }

      container.appendChild(content);
      container.onclick = (e) => {
        if (!e.target.closest('.pill-chev-wrap')) callbacks.onClick();
      };
      container.onmouseenter = () => callbacks.onHover && callbacks.onHover(true);
      container.onmouseleave = () => callbacks.onHover && callbacks.onHover(false);
    },

    createPopover(activeId, onSelect, onClose) {
      const pop = h('div', { 
        className: 'popover',
        onmouseleave: () => onClose && onClose()
      });
      TONES.forEach((tone, idx) => {
        const item = h('div', { 
          className: `pop-item ${tone.id === activeId ? 'pop-item--active' : ''}`,
          onclick: (e) => { e.stopPropagation(); onSelect(tone.id); }
        });
        
        item.appendChild(h('span', { className: 'pop-label', textContent: tone.l }));
        if (tone.id === activeId) {
          item.appendChild(h('span', { className: 'pop-check', textContent: '✓' }));
        } else {
          item.appendChild(h('span', { className: 'pop-sub', textContent: tone.s }));
        }
        
        pop.appendChild(item);
        if (idx < TONES.length - 1) pop.appendChild(h('div', { className: 'pop-divider' }));
      });
      return pop;
    },

    createDecodeButton(onClick) {
      return h('div', { 
        className: 'decode-float', 
        textContent: 'Decode',
        onclick: (e) => { e.stopPropagation(); onClick(); }
      });
    },

    createDecodeCard(text, onClose) {
      const card = h('div', { className: 'decode-card' });
      const header = h('div', { className: 'decode-card-header' },
        h('span', { className: 'decode-card-tag', textContent: 'Decoded Message' }),
        h('div', { className: 'decode-card-close', textContent: '✕', onclick: (e) => { e.stopPropagation(); onClose(); } })
      );
      
      const body = h('div', { className: 'decode-card-body' },
        h('div', { className: 'decode-card-text', textContent: text }),
        h('div', { 
          className: 'decode-card-copy',
          onclick: function(e) {
            e.stopPropagation();
            navigator.clipboard.writeText(text);
            this.className = 'decode-card-copy decode-card-copy--copied';
            this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Copied!`;
            setTimeout(() => {
              this.className = 'decode-card-copy';
              this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`;
            }, 2000);
          }
        }, h('div', { style: 'display:contents', innerHTML: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy` }))
      );

      card.appendChild(header);
      card.appendChild(body);
      return card;
    },

    showToast: (root, msg, type = 'success') => {
      const toast = h('div', { className: `toast toast--${type}` });
      toast.appendChild(h('div', { className: 'toast-dot' }));
      toast.appendChild(h('span', { textContent: msg }));
      
      root.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('toast--active'));
      setTimeout(() => {
        toast.classList.remove('toast--active');
        setTimeout(() => toast.remove(), 400);
      }, 2500);
    }
  };
})();
