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
      
      // Global click-away detection
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#' + SHADOW_ID)) {
          for (const entry of this.registry.values()) {
            if (entry.popover) {
              entry.popover = false;
              if (!entry.isMouseOver) entry.state = 'rest';
              this.render(entry.input);
            }
          }
        }
      });
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
        input,
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

      // 1. Manage Carrier & Payload
      if (!e.pill) {
        e.pill = UI.h('div', { className: 't-pill' });
        e.wrap.appendChild(e.pill);
      }

      if (e.lastState !== e.state || e.lastTone !== e.tone) {
        UI.renderPill(e.pill, e.state, e.tone, {
          onClick: () => {
            if (e.state === 'rest') { e.state = 'expanded'; this.render(input); }
            else if (e.state === 'expanded') this.convert(input);
            else if (e.state === 'done') this.undo(input);
          },
          onTogglePopover: () => { 
            e.popover = !e.popover; 
            if (!e.popover && !e.isMouseOver) e.state = 'rest';
            this.render(input); 
          },
          onHover: (isHover) => {
            e.isMouseOver = isHover;
            if (e.state === 'rest' && isHover) { e.state = 'expanded'; this.render(input); }
            else if (e.state === 'expanded' && !isHover && !e.popover) { e.state = 'rest'; this.render(input); }
          }
        });
        
        e.lastState = e.state;
        e.lastTone = e.tone;
      }
      
      // 2. Popover Toggle
      if (e.popover) e.pill.classList.add('t-pill--popover-open');
      else e.pill.classList.remove('t-pill--popover-open');

      // 3. Popover Content
      if (e.popover) {
        if (e.popNode) e.popNode.remove();
        e.popNode = UI.createPopover(e.tone, 
          (toneId) => { e.tone = toneId; e.popover = false; this.render(input); },
          () => { e.popover = false; if (!e.isMouseOver) e.state = 'rest'; this.render(input); }
        );
        e.wrap.appendChild(e.popNode);
        requestAnimationFrame(() => e.popNode.classList.add('popover--active'));
      } else if (e.popNode) {
        e.popNode.classList.remove('popover--active');
        const node = e.popNode;
        setTimeout(() => { if (!e.popover) node.remove(); }, 300);
        e.popNode = null;
      }
    }

    async convert(input) {
      const e = this.registry.get(input);
      const text = input.innerText || input.value;
      if (!text || text.length < 3) return;

      e.originalText = text;
      e.state = 'loading'; 
      this.render(input);

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
      ['input', 'change', 'blur'].forEach(name => input.dispatchEvent(new Event(name, { bubbles: true })));
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
      for (const [input, e] of this.registry.entries()) {
        if (!input.isConnected) { e.wrap.remove(); this.registry.delete(input); continue; }
        const rect = input.getBoundingClientRect();
        const sc = this.getScroll(input);
        const isWA = window.location.host.includes('whatsapp');
        const isSL = window.location.host.includes('slack');
        
        if (isWA || isSL) {
          e.wrap.style.top = `${rect.top + sc.y + (rect.height - 32) / 2}px`;
          e.wrap.style.left = `${rect.right + sc.x - 210}px`;
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
