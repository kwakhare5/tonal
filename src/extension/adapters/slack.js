/**
 * Tonal Slack Adapter
 * Handles: Channel Chat, Direct Messages, Thread Replies
 */

window.TonalAdapters = window.TonalAdapters || {};

window.TonalAdapters.slack = {
  id: 'slack',
  
  matches: (url) => url.includes('slack.com'),

  selectors: [
    '.ql-editor[contenteditable="true"]', // Legacy Quill
    '.lexical-editor [contenteditable="true"]', // Modern Lexical
    '[data-lexical-editor="true"]', // Lexical Root
    '[aria-label*="Message"]',
    '.c-wysiwyg_container [contenteditable="true"]',
    '.p-message_input_field [contenteditable="true"]'
  ],

  isValid(el) {
    const label = (el.getAttribute('aria-label') || '').toLowerCase();
    const role = (el.getAttribute('role') || '').toLowerCase();
    if (label.includes('jump to') || label.includes('search') || role === 'combobox') return false;
    return label.includes('message') || el.closest('.p-message_input') || el.classList.contains('lexical-editor');
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
    // Slack specific: trigger events so the Quill editor updates its state
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: ' ' })); // Force update
  }
};
