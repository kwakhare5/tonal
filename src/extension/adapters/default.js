/**
 * Tonal Default Adapter
 * Fallback for unknown platforms or general testing
 */

window.TonalAdapters = window.TonalAdapters || {};

window.TonalAdapters.default = {
  id: "default",

  matches: () => true, // Always matches as fallback

  selectors: [
    '[contenteditable="true"]',
    "textarea",
    '[role="textbox"]',
    '[role="message"]',
    ".editable",
  ],

  isValid(el) {
    // Structural Fingerprinting: Identify message fields vs simple inputs
    const rect = el.getBoundingClientRect();
    if (rect.height < 32 || rect.width < 100) return false;

    const label = (
      el.getAttribute("aria-label") ||
      el.placeholder ||
      el.id ||
      ""
    ).toLowerCase();
    const isSearch =
      label.includes("search") ||
      label.includes("filter") ||
      label.includes("query");
    if (isSearch) return false;

    // Must be editable and visible
    return (
      el.offsetHeight > 0 &&
      (el.contentEditable === "true" ||
        el.tagName === "TEXTAREA" ||
        el.getAttribute("role") === "textbox")
    );
  },

  /**
   * Checks if the selection is within a messaging area.
   * For the default adapter, we only allow it in text boxes themselves.
   */
  isInMessagingZone(el) {
    if (!el) return false;
    // Default: Only allow decoding inside active text boxes to prevent floating buttons everywhere
    return (
      el.isContentEditable ||
      el.tagName === "TEXTAREA" ||
      el.getAttribute("role") === "textbox"
    );
  },

  getOffsets(el) {
    return { x: 8, y: 8 };
  },

  getValue(el) {
    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT")
      return el.value || "";
    return (el.innerText || el.textContent || "").trim();
  },

  insertText(input, text, isRichText = false) {
    input.focus();
    if (input.tagName === "TEXTAREA" || input.tagName === "INPUT") {
      input.value = text;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      document.execCommand("selectAll", false, null);
      document.execCommand("insertText", false, text);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  },
};
