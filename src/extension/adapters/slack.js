window.TonalAdapters = window.TonalAdapters || {};

window.TonalAdapters.slack = {
  matches: (url) => url.includes('slack.com'),
  insertText: (input, text, isRichText = false) => {
    input.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, text);
    
    // Dispatch input events to force React/Quill to update
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
};
