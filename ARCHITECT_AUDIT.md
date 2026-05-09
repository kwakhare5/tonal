# ARCHITECT_AUDIT.md
Feature: Fixing Platform Architecture Inconsistencies | Date: 2026-05-09

## Blast Radius Map
Fixing these 8 issues will touch the following areas of the codebase:
- `src/extension/content.js`: Major changes to `insertText()`, `watch()`, `convert()`, and `directConvert()`.
- `src/extension/background.js`: Changes to state management (`stats`, `circuitOpen`) to use `chrome.storage`.
- `src/extension/popup.js`: Minor updates to ensure settings are saved correctly for `content.js` to read.
- `src/core/tonal.js`: Potential minor updates if we change how the wrapper attaches to the DOM.

## Failure Mode Analysis
- **API Failure:** Handled by Circuit Breaker; results in "AI Offline" toast.
- **Offline Mode:** Prevents futile requests, preserving battery.
- **State Sync:** Prevents "Ghost Text" by forcing framework reconcilers to update.

## Architecture Options + Trade-offs
1. **Tactical Patch:** Fast (1hr), low complexity, poor scalability.
2. **Structural Overhaul:** Slower (4hr), high stability, 10x scalability (Recommended).

## Recommended Approach
**Option 2: Structural Overhaul**. Necessary for "Elite" production stability.

## Pre-conditions
1. Approved Implementation Plan.
2. Priority list for platform testing (LinkedIn first).
