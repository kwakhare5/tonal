/**
 * TONAL CONTENT INJECTOR v4.0.0
 * Ultra-Lean | Inside-the-Box Docking | State-Driven
 */

(function() {
  const UI = window.Tonal;
  const SHADOW_ID = 'tonal-v4-root';
  const SELECTORS = ['[contenteditable="true"]', 'textarea', '[role="textbox"]', '.ql-editor'].join(',');

  class TonalInjector {
    constructor() {
      this.registry = new Map(); // input -> { wrap, state, tone, popover, originalText }
      this.init();
    }

    init() {
      const scan = () => {
        const elements = document.querySelectorAll(SELECTORS);
        elements.forEach(el => {
          if (el.dataset.tonal || (el.offsetWidth === 0 && el.offsetHeight === 0)) return;
          el.dataset.tonal = "v4";
          this.register(el);
          console.log('🔍 Tonal: Injected into', el.tagName, el.className);
        });
      };

      scan(); 
      setInterval(scan, 1000);
      document.addEventListener('DOMContentLoaded', scan);
      window.addEventListener('load', scan);

      requestAnimationFrame(() => this.watch());
    }

    getShadow() {
      let host = document.getElementById(SHADOW_ID);
      if (!host) {
        host = UI.h('div', { id: SHADOW_ID, style: 'position:absolute; top:0; left:0; width:0; height:0; z-index:2147483647;' });
        document.body.appendChild(host);
      }
      if (!host.shadowRoot) {
        const shadow = host.attachShadow({ mode: 'open' });
        UI.injectStyles(shadow);
        return shadow;
      }
      return host.shadowRoot;
    }

    register(input) {
      const shadow = this.getShadow();
      const wrap = UI.h('div', { 
        className: 't-wrap',
        style: 'position:absolute; pointer-events:auto; display:flex; align-items:center; justify-content:flex-end; width:200px; height:32px;' 
      });
      shadow.appendChild(wrap);

      const entry = { 
        wrap, 
        shadow, 
        state: 'rest', 
        tone: 'workChat', 
        popover: false,
        originalText: '',
        pill: null,
        pop: null
      };
      this.registry.set(input, entry);
      this.render(input);
    }

    render(input) {
      const e = this.registry.get(input);
      if (!e) return;

      // 1. Create or Update Pill
      if (!e.pill) {
        e.pill = UI.createPill(e.state, e.tone, {
          onClick: () => {
            if (e.state === 'rest') { e.state = 'expanded'; this.render(input); }
            else if (e.state === 'expanded') this.convert(input);
            else if (e.state === 'done') this.undo(input);
          },
          onTogglePopover: () => { e.popover = !e.popover; this.render(input); }
        });
        e.wrap.appendChild(e.pill);
      } else {
        // Surgical update: classes only to preserve hover state
        e.pill.className = `t-pill t-pill--${e.state}${e.popover ? ' t-pill--popover-open' : ''}`;
        const label = e.pill.querySelector('.t-label');
        if (label) {
          if (e.state === 'loading') { label.className = 't-label dots'; label.textContent = 'Converting'; }
          else if (e.state === 'done') { label.className = 't-label'; label.textContent = 'Undo'; }
          else { label.className = 't-label'; label.textContent = (window.Tonal.TONES.find(t => t.id === e.tone) || {}).l || 'Work Chat'; }
        }
      }

      // 2. Manage Popover
      if (e.popover && !e.pop) {
        e.pop = UI.createPopover(e.tone, (newTone) => {
          e.tone = newTone; e.popover = false; this.render(input);
        });
        e.wrap.insertBefore(e.pop, e.pill);
        requestAnimationFrame(() => e.pop.classList.add('popover--active'));
      } else if (!e.popover && e.pop) {
        e.pop.classList.remove('popover--active');
        const p = e.pop; e.pop = null;
        setTimeout(() => p.remove(), 200);
      }
    }

    async convert(input) {
      const e = this.registry.get(input);
      const text = input.innerText || input.value;
      if (!text || text.length < 3) return;

      e.originalText = text;
      e.state = 'loading'; 
      this.render(input);

      // Simulate API Logic
      setTimeout(() => {
        const result = `[TONAL: ${e.tone.toUpperCase()}] ${text}`;
        this.insertText(input, result);
        
        e.state = 'done'; 
        this.render(input);
        UI.showToast(e.shadow, 'Tone shifted to ' + e.tone);
      }, 1000);
    }

    insertText(input, text) {
      input.focus();
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, text);
      
      ['input', 'change', 'blur'].forEach(name => {
        input.dispatchEvent(new Event(name, { bubbles: true }));
      });
    }

    undo(input) {
      const e = this.registry.get(input);
      if (!e.originalText) return;
      
      this.insertText(input, e.originalText);
      e.state = 'rest';
      this.render(input);
      UI.showToast(e.shadow, 'Restored original text');
    }

    getScroll(el) {
      return { y: window.scrollY, x: window.scrollX };
    }

    watch() {
      // 1. Cleanup orphaned overlays
      for (const [input, e] of this.registry.entries()) {
        if (!input.isConnected) {
          e.wrap.remove();
          this.registry.delete(input);
        }
      }

      // 2. Position active overlays
      for (const [input, e] of this.registry.entries()) {
        const rect = input.getBoundingClientRect();
        const sc = this.getScroll(input);
        
        // WhatsApp/Slack "Inside-the-Box" Docking
        const isWA = window.location.host.includes('whatsapp');
        const isSL = window.location.host.includes('slack');
        
        if (isWA || isSL) {
          e.wrap.style.top = `${rect.top + sc.y + (rect.height - 32) / 2}px`;
          e.wrap.style.left = `${rect.right + sc.x - 210}px`; // 200px width + 10px padding
        } else {
          e.wrap.style.top = `${rect.bottom + sc.y + 4}px`;
          e.wrap.style.left = `${rect.right + sc.x - 200}px`;
        }
      }
      requestAnimationFrame(() => this.watch());
    }
  }

  if (window.Tonal) new TonalInjector();
})();
