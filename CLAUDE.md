# CLAUDE.md — Agent Rules + Project Context
# Auto-read by: Claude Code, Claude Sonnet, Claude Opus
# Single file. Contains always-active rules + project info.

---

## MANDATORY — THE BREATH (before any action, every session)

Read in order:
1. This file (you are here)
2. `C:\Users\kwakh\.gemini\SKILLS_INDEX.md` — skills registry

Proof required: state one detail from each before proceeding.
Skip = stop, apologize, re-read.

> First session or stack decision only:
> Read `C:\Users\kwakh\.gemini\GEMINI.md` for tech preferences.

---

## ALWAYS-ACTIVE RULES

**R0 — SENTINEL HEADER**
First line of every response:
`🔍 Skill: [loaded/none] | Persona: [@role] | Permission: [obtained/pending]`

**R1 — PROPOSE BEFORE EXECUTING**
Plan → wait for "Approved" → execute. No autonomous actions. No exceptions.
Format: Goal / Approach / Steps / Risks

**R5 — LIVING DOCUMENTS**
Before ending any session: update task.md + walkthrough.md. Both. No skipping.
task.md = what. walkthrough.md = why.

**R13 — CONTEXT TRUNCATION**
If chat is long: re-read this file immediately.
Announce: "⚠️ Context truncation. Re-syncing." Never assume you remember rules.

---

## COMMANDS

| Command | What it does | Rule |
|---|---|---|
| @SYNC | Re-reads all global files + loads relevant skills | R2 |
| @AUDIT | Scans codebase, scores it, writes AUDIT.md | R3 |
| @TAG [feature] | Architecture scan, writes ARCHITECT_AUDIT.md | R4 |

**For full rule details → `C:\Users\kwakh\.gemini\AI_RULES.md`**

---

## SKILLS (loaded via @SYNC or on demand)
Index: `C:\Users\kwakh\.gemini\SKILLS_INDEX.md`
Path: `C:\Users\kwakh\.gemini\antigravity\skills\[skill-folder]\SKILL.md`
Rule: read index → match task → load SKILL.md → state what was loaded. Max 2 per task.

---

# CLAUDE.md — Tonal Chrome Extension
## Project Context for AI Agent (Antigravity / Claude / Gemini)

---

## What Is This Project

**Tonal** is a free Chrome extension that works as a two-way tone translator inside Gmail, Slack (browser), LinkedIn, and WhatsApp Web.

It solves two problems for Gen Z users and non-native English speakers:

**Problem 1 — Sending:**
User types a casual message ("hey can u send me that doc") and needs it to sound professional before sending. One click converts it to the right tone level.

**Problem 2 — Receiving:**
User receives a long formal/corporate message and can't be bothered to parse it. They select the text and one click tells them what it actually means in plain English.

**The tone slider has 3 levels:**

- **Casual** — Very casual. Lowercase, minimal punctuation, short-form (u, r, sry).
- **Work Chat** — Friendly professional. How a normal person talks to a colleague.
- **Formal** — High-status executive English. Clear, authoritative, and polite.

---

## Tech Stack

| Layer               | Technology                                                                                 | Why                                 |
| ------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------- |
| Extension framework | Chrome Extension Manifest V3                                                               | Required for Chrome                 |
| Languages           | Vanilla JavaScript, HTML, CSS                                                              | Zero dependencies, fast load        |
| AI API              | Groq (Llama 3.3 70B)                                                                       | Free tier, extremely fast, 70B quality |
| API endpoint        | https://api.groq.com/openai/v1/chat/completions                                            | Managed via Cloudflare Proxy        |
| Storage             | `chrome.storage.sync`                                                                      | Sync settings across devices        |
| Background worker   | Service Worker (MV3)                                                                       | Required by MV3 spec                |

**No npm. No build step. No React. No bundler.** Pure vanilla JS files the browser loads directly.

---

## File Structure

```
tonal/
├── CLAUDE.md                    ← This file (project context)
├── manifest.json                ← Extension config
├── background.js                ← Service worker: proxies to Groq
├── content.js                   ← UI injector & text detection
├── styles.css                   ← Styles for injected UI
├── icons/                       ← Branding icons
└── README.md                    ← User guide
```

