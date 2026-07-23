/**
 * TONAL CONTENT ORCHESTRATOR
 * Zero Bloat | Production-Hardened | Modular Deep Architecture
 */

(function () {
  // CONTEXT GUARD: If the extension was updated/reloaded, the context is invalidated.
  if (!chrome.runtime?.id) return;

  // ── 1. AI CLIENT MODULE ─────────────────────────────────────────
  class AIClient {
    static async call(text, mode, toneLevel = "workChat", attempt = 1) {
      const MAX_RETRIES = 3;
      return new Promise((resolve, reject) => {
        if (!chrome.runtime?.id) {
          return reject(new Error("Extension reloaded. Please refresh."));
        }
        chrome.runtime.sendMessage(
          {
            type: mode === "decode" ? "TONESHIFT_DECODE" : "TONESHIFT_CONVERT",
            text,
            toneLevel,
          },
          (res) => {
            if (chrome.runtime.lastError || !res || !res.success) {
              // Offline fallback: use local engine if worker is unreachable or service worker is dead
              const canFallback = mode === "convert" && (res?.offline || (!res && attempt >= 3));
              if (canFallback) {
                try {
                  resolve(OfflineToneEngine.apply(text, toneLevel));
                } catch (e) {
                  reject(new Error(res?.error || "AI Offline"));
                }
                return;
              }
              if (attempt < MAX_RETRIES) {
                setTimeout(
                  () =>
                    AIClient.call(text, mode, toneLevel, attempt + 1)
                      .then(resolve)
                      .catch(reject),
                  Math.pow(2, attempt) * 500,
                );
              } else {
                reject(new Error(res?.error || "AI Offline"));
              }
            } else {
              // Track real usage stats
              if (mode === "decode") {
                const wordCount = text.trim().split(/\s+/).length;
                chrome.storage.local.get({ statDecoded: 0 }, (s) => {
                  chrome.storage.local.set({ statDecoded: s.statDecoded + wordCount });
                });
              } else {
                chrome.storage.local.get({ statRewrites: 0 }, (s) => {
                  chrome.storage.local.set({ statRewrites: s.statRewrites + 1 });
                });
              }
              resolve(res.text);
            }
          },
        );
      });
    }
  }

  // ── 1b. OFFLINE TONE ENGINE ──────────────────────────────────────
  const OfflineToneEngine = {
    _rules: {
      formal: [
        [/\bwanna\b/gi, "want to"], [/\bgonna\b/gi, "going to"],
        [/\bgotta\b/gi, "have to"], [/\bkinda\b/gi, "somewhat"],
        [/\bsorta\b/gi, "somewhat"], [/\bya\b/gi, "you"],
        [/\byeah\b/gi, "yes"], [/\bnope\b/gi, "no"],
        [/\bcool\b/gi, "excellent"], [/\bawesome\b/gi, "excellent"],
        [/\bstuff\b/gi, "items"], [/\bthing\b/gi, "matter"],
        [/\bget\b/gi, "obtain"], [/\bfix\b/gi, "resolve"],
        [/\bcheck out\b/gi, "review"], [/\bkick off\b/gi, "commence"],
        [/\bdig into\b/gi, "investigate"], [/\bwrap up\b/gi, "conclude"],
        [/\btouch base\b/gi, "follow up"], [/\bloop in\b/gi, "include"],
        [/\bgrab\b/gi, "obtain"], [/\bshow\b/gi, "demonstrate"],
        [/\btalk\b/gi, "discuss"], [/\bsend\b/gi, "transmit"],
        [/\bask\b/gi, "inquire"], [/\btell\b/gi, "inform"],
        [/\bjust\b/gi, ""], [/\bbasically\b/gi, ""],
        [/\bliterally\b/gi, ""], [/\bactually\b/gi, ""],
      ],
      casual: [
        [/\bI would like to\b/gi, "I'd love to"],
        [/\bI am writing to\b/gi, "reaching out about"],
        [/\bplease find attached\b/gi, "here's"],
        [/\bfurthermore\b/gi, "also"], [/\bmoreover\b/gi, "plus"],
        [/\bnevertheless\b/gi, "still"], [/\bconsequently\b/gi, "so"],
        [/\bsubsequently\b/gi, "then"], [/\butilize\b/gi, "use"],
        [/\bfacilitate\b/gi, "help"], [/\bascertain\b/gi, "find out"],
        [/\btransmit\b/gi, "send"], [/\binquire\b/gi, "ask"],
        [/\binform\b/gi, "tell"], [/\bobtain\b/gi, "get"],
        [/\bcommence\b/gi, "start"], [/\bconclude\b/gi, "wrap up"],
        [/\bdemonstrate\b/gi, "show"],
      ],
      workChat: [
        [/\bI would like to\b/gi, "I want to"],
        [/\bplease find attached\b/gi, "here's"],
        [/\butilize\b/gi, "use"], [/\bfacilitate\b/gi, "help"],
        [/\bwanna\b/gi, "want to"], [/\bgonna\b/gi, "going to"],
        [/\byeah\b/gi, "yes"], [/\bnope\b/gi, "no"],
      ],
    },
    apply(text, toneLevel) {
      const rules = this._rules[toneLevel] || this._rules.workChat;
      let result = text;
      for (const [pattern, replacement] of rules) {
        result = result.replace(pattern, replacement);
      }
      // Collapse multiple spaces left by empty replacements
      return result.replace(/  +/g, " ").trim();
    },
  };

  // ── 2. MAGNET PHYSICS MODULE (Performance Optimized) ──────────
  class MagnetPhysics {
    constructor() {
      this.activeTargets = new Map(); // el -> { el, threshold, pullFactor, center: {x, y} }
      this.ticking = false;
    }

    register(el, threshold, pullFactor) {
      this.activeTargets.set(el, {
        el,
        threshold,
        pullFactor,
        center: null,
      });
      this.refreshElement(el);
    }

    unregister(el) {
      this.activeTargets.delete(el);
    }

    refreshElement(el) {
      const target = this.activeTargets.get(el);
      if (!target) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        target.center = null;
        return;
      }
      target.center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }

    refreshAll() {
      this.activeTargets.forEach((target, el) => {
        this.refreshElement(el);
      });
    }

    handleMouseMove(clientX, clientY) {
      if (this.ticking) return;
      this.ticking = true;

      requestAnimationFrame(() => {
        this.processPhysics(clientX, clientY);
        this.ticking = false;
      });
    }

    processPhysics(clientX, clientY) {
      this.activeTargets.forEach((target) => {
        if (
          !target.center ||
          target.el.style.display === "none" ||
          !target.el.isConnected
        ) {
          target.el.style.transform = "";
          return;
        }

        const dx = clientX - target.center.x;
        const dy = clientY - target.center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < target.threshold) {
          const pull = (target.threshold - dist) / target.threshold;
          const easePull = pull * pull * (3 - 2 * pull);
          const x = dx * easePull * target.pullFactor;
          const y = dy * easePull * target.pullFactor;
          const isRestPill = target.el.classList.contains("t-pill--rest");
          target.el.style.transform = `translate(${x}px, ${y}px) scale(${isRestPill ? 1.08 : 1})`;
        } else {
          target.el.style.transform = "";
        }
      });
    }
  }

  // ── 3. DECODE CONTROLLER MODULE ────────────────────────────────
  class DecodeController {
    constructor(shadowRoot, magnetPhysics) {
      this.shadowRoot = shadowRoot;
      this.magnetPhysics = magnetPhysics;
      this.button = null;
      this.card = null;
      this.selectedText = "";
      this.selectedRect = null;
      this.isDecoding = false;
      this.debounceTimeout = null;
      this.preventHide = false;
    }

    handleSelection() {
      if (this.isDecoding || this.preventHide) return;
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text.length > 0 && !this.card) {
        const adapter = window.tonalAdapters.manager.getAdapter();
        if (selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        const node = range.commonAncestorContainer;
        const container = node.nodeType === 3 ? node.parentElement : node;

        if (!container || typeof container.closest !== "function") {
          this.hideButton();
          return;
        }

        if (
          adapter &&
          adapter.isInMessagingZone &&
          !adapter.isInMessagingZone(container)
        ) {
          this.hideButton();
          return;
        }

        this.selectedText = text;
        this.selectedRect = range.getBoundingClientRect();
        this.showButton();
      } else {
        this.hideButton();
      }
    }

    showButton() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        const rect = this.selectedRect;
        if (!rect || !this.selectedText) return;

        if (!this.button) {
          this.button = window.tonal.createDecodeFloat(() => this.decodeText());
          this.shadowRoot.appendChild(this.button);
          this.magnetPhysics.register(this.button, 60, 0.35);
        }

        const btn = this.button;
        btn.style.display = "inline-flex";
        const safeRect = this.getSafeRect(rect);
        const left = safeRect.left + safeRect.width / 2 - 36;
        let top = safeRect.top - 32;
        if (rect.top < 40) top = safeRect.top + safeRect.height + 4;

        Object.assign(btn.style, {
          left: `${Math.max(12, Math.min(left, window.innerWidth - 84))}px`,
          top: `${top}px`,
        });

        this.magnetPhysics.refreshElement(btn);

        requestAnimationFrame(() => btn.classList.add("decode-float--active"));
      }, 150);
    }

    hideButton() {
      if (this.button) {
        this.button.classList.remove("decode-float--active");
        const btn = this.button;
        setTimeout(() => {
          if (btn.classList.contains("decode-float--active")) return;
          btn.style.display = "none";
        }, 300);
      }
    }

    updatePositions() {
      if (this.isDecoding) return;
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text.length > 0 && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Hide if the selected text scrolls completely out of the viewport (Option A)
        const isOutOfViewport =
          rect.bottom < 0 ||
          rect.top > window.innerHeight ||
          rect.right < 0 ||
          rect.left > window.innerWidth;

        if (isOutOfViewport) {
          this.hideButton();
          this.dismissCard();
          return;
        }

        this.selectedRect = rect;

        if (
          this.button &&
          this.button.style.display !== "none" &&
          this.button.classList.contains("decode-float--active")
        ) {
          const safeRect = this.getSafeRect(rect);
          const left = safeRect.left + safeRect.width / 2 - 36;
          let top = safeRect.top - 32;
          if (rect.top < 40) top = safeRect.top + safeRect.height + 4;

          Object.assign(this.button.style, {
            left: `${Math.max(12, Math.min(left, window.innerWidth - 84))}px`,
            top: `${top}px`,
          });
          this.magnetPhysics.refreshElement(this.button);
        }

        if (
          this.card &&
          this.card.style.display !== "none" &&
          this.card.classList.contains("decode-card--active")
        ) {
          if (this.card.style.position === "fixed") return;

          const cardWidth = 288;
          const safeRect = this.getSafeRect(rect);
          let left = safeRect.left + safeRect.width / 2 - cardWidth / 2;
          let top = safeRect.top + safeRect.height + 12;

          const safeHeight = 420;
          if (top + safeHeight > window.innerHeight - 24) {
            const aboveTop = safeRect.top - safeHeight - 12;
            if (aboveTop > 12) {
              top = aboveTop;
            }
          }

          left = Math.max(12, Math.min(left, window.innerWidth - cardWidth - 12));
          Object.assign(this.card.style, {
            left: `${left}px`,
            top: `${top}px`,
          });
        }
      }
    }

    async decodeText() {
      const text = this.selectedText;
      if (!text || this.isDecoding) return;
      this.isDecoding = true;
      this.hideButton();
      try {
        const result = await AIClient.call(text, "decode");
        this.isDecoding = false;
        this.showCard(result, this.selectedRect);
      } catch (err) {
        this.isDecoding = false;
        window.tonal.showToast(this.shadowRoot, "Decode failed", "error");
      }
    }

    showCard(resultText, rect) {
      if (this.card) this.card.remove();
      const cardWidth = 288;
      const safeHeight = 420;
      const vH = window.innerHeight;
      const vW = window.innerWidth;

      const safeRect = this.getSafeRect(rect);
      let left = safeRect.left + safeRect.width / 2 - cardWidth / 2;
      let top = safeRect.top + safeRect.height + 12;

      const dismissCard = () => this.dismissCard();

      if (top + safeHeight > vH - 24) {
        const aboveTop = safeRect.top - safeHeight - 12;
        if (aboveTop > 12) {
          top = aboveTop;
        } else {
          this.card = window.tonal.createDecodeCard(resultText, dismissCard);
          Object.assign(this.card.style, {
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            display: "block",
          });
          this.shadowRoot.appendChild(this.card);
          requestAnimationFrame(() =>
            this.card.classList.add("decode-card--active"),
          );
          return;
        }
      }

      left = Math.max(12, Math.min(left, vW - cardWidth - 12));
      this.card = window.tonal.createDecodeCard(resultText, dismissCard);
      Object.assign(this.card.style, {
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        display: "block",
      });
      this.shadowRoot.appendChild(this.card);
      requestAnimationFrame(() =>
        this.card.classList.add("decode-card--active"),
      );
    }

    dismissCard() {
      if (!this.card) return;
      this.card.classList.remove("decode-card--active");
      const node = this.card;
      setTimeout(() => {
        if (node) node.remove();
        if (this.card === node) this.card = null;
      }, 200);
    }

    getSafeRect(rect) {
      const host = document.getElementById("tonal-root");
      if (!host) return rect;
      const hRect = host.getBoundingClientRect();
      return {
        left: rect.left - hRect.left,
        top: rect.top - hRect.top,
        width: rect.width,
        height: rect.height,
      };
    }
  }

  // ── 4. TONAL REGISTRY MODULE (Scanning & Position Batching) ──
  class TonalRegistry {
    constructor(shadowRoot, magnetPhysics) {
      this.shadowRoot = shadowRoot;
      this.magnetPhysics = magnetPhysics;
      this.registry = new Map(); // input -> entry
      this.updatePending = false;
      this.resizeObserver = new ResizeObserver(() =>
        this.requestPositionUpdate(),
      );
      this.scanTimeout = null;
    }

    scan() {
      if (!chrome.runtime?.id) return;
      if (this.scanTimeout) clearTimeout(this.scanTimeout);
      this.scanTimeout = setTimeout(() => {
        if (document.visibilityState === "hidden") return;
        const adapter = window.tonalAdapters.manager.getAdapter();
        if (!adapter || adapter.id === "none") return;

        const scanNode = (root) => {
          root.querySelectorAll(adapter.selectors.join(",")).forEach((el) => {
            if (el.dataset.tonal || !adapter.isValid(el)) return;
            el.dataset.tonal = "v5";
            this.register(el, adapter);
          });
          root
            .querySelectorAll(
              "div, section, main, footer, header, aside, [role], [data-tonal-host]",
            )
            .forEach((el) => {
              if (el.shadowRoot && el.id !== "tonal-root") {
                scanNode(el.shadowRoot);
              }
            });
        };
        scanNode(document);
      }, 150);
    }

    register(input, adapter) {
      const wrap = window.tonal.h("div", {
        className: "t-wrap",
        style: "position:absolute; pointer-events:auto; width:0; height:0;",
      });
      this.shadowRoot.appendChild(wrap);

      const entry = {
        input,
        wrap,
        adapter,
        state: "rest",
        tone: "workChat",
        popover: false,
        pill: null,
        isMouseOver: false,
      };
      this.registry.set(input, entry);
      this.resizeObserver.observe(input);

      const hostname = window.location.hostname;
      chrome.storage.sync.get("defaultTone", (res) => {
        // Apply per-site memory if available, fall back to global default
        chrome.storage.local.get({ toneMemory: {} }, (local) => {
          if (local.toneMemory[hostname]) {
            entry.tone = local.toneMemory[hostname];
          } else if (res.defaultTone) {
            entry.tone = res.defaultTone;
          }
          this.render(input);
          this.requestPositionUpdate();
        });
      });

      input.addEventListener(
        "input",
        () => {
          if (entry.state === "done") entry.state = "rest";
          if (entry.popover) {
            entry.popover = false;
            entry.state = "rest";
          }
          this.render(input);
        },
        { passive: true },
      );
    }

    render(input) {
      const entry = this.registry.get(input);
      if (!entry) return;

      if (!entry.pill) {
        entry.pill = window.tonal.h("div", {
          className: "t-pill",
          style:
            "position:absolute; right:0; bottom:0; transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);",
        });
        entry.wrap.appendChild(entry.pill);
        this.magnetPhysics.register(entry.pill, 50, 0.25);
      }

      window.tonal.renderPill(
        entry.pill,
        entry.state,
        entry.tone,
        entry.popover,
        {
          onClick: () => {
            if (entry.state === "rest") {
              entry.state = "expanded";
              this.render(input);
            } else if (entry.state === "expanded") {
              this.convert(input);
            } else if (entry.state === "done") {
              this.undo(input);
            }
          },
          onTogglePopover: () => {
            entry.popover = !entry.popover;
            if (!entry.popover) {
              entry.state = entry.isMouseOver ? "expanded" : "rest";
            }
            this.render(input);
          },
          onHover: (hover) => {
            entry.isMouseOver = hover;
            if (hover) {
              if (entry.hoverTimer) clearTimeout(entry.hoverTimer);
              if (!entry.popover && entry.state !== "done") {
                entry.state = "expanded";
                this.render(input);
              }
            } else {
              entry.hoverTimer = setTimeout(() => {
                if (
                  !entry.isMouseOver &&
                  !entry.isMouseOverPopover &&
                  !entry.popover &&
                  entry.state !== "done" &&
                  entry.state !== "loading"
                ) {
                  entry.state = "rest";
                  this.render(input);
                }
              }, 250);
            }
          },
        },
      );

      this.updatePopoverState(entry);
      this.magnetPhysics.refreshElement(entry.pill);
    }

    updatePopoverState(entry) {
      if (entry.popover) {
        if (!entry.popNode) {
          entry.popNode = window.tonal.createPopover(
            entry.tone,
            (t) => {
              entry.tone = t;
              entry.popover = false;
              entry.state = entry.isMouseOver ? "expanded" : "rest";
              // Save as global default AND per-site memory
              chrome.storage.sync.set({ defaultTone: t });
              const hostname = window.location.hostname;
              chrome.storage.local.get({ toneMemory: {} }, (local) => {
                const updated = { ...local.toneMemory, [hostname]: t };
                chrome.storage.local.set({ toneMemory: updated });
              });
              this.render(entry.input);
              this.convert(entry.input);
            },
            () => {
              entry.popover = false;
              entry.state = entry.isMouseOver ? "expanded" : "rest";
              this.render(entry.input);
            },
            () => {
              entry.isMouseOverPopover = true;
              if (entry.hoverTimer) clearTimeout(entry.hoverTimer);
            },
            () => {
              entry.isMouseOverPopover = false;
              entry.hoverTimer = setTimeout(() => {
                if (
                  !entry.isMouseOver &&
                  !entry.isMouseOverPopover &&
                  !entry.popover &&
                  entry.state !== "done" &&
                  entry.state !== "loading"
                ) {
                  entry.state = "rest";
                  this.render(entry.input);
                }
              }, 250);
            },
          );
          entry.wrap.appendChild(entry.popNode);
        }
        const isCramped = entry.input.getBoundingClientRect().top < 220;
        Object.assign(entry.popNode.style, {
          position: "absolute",
          right: "0",
          bottom: isCramped ? "auto" : "40px",
          top: isCramped ? "24px" : "auto",
          transformOrigin: isCramped ? "top right" : "bottom right",
        });
        requestAnimationFrame(() => {
          if (entry.popNode) entry.popNode.classList.add("popover--active");
        });
      } else if (entry.popNode) {
        entry.popNode.classList.remove("popover--active");
        const node = entry.popNode;
        setTimeout(() => node.remove(), 200);
        entry.popNode = null;
      }
    }

    async convert(input) {
      const entry = this.registry.get(input);
      if (!entry) return;
      const currentText = entry.adapter.getValue(input);
      if (!currentText || currentText.length < 2) {
        return window.tonal.showToast(
          this.shadowRoot,
          "Type something first",
          "error",
        );
      }
      const textAtStart = currentText;
      if (entry.state !== "done") {
        entry.originalText = currentText;
      }
      const sourceText = entry.originalText || currentText;
      entry.state = "loading";
      this.render(input);

      try {
        let res = await AIClient.call(sourceText, "convert", entry.tone);
        if (entry.adapter.getValue(input) !== textAtStart) {
          window.tonal.showToast(
            this.shadowRoot,
            "Draft changed. Re-click to update.",
            "error",
          );
          entry.state = "rest";
          this.render(input);
          return;
        }
        const trimmed = (res || "").trim();
        entry.adapter.insertText(input, trimmed, input.isContentEditable);
        entry.state = "done";
        // Persist undo history (cap at 10)
        const histEntry = {
          originalText: entry.originalText,
          rewrittenText: trimmed,
          tone: entry.tone,
          ts: Date.now(),
        };
        chrome.storage.local.get({ undoHistory: [] }, (s) => {
          const history = [histEntry, ...s.undoHistory].slice(0, 10);
          chrome.storage.local.set({ undoHistory: history });
        });
        window.tonal.showToast(this.shadowRoot, "Converted");
      } catch (err) {
        entry.state = "error";
        let msg = "AI Offline";
        if (err.message === "Failed to fetch") msg = "Check your internet";
        if (err.message === "Extension reloaded. Please refresh.") msg = "Extension updated. Refresh page.";
        window.tonal.showToast(this.shadowRoot, msg, "error");
      }
      this.render(input);
    }

    undo(input) {
      const entry = this.registry.get(input);
      if (!entry) return;
      if (entry.originalText) {
        entry.adapter.insertText(input, entry.originalText, input.isContentEditable);
        entry.state = "rest";
        this.render(input);
        window.tonal.showToast(this.shadowRoot, "Restored");
        return;
      }
      // Fallback: restore from persisted history if in-memory original is gone
      chrome.storage.local.get({ undoHistory: [] }, (s) => {
        const last = s.undoHistory[0];
        if (last) {
          entry.adapter.insertText(input, last.originalText, input.isContentEditable);
          entry.state = "rest";
          this.render(input);
          window.tonal.showToast(this.shadowRoot, "Restored from history");
        }
      });
    }

    requestPositionUpdate() {
      if (this.updatePending) return;
      this.updatePending = true;
      requestAnimationFrame(() => {
        this.updatePositions();
        this.updatePending = false;
      });
    }

    updatePositions() {
      const host = document.getElementById("tonal-root");
      if (!host) return;
      const hRect = host.getBoundingClientRect();

      // Performance Optimization: Batch DOM Reads first to avoid Layout Thrashing
      const updates = [];
      this.registry.forEach((entry, input) => {
        if (!input.isConnected) {
          updates.push({ entry, input, disconnect: true });
          return;
        }
        const rect = input.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          updates.push({ entry, input, visible: false });
          return;
        }
        updates.push({
          entry,
          input,
          visible: true,
          left: rect.left - hRect.left,
          top: rect.top - hRect.top,
          width: rect.width,
          height: rect.height,
        });
      });

      // Batch DOM Writes
      updates.forEach(
        ({ entry, input, disconnect, visible, left, top, width, height }) => {
          if (disconnect) {
            if (this.resizeObserver) this.resizeObserver.unobserve(input);
            this.magnetPhysics.unregister(entry.pill);
            entry.wrap.remove();
            this.registry.delete(input);
            return;
          }
          if (!visible) {
            entry.wrap.style.display = "none";
            if (entry.popover || entry.state !== "rest") {
              entry.popover = false;
              entry.state = "rest";
              this.updatePopoverState(entry);
              this.render(input);
            }
            return;
          }

          entry.wrap.style.display = "block";
          const offsets = entry.adapter.getOffsets
            ? entry.adapter.getOffsets(input)
            : { x: 8, y: 8 };
          entry.wrap.style.left = `${left + width - offsets.x}px`;
          entry.wrap.style.top = `${top + height - offsets.y}px`;

          this.magnetPhysics.refreshElement(entry.pill);
        },
      );
    }
  }

  // ── 5. TONAL BOOTSTRAP MODULE ──────────────────────────────────
  class TonalBootstrap {
    constructor() {
      this.pillEnabled = true;
      this.decodeEnabled = true;
      this.shadowRoot = this.getShadowRoot();
      this.magnetPhysics = new MagnetPhysics();
      this.decodeController = new DecodeController(
        this.shadowRoot,
        this.magnetPhysics,
      );
      this.registry = new TonalRegistry(this.shadowRoot, this.magnetPhysics);

      // Read feature toggles before wiring listeners
      chrome.storage.sync.get({ pillEnabled: true, decodeEnabled: true }, (res) => {
        this.pillEnabled = res.pillEnabled;
        this.decodeEnabled = res.decodeEnabled;
        this.initGlobalListeners();
        this.initObservers();
      });
      window.tonal.injectFonts(this.shadowRoot);
    }

    getShadowRoot() {
      let host = document.getElementById("tonal-root");
      if (!host) {
        host = document.createElement("div");
        host.id = "tonal-root";
        host.style.cssText =
          "position:fixed; top:0; left:0; width:100%; height:100%; z-index:2147483647; pointer-events:none;";
        (document.body || document.documentElement).appendChild(host);
      }
      const shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
      if (!shadow.querySelector("style")) {
        window.tonal.injectStyles(shadow);
      }
      return shadow;
    }

    initGlobalListeners() {
      document.addEventListener("click", (e) => this.dismissPopovers(e));
      document.addEventListener("selectionchange", () => {
        if (!this.decodeEnabled) return;
        this.decodeController.handleSelection();
      });
      document.addEventListener("mousemove", (e) =>
        this.magnetPhysics.handleMouseMove(e.clientX, e.clientY),
      );
      document.addEventListener("click", () => {
        if (this.pillEnabled) this.registry.scan();
      }, {
        passive: true,
      });
      document.addEventListener("focusin", () => {
        if (this.pillEnabled) this.registry.scan();
      }, {
        passive: true,
      });

      document.addEventListener("mousedown", (e) => {
        const path = e.composedPath();
        const onDecodeUI = path.some(
          (el) =>
            el.classList &&
            (el.classList.contains("decode-float") ||
              el.classList.contains("decode-card")),
        );
        this.decodeController.preventHide = onDecodeUI;
      });

      document.addEventListener("mouseup", () => {
        setTimeout(() => {
          this.decodeController.preventHide = false;
        }, 50);
      });

      const onSync = () => {
        this.registry.requestPositionUpdate();
        this.decodeController.updatePositions();
        this.magnetPhysics.refreshAll();
      };
      window.addEventListener("resize", onSync, { passive: true });
      document.addEventListener("scroll", onSync, {
        passive: true,
        capture: true,
      });

      chrome.storage.onChanged.addListener((changes) => {
        if (changes.defaultTone) {
          this.registry.registry.forEach((entry) => {
            entry.tone = changes.defaultTone.newValue;
            this.registry.render(entry.input);
          });
        }
        if (changes.pillEnabled) {
          this.pillEnabled = changes.pillEnabled.newValue;
          if (!this.pillEnabled) {
            // Clean up all existing pills immediately
            this.registry.registry.forEach((entry) => {
              this.magnetPhysics.unregister(entry.pill);
              entry.wrap.remove();
            });
            this.registry.registry.clear();
            // Reset data-tonal markers so pills re-register when re-enabled
            document.querySelectorAll('[data-tonal]').forEach((el) => delete el.dataset.tonal);
          }
        }
        if (changes.decodeEnabled) {
          this.decodeEnabled = changes.decodeEnabled.newValue;
          if (!this.decodeEnabled) {
            this.decodeController.hideButton();
            this.decodeController.dismissCard();
          }
        }
      });

      // Keyboard shortcut: TONAL_ACTIVATE sent from background.js
      chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type !== "TONAL_ACTIVATE" || !this.pillEnabled) return;
        // Find the first registered input that is currently focused or visible
        const activeEl = document.activeElement;
        let entry = this.registry.registry.get(activeEl);
        if (!entry) {
          // Fall back to first registered entry
          entry = this.registry.registry.values().next().value;
        }
        if (entry) {
          entry.state = "expanded";
          entry.popover = true;
          this.registry.render(entry.input);
          entry.input.focus();
        }
      });
    }

    initObservers() {
      this.observer = new MutationObserver((mutations) => {
        if (!this.pillEnabled) return;
        // Skip if only tonal's own root changed (prevents scan loops)
        const relevant = mutations.some((m) => {
          if (m.target && m.target.id === 'tonal-root') return false;
          if (m.addedNodes.length === 0 && m.removedNodes.length === 0) return false;
          return true;
        });
        if (relevant) this.registry.scan();
      });
      this.observer.observe(document.body, { childList: true, subtree: true });

      if (this.pillEnabled) this.registry.scan();
    }

    dismissPopovers(e) {
      const path = e.composedPath();
      if (
        this.decodeController.card &&
        !path.includes(this.decodeController.card)
      ) {
        this.decodeController.dismissCard();
      }
      this.registry.registry.forEach((entry) => {
        if (entry.popover && !path.includes(entry.wrap)) {
          entry.popover = false;
          entry.state = "rest";
          this.registry.render(entry.input);
        }
      });
    }
  }

  if (window.tonal) {
    window.tonalInjector = new TonalBootstrap();
    console.info(
      "%c tonal Elite %c Active on " + window.location.host,
      "background: #000; color: #fff; padding: 2px 5px; border-radius: 3px;",
      "color: #888;",
    );
  }
})();
