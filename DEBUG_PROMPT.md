# FULL DIAGNOSTIC PROMPT — Paste this into Antigravity IDE
# ============================================================
# Copy everything below this line and paste it into Antigravity chat

---

I need you to do a complete from-scratch diagnostic and fix of my Chrome extension. 
Go through every single file, find all issues, and fix them one by one. 
Do not skip any file. Do not assume anything works. Check everything.

## Step 1 — Read ALL files first

Open and read every file in this project before touching anything:
- manifest.json
- background.js
- content.js
- styles.css
- popup.html
- popup.js

Confirm you have read all of them before proceeding.

---

## Step 2 — Check manifest.json for these specific issues

1. Is `manifest_version` set to exactly `3`? (not 2, not "3")
2. Are ALL these in `host_permissions`?
   - "https://mail.google.com/*"
   - "https://app.slack.com/*"
   - "https://www.linkedin.com/*"
   - "https://web.whatsapp.com/*"
   - "https://generativelanguage.googleapis.com/*"
3. Is `background.service_worker` pointing to `"background.js"`?
4. Is `action.default_popup` pointing to `"popup.html"`?
5. Do the content_scripts `matches` include all 4 websites?
6. Are both `"content.js"` and `"styles.css"` listed under content_scripts?
7. Are the icon paths correct — `"icons/icon16.png"`, `"icons/icon48.png"`, `"icons/icon128.png"`?
8. Is `"run_at": "document_idle"` set on content_scripts?

Fix any issues found.

---

## Step 3 — Check background.js for these specific issues

