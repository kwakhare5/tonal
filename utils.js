/* utils.js — Tonal Helper Logic */

const SELECTORS = {
  gmail: [
    'div[aria-label="Message Body"]', 
    '.Am.Al.editable', 
    'div[g_editable="true"][contenteditable="true"]', 
    '.gmail_default', 
    '[role="textbox"][aria-label*="Message"]'
  ],
  slack: [
    '.ql-editor[contenteditable="true"]', 
    '[data-lexical-editor="true"]', 
    '.p-rich_text_input__editable', 
    '[data-testid="message-editor"]', 
    '.p-rich_text_input',
    '.msg-composer__editor',
    '#message-input div[contenteditable="true"]'
  ],
  whatsapp: [
    '#main footer div[contenteditable="true"]',
    'div[data-testid="conversation-compose-box-input"]',
    'div[data-testid="message-input-content"]',
    'footer .copyable-area [contenteditable="true"]'
  ],
  linkedin: [
    '.msg-form__contenteditable', 
    '.feed-shared-update-v2__comment-box [contenteditable]', 
    '.editor-content [contenteditable="true"]', 
    '.msg-form__textarea'
  ]
};

const HUMAN_ERRORS = {
  "NO_TEXT": "Type something first",
  "AI_FAILED": "Couldn't rewrite this",
  "AI_BUSY": "AI is busy. Try again soon.",
  "RATE_LIMIT": "Taking a break. Try in 1 min.",
  "NETWORK_ERROR": "Check your internet",
  "SERVER_ERROR": "Something went wrong"
};

function getPlatform() {
  const hostname = location.hostname;
  if (hostname.includes("mail.google.com")) return "gmail";
  if (hostname.includes("slack.com")) return "slack";
  if (hostname.includes("whatsapp.com")) return "whatsapp";
  if (hostname.includes("linkedin.com")) return "linkedin";
  return null;
}

function maskPII(text) {
  const mapping = new Map();
  let counter = 0;
  const PREFIX = "__TS_PII_";

  // Emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  let maskedText = text.replace(emailRegex, (match) => {
    const placeholder = `${PREFIX}EMAIL_${counter++}__`;
    mapping.set(placeholder, match);
    return placeholder;
  });

  // Phones
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
  maskedText = maskedText.replace(phoneRegex, (match) => {
    const placeholder = `${PREFIX}PHONE_${counter++}__`;
    mapping.set(placeholder, match);
    return placeholder;
  });

  // Credit Cards (Broad detection for Visa, MC, Amex, Discover)
  const ccRegex = /\b(?:\d[ -]?){13,16}\d\b/g;
  maskedText = maskedText.replace(ccRegex, (match) => {
    const cleanCC = match.replace(/[- ]/g, "");
    if (cleanCC.length >= 13 && cleanCC.length <= 19) {
      const placeholder = `${PREFIX}CC_${counter++}__`;
      mapping.set(placeholder, match);
      return placeholder;
    }
    return match;
  });

  return { maskedText, mapping };
}

function unmaskPII(text, mapping) {
  let result = text;
  mapping.forEach((value, key) => {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const fuzzyKey = escapedKey.split('_').join('\\s*?_\\s*?');
    const re = new RegExp(fuzzyKey, 'gi');
    result = result.replace(re, value);
  });
  return result;
}

function getInputText(element) {
  const platform = getPlatform();
  const clone = element.cloneNode(true);

  if (platform === "whatsapp") {
    clone.querySelectorAll('[data-testid*="quote"], [class*="quoted-message"]').forEach(quote => quote.remove());
  }
  
  return (clone.innerText || clone.textContent || "").trim();
}

function setInputText(element, text) {
  if (element.isContentEditable) {
    element.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    
    document.execCommand('delete', false, null);
    document.execCommand('insertText', false, text);
    element.dispatchEvent(new InputEvent('input', { bubbles: true }));
  } else {
    element.value = text;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function setInputTextWithHighlight(element, oldText, newText, isUndo = false) {
  if (!element.isContentEditable) { 
    setInputText(element, newText); 
    return; 
  }
  
  element.focus();
  
  // Use SelectAll + InsertText for a cleaner replacement in React/Lexical editors
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
  
  document.execCommand('delete', false, null);
  document.execCommand('insertText', false, newText);
  
  requestAnimationFrame(() => {
    // Only dispatch 'input' - multiple events (beforeinput/change) cause duplication in React
    element.dispatchEvent(new InputEvent('input', { 
      bubbles: true, 
      cancelable: true,
      data: newText
    }));
    
    // Hammer the state for deep React/Lexical editors
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
    element.focus();
  });
  
  if (!isUndo) {
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('hiliteColor', false, 'rgba(255, 233, 153, 0.45)');
    selection.collapseToEnd();
    
    const cleanup = (event) => {
      const isInteraction = event.type === 'mousedown' || event.type === 'focus' || (event.key && event.key.length === 1);
      if (isInteraction) {
        document.execCommand('hiliteColor', false, 'transparent');
        document.execCommand('removeFormat', false, null);
        element.removeEventListener('keydown', cleanup);
        element.removeEventListener('mousedown', cleanup);
        element.removeEventListener('focus', cleanup);
        element._tCleanupActive = false;
      }
    };
    if (element._tCleanupActive) {
      element.removeEventListener('keydown', element._tCleanup);
      element.removeEventListener('mousedown', element._tCleanup);
      element.removeEventListener('focus', element._tCleanup);
    }
    element._tCleanup = cleanup;
    element._tCleanupActive = true;
    element.addEventListener('keydown', cleanup);
    element.addEventListener('mousedown', cleanup);
    element.addEventListener('focus', cleanup);
  }
}
