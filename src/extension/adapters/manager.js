window.TonalAdapters = window.TonalAdapters || {};

window.TonalAdapters.manager = {
  getAdapter: () => {
    const url = window.location.href;
    if (window.TonalAdapters.whatsapp && window.TonalAdapters.whatsapp.matches(url)) return window.TonalAdapters.whatsapp;
    if (window.TonalAdapters.linkedin && window.TonalAdapters.linkedin.matches(url)) return window.TonalAdapters.linkedin;
    if (window.TonalAdapters.slack && window.TonalAdapters.slack.matches(url)) return window.TonalAdapters.slack;
    if (window.TonalAdapters.gmail && window.TonalAdapters.gmail.matches(url)) return window.TonalAdapters.gmail;
    return window.TonalAdapters.default;
  },
  
  insertText: (input, text, isRichText = false) => {
    const adapter = window.TonalAdapters.manager.getAdapter();
    adapter.insertText(input, text, isRichText);
  }
};
