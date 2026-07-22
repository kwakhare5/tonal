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
| LinkedIn | `adapters/linkedin.js` | 🟢 Live |
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
| LinkedIn adapter | 🟢 Live | `adapters/linkedin.js` fully integrated and validated |
| Twitter/X adapter | ⏸️ Paused | Not yet implemented |
| Tone history drawer | ⏸️ Paused | Last 5 rewrites via chrome.storage |

---

## Real File Map

```
Tonal/
├── extension/                       ← self-contained Chrome Extension (MV3)
│   ├── manifest.json                ← MV3 configuration
│   ├── background.js                ← Service Worker → Cloudflare Worker proxy
│   ├── content.js                   ← Scan loop + UI orchestration
│   ├── popup.html
│   ├── popup.js
│   ├── core/
│   │   ├── config.cjs               ← Shared configuration for tone definitions
│   │   ├── tonal.css                ← Shared core design system styles
│   │   └── tonal.js                 ← Core UI rendering components
│   └── adapters/
│       ├── manager.js               ← Adapter orchestration (register here)
│       ├── gmail.js
│       ├── linkedin.js
│       ├── slack.js
│       └── default.js
├── backend/                         ← Cloudflare Worker API proxy
│   ├── src/index.js                 ← Backend worker router & LLM orchestrator
│   └── wrangler.toml
├── website/                         ← Next.js App Router website
│   ├── next.config.ts
│   ├── tsconfig.json                ← Path aliases for shared @tonal-core modules
│   └── src/
│       ├── app/
│       │   ├── globals.css          ← Imports shared extension tonal.css
│       │   └── page.tsx
│       └── components/
│           └── TonalMockup.tsx      ← Interactive tone selector demo
├── tests/                           ← Backend test suite (Node --test)
└── extension_demo.html              ← Standalone Light-Mode UI States Playground
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
| CSS variables | Standard names inside `:host {}` to prevent bleeding | `--black`, `--white`, `--green`, `--gray-1` |
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
| 2026-07-13 | Event-Driven DOM Polling | Removed `setInterval` in favor of `MutationObserver` and `ResizeObserver` to prevent layout thrashing and high CPU idle usage |
| 2026-07-14 | Centralized Architecture & Design System | Unified the Extension and Next.js styles by extracting a shared `extension/core/tonal.css` and `config.cjs`, removing over 200 lines of duplicate CSS and JS configuration. |
| 2026-07-14 | Swiss Neo-Minimalist Redesign | Transitioned the landing page to a pure white grid layout using Lora (headings) and DM Sans (body) to present a premium bespoke design. |
| 2026-07-14 | Visualizer Resizing & Floating Navbar Redesign | Redesigned floating pill navbar, added scroll states, section links, and scaled visualizer to 860px max-width / 340px height. |
| 2026-07-14 | Static JSDoc Type-Checking for Vanilla JS Extension | Created `jsconfig.json` and `globals.d.ts` to enable static type analysis without typescript build overhead. |
| 2026-07-14 | Next.js Font Optimization & Inheritance Reset | Converted static font link tags to optimized Next.js `next/font/google` variables and applied inheritance reset rules so form inputs and buttons strictly render Lora and DM Sans. |
| 2026-07-14 | Borderless Active Mockup ambient glows | Replaced hard-coded outer mockup border lines with dynamic transitions of box-shadow glows (blue for Gmail, purple for Slack) to indicate active editor context. |
| 2026-07-14 | Grid Dot matrix background textures | Overlaid subtle radial-gradient dot textures on the Hero and bottom CTA sections, combined with blur-filter glows, to create organic visual depth. |
| 2026-07-14 | Headline marker highlight effect | Selected a sweeping soft blue marker-like background highlight (`.text-highlight`) on the hero heading to emphasize "without breaking focus." |
| 2026-07-14 | Strict Spacing Consolidation | Refactored all layout margins/paddings/gaps to CSS design tokens to lock the layout into a precise 4pt/8pt spacing scale. |
| 2026-07-14 | FAQ Accessibility (A11y) | Added keydown interaction hooks (Space/Enter) and ARIA traits to support screen reader and keyboard-only layouts. |
| 2026-07-14 | Mockup Tab Target Expansion | Configured ::before pseudo-element targets to expand Gmail/Slack tab hit bounds to 44px on mobile viewports. |
| 2026-07-14 | Unified Branding Assets | Replaced SVGs with the official rounded square `icon128.png` branding across all files (mockups, navbar, popup, floating pill). |
| 2026-07-14 | Purposeful Motion & Animation | Implemented CSS fades, ambient glows, Intersection Observer scroll reveals, and responsive active button feedback. |
| 2026-07-14 | Standalone Light-Mode Visual Spec | Created a clean visual states catalog in `extension_demo.html` with no codes or technical bloat, styled in light mode. |
| 2026-07-14 | Authentic Dynamic Mockup Headers | Styled interactive mockup headers to dynamically adapt their backgrounds and borders matching Gmail (#F2F6FC) and Slack (#3F0E40) branding when selected. |
| 2026-07-14 | Global Dot Grid Background | Exposed the dot-grid drafting background pattern across the entire site by setting all main section backgrounds to transparent. |
| 2026-07-14 | Mockup Card Border | Set a solid border of rgba(0, 0, 0, 0.15) to composer-mockup to stand out clearly on the global dot-grid background. |
| 2026-07-14 | Test Suite Restoration | Relocated tests/ folder back to root to fix relative module imports and package.json integration. |
| 2026-07-14 | Dynamic Mockup Height (480px) and Flex Sizing | Defined a fixed mockup height of 480px in globals.css and refactored inner container layouts to size dynamically using CSS Flexbox. |
| 2026-07-14 | Scoped Text Selection Scoping Fix | Replaced global selectAll execution inside tonal.js with node-level scoped selection to protect external document text inputs. |
| 2026-07-14 | Cloudflare Pages CORS and Rate-Limit Response Patches | Allowed Cloudflare Pages origins dynamically in worker.js and structured Groq API 429 rate limit exceptions into human-readable JSON payloads. |
| 2026-07-14 | Website Contrast, Highlight & Shimmer Redesign | Replaced hero blue underline with a warm yellow highlighter tone, boosted dot-grid opacity to 0.065, added active sliding gradient shimmer motion to the highlighter, and cast blue, purple, and magenta gradients behind mockup visualizers. |
| 2026-07-14 | Global CSS Zoom Factor | Added a global `zoom: 1.1` factor to the `html` element in `globals.css` to scale the layout up by 10% automatically at default 100% zoom. |
| 2026-07-22 | Redesigned Installation Guide & Download Modal | Built responsive 3-2 grid installation guide (`InstallSteps.tsx` and `InstallGuideModal.tsx`) with glassmorphism cards and Lora serif typography. |
| 2026-07-22 | Modal Overlay Boundary Pinning Fix | Solved fixed-position modal coordinate offset under global `zoom: 1.1` by using absolute viewport boundary pins (`top: 0; bottom: 0; left: 0; right: 0;`). |
| 2026-07-22 | Dynamic Screenshot-Based Open Graph Preview | Created dynamic `opengraph-image.tsx` Edge route capturing real-time browser screenshots of `https://tonall.vercel.app` via Microlink API. |
| 2026-07-22 | Extension Asset Build Sync | Added `website/scripts/copy-assets.cjs` prebuild step to sync extension assets locally and allow Vercel build compilation under the `website` root. |
| 2026-07-22 | Whitelisted Extension Zip Package | Removed `.zip` exclusion for `website/public/tonal-extension.zip` in `.gitignore` to prevent 404 download errors on Vercel. |
| 2026-07-22 | Cloudflare Worker CORS Whitelisting | Deployed Cloudflare Worker proxy with `ALLOWED_ORIGIN = "https://tonall.vercel.app"` and verified CORS preflight response headers. |
| 2026-07-22 | Favicon Fallback Cleanup | Deleted default Next.js/Vercel `favicon.ico` in `app/` folder to enable seamless fallback to official Tonal brand icons in metadata. |

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
| 2026-07-14 | Next.js Hydration & Cache Lock | Cleared Turbopack build cache, terminated stuck dev process, and moved link tags with precedence="default" to body to fix Google Fonts loading. |
| 2026-07-14 | Stale/Broken Root package.json Scripts | Pointed dev/deploy/zip scripts to correct backend and extension directories, and added Node test suite command. |
| 2026-07-14 | Broken Backend Test Imports | Updated test files to reference the Cloudflare Worker under the new `/backend` path, restoring test correctness. |
| 2026-07-14 | Draft.js Selection/Cursor Offset Snapping | Implemented recursive text node child scanning down to leaf nodeType 3 to restore correct focus anchor selection inside LinkedIn modals. |
| 2026-07-14 | Missing Text Field Validation | Added TDD checks and separated input validation to distinguish missing/invalid text variables from short inputs. |
| 2026-07-14 | Mockup Tab Contrast Issue | Standardized active/inactive tab text colors dynamically based on header background brightness to prevent illegible gray text on eggplant purple. |
| 2026-07-14 | Ruled Line Visibility | Increased contrast opacity of ruled writing lines inside the mockup body to prevent them from looking unnoticeably faint. |
| 2026-07-14 | Global SelectAll Extension Text Corruption | Scoped text insertion selection to the input node container in `tonal.js` to prevent resetting unrelated fields. |
| 2026-07-14 | Missing Background Platform Context | Read `sender.tab.url` inside `background.js` and forwarded platform identifiers in payloads to enable context-specific formatting prompts. |
| 2026-07-14 | HTML Leakage in Gmail Input | Restored Gmail input adapters to fetch plaintext textContent rather than innerHTML to secure LLM pipelines. |
| 2026-07-14 | Mockup Tab React Ref Race | Separated ref bindings from conditional mount pipelines to resolve UI element registration glitches. |
| 2026-07-14 | Mockup Inactive Tab Text Visibility | Configured dynamic opacity scaling for mockup tabs based on Gmail/Slack/LinkedIn header brightness transitions. |
| 2026-07-22 | Modal Cut-off Under Zoom | Switched overlay positioning from fixed viewport dimensions (`width: 100vw; height: 100vh`) to absolute boundary pins (`top: 0; bottom: 0; left: 0; right: 0;`). |
| 2026-07-22 | Vercel Subdirectory Import Missing Modules | Created `website/scripts/copy-assets.cjs` prebuild asset copy step so Vercel builds can resolve extension assets without path resolution errors. |
| 2026-07-22 | Zip Download 404 on Vercel | Whitelisted `website/public/tonal-extension.zip` in root `.gitignore` to allow git tracking and production downloads. |
| 2026-07-22 | Vercel Favicon Override | Deleted `website/src/app/favicon.ico` default Vercel triangle icon to fallback to Tonal branding PNG icons in metadata. |
