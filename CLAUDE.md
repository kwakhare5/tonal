# CLAUDE.md — Project Context
# Hard cap: 200 lines. Global rules are in C:\Users\kwakh\.gemini\config\AGENTS.md
# Domain terms → CONTEXT.md (read every session)
# Heavy architecture → ARCHITECTURE.md (load on-demand)

---

## 1. PROJECT IDENTITY

**Name:** tonal
**Goal:** Chrome extension that adds AI-powered tone adjustment to any text input on any website
**Status:** In Progress
**Stack type:** Chrome Extension (MV3) — Vanilla JS only, no build step

---

## 2. TECH STACK

- **Extension:** Chrome Extension Manifest V3, Vanilla JS ONLY (no React, no Vue, no npm, no bundler)
- **UI isolation:** Shadow DOM — all tonal UI wrapped in Shadow DOM, no exceptions
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
   - All tonal UI wrapped in Shadow DOM. No exceptions.
   - Never inject into `<iframe>` elements.
   - Never put the API key in content script. All API calls: `content.js → background.js → Cloudflare Worker → Groq`

2. **Storage rules:**
   - `chrome.storage.local` for persistence (not `localStorage` — doesn't work across pages in MV3)
   - `chrome.storage.sync` for user preferences (syncs across devices, max 100KB total)

3. **Design tokens:**
   - All tokens declared inside `:host { }` inside the shadow root
   - Never reference CSS variables from the host page — they don't cross the Shadow DOM boundary

4. **Adding a new platform adapter:**
   1. Create `extension/adapters/[platform].js`
   2. Find the platform's text input injection point
   3. Create host element → attach Shadow DOM → render tonal pill inside shadow root
   4. Register adapter in `extension/adapters/index.js`
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
    index.js        — registers all adapters
    [platform].js   — platform adapter (gmail, slack, linkedin)
/backend            — Cloudflare Worker API proxy
  src/index.js      — backend worker script (holds API key securely)
  wrangler.toml     — wrangler deployment config
/website            — Next.js App Router website for tonal
  tsconfig.json     — TypeScript config with custom aliases (@tonal-core)
  /public           — static assets, CDN images, and extension icons
  /src/app
    layout.tsx      — main HTML layout and font configurations
    page.tsx        — landing page composition
    globals.css     — imports shared tonal.css and defines global rules
  /src/components
    TonalMockup.tsx — interactive tone selector demo
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
- [2026-07-14] Removed adapters/index.js from manifest.json when refactoring paths → Always double-check every item in manifest script arrays to prevent breaking extension initialization.
- [2026-07-14] `document.execCommand("selectAll")` is GLOBAL — selects entire page on Gmail, corrupts To:/Subject fields → Use `range.selectNodeContents(el)` scoped to the target element only.
- [2026-07-14] `background.js` message listener drops the `sender` param → Always accept `(request, sender, sendResponse)` and use `sender.tab?.url` to detect platform for worker context injection.
- [2026-07-14] `getValue()` returning `innerHTML` sends raw HTML tags to AI → Always return `innerText` for AI input; the paste handler reconstructs HTML on insert.

---

## 7. SESSION RESUME

_AI fills this at the END of every session. Read this at the START of the next session._

**Last session date:** 2026-07-30

**What we built / changed:**
- **Modularized & Refactored Website Sections**: Consolidated landing page sections into `src/app/page.tsx`, retaining core reusable widgets (`Navbar`, `TonalMockup`, `ToneShowcase`, `InstallSteps`, `InstallGuideModal`, `FaqSection`, `DownloadButton`, `ScrollObserver`).
- **UI Design System Upgrade**: Applied `apple-design` and `frontend-design` glassmorphic visual architecture (`Lora` display font with `-0.025em` tracking, `DM Sans` body, `backdrop-filter: blur(20px)`, radial glow backdrop, spring hover cards).
- **Enforced Original Light Sky Palette**: Preserved `#F7F9FC` background, `#0B192C` primary navy typography, and brand accent colors (`#0066FF`, `#6C56FC`, `#F200CA`, `#10B981`, `#F59E0B`, `#EF4444`).
- **Code & Asset Cleanup**: Purged 20.3MB of unreferenced legacy background assets (`qipeline_medium_sky_clouds.png`, etc.) and eliminated 5 redundant wrapper components.
- **Verification**: `npm run build` (2.3s) and `npm run lint` passed cleanly with 0 errors.

**Immediate next task:**
- Test landing page locally or deploy to Vercel via git push.
- Reload extension in Chrome (`chrome://extensions` → reload).

**Open blockers:**
- None.

**Files most recently changed:**
- `website/src/app/page.tsx` — Consolidated section layouts & typography hierarchy
- `website/src/app/globals.css` — Apple & Linear sky glassmorphism rules & hover transitions
- `website/src/components/InstallGuideModal.tsx` — Reused InstallSteps & CSS classes
- `website/src/app/install/page.tsx` — Reused InstallSteps component
- `website/src/components/TonalMockup.tsx` — Typed React.FC export & typing session cancellation
- `website/public/` — Purged 20.3MB unused legacy assets
