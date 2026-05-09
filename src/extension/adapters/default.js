window.TonalAdapters = window.TonalAdapters || {};

window.TonalAdapters.default = {
  matches: () => true,
  insertText: (input, text, isRichText = false) => {
    input.focus();
    document.execCommand('selectAll', false, null);
    
    const dataTransfer = new DataTransfer();
    dataTransfer.setData('text/plain', text);
    if (isRichText) dataTransfer.setData('text/html', text);
    
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true
    });
    input.dispatchEvent(pasteEvent);

    if (!pasteEvent.defaultPrevented) {
      document.execCommand('insertText', false, text);
    }
  }
};
