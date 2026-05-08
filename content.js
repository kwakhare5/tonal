/* content.js — Tonal v2.0 (Strict Design System Implementation) */
(function () {
  "use strict";

  const injected = new WeakSet();

  function isContextValid() {
    return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
  }

  function getPlatform() {
    const h = location.hostname;
    if (h.includes("mail.google.com")) return "gmail";
    if (h.includes("app.slack.com")) return "slack";
    if (h.includes("web.whatsapp.com")) return "whatsapp";
    if (h.includes("linkedin.com")) return "linkedin";
    return null;
  }

  const SELECTORS = {
    gmail: ['div[aria-label="Message Body"]', '.Am.Al.editable', 'div[g_editable="true"][contenteditable="true"]'],
    slack: ['.ql-editor[contenteditable="true"]', '[data-lexical-editor="true"]', '.p-rich_text_input__editable'],
    whatsapp: ['div[contenteditable="true"][data-tab="10"]', 'footer div[contenteditable="true"]'],
    linkedin: ['.msg-form__contenteditable', '.feed-shared-update-v2__comment-box [contenteditable]']
  };

  function scan() {
    const platform = getPlatform();
    if (!platform) return;
    const selectors = SELECTORS[platform];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!injected.has(el)) {
          inject(el, platform);
          injected.add(el);
        }
      });
    });
  }

  function inject(input, platform) {
    const wrap = document.createElement('div');
    wrap.className = `t-wrap t-wrap--${platform}`;
    wrap._tInput = input;
    
    const btn = makeButton();
    wrap.appendChild(btn);
    
    document.body.appendChild(wrap);
    positionPill(btn, input, platform);

    // Reposition on window resize
    window.addEventListener('resize', () => positionPill(btn, input, platform));
    
    // Observer for input changes to update label
    const observer = new MutationObserver(() => updatePillLabel(btn, input));
    observer.observe(input, { characterData: true, childList: true, subtree: true });

    // Initial check
    updatePillLabel(btn, input);
  }

  function makeButton() {
    const btn = document.createElement('button');
    btn.className = 't-pill t-pill--rest';
    btn.dataset.state = "idle";
    btn.dataset.tone = "workChat";
    
    // Strict SVG from design system (Spec: 13x8px icon)
    btn.innerHTML = `
      <span class="pill-icon">
        <svg width="13" height="8" viewBox="0 0 72 44" fill="none">
          <rect x="0" y="18" width="72" height="8" rx="4" fill="#444"/>
          <rect x="0" y="18" width="39" height="8" rx="4" fill="white"/>
          <circle cx="39" cy="22" r="16" fill="white"/>
          <circle cx="39" cy="22" r="9" fill="#0F0F0F"/>
        </svg>
      </span>
      <span class="pill-text"></span>
    `;

    btn.addEventListener("mouseenter", () => {
      if (btn.dataset.state === "idle") {
        updatePillLabel(btn, btn.closest(".t-wrap")._tInput); // Refresh text
        btn.classList.replace("t-pill--rest", "t-pill--expanded");
      }
    });

    btn.addEventListener("mouseleave", () => {
      if (btn.dataset.state === "idle") {
        btn.classList.replace("t-pill--expanded", "t-pill--rest");
      }
    });

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = getInputText(btn.closest(".t-wrap")._tInput);
      
      if (btn.dataset.state === "undo") {
        handleUndo(btn);
      } else if (text && text.length > 0) {
        handleConvert(btn);
      } else {
        showPopover(btn);
      }
    });

    btn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showPopover(btn);
    });

    return btn;
  }

  function updatePillLabel(btn, input) {
    if (btn.dataset.state !== "idle") return;
    const text = getInputText(input);
    const label = btn.querySelector(".pill-text");
    if (label) {
      // Logic: Always set text, CSS (opacity/max-width) handles visibility for --rest state
      const newLabel = (text && text.length > 0) ? "Convert" : "Tonal";
      if (label.textContent !== newLabel) label.textContent = newLabel;
    }
  }

  function positionPill(btn, input, platform) {
    const wrap = btn.closest(".t-wrap");
    const rect = input.getBoundingClientRect();
    
    wrap.style.top = `${rect.top + window.scrollY}px`;
    wrap.style.left = `${rect.left + window.scrollX}px`;
    wrap.style.width = `${rect.width}px`;
    wrap.style.height = `${rect.height}px`;
    
    // Pill is always absolute right-middle
    btn.style.position = "absolute";
    btn.style.right = "8px";
    btn.style.top = "50%";
    btn.style.transform = "translateY(-50%)";
  }

  function showPopover(btn) {
    closePopover();
    const input = btn.closest(".t-wrap")._tInput;
    const pop = document.createElement("div");
    pop.className = "popover";
    pop.innerHTML = `
      <button class="popover-item" data-tone="texting">
        <span class="popover-item-label">Casual</span>
        <span class="popover-item-sub">texting</span>
      </button>
      <div class="popover-divider"></div>
      <button class="popover-item ${btn.dataset.tone === "workChat" ? "popover-item--active" : ""}" data-tone="workChat">
        <span class="popover-item-label">Work Chat</span>
        <span class="popover-item-sub">friendly ✓</span>
      </button>
      <div class="popover-divider"></div>
      <button class="popover-item" data-tone="corporate">
        <span class="popover-item-label">Formal</span>
        <span class="popover-item-sub">professional</span>
      </button>
      <div class="popover-divider"></div>
      <button class="popover-item popover-item--decode" data-tone="decode">
        <span class="popover-item-label">Decode message</span>
        <span class="popover-item-sub">↓</span>
      </button>
    `;

    pop.querySelectorAll(".popover-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const tone = item.dataset.tone;
        closePopover();
        if (tone === "decode") {
          runDecode(btn, input);
        } else {
          btn.dataset.tone = tone;
          handleConvert(btn, tone);
        }
      });
    });

    document.body.appendChild(pop);
    const rect = btn.getBoundingClientRect();
    pop.style.top = `${rect.top - pop.offsetHeight - 8}px`;
    pop.style.left = `${rect.right - pop.offsetWidth}px`;

    setTimeout(() => document.addEventListener("click", closePopover, { once: true }), 10);
  }

  function closePopover() {
    document.querySelector(".popover")?.remove();
  }

  async function handleConvert(btn, toneOverride) {
    const input = btn.closest(".t-wrap")._tInput;
    const text = getInputText(input);
    const tone = toneOverride || btn.dataset.tone || "workChat";
    
    btn.dataset.original = text;
    btn.dataset.state = "loading";
    btn.classList.add("t-pill--expanded");
    btn.querySelector(".pill-text").textContent = "Converting";
    btn.querySelector(".pill-text").classList.add("pill-text--dim");

    try {
      chrome.runtime.sendMessage({ type: "TONESHIFT_CONVERT", text, toneLevel: tone }, (res) => {
        if (res?.success) {
          setInputTextWithHighlight(input, text, res.text);
          setDone(btn);
        } else {
          setIdle(btn);
          showToast(res?.error || "Failed", "error");
        }
      });
    } catch (e) {
      setIdle(btn);
    }
  }

  async function runDecode(btn, input) {
    const text = getInputText(input);
    btn.dataset.state = "loading";
    btn.classList.add("t-pill--expanded");
    btn.querySelector(".pill-text").textContent = "Decoding";

    chrome.runtime.sendMessage({ type: "TONESHIFT_DECODE", text }, (res) => {
      setIdle(btn);
      if (res?.success) showDecodeCard(res.text, btn);
    });
  }

  function showDecodeCard(text, btn) {
    document.querySelector(".card")?.remove();
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-label">Plain English</div>
      <div class="card-text" style="font-size:14px; line-height:1.6; margin-bottom:20px;">${text}</div>
      <button class="t-btn-primary">Copy to Clipboard</button>
    `;
    document.body.appendChild(card);
    
    const rect = btn.getBoundingClientRect();
    card.style.top = `${rect.top - card.offsetHeight - 12}px`;
    card.style.left = `${rect.right - card.offsetWidth}px`;

    card.querySelector(".t-btn-primary").addEventListener("click", () => {
      navigator.clipboard.writeText(text);
      showToast("Copied!", "success");
      card.remove();
    });
    
    setTimeout(() => document.addEventListener("click", () => card.remove(), { once: true }), 100);
  }

  function setDone(btn) {
    btn.dataset.state = "undo";
    btn.className = "t-pill t-pill--done";
    btn.querySelector(".pill-text").textContent = "Undo";
    btn.querySelector(".pill-text").classList.remove("pill-text--dim");
    setTimeout(() => { if (btn.dataset.state === "undo") setIdle(btn); }, 5000);
  }

  function setIdle(btn) {
    btn.dataset.state = "idle";
    btn.className = "t-pill t-pill--rest";
    updatePillLabel(btn, btn.closest(".t-wrap")?._tInput);
  }

  function handleUndo(btn) {
    const input = btn.closest(".t-wrap")._tInput;
    if (btn.dataset.original) setInputText(input, btn.dataset.original);
    setIdle(btn);
  }

  function getInputText(el) {
    return (el.innerText || el.textContent || "").trim();
  }

  function setInputText(el, text) {
    if (el.isContentEditable) {
      el.innerText = text;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      el.value = text;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function setInputTextWithHighlight(el, oldText, newText) {
    if (!el.isContentEditable) { setInputText(el, newText); return; }
    
    const words = newText.split(" ");
    el.innerHTML = words.map(w => `<span class="t-hl">${w}</span>`).join(" ");
    el.dispatchEvent(new Event('input', { bubbles: true }));
    
    setTimeout(() => {
      el.querySelectorAll(".t-hl").forEach(h => h.classList.add("t-hl--fade"));
      setTimeout(() => {
        el.innerText = newText; // Final clean text
      }, 2000);
    }, 1000);
  }

  function showToast(msg, type) {
    let t = document.getElementById("t-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "t-toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = `t-toast--${type}`;
    t.classList.add("t-toast--show");
    setTimeout(() => t.classList.remove("t-toast--show"), 3000);
  }

  // Init
  const observer = new MutationObserver(scan);
  observer.observe(document.body, { childList: true, subtree: true });
  scan();

})();
