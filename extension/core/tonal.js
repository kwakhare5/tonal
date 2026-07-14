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
    CHECK: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>`,
  };

  const TONES = window.TonalConfig ? window.TonalConfig.TONES : [];

  function h(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === "className") el.className = v;
      else if (k === "textContent") el.textContent = v;
      else if (k === "innerHTML") el.innerHTML = v;
      else if (k === "style") el.style.cssText = v;
      else if (k.startsWith("on"))
        el.addEventListener(k.toLowerCase().substring(2), v);
      else el.setAttribute(k, v);
    });
    children.forEach(
      (c) =>
        c &&
        el.appendChild(typeof c === "string" ? document.createTextNode(c) : c),
    );
    return el;
  }

  return {
    TONES,
    h,
    insertText: (input, text) => {
      input.focus();
      if (input.tagName === "TEXTAREA" || input.tagName === "INPUT") {
        input.value = text;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      } else {
        document.execCommand("selectAll", false, null);

        const dataTransfer = new DataTransfer();
        dataTransfer.setData("text/plain", text);
        if (/<[a-z][\s\S]*>/i.test(text)) {
          dataTransfer.setData("text/html", text);
        }
        const pasteEvent = new ClipboardEvent("paste", {
          clipboardData: dataTransfer,
          bubbles: true,
          cancelable: true,
        });

        if (input.dispatchEvent(pasteEvent)) {
          document.execCommand("insertText", false, text);
        }

        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        input.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: " ", code: "Space" }),
        );
        input.dispatchEvent(
          new KeyboardEvent("keyup", { bubbles: true, key: " ", code: "Space" }),
        );
      }
    },
    injectStyles: (root) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = chrome.runtime.getURL("core/tonal.css");
      root.appendChild(link);
    },
    injectFonts: () => {
      if (document.getElementById("tonal-fonts")) return;
      const link = h("link", {
        id: "tonal-fonts",
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap",
      });
      const geist = h("link", {
        id: "tonal-geist",
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/geist@latest/dist/fonts/geist-sans/style.css",
      });
      const geistMono = h("link", {
        id: "tonal-geist-mono",
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/geist@latest/dist/fonts/geist-mono/style.css",
      });
      document.head.appendChild(link);
      document.head.appendChild(geist);
      document.head.appendChild(geistMono);
    },
    renderPill: (container, state, toneId, isPopoverOpen, callbacks) => {
      const tone = TONES.find((t) => t.id === toneId) || TONES[1];
      if (!container.dataset.tonalInited) {
        container.className = "t-hitbox";
        container.setAttribute("role", "button");
        container.setAttribute("aria-label", "Tonal AI Tone Selector");
        container.setAttribute("tabindex", "0");

        const pill = h("div", { className: "t-pill" });
        container.appendChild(pill);

        container.onclick = (e) => {
          if (!e.target.closest(".pill-chev-wrap")) callbacks.onClick();
        };
        container.onkeydown = (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            callbacks.onClick();
          }
        };
        container.onmouseenter = () => callbacks.onHover(true);
        container.onmouseleave = () => callbacks.onHover(false);
        container.dataset.tonalInited = "true";
      }
      const pill = container.querySelector(".t-pill");
      if (!pill) return;

      pill.className = `t-pill t-pill--${state} ${isPopoverOpen ? "t-pill--popover-open" : ""}`;

      if (state === "rest" || state === "hover") {
        pill.innerHTML = `<div class="pill-icon">${SVGS.LOGO}</div>`;
      } else if (state === "expanded") {
        const chevTransform = isPopoverOpen ? "transform: rotate(180deg);" : "";
        pill.innerHTML = `<div class="pill-icon">${SVGS.LOGO}</div><span class="pill-text">${tone.l}</span><div class="pill-chev-wrap" tabindex="0" role="button" aria-label="Toggle tone menu" style="${chevTransform}">${SVGS.CHEV}</div>`;
        const chev = pill.querySelector(".pill-chev-wrap");
        if (chev)
          chev.onclick = (e) => {
            e.stopPropagation();
            callbacks.onTogglePopover();
          };
      } else if (state === "loading") {
        pill.innerHTML = `<span class="pill-text">Converting<span class="pill-dots"></span></span>`;
      } else if (state === "done") {
        pill.innerHTML = `<span class="pill-text">Undo</span>`;
      } else if (state === "error") {
        pill.innerHTML = `<div class="pill-icon"><svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l12 12M13 1L1 13"/></svg></div><span class="pill-text" style="margin-left: 4px;">Retry</span>`;
      }
    },
    createPopover: (
      activeId,
      onSelect,
      onClose,
      onMouseEnter,
      onMouseLeave,
    ) => {
      const pop = h("div", {
        className: "popover",
        role: "listbox",
        "aria-label": "Select tone level",
        onmouseenter: onMouseEnter,
        onmouseleave: onMouseLeave,
      });
      TONES.forEach((tone, idx) => {
        const isActive = tone.id === activeId;
        const item = h(
          "div",
          {
            className: `pop-item ${isActive ? "pop-item--active" : ""}`,
            role: "option",
            "aria-selected": isActive ? "true" : "false",
            tabindex: isActive ? "-1" : "0",
            onclick: (e) => {
              e.stopPropagation();
              onSelect(tone.id);
            },
            onkeydown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(tone.id);
              }
            },
          },
          h("span", { className: "pop-label", textContent: tone.l }),
          isActive
            ? h("span", { className: "pop-check", textContent: "✓" })
            : h("span", { className: "pop-sub", textContent: tone.s }),
        );
        pop.appendChild(item);
        if (idx < TONES.length - 1)
          pop.appendChild(h("div", { className: "pop-divider" }));
      });
      pop.classList.add("popover--active");
      return pop;
    },
    createDecodeFloat: (onDecode) => {
      return h(
        "div",
        {
          className: "decode-float",
          role: "button",
          "aria-label": "Decode selected text",
          tabindex: "0",
          onclick: onDecode,
          onkeydown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onDecode();
            }
          },
        },
        h("span", { textContent: "Decode" }),
      );
    },
    createDecodeCard: (text, onClose) => {
      const copyBtn = h("div", {
        className: "decode-card-copy",
        role: "button",
        "aria-label": "Copy decoded text",
        tabindex: "0",
        innerHTML: `${SVGS.COPY} Copy`,
      });
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(text);
        copyBtn.className = "decode-card-copy decode-card-copy--copied";
        copyBtn.innerHTML = `${SVGS.CHECK} Copied!`;
        setTimeout(() => {
          copyBtn.className = "decode-card-copy";
          copyBtn.innerHTML = `${SVGS.COPY} Copy`;
        }, 2000);
      };
      copyBtn.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          copyBtn.click();
        }
      };

      return h(
        "div",
        {
          className: "decode-card",
          role: "dialog",
          "aria-label": "Decoding results",
        },
        h(
          "div",
          { className: "decode-card-header" },
          h("span", {
            className: "decode-card-tag",
            textContent: "Plain English",
          }),
          h("div", {
            className: "decode-card-close",
            role: "button",
            "aria-label": "Close card",
            tabindex: "0",
            innerHTML: SVGS.CLOSE,
            onclick: onClose,
            onkeydown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClose();
              }
            },
          }),
        ),
        h(
          "div",
          { className: "decode-card-body" },
          h("div", { className: "decode-card-text", textContent: text }),
          copyBtn,
        ),
      );
    },
    showToast: (root, msg, type = "success") => {
      const toast = h(
        "div",
        { className: `toast toast--${type}` },
        h("div", { className: `toast-dot toast-dot--${type}` }),
        h("span", { textContent: msg }),
      );
      root.appendChild(toast);
      // Trigger entrance
      requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add("toast--active"));
      });
      // Trigger exit
      setTimeout(() => {
        toast.classList.remove("toast--active");
        toast.classList.add("toast--exit");
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    },
  };
})();
