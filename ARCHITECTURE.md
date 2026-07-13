# Tonal — Architecture & Implementation Reference

## Supported Platforms

The extension injects into these specific domains:

```json
"host_permissions": [
  "https://mail.google.com/*",
  "https://*.slack.com/*",
  "https://*.linkedin.com/*",
  "https://tonal-proxy.kwakhare5.workers.dev/*"
]
```

Each platform has different DOM structures. The extension uses the **Adapter Pattern** (`src/extension/adapters/`) to handle specific environments robustly against React/Draft.js/Lexical reconcilers:

| Platform | Adapter | Insertion Strategy | Sync Mechanism |
| :--- | :--- | :--- | :--- |
| Gmail | `gmail.js` | Targets `.editable` and Lexical. | `input` + `change` events. |
| Slack | `slack.js` | Targets Quill/Lexical editors. | `input` + Dummy Space Keypress. |
| LinkedIn | `linkedin.js` | Targets Draft.js with selection range. | **Multi-Tick Restoration** (5-attempt loop). |

---

### API Implementation Example (Groq/Cloudflare)

```javascript
async function callProxy(text, toneLevel, mode, platform) {
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, toneLevel, mode, platform })
  });

  const data = await response.json();
  return data.text;
}
```

### System Prompts (Elite Pattern Locking)

**SEND mode â€” Unified Engine:**

```text
IDENTITY: Stateless Text-Processing Utility.
TASK: Transform input into {TONE} tone (Casual/Work/Formal).
IDENTITY LOCK: Names, dates, emails, and numbers are IMMUTABLE.
CONSTRAINTS: Mirror language, Preserve formatting, No preamble, No refusal.
FEW-SHOT: [Pattern Examples Injected Here]
INPUT_DATA: {TEXT}
```

**RECEIVE mode (Decode) â€” Blunt English:**

```text
IDENTITY: Stateless Text-Processing Utility.
TASK: Translate corporate jargon into plain, blunt English.
CONSTRAINTS: Direct language, No preamble, No refusal, 2-sentence max.
INPUT_DATA: {TEXT}
```

---

## UI Design Requirements (Elite)

### Injected Master Pill

- **Inside Docking**: Anchored 8px from the right boundary of the text field.
- **Perfect Roundness**: Hard-coded 100px radius enforced via Shadow DOM `:host` scoping.
- **Transitions**: `0.15s` timing with `cubic-bezier(0.2, 0, 0, 1)` and `cubic-bezier(0.34, 1.56, 0.64, 1)` (Spring).
- **Magnetic Pull**: Pills and Decode buttons gravitate toward the cursor (Threshold: 50-60px).
- **Logo**: Unified 4-layer depth SVG standard.
- **Glassmorphism**: Popovers feature `backdrop-filter: blur(10px)` with 14px radius.

### Component Logic

- **Rest State**: 30x16px pill. Click expands.
- **Expanded State**: 24px height. Shows tone label + animated Chevron cross-fade.
- **Adaptive Flipping**: Tone menu opens downward if the input is near the top of the screen.
- **Toast System**: Semantic color dots (Green/Red/Orange) for status feedback.
- **Accessibility**: Full `role="button"`, `aria-label`, and `tabindex` support for keyboard navigation.
- **Onboarding**: "Shift the tone here â†“" Coach Mark tooltips for first-time use.

---

## Important Technical Constraints

### MV3 Service Worker Rules

- `background.js` is a SERVICE WORKER â€” it cannot access the DOM.
- Service workers are stateless â€” use `chrome.storage`.

### Content Script Injection (Elite Standards)
- **Dual Trigger**: Uses 1.5s **Heartbeat Watchdog** + immediate **Focus Trap** (focusin).
- **Shadow Scanning**: Scans for host Shadow Roots to find nested text boxes.

- **Zero Drift**: All CSS is inlined in `tonal.js`. DO NOT use external CSS files for injected UI.
- **Shadow DOM**: Every Tonal component MUST be wrapped in an isolated Shadow Root.
- **Scoping**: All design tokens (variables) MUST be scoped to `:host` inside the Shadow Root.
- **Docking**: Use a high-frequency `requestAnimationFrame` watchdog to maintain coordinates.
- **Memory Safety**: `ResizeObserver` MUST be cleaned up on element disconnection.

