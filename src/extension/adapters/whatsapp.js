/**
 * Tonal WhatsApp Adapter
 * Handles: Main Chat Input
 */

window.TonalAdapters = window.TonalAdapters || {};

window.TonalAdapters.whatsapp = {
  id: 'whatsapp',
  
  matches: (url) => url.includes('whatsapp.com'),

  selectors: [
    '#main [contenteditable="true"]',
    '#main [role="textbox"]',
    '[data-tab="10"]',
    'footer [contenteditable="true"]',
    '.lexical-rich-text-input [contenteditable="true"]'
  ],

  isValid(el) {
    const isInMain = el.closest('#main') || el.closest('footer') || el.closest('[role="main"]');
    const isSmall = el.offsetHeight < 20 && el.offsetWidth < 50; 
    return isInMain && !isSmall;
  },

  getOffsets(el) {
    return { x: 8, y: 8 };
  },

  getValue(el) {
    return (el.innerText || el.textContent || "").trim();
  },

  insertText(input, text, isRichText = false) {
    input.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, text);
    // WhatsApp specific: trigger input event
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
};
