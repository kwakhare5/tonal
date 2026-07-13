# CONTEXT.md — Domain Language
# Read at the START of EVERY session.
# AI fills and maintains this via @GRILL. You rarely edit this manually.

---

## Core Entities

| Term | What it means in THIS app | Never call it |
|------|--------------------------|---------------|
| Tonal Pill | The floating UI button injected into a text input field | Widget, button, toolbar, overlay |
| Adapter | A platform-specific module that finds and injects into a site's text inputs | Plugin, integration, connector |
| Shadow Root | The isolated DOM container that holds all Tonal UI (prevents CSS conflicts) | Shadow DOM, iframe, container |
| Tone | A writing style the user can apply (e.g. Professional, Casual, Concise) | Mode, style, preset, voice |
| Decode Card | The popup that appears showing the analysis/transformation result | Popup, modal, result card |
| Cloudflare Worker | The serverless proxy that holds the API key and forwards requests to Groq | Backend, server, API layer |
| Host Page | The website where Tonal is injected — its styles must not affect Tonal | Page, site, tab |

---

## Business Rules (Never Break)

1. Vanilla JS ONLY — no npm, no bundler, no framework, no build step ever
2. API key lives ONLY in the Cloudflare Worker — never in content script or background script
3. ALL Tonal UI is inside Shadow DOM — no exceptions, no direct DOM injection to host page
4. Never inject into `<iframe>` elements
5. `chrome.storage.local` for data persistence — NOT `localStorage` (doesn't work across pages in MV3)
6. All CSS is inlined in content script — no external stylesheets loaded

---

## Platform Adapters

| Platform | File | Status |
|----------|------|--------|
| Gmail | `adapters/gmail.js` | 🟢 Live |
| Slack | `adapters/slack.js` | 🟢 Live |
| Default (generic) | `adapters/default.js` | 🟢 Live |
| LinkedIn | `adapters/linkedin.js` | 🔨 Building |
| Twitter/X | — | ⏸️ Paused |

_Always register new adapters in `adapters/manager.js` and add `host_permissions` in `manifest.json`._

---

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Shadow DOM injection | 🟢 Live | All UI isolated in shadow roots |
| Cloudflare Worker proxy | 🟢 Live | `src/backend/worker.js` + `wrangler.toml` |
| Tone picker (3 levels) | 🟢 Live | Casual / Work Chat / Formal |
| Undo button | 🟢 Live | Restores original text exactly |
| Floating Decode button | 🟢 Live | Appears on text selection |
| Decode result card | 🟢 Live | Viewport-aware, auto-dismiss, Copy button |
| Real-time pref sync | 🟢 Live | Popup changes → all tabs instantly |
| LinkedIn adapter | 🔨 Building | `adapters/linkedin.js` exists, WIP |
| Twitter/X adapter | ⏸️ Paused | Not yet implemented |
| Tone history drawer | ⏸️ Paused | Last 5 rewrites via chrome.storage |

---

## Real File Map

```
tonal/
├── manifest.json                    ← MV3. host_permissions: gmail, slack, linkedin, CF worker
├── src/
│   ├── core/
│   │   └── tonal.js                 ← Design system tokens + classes
│   ├── extension/
│   │   ├── adapters/
│   │   │   ├── manager.js           ← Adapter orchestration (register here)
│   │   │   ├── gmail.js
│   │   │   ├── linkedin.js
│   │   │   ├── slack.js
│   │   │   └── default.js
│   │   ├── background.js            ← Service Worker → Cloudflare proxy
│   │   ├── content.js               ← Scan loop + orchestration + UI injection
│   │   ├── popup.html
│   │   └── popup.js
│   └── backend/
│       ├── worker.js                ← Cloudflare Worker source (holds API key)
│       └── wrangler.toml
└── design/
    └── tonal-design-system-v2.html  ← SOURCE OF TRUTH for all design tokens
```

**AI model:** Groq Llama 3.3 70B via `https://api.groq.com/openai/v1/chat/completions`

---

## API Call Chain (security critical)

```
User triggers tone change
→ content.js captures text + tone selection
→ chrome.runtime.sendMessage() to background.js
→ background.js fetches Cloudflare Worker URL
→ Cloudflare Worker (holds API key) calls Groq
→ result flows back: Worker → background.js → content.js → Decode Card displayed
```

---

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Adapter files | `[platform].js` | `twitter.js`, `gmail.js` |
| CSS variables | `--tonal-*` prefix, inside `:host {}` | `--tonal-primary`, `--tonal-radius` |
| Storage keys | `tonal_*` prefix | `tonal_preferences`, `tonal_history` |
| Message types | SCREAMING_SNAKE | `TONE_REQUEST`, `TONE_RESPONSE` |

---

## ADRs — Architecture Decision Records

| Date | Decision | Why |
|------|---------|-----|
| — | Vanilla JS, no framework | Load instantly, zero complexity, no build step |
| — | Shadow DOM for all UI | Complete CSS isolation from host pages |
| — | All CSS inlined in content script | Works inside Shadow DOM reliably |
| — | Cloudflare Worker as API proxy | API key never exposed in extension code |
| — | Groq Llama 3.3 70B | Ultra-fast, free tier |
| — | Adapter pattern per platform | Different injection points per site |
| — | chrome.storage.local for data | localStorage doesn’t persist across pages in MV3 |
| — | chrome.storage.sync for prefs | Syncs across devices (max 100KB) |
| 2026-07-11 | CORS Origin restriction on CF Worker | Lock proxy to requests from extension or localhost only |
| 2026-07-11 | XML prompt isolation | Wrap user input in `<user_message>` tags — defends against prompt injection |
| 2026-07-13 | Event-Driven DOM Polling | Removed `setInterval` in favor of `MutationObserver` and `ResizeObserver` to prevent layout thrashing and high CPU idle usage |

---

## Bugs Fixed

_Append-only. Never repeat these._

| Date | Bug | Fix |
|------|-----|-----|
| — | localStorage doesn’t persist in MV3 | `chrome.storage.local` instead |
| — | Host CSS vars bleed into shadow root | Re-declare all tokens inside `:host { }` |
| — | API key exposure from content script | Route through `background.js` → Cloudflare |
| — | Decode card clips at screen edges | Viewport-aware positioning |
| 2026-07-11 | Prompt injection vulnerability | Wrap input in `<user_message>` XML tags |
| 2026-07-11 | Viewport drift on scroll | Update Decode button/card coordinates on scroll/resize |
| 2026-07-11 | Selection click race condition | Track mousedown to prevent selectionchange hiding Decode UI |
| 2026-07-11 | Formatting/newlines compressed | System prompt instructs to preserve paragraph spacing |
| 2026-07-13 | XML Tag Breakout Prompt Injection | Encode `<` and `>` as HTML entities in `worker.js` before inserting text into XML payload |
