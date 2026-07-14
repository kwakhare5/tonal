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
  package.json      — local package overrides (e.g. type: commonjs)
  /core
    config.cjs      — shared configuration for tone definitions
    tonal.css       — shared core design system styles
    tonal.js        — core UI rendering components
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

---

## 7. SESSION RESUME

_AI fills this at the END of every session. Read this at the START of the next session._

**Last session date:** 2026-07-14

**What we built / changed:**
- Swiss Neo-Minimalist Redesign: Removed card blocks and borders. Sections are now separated by thin `1px` structural borders and plenty of whitespace.
- Exclusively Lora and DM Sans: Configured the website typography stack to load and apply only Lora and DM Sans, completely removing Cormorant Garamond and DM Mono.
- Font Inheritance & Reset: Fixed website font consistency by using Next.js `next/font/google` in layout.tsx and adding a CSS reset rule in globals.css so all input elements, buttons, and textareas inherit the correct fonts.
- Spacing System Consolidation: Scanned all sections and components and replaced remaining hardcoded pixel values (margins, paddings, gaps) with design tokens (`var(--space-*)`), ensuring 100% spacing consistency across all sections.
- Responsive Column Dividers (Mobile): Added neat horizontal divider borders and vertical padding scales to Comparison and Engine columns on mobile, matching the desktop columns' layout.
- FAQ & Mockup Accessibility Fixed: Implemented full key down listeners, tabIndex focus boundaries, and ARIA expansion attributes to the FAQ Section.
- Mockup Touch Target Expansion: Added hit area expansion overlays to the Gmail and Slack platform tab selectors to comply with WCAG 44x44px target guidelines.
- Restored Supported Platforms Badge: Added back the "Gmail, Slack, and LinkedIn" pill at the top of the hero section and fixed its text color class.
- Professional Value-Prop Copy: Removed Llama 3.3 and Groq LPU "flex" jargon from the hero section, replacing it with a refined, value-focused copy ("Adjust your tone without breaking focus."). Also polished the workflow comparison text.
- Dynamic Mockup Glows (Borderless): Swapped the mockup outer border with an active-platform reacting box-shadow (soft blue for Gmail, soft aubergine for Slack) with ambient glows.
- Dot-Grid Background Textures: Added subtle dot-grid background textures and soft blurred color blobs behind the Hero and bottom CTA sections.
- Prototypes: Evaluated text effect options (gradients, underlines, highlights) and selected the clean Option 3 "Highlight Background Blob" marker stroke on the header.
- Added Author Credits: Added "Karan Wakhare" name in footer branding and copyright notes, and hyperlinked credits to Groq, Llama, and Cloudflare.
- Brand Logo Unification: Replaced all instances of the vector slider SVGs with the official rounded square `icon128.png` brand logo (in the navbar, footer, extension popup header, extension injected pill, website interactive mockup, and browser tab favicon metadata).
- SVG GitHub Logo: Replaced the text-only GitHub navigation link with a clean inline SVG.

**Immediate next task:**
- Perform end-to-end testing of the zipped extension inside Google Chrome on live Gmail, Slack, and LinkedIn inputs.

**Open blockers:**
- None.

**Files most recently changed:**
- `website/src/app/page.tsx`
- `website/src/app/globals.css`
- `website/src/app/layout.tsx`
- `website/src/components/TonalMockup.tsx`
- `website/src/components/FaqSection.tsx`
- `extension/core/tonal.js`
- `extension/popup.html`
- `CLAUDE.md`
