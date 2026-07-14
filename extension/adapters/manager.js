/**
 * TONAL ADAPTER MANAGER v5.0.0
 * Multi-Platform Orchestration
 */

window.TonalAdapters = window.TonalAdapters || {};

window.TonalAdapters.manager = {
  /**
   * Detects the correct platform adapter based on the current URL.
   * @returns {Object} The active platform adapter.
   */
  getAdapter: () => {
    const url = window.location.href;
    const registry = window.TonalAdapters;

    // Check for specific platforms first
    if (registry.linkedin?.matches(url)) return registry.linkedin;
    if (registry.slack?.matches(url)) return registry.slack;
    if (registry.gmail?.matches(url)) return registry.gmail;

    // Fallback stub
    return { id: "none", matches: () => false };
  },
};
