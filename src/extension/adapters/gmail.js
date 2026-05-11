/**
 * Tonal Gmail Adapter
 * Handles: Compose Window, Reply Area, Inline Replies
 */

window.TonalAdapters = window.TonalAdapters || {};

window.TonalAdapters.gmail = {
  id: 'gmail',
  
  matches: (url) => url.includes('mail.google.com'),

  selectors: [
    '[role="textbox"][aria-label*="Message"]', 
    '[role="textbox"][aria-label*="Body"]',
    '.editable[contenteditable="true"]',
    '.Am.Al.editable',
    '[aria-label*="Reply"] [contenteditable="true"]',
    '.dL .editable',
    'div[id*=":"][role="textbox"]' // Very common Gmail compose ID pattern
  ],

  isValid(el) {
    const label = (el.getAttribute('aria-label') || '').toLowerCase();
    const name = (el.getAttribute('name') || '').toLowerCase();
    const role = (el.getAttribute('role') || '').toLowerCase();
    
    // Block common Gmail navigation/search inputs
    if (label.includes('search') || name === 'q' || label.includes('to') || label.includes('cc') || label.includes('subject')) return false;
    
    // Gmail-specific: Compose boxes often have these classes
    const isGmailEditor = el.classList.contains('editable') || el.classList.contains('LW-avf');
    
    return label.includes('message') || label.includes('body') || isGmailEditor || role === 'textbox';
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
    
    // Sync with Gmail's Lexical/React state
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
};
