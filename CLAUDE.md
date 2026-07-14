# CLAUDE.md — Project Context
# Hard cap: 200 lines. Global rules are in C:\Users\kwakh\.gemini\config\AGENTS.md
# Domain terms → CONTEXT.md (read every session)
# Heavy architecture → ARCHITECTURE.md (load on-demand)

---

## 1. PROJECT IDENTITY

**Name:** Tonal
**Goal:** Chrome extension that adds AI-powered tone adjustment to any text input on any website
**Status:** In Progress
**Stack type:** Chrome Extension (MV3) — Vanilla JS only, no build step

---

## 2. TECH STACK

- **Extension:** Chrome Extension Manifest V3, Vanilla JS ONLY (no React, no Vue, no npm, no bundler)
- **UI isolation:** Shadow DOM — all Tonal UI wrapped in Shadow DOM, no exceptions
- **AI:** Groq via Cloudflare Worker (content.js → background.js → Worker → Groq). API key never in content script.
- **Storage:** `chrome.storage.local` (persistence) + `chrome.storage.sync` (user prefs, syncs across devices, max 100KB)
- **CSS:** All CSS inlined in the content script — no external stylesheets

---

## 3. DEV COMMANDS

```bash
# Load the extension in Chrome:
# Chrome → More tools → Extensions → Load unpacked → select the /extension folder

# No build step. Edit files, reload extension in Chrome, test.

# Run website locally:
# cd website && npm run dev (runs on http://localhost:3000)

# Build website:
# cd website && npm run build
```

---

## 4. LOCAL RULES

1. **HARD CONSTRAINTS — never break:**
   - Vanilla JS ONLY. No React, no Vue, no npm, no bundler, no build step.
   - All CSS inlined in content script. No external stylesheets.
   - All Tonal UI wrapped in Shadow DOM. No exceptions.
   - Never inject into `<iframe>` elements.
   - Never put the API key in content script. All API calls: `content.js → background.js → Cloudflare Worker → Groq`

2. **Storage rules:**
   - `chrome.storage.local` for persistence (not `localStorage` — doesn't work across pages in MV3)
   - `chrome.storage.sync` for user preferences (syncs across devices, max 100KB total)

3. **Design tokens:**
   - Source of truth: `design/tonal-design-system-v2.html`
   - All tokens declared inside `:host { }` inside the shadow root
   - Never reference CSS variables from the host page — they don't cross the Shadow DOM boundary

4. **Adding a new platform adapter:**
   1. Create `src/extension/adapters/[platform].js`
   2. Find the platform's text input injection point
   3. Create host element → attach Shadow DOM → render Tonal pill inside shadow root
   4. Register adapter in `src/extension/adapters/manager.js`
   5. Add `host_permissions` for the platform's domain in `manifest.json`

5. **Before marking any task done:**
   - Test injection on the actual platform in Chrome (Load unpacked → real test)
   - Verify Undo restores original text exactly
   - Verify Decode card is viewport-aware (doesn't clip at screen edges)

---

## 5. PROJECT PATTERNS

### File structure
```
/extension          — self-contained Chrome Extension (MV3)
  manifest.json     — MV3 manifest, host_permissions per platform
  popup.html        — default popup UI
  popup.js          — popup controller
  background.js     — service worker, handles API calls to Cloudflare Worker
  content.js        — injected into pages, handles UI and watchdog
  tonal.css         — core design system styles
  tonal.js          — core UI rendering components
  package.json      — local package overrides (e.g. type: commonjs)
  /adapters         — per-platform injection adapters
    manager.js      — registers all adapters
    [platform].js   — platform adapter (gmail, slack, linkedin)
/backend            — Cloudflare Worker API proxy
  worker.js         — backend worker script (holds API key securely)
  wrangler.toml     — wrangler deployment config
/website            — Next.js App Router website for Tonal
  tsconfig.json     — TypeScript config with custom aliases (@tonal-core)
  /public           — static assets, CDN images, and extension icons
  /src/app
    layout.tsx      — main HTML layout and font configurations
    page.tsx        — landing page composition
    globals.css     — imports shared tonal.css and defines global rules
  /src/components
    TonalMockup.tsx — interactive tone selector demo (imports shared config)
```

### API call chain (security critical)
```
content.js (user interaction)
  → chrome.runtime.sendMessage()
  → background.js (service worker)
  → fetch(CLOUDFLARE_WORKER_URL, { text, tone })
  → Cloudflare Worker (holds API key securely)
  → Groq API
  → response back through chain
```

---

## 6. MISTAKES TO AVOID

<!-- AI appends here after every VERIFY failure -->
<!-- Format: [YYYY-MM-DD] What went wrong → What to do instead -->
- [2026-07-14] Module format mismatch when importing extension files into Next.js → Used `.cjs` extension and `tsconfig.json` paths to ensure Next.js Turbopack resolves external CommonJS files correctly.
- [2026-07-14] Removed adapters/manager.js from manifest.json when refactoring paths → Always double-check every item in manifest script arrays to prevent breaking extension initialization.
- [2026-07-14] `document.execCommand("selectAll")` is GLOBAL — selects entire page on Gmail, corrupts To:/Subject fields → Use `range.selectNodeContents(el)` scoped to the target element only.
- [2026-07-14] `background.js` message listener drops the `sender` param → Always accept `(request, sender, sendResponse)` and use `sender.tab?.url` to detect platform for worker context injection.
- [2026-07-14] `getValue()` returning `innerHTML` sends raw HTML tags to AI → Always return `innerText` for AI input; the paste handler reconstructs HTML on insert.

---

## 7. SESSION RESUME

_AI fills this at the END of every session. Read this at the START of the next session._

**Last session date:** 2026-07-14

**What we built / changed:**
- BUG-1 Fixed: `document.execCommand("selectAll")` in `tonal.js` → replaced with `range.selectNodeContents(el)` scoped to element. Root cause of Gmail subject/To field corruption.
- BUG-2 Fixed: `background.js` now detects platform from `sender.tab.url` and passes it to worker → platform-specific prompts now fire for Gmail/Slack/LinkedIn.
- BUG-3 Fixed: `adapters/gmail.js` `getValue()` now returns `innerText` not `innerHTML` → AI receives plain text, not HTML tags.
- BUG-4 Fixed: `worker.js` CORS now allows `*.pages.dev` + `ALLOWED_ORIGIN` env var for production website.
- BUG-4b Fixed: Groq 429 rate limit now returns proper 429 with user-friendly message instead of swallowing into 502.
- BUG-6 Fixed: `TonalMockup.tsx` LinkedIn tab added; refs cleaned up (only one branch renders at a time via &&).
- TDD: 8 new regression tests added to `tests/bug_regression.test.js`. Full suite 16/16 green.

**Immediate next task:**
- Deploy backend to Cloudflare: `npm run deploy` from root (requires Wrangler auth)
- Add `ALLOWED_ORIGIN` secret in Cloudflare dashboard if using a custom domain
- Reload extension in Chrome after `tonal.js` + `background.js` changes

**Open blockers:**
- None. All 6 bugs fixed and test-verified.

**Files most recently changed:**
- `website/src/components/TonalMockup.tsx`
- `website/src/app/globals.css`
- `website/src/app/page.tsx`
- `CLAUDE.md`
