/**
 * Tonal LinkedIn Adapter
 * Handles: Main Chat, Feed Comments, InMail
 */

window.TonalAdapters = window.TonalAdapters || {};

window.TonalAdapters.linkedin = {
  id: "linkedin",

  matches: (url) => url.includes("linkedin.com"),

  selectors: [
    ".msg-form__contenteditable",
    '.msg-form__contenteditable [contenteditable="true"]',
    '[role="textbox"][aria-label*="message"]',
    '.ql-editor[contenteditable="true"]',
    ".comments-comment-box__content-editable", // Feed Comments
    '.feed-shared-update-v2__comment-box [contenteditable="true"]', // Alternative Feed Comments
    ".msg-form__textarea", // Fallback for some InMail variations
    // MACRO TARGETING: Ensure we capture generic editable elements in overlay/drawers
    '.msg-overlay-container [contenteditable="true"]',
    '.msg-overlay-container [role="textbox"]',
  ],

  isValid(el) {
    const label = (
      el.getAttribute("aria-label") ||
      el.placeholder ||
      ""
    ).toLowerCase();
    const role = (el.getAttribute("role") || "").toLowerCase();
    if (
      label.includes("search") ||
      label.includes("filter") ||
      role === "combobox"
    )
      return false;

    // MACRO CHECK: Must be inside the main scaffold, overlay container, or feed
    const macroZone = el.closest(
      ".scaffold-layout__main, .msg-overlay-container, .core-rail",
    );
    return !!macroZone && el.offsetHeight > 20;
  },

  isInMessagingZone(el) {
    if (!el) return false;
    // TARGET: Macro-pillars (Main Chat, Retractable Drawer, Feed/Comments)
    const zone = el.closest(
      '.scaffold-layout__main, .msg-overlay-container, .core-rail, [data-view-name="message-overlay"]',
    );
    return !!zone;
  },

  getOffsets(el) {
    return { x: 8, y: 8 };
  },

  getValue(el) {
    return (el.innerText || el.textContent || "").trim();
  },

  insertText(el, text, isRichText = false) {
    el.focus();
    const selection = window.getSelection();
    let offset = 0;
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      offset = range.startOffset;
    }

    document.execCommand("selectAll", false, null);

    const dataTransfer = new DataTransfer();
    dataTransfer.setData("text/plain", text);
    const pasteEvent = new ClipboardEvent("paste", {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true,
    });

    if (el.dispatchEvent(pasteEvent)) {
      document.execCommand("insertText", false, text);
    }

    // LinkedIn specific: trigger events for React/Draft.js synchronization
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    // Dispatch a dummy keyboard event to wake up the Send button logic
    el.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, key: " ", code: "Space" }),
    );
    el.dispatchEvent(
      new KeyboardEvent("keyup", { bubbles: true, key: " ", code: "Space" }),
    );

    // Cursor Anchor: Robust Multi-Tick restoration for Draft.js stability
    const restore = (attempts = 0) => {
      if (attempts > 5) return; // Guard

      el.focus();
      try {
        const selection = window.getSelection();
        const newRange = document.createRange();
        const textNode = el.firstChild || el;

        // Ensure we target a valid text offset in the current DOM state
        const maxLen =
          textNode.nodeType === 3
            ? textNode.length
            : (textNode.textContent || "").length;
        const finalPos = Math.min(offset, maxLen);

        newRange.setStart(textNode, finalPos);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } catch (e) {
        // If DOM changed, wait for next tick and try again
        setTimeout(() => restore(attempts + 1), 20);
      }
    };

    setTimeout(() => restore(), 30);
  },
};
