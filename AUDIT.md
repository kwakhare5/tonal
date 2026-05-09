# AUDIT.md
Date: 2026-05-09
Score: 65/100

## Critical Issues (with diffs)

❌ Problem: State Synchronization (Ghost Text) in `src/extension/content.js`
⚠️ Why: LinkedIn/WhatsApp React state bypasses DOM changes. Text reverts on send.
✅ Fix: Implement native property descriptor bypass for React and Paste Event simulation for Lexical.

❌ Problem: Rich Text Formatting destruction in `src/extension/content.js`
⚠️ Why: Strips HTML from Gmail/Slack, destroying user formatting.
✅ Fix: Use Selection/Range API or handle innerHTML safely.

❌ Problem: CSP Blocking on API Fallback in `src/extension/content.js`
⚠️ Why: direct fetch() from content script fails on LinkedIn/WhatsApp.
✅ Fix: Remove direct fallback; rely exclusively on Background Service Worker.

## Minor Issues (with diffs)

❌ Problem: Infinite RAF Loop in `src/extension/content.js`
⚠️ Why: High CPU usage and battery drain.
✅ Fix: Replace requestAnimationFrame with ResizeObserver and IntersectionObserver.

❌ Problem: Service Worker State Loss in `src/extension/background.js`
⚠️ Why: Rate limiter resets every time Chrome puts the worker to sleep.
✅ Fix: Use chrome.storage.session to persist stats and circuit breaker state.

## What's Good
- 1:1 Typography parity achieved with DM Sans/DM Mono.
- Strong shadow DOM isolation for styling.
- Reliable cross-platform selector engine (v4).

## Next audit recommended:
After implementation of the Structural Overhaul (v5.0.0).
