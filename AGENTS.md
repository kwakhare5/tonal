# AGENTS.md — Project Rules
# Global: C:\Users\kwakh\.gemini\config\AGENTS.md
# Brain: D:\workflow-main\brain\Projects\[Project].md

# Tonal â€” CLAUDE.md
# Global rules: C:\Users\kwakh\.gemini\config\AGENTS.md (read this first)
# Brain file: D:\workflow-main\brain\Projects\Tonal.md (full context â€” file map, flows, adapters)

---

## PROJECT RULES (not in the brain or global AGENTS.md)

### Hard Constraints (never break these)
- Vanilla JS ONLY. No React, no Vue, no npm, no bundler, no build step.
- All CSS inlined in the content script. No external stylesheets.
- All Tonal UI wrapped in Shadow DOM. No exceptions.
- Never inject into `<iframe>` elements.
- Never put the API key in content script. All API calls go: `content.js â†’ background.js â†’ Cloudflare Worker â†’ Groq`.

### Storage
- `chrome.storage.local` for persistence (not localStorage â€” doesn't work across pages in MV3)
- `chrome.storage.sync` for user preferences (syncs across devices, max 100KB total)

### Adding a New Platform Adapter
1. Create `src/extension/adapters/[platform].js`
2. Find the platform's text input injection point
3. Create host element â†’ attach Shadow DOM â†’ render Tonal pill inside shadow root
4. Register adapter in `src/extension/adapters/manager.js`
5. Add `host_permissions` for the platform's domain in `manifest.json`

### Design Tokens
- Source of truth: `design/tonal-design-system-v2.html`
- All tokens must be declared inside `:host { }` inside the shadow root
- Never reference CSS variables from the host page â€” they don't cross the Shadow DOM boundary

### Before Marking Done
- Test injection on the actual platform in Chrome (load unpacked)
- Verify Undo restores original text exactly
- Verify Decode card is viewport-aware (doesn't clip at screen edges)