1. Is this file a pure service worker? (NO `document`, NO `window`, NO `localStorage` — these don't exist in service workers and will crash it silently)
2. Does it listen for messages using `chrome.runtime.onMessage.addListener`?
3. Does the listener return `true` at the end to keep the async channel open?
4. Is the Gemini API URL exactly this?
   `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=API_KEY_HERE`
   (The key goes as a QUERY PARAMETER `?key=`, NOT in headers)
5. Is the Gemini request body structured like this?
   ```json
   {
     "contents": [{"parts": [{"text": "PROMPT_HERE"}]}],
     "generationConfig": {"maxOutputTokens": 500, "temperature": 0.4}
   }
   ```
6. Is the response extracted like this?
   `data.candidates[0].content.parts[0].text.trim()`
7. Does it handle these error codes?
   - 401: invalid API key
   - 429: rate limit
   - network failure (catch block)
8. Does it send back `{success: true, text: result}` or `{success: false, error: message}`?

Fix every issue found.

---

## Step 4 — Check content.js for these specific issues

### 4A — Initialization
1. Is there a delay before scanning? (Slack, Gmail, LinkedIn are SPAs — they need 1500ms delay minimum before the DOM is ready)
2. Is there a MutationObserver watching for new elements? (These apps add the text input dynamically)
3. Is there a WeakSet or Set to track already-injected inputs? (prevents duplicate buttons)

### 4B — Input Detection Selectors
Check that these EXACT selectors are being tried for each platform:

**Gmail:**
- `div[aria-label="Message Body"]`
- `.Am.Al.editable`
- `[role="textbox"][aria-multiline="true"]`

**Slack:**
- `.ql-editor[data-placeholder]`
- `[data-qa="message_input"]`
- `[data-lexical-editor="true"]`
- `.p-rich_text_input__editable`

**LinkedIn:**
- `.msg-form__contenteditable`
- `div[aria-label="Write a message..."]`
- `.ql-editor`

**WhatsApp Web:**
- `div[contenteditable="true"][data-tab="10"]`
- `div[contenteditable="true"][title="Type a message"]`

### 4C — Button Injection
1. Is the button being appended to the correct parent? (it should go near the toolbar/send button area, not inside the text input itself)
2. Is the button position `absolute` or does it use the parent's flex layout?
3. Is the current tone level stored on the button (e.g. `button.dataset.tone = "workChat"`)?

### 4D — Text Reading
1. Is text being read from `inputElement.innerText` or `inputElement.textContent`? (both are fine for contenteditable)
2. Is it trimming whitespace before checking if empty?
3. Is there a minimum length check? (skip if less than 5 characters)

### 4E — Sending Message to Background
Is the message format exactly this?
```javascript
chrome.runtime.sendMessage({
  type: "TONESHIFT_CONVERT",  // or TONESHIFT_DECODE
  text: originalText,
  toneLevel: currentTone,  // "texting", "workChat", or "corporate"
  apiKey: apiKey
}, (response) => {
  // handle response.success and response.text
});
```

### 4F — Getting API Key
Is it reading the key like this?
```javascript
chrome.storage.sync.get(["apiKey"], ({ apiKey }) => { ... });
```
(NOT localStorage — that doesn't work in extensions)

### 4G — Replacing Text in ContentEditable
This is the most common failure point. The replacement must work like this:
```javascript
function setContentEditableText(element, newText) {
  element.focus();
  
  // Method 1: execCommand (works in most cases)
  document.execCommand("selectAll", false, null);
  document.execCommand("insertText", false, newText);
  
  // Method 2: Fallback if above doesn't trigger app state update
  if (element.innerText.trim() !== newText.trim()) {
    element.innerHTML = newText;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
  }
}
```
The key is dispatching the `input` event after setting text — otherwise Gmail/Slack won't know the text changed.

### 4H — Decode Feature (Text Selection)
1. Is the `selectionchange` or `mouseup` event on `document`?
2. Is it checking `window.getSelection().toString().trim().length >= 20`?
3. Is it NOT showing the decode button when selection is inside a contenteditable?
4. Is the floating button positioned using `getBoundingClientRect()` of the selection range?

Fix every issue found in content.js.

---

## Step 5 — Check popup.js for these specific issues

1. Is it saving to `chrome.storage.sync` (not localStorage)?
2. Is it reading back on load like this?
   ```javascript
   chrome.storage.sync.get(["apiKey", "defaultTone"], ({ apiKey, defaultTone }) => { ... });
   ```
3. Does it validate the API key starts with `"AIza"` before saving? (Gemini keys always start with AIza)
4. Does it show/hide the "Connected" badge based on whether a key exists?
5. Is there a visible success/error message after saving?

---

## Step 6 — Check styles.css for these specific issues

1. Is the button's z-index high enough? (minimum 9999 so it appears above the app's own UI)
2. Does the toast notification have `position: fixed` and `z-index: 999999`?
3. Are styles namespaced with a prefix like `.ts-` to avoid conflicting with Slack/Gmail/LinkedIn's own CSS?
4. Is `pointer-events: none` set on the toast so it doesn't block clicking?
5. Is the decode card `position: fixed` (not absolute) so it stays in view?

---

## Step 7 — Generate Icons If Missing

If the icons folder is empty or icons are missing, write and run this Python script:

```python
from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs("icons", exist_ok=True)

sizes = [16, 48, 128]
for size in sizes:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Rounded rectangle background
    margin = size // 8
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=size // 5,
        fill=(107, 33, 255, 255)
    )
    
    img.save(f"icons/icon{size}.png")
    print(f"Created icon{size}.png")
```

Run it with: `python3 generate_icons.py`

---

## Step 8 — Test It After Fixing

After fixing all issues:

1. Open Chrome → go to `chrome://extensions`
2. Click the refresh icon on the ToneShift extension
3. Open Chrome DevTools console on the BACKGROUND SERVICE WORKER:
   - Go to `chrome://extensions`
   - Find ToneShift → click "Service Worker" link
   - This opens DevTools for the background script
   - Check for any errors here
4. Open Gmail in a new tab
5. Right-click → Inspect → Console tab
   - Check for any content.js errors here
6. Click "Compose" in Gmail
7. Type a message in the compose box
8. Check if the ToneShift button appears

If button does NOT appear:
- In the Gmail console, type: `document.querySelector('div[aria-label="Message Body"]')`
- If it returns null, the selector is wrong for this Gmail version
- Find the actual selector: right-click the compose text area → Inspect → look at the element's classes and attributes → update the selector in content.js

---

## Step 9 — Common Error Messages and Their Fixes

| Error you see | What it means | Fix |
|---|---|---|
| "Could not establish connection. Receiving end does not exist." | content.js sent a message but background.js wasn't loaded | Reload the extension and the tab |
| "Extension context invalidated" | Extension was reloaded while the tab was open | Refresh the Gmail/Slack tab |
| "Cannot read properties of null (reading 'addListener')" | chrome.runtime not available | You're running content.js code outside a content script context |
| API returns 400 Bad Request | Wrong request body format to Gemini | Check the `contents` structure matches exactly |
| API returns 403 | API key doesn't have Gemini API enabled | Go to Google AI Studio and enable the API |
| Button appears but nothing happens on click | API key not saved, or message not reaching background.js | Check chrome.storage.sync has the key, check background service worker console |
| Text not replaced after conversion | setContentEditableText not triggering app state | Add the input event dispatch, try both execCommand and innerHTML methods |

---

## Step 10 — Final Verification Checklist

After all fixes, verify each one works:
- [ ] Extension loads with no errors in chrome://extensions
- [ ] Popup opens when clicking the extension icon
- [ ] API key saves and Connected badge appears
- [ ] Reloading Gmail shows the ToneShift button in compose
- [ ] Clicking the tone label cycles through Texting → Work Chat → Corporate
- [ ] Typing a message and clicking the button replaces the text
- [ ] Undo button restores original text
- [ ] Selecting received text shows Decode button
- [ ] Decode shows a plain English result
- [ ] No errors in the Service Worker console
- [ ] No errors in the Gmail/Slack tab console

Report back with exactly which checks passed and which failed so we can fix the remaining issues.
