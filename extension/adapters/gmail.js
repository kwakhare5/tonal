/**
 * Tonal Gmail Adapter
 * Handles: Compose Window, Reply Area, Inline Replies
 */

window.TonalAdapters = window.TonalAdapters || {};

window.TonalAdapters.gmail = {
  id: "gmail",

  matches: (url) => url.includes("mail.google.com"),

  selectors: [
    '[role="textbox"][aria-label*="Message"]',
    '[role="textbox"][aria-label*="Body"]',
    '.editable[contenteditable="true"]',
    ".Am.Al.editable",
    '[aria-label*="Reply"] [contenteditable="true"]',
    ".dL .editable",
    'div[id*=":"][role="textbox"]', // Very common Gmail compose ID pattern
    // MACRO TARGETING: Any editable in a dialog
    '[role="dialog"] [contenteditable="true"]',
    '[role="dialog"] [role="textbox"]',
  ],

  isValid(el) {
    const label = (el.getAttribute("aria-label") || "").toLowerCase();
    const name = (el.getAttribute("name") || "").toLowerCase();
    const role = (el.getAttribute("role") || "").toLowerCase();

    // Block common Gmail navigation/search inputs
    if (
      label.includes("search") ||
      name === "q" ||
      label.includes("to") ||
      label.includes("cc") ||
      label.includes("subject")
    )
      return false;

    // MACRO CHECK: Must be inside main body or a popup dialog
    const macroZone = el.closest('[role="main"], [role="dialog"], .nH');
    return !!macroZone && el.offsetHeight > 20;
  },

  isInMessagingZone(el) {
    if (!el) return false;
    // TARGET: Macro-pillars (Main Workspace, Retractable Compose Dialogs)
    const zone = el.closest('[role="main"], [role="dialog"], .nH');
    return !!zone;
  },

  getOffsets(el) {
    return { x: 8, y: 8 };
  },

  getValue(el) {
    // Always return plain text for AI processing — never innerHTML.
    // Gmail's paste handler reconstructs the rich-text HTML structure on insert.
    return (el.innerText || el.textContent || "").trim();
  },

  insertText(input, text, isRichText = false) {
    window.Tonal.insertText(input, text);
  },
};
