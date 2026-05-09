window.TonalAdapters = window.TonalAdapters || {};

window.TonalAdapters.gmail = {
  matches: (url) => url.includes('mail.google.com'),
  insertText: (input, text, isRichText = false) => {
    input.focus();
    document.execCommand('selectAll', false, null);
    if (isRichText) {
      document.execCommand('insertHTML', false, text);
    } else {
      document.execCommand('insertText', false, text);
    }
  }
};
