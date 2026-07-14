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
    // MACRO TARGETING: Ensure we capture generic editable elements in overlay/drawers and post creation modals
    '.msg-overlay-container [contenteditable="true"]',
    '.msg-overlay-container [role="textbox"]',
    '.share-creation-state__member-editor [contenteditable="true"]',
    '.share-creation-state__member-editor',
    '.artdeco-modal [contenteditable="true"]',
    '.artdeco-modal [role="textbox"]'
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

    // MACRO CHECK: Must be inside the main scaffold, overlay container, feed, or modal dialog
    const macroZone = el.closest(
      ".scaffold-layout__main, .msg-overlay-container, .core-rail, .artdeco-modal, .share-creation-state"
    );
    return !!macroZone && el.offsetHeight > 20;
  },

  isInMessagingZone(el) {
    if (!el) return false;
    // TARGET: Macro-pillars (Main Chat, Retractable Drawer, Feed/Comments, Post Creation Dialog)
    const zone = el.closest(
      '.scaffold-layout__main, .msg-overlay-container, .core-rail, [data-view-name="message-overlay"], .artdeco-modal, .share-creation-state'
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

    window.Tonal.insertText(el, text);

    // Cursor Anchor: Robust Multi-Tick restoration for Draft.js stability
    const restore = (attempts = 0) => {
      if (attempts > 5) return; // Guard

      el.focus();
      try {
        const selection = window.getSelection();
        const newRange = document.createRange();
        
        // Find the last text node in the element tree
        let textNode = el;
        while (textNode && textNode.nodeType !== 3 && textNode.lastChild) {
          textNode = textNode.lastChild;
        }

        // Ensure we target a valid text offset in the current DOM state
        const maxLen =
          textNode.nodeType === 3
            ? textNode.length
            : (textNode.textContent || "").length;

        newRange.setStart(textNode, maxLen);
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
