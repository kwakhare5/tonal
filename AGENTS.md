# AGENTS.md
# Universal agent context file.
# Global AI rules: C:\Users\kwakh\.gemini\config\AGENTS.md (auto-loaded by Antigravity)
# Brain: D:\workflow-main\brain\ (read via MCP obsidian-vault at session start)
#
# READ ORDER:
# 1. Global AGENTS.md (auto-loaded)   → behavior, brain rules, audit loop
# 2. This file                        → project identity, tech stack, design system
# 3. CONTEXT.md                       → domain glossary, session log
# 4. ARCHITECTURE.md                  → schemas, API contracts
# CLAUDE.md â€” Agent Rules + Project Context

## Overview

Single file. Contains always-active rules + project info.

---

## MANDATORY â€” THE BREATH (before any action, every session)

Read in order:

1. This file (you are here)
2. `C:\Users\kwakh\.gemini\SKILLS_INDEX.md` â€” skills registry

Proof required: state one detail from each before proceeding.
Skip = stop, apologize, re-read.

> First session or stack decision only:
> Read `C:\Users\kwakh\.gemini\GEMINI.md` for tech preferences.

---

## ALWAYS-ACTIVE RULES

**R0 â€” SENTINEL HEADER**
First line of every response:
`ðŸ” Skill: [loaded/none] | Persona: [@role] | Permission: [obtained/pending]`

**R1 â€” PROPOSE BEFORE EXECUTING**
Plan â†’ wait for "Approved" â†’ execute. No autonomous actions. No exceptions.
Format: Goal / Approach / Steps / Risks

**R5 â€” LIVING DOCUMENTS**
Before ending any session: update task.md + walkthrough.md. Both. No skipping.
task.md = what. walkthrough.md = why.

**R13 â€” CONTEXT TRUNCATION**
If chat is long: re-read this file immediately.
Announce: "âš ï¸ Context truncation. Re-syncing." Never assume you remember rules.

---

## COMMANDS

| Command | What it does | Rule |
| :--- | :--- | :--- |
| @SYNC | Re-reads all global files + loads relevant skills | R2 |
| @AUDIT | Scans codebase, scores it, writes AUDIT.md | R3 |
| @TAG [feature] | Architecture scan, writes ARCHITECT_AUDIT.md | R4 |

**For full rule details â†’ `C:\Users\kwakh\.gemini\AI_RULES.md`**

---

## SKILLS (loaded via @SYNC or on demand)

Index: `C:\Users\kwakh\.gemini\SKILLS_INDEX.md`
Path: `C:\Users\kwakh\.gemini\config\skills\[skill-folder]\SKILL.md`
Rule: read index â†’ match task â†’ load SKILL.md â†’ state what was loaded. Max 2 per task.

---

## Project Context for Antigravity

**Tonal** is a free Chrome extension that works as a two-way tone translator inside Gmail, Slack (browser), and LinkedIn. It uses a Cloudflare Worker proxy to route requests to Groq (Llama 3.3 70B) for high-fidelity, preamble-free rephrasing.

It solves two problems for Gen Z users and non-native English speakers:

**Problem 1 â€” Sending:**
User types a casual message ("hey can u send me that doc") and needs it to sound professional before sending. One click converts it to the right tone level.

**Problem 2 â€” Receiving:**
User receives a long formal/corporate message and can't be bothered to parse it. They select the text and one click tells them what it actually means in plain English.

**The tone levels are:**

- **Casual texting** â€” Lowercase, minimal punctuation, short-form (u, r, sry).
- **Work Chat** â€” Friendly professional. How a normal person talks to a colleague.
- **Formal professional** â€” High-status executive English. Clear, authoritative, and polite.

---

## Tech Stack

| Layer               | Technology                                         | Why                                    |
| :------------------ | :------------------------------------------------- | :------------------------------------- |
| Extension framework | Chrome Extension Manifest V3                       | Required for Chrome                    |
| Languages           | Vanilla JavaScript, HTML, CSS                      | Zero dependencies, fast load           |
| AI API              | Groq (Llama 3.3 70B)                               | Free tier, extremely fast, 70B quality |
| API endpoint        | <https://api.groq.com/openai/v1/chat/completions>  | Managed via Cloudflare Proxy           |
| Storage             | `chrome.storage.sync`                              | Sync settings across devices           |
| Background worker   | Service Worker (MV3)                               | Required by MV3 spec                   |

**No npm. No build step. No React. No bundler.** Pure vanilla JS files the browser loads directly.

---

## File Structure

```text
tonal/
â”œâ”€â”€ CLAUDE.md                    â† This file (project context)
â”œâ”€â”€ manifest.json                â† Extension config
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ core/
â”‚   â”‚   â””â”€â”€ tonal.js             â† Design System Tokens & Classes
â”‚   â””â”€â”€ extension/
â”‚       â”œâ”€â”€ adapters/            â† Platform-specific DOM interaction
â”‚       â”‚   â”œâ”€â”€ manager.js
â”‚       â”‚   â”œâ”€â”€ linkedin.js
â”‚       â”‚   â”œâ”€â”€ slack.js
â”‚       â”‚   â”œâ”€â”€ gmail.js
â”‚       â”‚   â””â”€â”€ default.js
â”‚       â”œâ”€â”€ background.js        â† Service worker: Proxies to Cloudflare
â”‚       â”œâ”€â”€ content.js           â† Orchestration & Scan Loop Engine
â”‚       â”œâ”€â”€ popup.html           â† Elite Popup
â”‚       â””â”€â”€ popup.js             â† Popup Logic
â”œâ”€â”€ design/
â”‚   â””â”€â”€ tonal-design-system-v2.html â† Source of Truth (Elite)
â”œâ”€â”€ icons/                       â† Branding icons
â””â”€â”€ README.md                    â† User guide
```

---

## How It Works â€” Full Flow

### Sending Flow (Casual â†’ Formal)

1. User types in Gmail compose, Slack message box, or LinkedIn message
2. `content.js` detects the text input and injects a small "Tonal" pill button
3. User picks tone level via the **Popover Dropdown**
4. User clicks the button (or tone item)
5. `content.js` reads text and sends to `background.js`
6. `background.js` calls the Cloudflare Proxy (Groq Llama 3.3 70B)
7. Proxy returns the rewritten text
8. `content.js` replaces the text in the input field
9. There's an Undo button that restores the original text
10. **Real-Time Sync**: Preference changes in the popup update all active pills across all tabs instantly.

### Receiving/Decoding Flow (Formal â†’ Plain)

1. User selects any text on the page
2. A small floating "Decode" button appears near the cursor (with **Magnetic Pull**)
3. `content.js` sends text to `background.js`
4. Groq returns a plain English explanation
5. A **Viewport-Aware** card appears (automatically flips position if near screen edge)
6. Card has a "Copy" button (turns green on success) and auto-dismisses

---