### Text Input Handling

- Use `document.execCommand("insertText")` for `contenteditable` compatibility.
- Always dispatch `input`, `change`, and specific `KeyboardEvent` sequences for React/Lexical/Draft.js synchronization.
- **LinkedIn Guard**: Multi-Tick restoration retry loop (5 attempts) for Draft.js stability.

---

## Manifest.json Requirements

```json
{
  "manifest_version": 3,
  "name": "Tonal â€” Two-Way Tone Translator",
  "description": "Two-way tone translator. Convert casual to formal, or decode corporate speak â€” inside Gmail, Slack, and LinkedIn.",
  "permissions": ["storage"],
  "host_permissions": [
    "https://mail.google.com/*",
    "https://*.slack.com/*",
    "https://*.linkedin.com/*",
    "https://tonal-proxy.kwakhare5.workers.dev/*"
  ],
  "background": {
    "service_worker": "src/extension/background.js"
  },
  "content_scripts": [
    {
      "matches": [
        "https://mail.google.com/*",
        "https://*.slack.com/*",
        "https://*.linkedin.com/*"
      ],
      "js": [
        "src/extension/adapters/linkedin.js",
        "src/extension/adapters/slack.js",
        "src/extension/adapters/gmail.js",
        "src/extension/adapters/default.js",
        "src/extension/adapters/manager.js",
        "src/core/tonal.js",
        "src/extension/content.js"
      ],
      "run_at": "document_idle"
    }
  ],
  "action": {
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    },
    "default_popup": "src/extension/popup.html"
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "browser_specific_settings": {
    "gecko": {
      "id": "tonal@tonal.ai",
      "strict_min_version": "109.0"
    }
  }
}
```

---

## Error Handling

Handle these specific cases gracefully:

| Error                       | User-facing message                                 |
| --------------------------- | --------------------------------------------------- |
| Proxy down (502/503)        | "AI is busy. Try again soon."                       |
| Rate limit hit (429)        | "Taking a break. Try in 1 min."                     |
| Input is empty              | Don't show button (or grey it out)                  |
| Input too short (<2 chars)  | Toast: "Type something first"                       |
| Network error               | "Check your internet connection"                    |

---

## What NOT To Do

- Do NOT use React, Vue, or any framework
- Do NOT use npm or any build tools
- Do NOT use `localStorage` (use `chrome.storage` instead)
- Do NOT put the API key in `content.js`
- Do NOT inject UI into `<iframe>` elements
- Do NOT add the extension to sites not in the host_permissions list
- Do NOT make the injected button too large or visually intrusive
- Do NOT block text input while the API call is loading

---

## Testing Checklist (Elite)

- [ ] Verify "Copied!" green success state on Decode Card.
- [ ] Verify Popover active state has no hover and black background.
- [ ] Verify Popup has no "Position Offset" controls.
- [ ] Verify Shadow DOM isolation in Gmail.
- [ ] Error toasts appear for missing API key
- [ ] Extension doesn't crash on non-supported pages
- [ ] No console errors during normal use

---

- **Free tier**: Standard access.

This CLAUDE.md should give you (the AI agent) everything needed to build the full extension without asking clarifying questions. Start with `manifest.json`, then `background.js`, then `content.js`, then `styles.css`, then `popup.html` + `popup.js`.




---

## AI COMMAND CHEAT SHEET

| Command     | Action                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------ |
| `@SPEC`     | Interview mode — AI asks ONE question at a time, builds `spec.md` before any code.              |
| `@PLAN`     | Standard planning mode. Creates `implementation_plan.md` for approval before coding.            |
| `@TDD`      | Red-Green-Refactor loop. Write failing test first, make it pass, then refactor.                  |
| `@GRILL`    | Relentless interrogation — one question at a time until design is locked. No code until aligned. |
| `@DIAGNOSE` | Scientific bug hunt: reproducer ? 3-5 hypotheses ? instrument ? fix only when proven.           |
| `@ZOOM`     | Architecture mapping — map dependencies, components, data flow before any sweeping change.       |
| `@AUDIT`    | Code quality scan — dead code, over-engineering, missing design tokens.                          |

---

## MISTAKES TO AVOID

