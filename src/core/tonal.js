/**
 * TONAL CORE v4.8.0
 * Professional Motion Profile | High-Fidelity Interaction Layer
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
      --black: #0F0F0F; --gray-1: #1C1C1E; --gray-2: #2C2C2E; --gray-3: #3A3A3C; --gray-4: #636366; 
      --gray-5: #AEAEB2; --gray-6: #D1D1D6; --gray-7: #E5E5EA; --gray-8: #F2F2F7; --gray-9: #F5F5F7;
      --white: #FFFFFF; --green: #34C759; --red: #FF3B30;
      --font: 'DM Sans', -apple-system, sans-serif;
      --r-pill: 100px; --r-lg: 14px;
      --sh-xs: 0 1px 3px rgba(0, 0, 0, .16);
      --sh-sm: 0 1px 4px rgba(0, 0, 0, .06), 0 4px 12px rgba(0, 0, 0, .06);
      --sh-lg: 0 8px 24px rgba(0, 0, 0, .1), 0 24px 64px rgba(0, 0, 0, .12);
      --ease-out: cubic-bezier(0.2, 0, 0, 1);
      --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .t-pill {
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--black); border-radius: var(--r-pill); cursor: pointer;
      box-shadow: var(--sh-xs); transition: all 0.4s var(--ease-out);
      user-select: none; box-sizing: border-box; position: relative; overflow: hidden;
      font-family: var(--font);
    }
    .t-pill:active { transform: scale(0.94); transition: transform 0.1s; }

    .t-pill--rest { width: 30px; height: 16px; padding: 0; }
    .t-pill--rest:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(0, 0, 0, .2); }
    .t-pill--expanded { height: 24px; padding: 0 9px; gap: 5px; }
    .t-pill--loading { height: 24px; padding: 0 9px; opacity: .7; cursor: default; animation: pulse 2s infinite ease-in-out; }
    .t-pill--done { height: 24px; padding: 0 10px; background: var(--green); box-shadow: 0 1px 4px rgba(52, 199, 89, .35); animation: successPop 0.4s var(--spring); }
    .t-pill--error { height: 24px; padding: 0 9px; background: var(--red); }

    @keyframes pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 0.4; } }
    @keyframes successPop { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }

    .pill-text { font-size: 10px; font-weight: 700; color: var(--white); letter-spacing: 0.01em; white-space: nowrap; font-family: var(--font); }
    
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
    .pop-item:nth-child(3) { transition-delay: 0.1s; } /* Accounts for divider at child 2 */
    .pop-item:nth-child(5) { transition-delay: 0.15s; }

    .pop-item:not(.pop-item--active):hover { background: var(--gray-9); }
    .pop-item--active { background: var(--black); cursor: default; }
    
    .pop-label { font-size: 13px; font-weight: 500; color: var(--black); }
    .pop-item--active .pop-label { color: var(--white); }
    .pop-sub { font-size: 10px; color: var(--gray-5); }
    .pop-item--active .pop-sub { color: var(--white); }
    .pop-check { font-size: 11px; color: var(--black); font-weight: 600; }
    .pop-item--active .pop-check { color: var(--white); }
    .pop-divider { height: 1px; background: var(--gray-8); opacity: 0; transition: opacity 0.3s; }
    .popover--active .pop-divider { opacity: 1; }

    .pill-dots::after { content: ''; display: inline-block; animation: dots 1.2s steps(4) infinite; }
    @keyframes dots { 0% { content: ''; } 25% { content: '.'; } 50% { content: '..'; } 75% { content: '...'; } }

    .toast {
      display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; 
      border-radius: var(--r-pill); font-size: 12px; font-weight: 600; font-family: var(--font);
      box-shadow: 0 4px 16px rgba(0, 0, 0, .2); background: var(--black); white-space: nowrap;
      opacity: 0; transform: translateY(20px); transition: all 0.4s var(--spring);
    }
    .toast--active { opacity: 1; transform: translateY(0); }
    .toast-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; background: #4ade80; animation: glow 1.5s infinite alternate; }
    @keyframes glow { from { box-shadow: 0 0 2px #4ade80; } to { box-shadow: 0 0 8px #4ade80; } }
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

  function createRestPill(callbacks) {
    const p = h('div', { className: 't-pill--rest' });
    p.innerHTML = SVGS.LOGO;
    p.onclick = (e) => { e.stopPropagation(); callbacks.onClick(); };
    p.onmouseenter = () => callbacks.onHover && callbacks.onHover(true);
    p.onmouseleave = () => callbacks.onHover && callbacks.onHover(false);
    return p;
  }

  function createExpandedPill(tone, callbacks) {
    const p = h('div', { className: 't-pill--expanded' });
    p.appendChild(h('div', { style: 'display:flex;align-items:center;justify-content:center;', innerHTML: SVGS.LOGO_SM }));
    p.appendChild(h('span', { className: 'pill-text', textContent: tone.l }));
    const chev = h('div', { 
      className: 'pill-chev-wrap', 
      innerHTML: SVGS.CHEV,
      onclick: (e) => { e.stopPropagation(); callbacks.onTogglePopover(); }
    });
    p.appendChild(chev);
    p.onclick = (e) => { if (!e.target.closest('.pill-chev-wrap')) callbacks.onClick(); };
    p.onmouseenter = () => callbacks.onHover && callbacks.onHover(true);
    p.onmouseleave = () => callbacks.onHover && callbacks.onHover(false);
    return p;
  }

  function createLoadingPill() {
    const p = h('div', { className: 't-pill--loading' });
    p.appendChild(h('span', { className: 'pill-text pill-dots', textContent: 'Converting' }));
    return p;
  }

  function createDonePill(callbacks) {
    const p = h('div', { className: 't-pill--done' });
    p.appendChild(h('span', { className: 'pill-text', textContent: 'Undo' }));
    p.onclick = (e) => { e.stopPropagation(); callbacks.onClick(); };
    return p;
  }

  function createErrorPill(callbacks) {
    const p = h('div', { className: 't-pill--error' });
    p.appendChild(h('span', { className: 'pill-text', textContent: 'Failed' }));
    p.onclick = (e) => { e.stopPropagation(); callbacks.onClick(); };
    return p;
  }

  return {
    TONES,
    h,
    injectStyles: (root) => {
      const style = document.createElement('style');
      style.textContent = CSS;
      root.appendChild(style);
    },
    
    renderPill(container, state, toneId, callbacks) {
      const tone = TONES.find(t => t.id === toneId) || TONES[1];
      container.className = `t-pill t-pill--${state}`;
      container.innerHTML = ''; 
      
      let payload;
      if (state === 'rest') payload = createRestPill(callbacks);
      else if (state === 'expanded') payload = createExpandedPill(tone, callbacks);
      else if (state === 'loading') payload = createLoadingPill();
      else if (state === 'done') payload = createDonePill(callbacks);
      else if (state === 'error') payload = createErrorPill(callbacks);
      
      if (payload) {
        while (payload.firstChild) container.appendChild(payload.firstChild);
        container.onclick = payload.onclick;
        container.onmouseenter = payload.onmouseenter;
        container.onmouseleave = payload.onmouseleave;
      }
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

    showToast: (root, msg) => {
      const toast = h('div', { className: 'toast' });
      toast.appendChild(h('div', { className: 'toast-dot' }));
      toast.appendChild(h('span', { style: 'color:#4ade80;', textContent: msg }));
      
      root.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('toast--active'));
      setTimeout(() => {
        toast.classList.remove('toast--active');
        setTimeout(() => toast.remove(), 400);
      }, 2500);
    }
  };
})();
