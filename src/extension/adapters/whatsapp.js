window.TonalAdapters = window.TonalAdapters || {};

window.TonalAdapters.whatsapp = {
  matches: (url) => url.includes('whatsapp.com'),
  insertText: (input, text, isRichText = false) => {
    input.focus();
    
    // 1. Force native selection
    const range = document.createRange();
    range.selectNodeContents(input);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    // 2. Allow Lexical to sync its internal state via selectionchange event
    setTimeout(() => {
      // 3. Insert the new text. Lexical will now correctly overwrite everything.
      const success = document.execCommand('insertText', false, text);
      
      // Fallback to paste if insertText fails
      if (!success) {
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text/plain', text);
        input.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dataTransfer, bubbles: true, cancelable: true }));
      }
    }, 50);
  }
};
