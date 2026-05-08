/* content.js — Tonal v2.0 (Strict Design System Implementation) */
(function () {
  "use strict";

  let isScanning = false;
  function scan() {
    if (isScanning) return;
    isScanning = true;

    try {
      const platform = getPlatform();
      if (!platform) return;
      const selectors = SELECTORS[platform];
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
          if (element.dataset.tonalInjected !== "true") {
            element.dataset.tonalInjected = "true";
            inject(element, platform);
          }
        });
      });
    } finally {
      isScanning = false;
    }
  }

  function inject(input, platform) {
    const wrapper = document.createElement('div');
    wrapper.className = `t-wrap t-wrap--${platform}`;
    wrapper._tInput = input;
    
    const pillButton = makeButton();
    wrapper.appendChild(pillButton);
    
    document.documentElement.appendChild(wrapper);
    positionPill(pillButton, input, true);
    updatePillLabel(pillButton, input);
  }

  function makeButton() {
    const pillButton = document.createElement('button');
    pillButton.className = 't-pill t-pill--rest';
    pillButton.dataset.state = "idle";
    
    // Load default tone from storage
    chrome.storage.sync.get(['defaultTone'], (result) => {
      pillButton.dataset.tone = result.defaultTone || "workChat";
      updatePillLabel(pillButton, pillButton.closest(".t-wrap")?._tInput);
    });
    
    pillButton.innerHTML = `
      <span class="t-pill-icon">
        <svg width="13" height="8" viewBox="0 0 72 44" fill="none">
          <rect x="0" y="18" width="72" height="8" rx="4" fill="#444"/>
          <rect x="0" y="18" width="39" height="8" rx="4" fill="white"/>
          <circle cx="39" cy="22" r="16" fill="white"/>
          <circle cx="39" cy="22" r="9" fill="#0F0F0F"/>
        </svg>
      </span>
      <span class="t-pill-text"></span>
      <span class="t-pill-caret">
        <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
          <path d="M1.5 1.5L4 3.5L6.5 1.5" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    `;

    pillButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      
      const isCaret = event.target.closest('.t-pill-caret');
      if (isCaret) {
        showPopover(pillButton);
        return;
      }

      if (pillButton.dataset.state === "undo") {
        handleUndo(pillButton);
      } else if (pillButton.dataset.state === "idle") {
        const text = getInputText(pillButton.closest(".t-wrap")._tInput);
        if (text && text.length > 0) {
          handleConvert(pillButton);
        } else {
          showPopover(pillButton);
        }
      }
    });

    pillButton.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showPopover(pillButton);
    });

    return pillButton;
  }

  const PULL_RADIUS   = 45;
  const EXPAND_RADIUS = 35;
  const BASE_TRANSFORM = "translateY(-50%)";
  
  document.addEventListener("mousemove", (event) => {
    const pills = document.querySelectorAll(".t-pill");
    pills.forEach(pillButton => {
      if (pillButton.dataset.state === "loading") {
        pillButton.style.transform = BASE_TRANSFORM;
        return;
      }

      const rect = pillButton.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.sqrt(dx*dx + dy*dy);

      if (distance < PULL_RADIUS) {
        const power = (PULL_RADIUS - distance) / PULL_RADIUS;
        const pullX = dx * power * 0.45;
        const pullY = dy * power * 0.45;
        
        pillButton.style.transform = `${BASE_TRANSFORM} translate(${pullX}px, ${pullY}px) scale(${1 + power * 0.05})`;
        pillButton.style.zIndex = "2147483647";

        if (distance < EXPAND_RADIUS) {
          if (pillButton.classList.contains("t-pill--rest")) {
            pillButton.classList.replace("t-pill--rest", "t-pill--expanded");
            updatePillLabel(pillButton, pillButton.closest(".t-wrap")._tInput);
          }
        }
      } else {
        pillButton.style.transform = BASE_TRANSFORM;
        pillButton.style.zIndex = "";
        
        if (pillButton.classList.contains("t-pill--expanded")) {
          if (!document.querySelector(".t-popover:hover") && !pillButton.matches(":hover")) {
             pillButton.classList.replace("t-pill--expanded", "t-pill--rest");
             updatePillLabel(pillButton, pillButton.closest(".t-wrap")?._tInput);
          }
        }
      }
    });
  });

  function updatePillLabel(pillButton, input) {
    if (pillButton.dataset.state !== "idle") return;
    const label = pillButton.querySelector(".t-pill-text");
    if (label) {
      const names = { casual: "Casual", workChat: "Work Chat", formal: "Formal" };
      const toneName = names[pillButton.dataset.tone] || "Work Chat";
      if (label.textContent !== toneName) label.textContent = toneName;
    }
  }

  function watchdog() {
    const wrappers = document.querySelectorAll(".t-wrap");
    wrappers.forEach(wrapper => {
      const input = wrapper._tInput;
      const pillButton = wrapper.querySelector(".t-pill");
      
      if (!input || !document.contains(input)) {
        wrapper.remove();
        return;
      }

      positionPill(pillButton, input, false); 
    });
    
    requestAnimationFrame(watchdog);
  }

  function showPopover(pillButton) {
    if (pillButton.classList.contains("t-pill--popover-open")) {
      closePopover();
      return;
    }
    closePopover();
    pillButton.classList.add("t-pill--popover-open");
    const input = pillButton.closest(".t-wrap")._tInput;
    const popoverElement = document.createElement("div");
    popoverElement.className = "t-popover";
    popoverElement.innerHTML = `
      <button class="t-popover-item ${pillButton.dataset.tone === "casual" ? "t-popover-item--active" : ""}" data-tone="casual">
        <span class="t-popover-item-label">Casual</span>
        <span class="t-popover-item-sub">${pillButton.dataset.tone === "casual" ? "✓" : ""}</span>
      </button>
      <div class="t-popover-divider"></div>
      <button class="t-popover-item ${(!pillButton.dataset.tone || pillButton.dataset.tone === "workChat") ? "t-popover-item--active" : ""}" data-tone="workChat">
        <span class="t-popover-item-label">Work Chat</span>
        <span class="t-popover-item-sub">${(!pillButton.dataset.tone || pillButton.dataset.tone === "workChat") ? "✓" : ""}</span>
      </button>
      <div class="t-popover-divider"></div>
      <button class="t-popover-item ${pillButton.dataset.tone === "formal" ? "t-popover-item--active" : ""}" data-tone="formal">
        <span class="t-popover-item-label">Formal</span>
        <span class="t-popover-item-sub">${pillButton.dataset.tone === "formal" ? "✓" : ""}</span>
      </button>
      <div class="t-popover-divider"></div>
      <button class="t-popover-item t-popover-item--decode" data-tone="decode">
        <span class="t-popover-item-label">Decode message</span>
        <span class="t-popover-item-sub">↓</span>
      </button>
    `;

    popoverElement.querySelectorAll(".t-popover-item").forEach(item => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const tone = item.dataset.tone;
        closePopover();
        if (tone === "decode") {
          runDecode(pillButton, input);
        } else {
          pillButton.dataset.tone = tone;
          chrome.storage.sync.set({ defaultTone: tone });
          const text = getInputText(input);
          if (text && text.trim().length > 0) {
            handleConvert(pillButton, tone);
          } else {
            updatePillLabel(pillButton, input);
          }
        }
      });
    });

    popoverElement.addEventListener("mouseleave", () => {
      setTimeout(() => {
        const isOverPill = pillButton.matches(":hover");
        const isOverPopover = popoverElement.matches(":hover");
        if (!isOverPill && !isOverPopover) {
          pillButton.classList.replace("t-pill--expanded", "t-pill--rest");
          closePopover();
        }
      }, 100);
    });

    const rect = pillButton.getBoundingClientRect();
    document.documentElement.appendChild(popoverElement);
    const popHeight = popoverElement.offsetHeight;
    popoverElement.style.top = `${rect.top - popHeight - 8}px`;
    popoverElement.style.left = `${rect.right - 200}px`;

    setTimeout(() => document.addEventListener("click", closePopover, { once: true }), 10);
  }

  function closePopover() {
    document.querySelectorAll(".t-pill--popover-open").forEach(b => b.classList.remove("t-pill--popover-open"));
    document.querySelector(".t-popover")?.remove();
  }

  async function handleConvert(pillButton, toneOverride) {
    const input = pillButton.closest(".t-wrap")._tInput;
    const text = getInputText(input);
    const tone = toneOverride || pillButton.dataset.tone || "workChat";
    
    pillButton.dataset.original = text;
    pillButton.dataset.state = "loading";
    pillButton.className = "t-pill t-pill--loading";
    pillButton.querySelector(".t-pill-text").textContent = "Converting";
    pillButton.querySelector(".t-pill-text").classList.add("t-pill-text--dim");

    const { maskedText, mapping } = maskPII(text);

    try {
      chrome.runtime.sendMessage({ type: "TONESHIFT_CONVERT", text: maskedText, toneLevel: tone }, (response) => {
        if (chrome.runtime.lastError) {
          setIdle(pillButton);
          return;
        }
        if (response?.success) {
          const finalOutput = unmaskPII(response.text, mapping);
          setInputTextWithHighlight(input, text, finalOutput);
          setDone(pillButton);
        } else {
          setError(pillButton, response?.error);
        }
      });
    } catch (error) {
      setIdle(pillButton);
    }
  }

  function setError(pillButton, errorKey) {
    const msg = HUMAN_ERRORS[errorKey] || HUMAN_ERRORS.SERVER_ERROR;
    pillButton.dataset.state = "error";
    pillButton.className = "t-pill t-pill--error";
    pillButton.querySelector(".t-pill-text").textContent = msg;
    pillButton.querySelector(".t-pill-text").classList.remove("t-pill-text--dim");
    
    setTimeout(() => {
      if (pillButton.dataset.state === "error") setIdle(pillButton);
    }, 3000);
  }

  async function runDecode(pillButton, input) {
    const text = getInputText(input);
    pillButton.dataset.state = "loading";
    pillButton.classList.add("t-pill--expanded");
    pillButton.querySelector(".t-pill-text").textContent = "Decoding";

    const { maskedText, mapping } = maskPII(text);

    chrome.runtime.sendMessage({ type: "TONESHIFT_DECODE", text: maskedText }, (response) => {
      setIdle(pillButton);
      if (chrome.runtime.lastError || !response) {
        setError(pillButton, "NETWORK_ERROR");
        return;
      }
      if (response?.success) {
        const finalOutput = unmaskPII(response.text, mapping);
        showDecodeCard(finalOutput, pillButton);
      } else {
        setError(pillButton, response?.error);
      }
    });
  }

  function showDecodeCard(text, pillButton) {
    document.querySelector(".t-card")?.remove();
    const card = document.createElement("div");
    card.className = "t-card";
    card.innerHTML = `
      <div class="t-card-label">Plain English</div>
      <div class="t-card-text">${text}</div>
      <button class="t-btn-primary">Copy to Clipboard</button>
    `;
    document.body.appendChild(card);
    
    const rect = pillButton.getBoundingClientRect();
    card.style.top = `${rect.top - card.offsetHeight - 12}px`;
    card.style.left = `${rect.right - card.offsetWidth}px`;

    card.querySelector(".t-btn-primary").addEventListener("click", () => {
      navigator.clipboard.writeText(text);
      showToast("Copied!", "success");
      card.remove();
    });
    
    setTimeout(() => document.addEventListener("click", () => card.remove(), { once: true }), 100);
  }

  function setDone(pillButton) {
    pillButton.dataset.state = "undo";
    pillButton.className = "t-pill t-pill--done";
    pillButton.querySelector(".t-pill-text").textContent = "Undo";
    pillButton.querySelector(".t-pill-text").classList.remove("t-pill-text--dim");
    setTimeout(() => { if (pillButton.dataset.state === "undo") setIdle(pillButton); }, 5000);
  }

  function setIdle(pillButton) {
    pillButton.dataset.state = "idle";
    pillButton.className = "t-pill t-pill--rest";
    updatePillLabel(pillButton, pillButton.closest(".t-wrap")?._tInput);
  }

  function handleUndo(pillButton) {
    const input = pillButton.closest(".t-wrap")._tInput;
    if (pillButton.dataset.original) {
      setInputTextWithHighlight(input, null, pillButton.dataset.original, true);
    }
    setIdle(pillButton);
  }

  function positionPill(pillButton, input, isFirstLoad = false) {
    const wrapper = pillButton.closest(".t-wrap");
    if (!wrapper) return;
    
    const rect = input.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0;
    
    // Check if box is actually in viewport (clipping)
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;

    if (!isVisible || !inViewport) {
      wrapper.style.display = "none";
      return;
    }
    
    wrapper.style.display = "block";
    const targetY = rect.bottom - 12; // Pin to bottom with offset
    const targetX = rect.right - 12; // Pin to right with offset

    if (isFirstLoad || !wrapper._lastX) {
      wrapper._lastX = targetX;
      wrapper._lastY = targetY;
    } else {
      wrapper._lastX += (targetX - wrapper._lastX) * 0.25;
      wrapper._lastY += (targetY - wrapper._lastY) * 0.25;
    }

    wrapper.style.top = `${wrapper._lastY}px`;
    wrapper.style.left = `${wrapper._lastX}px`;
    wrapper.style.zIndex = "2147483647";
    
    pillButton.style.position = "absolute";
    pillButton.style.right = "8px"; 
    pillButton.style.top = "0";
    pillButton.style.transform = "translateY(-50%)";
  }

  function showToast(msg, type) {
    let toastElement = document.getElementById("t-toast");
    if (!toastElement) {
      toastElement = document.createElement("div");
      toastElement.id = "t-toast";
      document.body.appendChild(toastElement);
    }
    toastElement.textContent = msg;
    toastElement.className = `t-toast--${type}`;
    toastElement.classList.add("t-toast--show");
    setTimeout(() => toastElement.classList.remove("t-toast--show"), 3000);
  }

  scan();
  watchdog();

  const observer = new MutationObserver(() => {
    if (!window._tLastScan || Date.now() - window._tLastScan > 500) {
      scan();
      window._tLastScan = Date.now();
    }
  });

  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
})();
