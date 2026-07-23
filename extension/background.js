/**
 * Tonal Background Service Worker
 */

const WORKER_URL = "https://tonal-proxy.kwakhare5.workers.dev";


/**
 * Detects the platform from a tab URL.
 * @param {string} url
 * @returns {'gmail'|'slack'|'linkedin'|'general'}
 */
function detectPlatform(url) {
  if (!url) return "general";
  if (url.includes("mail.google.com")) return "gmail";
  if (url.includes("slack.com")) return "slack";
  if (url.includes("linkedin.com")) return "linkedin";
  return "general";
}

/**
 * Message Router: Listens for rephrasing or decoding requests.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const isTonalRequest = ["TONESHIFT_CONVERT", "TONESHIFT_DECODE"].includes(
    request.type,
  );
  if (!isTonalRequest) return;

  const platform = detectPlatform(sender.tab?.url);
  handleRequest(request, sendResponse, platform);
  return true; // Keep channel open for async response
});

/**
 * Keyboard shortcut: forward TONAL_ACTIVATE to the active tab.
 */
chrome.commands.onCommand.addListener((command) => {
  if (command !== "activate-tonal") return;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "TONAL_ACTIVATE" });
    }
  });
});

/**
 * Processes the AI task by calling the Cloudflare Proxy.
 * @param {object} request
 * @param {function} sendResponse
 * @param {string} platform
 */
async function handleRequest(request, sendResponse, platform) {
  const mode = request.type === "TONESHIFT_DECODE" ? "decode" : "convert";

  const payload = {
    text: request.text?.substring(0, 5000), // Safety limit
    toneLevel: request.toneLevel || "workChat",
    mode: mode,
    platform: platform, // Enables platform-specific prompts in the worker
  };

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`Server Error: ${response.status}`);

    const data = await response.json();

    if (data.success && data.text) {
      sendResponse({ success: true, text: data.text });
    } else {
      throw new Error(data.error || "AI returned empty response");
    }
  } catch (err) {
    console.error("Tonal Gateway Error:", err.message);
    // Detect network/offline errors vs server errors
    const isOffline = err.message.includes("Failed to fetch") ||
      err.message.includes("NetworkError") ||
      err.message.includes("401") ||
      err.message.includes("503");
    sendResponse({ success: false, error: err.message, offline: isOffline });
  }
}