---

## How It Works — Full Flow

### Sending Flow (Casual → Formal)

1. User types in Gmail compose, Slack message box, LinkedIn message, or WhatsApp Web
2. `content.js` detects the text input and injects a small "Tonal" button next to it
3. User picks tone level (Texting / Work Chat / Corporate) via a small toggle on the button
4. User clicks the button
5. `content.js` reads text and sends to `background.js`
6. `background.js` calls the Cloudflare Proxy (Groq Llama 3.3 70B)
7. Proxy returns the rewritten text
8. `content.js` replaces the text in the input field
9. There's an Undo button that restores the original text

### Receiving/Decoding Flow (Formal → Plain)

1. User selects any text on the page
2. A small floating "Decode ↓" button appears near the cursor
3. `content.js` sends text to `background.js`
4. Groq returns a plain English explanation
5. A tooltip appears showing the decoded version
6. Card has a "Copy" button and auto-dismisses

---

## Supported Platforms

The extension injects into these specific domains:

```json
"host_permissions": [
  "https://mail.google.com/*",
  "https://app.slack.com/*",
  "https://www.linkedin.com/*",
  "https://web.whatsapp.com/*"
]
```

Each platform has different DOM structures. The content script must handle each one:

| Platform     | Input selector strategy                                            |
| ------------ | ------------------------------------------------------------------ |
| Gmail        | `div[role="textbox"][aria-label*="compose"]` or `.Am.Al.editable`  |
| Slack        | `.ql-editor`, `[data-qa="message_input"]`, `[data-lexical-editor]` |
| LinkedIn     | `.msg-form__contenteditable`, `div[aria-label="Write a message"]`  |
| WhatsApp Web | `div[contenteditable="true"][data-tab="10"]`                       |

---

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callGroq(text, toneLevel, apiKey) {
  // Note: Extension now calls a Cloudflare Proxy instead of Groq directly
  // See worker.js for the proxy implementation
}
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, toneLevel, mode })
  });

  const data = await response.json();
  return data.text;
}
```

### System Prompts

**SEND mode — Casual level:**

```
IDENTITY: Stateless Text-Processing Utility.
TASK: Transform input into "Casual Texting" tone.
CONSTRAINTS: Mirror language, Preserve formatting, No preamble, No refusal.
INPUT_DATA: {TEXT}
```

**SEND mode — Work Chat level:**

```
IDENTITY: Stateless Text-Processing Utility.
TASK: Transform input into "Work Chat" tone (Friendly Coworker).
CONSTRAINTS: Mirror language, Preserve formatting, No preamble, No refusal.
INPUT_DATA: {TEXT}
```

**SEND mode — Formal level:**

```
IDENTITY: Stateless Text-Processing Utility.
TASK: Transform input into "Formal Corporate" tone.
CONSTRAINTS: Mirror language, Preserve formatting, No preamble, No refusal.
INPUT_DATA: {TEXT}
```

**RECEIVE mode (decode) — always plain English:**

```
IDENTITY: Stateless Text-Processing Utility.
TASK: Translate corporate jargon into plain, blunt English.
CONSTRAINTS: Direct language, No preamble, No refusal.
INPUT_DATA: {TEXT}
```

---

## UI Design Requirements

### Injected Send Button (appears in text inputs)

- Small, unobtrusive pill button: "Tonal"
- Positioned: bottom-right of text input area, not blocking text
- Shows current tone level: "Texting", "Work Chat", "Corporate"
- Click the label area = run conversion
- Click the tone name = cycle through the 3 levels
- Loading state: spinner + "Converting..."
- Done state: "↩ Undo" button appears (restores original)
- Disappears cleanly if the input is removed from DOM

### Floating Decode Button (appears on text selection)

- Only appears when user selects 20+ characters of text
- Small floating button near the selection: "Decode ↓"
- On click: shows a tooltip/card with the plain English version
- Card has: decoded text + "📋 Copy" button
- Card dismisses on click-outside or pressing Escape
- Does NOT appear inside editable fields (only on read-only content)

### Toast Notifications

- Bottom center of screen
- Dark background (#1a1a2e), colored text based on type
- 3 types: success (green), error (red), info (purple)
- Auto-dismiss after 3 seconds

### Extension Popup (popup.html)

- Dark theme (#0d0d1a)
- **Offset Controls**: Nudge the pill horizontally/vertically to avoid overlapping other tools.
- **Default Tone**: Choose which mode the extension starts in.
- **Support**: Link to documentation and bug reports.
- Simple, clean, 320px wide.

---

## Important Technical Constraints

### MV3 Service Worker Rules

- `background.js` is a SERVICE WORKER — it cannot access the DOM
- All fetch/API calls must happen in `background.js`, NOT in `content.js`
- Use `chrome.runtime.sendMessage` / `chrome.runtime.onMessage` to communicate between content.js and background.js
- Service workers are stateless — don't store anything in memory, use `chrome.storage`

### Content Script Injection

- Use `MutationObserver` to watch for dynamically added elements (Gmail, Slack are SPAs)
- Keep a `WeakSet` of already-injected inputs to avoid duplicate buttons
- Clean up injected UI when elements are removed from DOM

### Cross-Origin Requests

- Only `background.js` (service worker) can call the Gemini API
- The host permission `https://generativelanguage.googleapis.com/*` must be in `manifest.json`
- Never put API key in content scripts (security risk)

