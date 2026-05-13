/**
 * Tonal Slack Adapter
 * Handles: Channel Chat, Direct Messages, Thread Replies
 */

window.TonalAdapters = window.TonalAdapters || {};

window.TonalAdapters.slack = {
  id: "slack",

  matches: (url) => url.includes("slack.com"),

  selectors: [
    '.ql-editor[contenteditable="true"]', // Legacy Quill
    '.lexical-editor [contenteditable="true"]', // Modern Lexical
    '[data-lexical-editor="true"]', // Lexical Root
    '[aria-label*="Message"]',
    '.c-wysiwyg_container [contenteditable="true"]',
    '.p-message_input_field [contenteditable="true"]',
    // MACRO TARGETING
    '.p-workspace__secondary_view [contenteditable="true"]',
    '.p-threads_view_root [contenteditable="true"]',
  ],

  isValid(el) {
    const label = (el.getAttribute("aria-label") || "").toLowerCase();
    const role = (el.getAttribute("role") || "").toLowerCase();
    if (
      label.includes("jump to") ||
      label.includes("search") ||
      role === "combobox"
    )
      return false;

    // MACRO CHECK: Ensure it's in the primary workspace, secondary (thread) drawer, or huddle
    const macroZone = el.closest(
      ".p-workspace__primary_view, .p-workspace__secondary_view, .p-threads_view_root, .p-flexpane",
    );
    return !!macroZone && el.offsetHeight > 20;
  },

  isInMessagingZone(el) {
    if (!el) return false;
    // TARGET: Macro-pillars (Main Workspace, Secondary Drawer/Threads)
    const zone = el.closest(
      ".p-workspace__primary_view, .p-workspace__secondary_view, .p-threads_view_root, .p-flexpane",
    );
    return !!zone;
  },

  getOffsets(el) {
    return { x: 8, y: 8 };
  },

  getValue(el) {
    return (el.innerText || el.textContent || "").trim();
  },

  insertText(input, text, isRichText = false) {
    input.focus();
    document.execCommand("selectAll", false, null);

    const dataTransfer = new DataTransfer();
    dataTransfer.setData("text/plain", text);
    const pasteEvent = new ClipboardEvent("paste", {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true,
    });

    if (input.dispatchEvent(pasteEvent)) {
      document.execCommand("insertText", false, text);
    }

    // Slack specific: trigger events so the editor updates its state
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, key: " " }),
    ); // Force update
  },
};
