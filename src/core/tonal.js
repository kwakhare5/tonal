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
      --font: 'DM Sans', -apple-system, sans-serif;
      --r-pill: 100px; --r-lg: 14px;
      --sh-lg: 0 8px 32px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.04);
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
      position: fixed; background: var(--black); color: var(--white);
      padding: 6px 14px; border-radius: var(--r-pill); font-size: 11px;
      font-weight: 700; cursor: pointer; z-index: 2147483647;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: var(--font);
      opacity: 0; transform: translateY(10px); transition: all 0.3s var(--spring);
    }
    .decode-float--active { opacity: 1; transform: translateY(0); }
    .decode-float:active { transform: scale(0.95); }

    .decode-card {
      position: fixed; width: 280px; background: var(--white);
      border-radius: var(--r-lg); border: 1px solid #F2F2F7;
      box-shadow: 0 24px 64px rgba(0,0,0,0.12); z-index: 2147483647;
      font-family: var(--font); overflow: hidden;
      opacity: 0; transform: translateY(20px); transition: all 0.4s var(--spring);
    }
    .decode-card--active { opacity: 1; transform: translateY(0); }

    .decode-card-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; background: #F9F9FB; border-bottom: 1px solid #F2F2F7;
    }
    .decode-card-tag { font-size: 10px; font-weight: 700; color: #AEAEB2; text-transform: uppercase; letter-spacing: 0.05em; }
    .decode-card-close { cursor: pointer; opacity: 0.4; transition: opacity 0.2s; }
    .decode-card-close:hover { opacity: 1; }

    .decode-card-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
    .decode-card-text { font-size: 13px; color: var(--black); line-height: 1.6; font-weight: 500; }
    .decode-card-copy {
      display: flex; align-items: center; gap: 6px; align-self: flex-start;
      padding: 6px 12px; border-radius: 8px; background: #F2F2F7;
      font-size: 11px; font-weight: 600; color: var(--black); cursor: pointer;
      transition: all 0.2s;
    }
    .decode-card-copy:hover { background: #E5E5EA; }
    .decode-card-copy--copied { background: var(--black); color: var(--white); }
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
        h('div', { className: 'decode-card-close', textContent: '✕', onclick: onClose })
      );
      
      const body = h('div', { className: 'decode-card-body' },
        h('div', { className: 'decode-card-text', textContent: text }),
        h('div', { 
          className: 'decode-card-copy',
          onclick: function() {
            navigator.clipboard.writeText(text);
            this.className = 'decode-card-copy decode-card-copy--copied';
            this.textContent = 'Copied!';
            setTimeout(() => {
              this.className = 'decode-card-copy';
              this.textContent = 'Copy';
            }, 2000);
          }
        }, 'Copy')
      );

      card.appendChild(header);
      card.appendChild(body);
      return card;
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