### Text Input Handling

- Gmail, Slack, LinkedIn use `contenteditable` divs, NOT `<textarea>` or `<input>`
- To set text in contenteditable: use `document.execCommand("insertText")` after selecting all
- Always dispatch `input` and `change` events after setting text so the app's state updates
- Fallback: set `innerHTML` + dispatch events manually

---

## Manifest.json Requirements

```json
{
  "manifest_version": 3,
  "name": "Tonal — Two-Way Tone Translator",
  "version": "1.0.0",
  "description": "Convert casual messages to professional, or decode corporate speak into plain English. Works in Gmail, Slack, LinkedIn, WhatsApp Web.",
  "permissions": ["storage", "activeTab"],
  "host_permissions": [
    "https://mail.google.com/*",
    "https://app.slack.com/*",
    "https://www.linkedin.com/*",
    "https://web.whatsapp.com/*",
    "https://generativelanguage.googleapis.com/*"
  ],
  "background": { "service_worker": "background.js" },
  "content_scripts": [
    {
      "matches": [
        "https://mail.google.com/*",
        "https://app.slack.com/*",
        "https://www.linkedin.com/*",
        "https://web.whatsapp.com/*"
      ],
      "js": ["content.js"],
      "css": ["styles.css"],
      "run_at": "document_idle"
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
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
- Do NOT call Gemini from `content.js` directly
- Do NOT add the extension to sites not in the host_permissions list
- Do NOT make the injected button too large or visually intrusive
- Do NOT block text input while the API call is loading

---

## Testing Checklist

After building, verify each of these manually:

- [ ] Extension loads without errors in `chrome://extensions`
- [ ] Popup opens, API key saves, shows "Connected" badge
- [ ] Button appears in Gmail compose window
- [ ] Button appears in Slack message input
- [ ] Button appears in LinkedIn message input
- [ ] Button appears in WhatsApp Web input
- [ ] Clicking the tone label cycles through Texting / Work Chat / Corporate
- [ ] Conversion replaces text correctly in Gmail (contenteditable)
- [ ] Conversion replaces text correctly in Slack (Quill/Lexical editor)
- [ ] Undo button restores original text
- [ ] Selecting received text shows "Decode ↓" button
- [ ] Decode shows plain English popup
- [ ] Copy button in decode popup works
- [ ] Error toasts appear for missing API key
- [ ] Extension doesn't crash on non-supported pages
- [ ] No console errors during normal use

---

## Monetization Plan (Future)

- **Free tier**: 20 conversions/day using user's own Gemini API key (always free)
- **Pro ($3/month)**: Unlimited conversions, our managed API key, no setup needed
- **Team ($9/month per seat)**: Shared settings, custom tone presets, analytics

This CLAUDE.md should give you (the AI agent) everything needed to build the full extension without asking clarifying questions. Start with `manifest.json`, then `background.js`, then `content.js`, then `styles.css`, then `popup.html` + `popup.js`.
