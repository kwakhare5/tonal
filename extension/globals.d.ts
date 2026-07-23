// Global declarations for Chrome Extension type safety checks
declare global {
  const chrome: any;
  interface Window {
    tonal: any;
    tonalAdapters: any;
    tonalInjector: any;
    chrome: any;
  }
}

export {};
