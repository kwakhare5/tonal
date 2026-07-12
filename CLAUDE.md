# Tonal — CLAUDE.md
# Global rules: C:\Users\kwakh\.gemini\config\AGENTS.md (read this first)
# Project wiki: D:\workflow-main\02_Obsidian_Brain\wiki\Projects\Tonal.md

---
**AI POINTER:** You are an amnesiac. DO NOT `grep` the codebase. At session start you MUST:
1. Use Obsidian MCP to read `00_System/active_project_context.md`
2. Read `wiki/hot.md` (recent context cache - ~500 words, fast)
3. Only then proceed. Do not guess architecture.
> For DB schema, file tree, and ADRs -> see `ARCHITECTURE.md` (loaded on-demand via @ZOOM).

## PROJECT RULES (not in the brain or global AGENTS.md)

### Hard Constraints (never break these)
- Vanilla JS ONLY. No React, no Vue, no npm, no bundler, no build step.
- All CSS inlined in the content script. No external stylesheets.
- All Tonal UI wrapped in Shadow DOM. No exceptions.
- Never inject into `<iframe>` elements.
- Never put the API key in content script. All API calls go: `content.js → background.js → Cloudflare Worker → Groq`.

### Storage
- `chrome.storage.local` for persistence (not localStorage — doesn't work across pages in MV3)
- `chrome.storage.sync` for user preferences (syncs across devices, max 100KB total)

### Adding a New Platform Adapter
1. Create `src/extension/adapters/[platform].js`
2. Find the platform's text input injection point
3. Create host element → attach Shadow DOM → render Tonal pill inside shadow root
4. Register adapter in `src/extension/adapters/manager.js`
5. Add `host_permissions` for the platform's domain in `manifest.json`

### Design Tokens
- Source of truth: `design/tonal-design-system-v2.html`
- All tokens must be declared inside `:host { }` inside the shadow root
- Never reference CSS variables from the host page — they don't cross the Shadow DOM boundary

### Before Marking Done
- Test injection on the actual platform in Chrome (load unpacked)
- Verify Undo restores original text exactly
- Verify Decode card is viewport-aware (doesn't clip at screen edges)

---

## 7. PROJECT-SPECIFIC SKILLS

_Skills that only load for THIS project. Put them in .agents/skills/ in the project root._

```
.agents\
  skills\
    my-skill-name\
      SKILL.md     <- auto-discovered, loads only in this project
```

**Use .agents/skills/ for:** domain patterns, API quirks, internal conventions unique to this codebase.
**Use global skills (workflow-main) for:** anything reusable across projects (Supabase, Stripe, Tailwind, etc.)

_Current project-specific skills:_
<!-- List them here as you add them -->
<!-- Format: "- `skill-name` - what it does" -->
