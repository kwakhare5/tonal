window.TonalAdapters = window.TonalAdapters || {};

window.TonalAdapters.linkedin = {
  matches: (url) => url.includes('linkedin.com'),
  insertText: (container, text, isRichText = false) => {
    // 1. Locate the actual Draft.js editor node
    const input = container.getAttribute('contenteditable') === 'true' 
      ? container 
      : container.querySelector('[contenteditable="true"]');
      
    if (!input) return;
    input.focus();

    // 2. Draft.js absolutely requires a hard native selection clear
    const range = document.createRange();
    range.selectNodeContents(input);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    // 3. Draft.js prefers native insertText over synthetic paste
    setTimeout(() => {
      const success = document.execCommand('insertText', false, text);
      
      if (!success) {
        // Fallback for strict browser states
        const dt = new DataTransfer();
        dt.setData('text/plain', text);
        input.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
      }
      
      // 4. Force React/Draft.js to sync the updated DOM to its internal state
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, 10);
  }
};