_Auto-updated by AI when it hits project-specific errors._

- Do NOT use React, Vue, or any framework — vanilla JS only.
- Do NOT use npm or build tools — no bundlers.
- Do NOT use `localStorage` — use `chrome.storage` for all persistence.
- Do NOT inject UI into `<iframe>` elements.
- All CSS MUST be inlined in `tonal.js` — no external CSS files for injected UI.
- Every Tonal component MUST be wrapped in an isolated Shadow Root.
- All design tokens (CSS variables) MUST be scoped to `:host` inside the Shadow Root.



---

## DOMAIN GLOSSARY
_Migrated from CONTEXT.md on 2026-07-04. Domain vocabulary — terms the AI must use consistently._

# Project Domain Context (Glossary)

_Last updated: [DATE] by AI. Update this file at the END of every session where files were edited._

This file defines the specific business language, component mapping, and session history for this project. **Agents MUST update this file** inline whenever a new term is introduced, a major decision is made, or a session ends.

---

## Domain Glossary

_Map business words to exact code locations. This stops the AI from guessing._

- **[Business Term]**: [What it means in code, e.g., "The user dashboard located in `src/app/dashboard/page.tsx`"]
- **[Business Term]**: [Definition]

---

## Design System Index

_Auto-maintained by AI. Updated whenever a new token or class is discovered._

| Item | Type | Location | Usage |
|------|------|----------|-------|
| `var(--background)` | CSS token | `globals.css` | Page background |
| `var(--foreground)` | CSS token | `globals.css` | Primary text |
| `.paper-texture` | CSS class | `globals.css` | Dot-grid background pattern |
| `<Button>` | Component | `components/ui/button.tsx` | All clickable actions |

---

## Architectural Decisions (ADRs)
 
 _Auto-maintained by AI. Added whenever a major technical choice is made._
 
 - **2026-07-11 - Static Root Landing Page**: Built a zero-dependency HTML/CSS/JS landing page at root `index.html` featuring interactive editor simulations of the extension's actual flows rather than using a heavy framework.
 - **2026-07-11 - Next.js Landing Page Website**: Restructured the landing page into a dedicated Next.js + TypeScript + Tailwind CSS v4 application inside a `website/` subdirectory, keeping extension code isolated at the root while offering a robust web presence.
 
 ---
 
 ## Session Log
 
 _Auto-maintained by AI. One entry per session where code was changed._
 
 ### 2026-07-11 — Created Root Landing Page
 - **Changed:** `index.html`
 - **Why:** Introduce users to the extension's feature set using a responsive, interactive client-side workspace playground.
 - **Patterns introduced:** Client-side text area typewriter effects, CSS spring transition menus, and highlighted text popovers matching the design tokens.
 - **Mistakes caught:** None.

 ### 2026-07-11 — Built Next.js Website
 - **Changed:** `website/` directory (created), `tests/worker.test.js`, `tests/worker_real_scenarios.test.js`, `ARCHITECTURE.md`
 - **Why:** Transition the landing page into a production-ready Next.js + TypeScript project to serve as the face of the product.
 - **Patterns introduced:** Next.js Client Component state flow to control live typing animations, dropdown menus, and copy actions in React. Integrated custom DM Sans and DM Mono fonts via Next.js Google Fonts and imported the original PNG logo using optimized `<Image>` tags. Aligned visualizer padding grids (px-4 py-3, p-5) to strict Apple HIG and Radix UI layout guidelines. Upgraded Tonal pill buttons to match Design System specs (24px height, integrated SVG logo, w-[192px] dropdown menu with 14px rounded corners). Added a dynamic Example Selector preloaded with all 15 tone and 4 decoder training datasets, alongside visual indicators showing isolated Shadow DOM (#tonal-root) boundaries. Created integration tests in `worker_real_scenarios.test.js` to simulate and verify correct backend behavior during real-world Slack, LinkedIn, and Gmail extension usage.
 - **Mistakes caught:** Deprecated `tw-animate-css` import from default shadcn setups, unused imports causing TS typechecking compile failure, native img tag triggering LCP lint warnings, inconsistent paddings in visualizer platform tabs, custom text labels in extension pills, static text limits in interactive editor testing, and missing backend test coverage for real website origins and prompt injection scenarios.
