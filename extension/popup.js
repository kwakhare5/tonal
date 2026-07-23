// Mock chrome.storage for local runs outside extension context
if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.sync) {
  window.chrome = {
    storage: {
      sync: {
        get: (defaults, callback) => {
          const defaultTone = localStorage.getItem("defaultTone") || defaults.defaultTone;
          const pillEnabled = localStorage.getItem("pillEnabled") !== null
            ? localStorage.getItem("pillEnabled") === "true"
            : defaults.pillEnabled;
          const decodeEnabled = localStorage.getItem("decodeEnabled") !== null
            ? localStorage.getItem("decodeEnabled") === "true"
            : defaults.decodeEnabled;
          
          callback({ defaultTone, pillEnabled, decodeEnabled });
        },
        set: (data, callback) => {
          if (data.defaultTone !== undefined) localStorage.setItem("defaultTone", data.defaultTone);
          if (data.pillEnabled !== undefined) localStorage.setItem("pillEnabled", data.pillEnabled);
          if (data.decodeEnabled !== undefined) localStorage.setItem("decodeEnabled", data.decodeEnabled);
          if (callback) callback();
        }
      }
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const tabSettings = document.getElementById("tab-settings");
  const tabActivity = document.getElementById("tab-activity");
  const viewsWrapper = document.getElementById("viewsWrapper");

  const togglePill = document.getElementById("toggle-pill");
  const toggleDecode = document.getElementById("toggle-decode");
  const toneItems = document.querySelectorAll(".seg-item");
  const saveBtn = document.getElementById("saveBtn");

  const statRewrites = document.getElementById("stat-rewrites");
  const statDecoded = document.getElementById("stat-decoded");
  const statTime = document.getElementById("stat-time");

  let selectedTone = "workChat";

  // ── Tab Switching ───────────────────────────────────────────
  tabSettings.addEventListener("click", () => {
    tabSettings.classList.add("tab-btn--active");
    tabActivity.classList.remove("tab-btn--active");
    viewsWrapper.style.transform = "translateX(0)";
  });

  tabActivity.addEventListener("click", () => {
    tabActivity.classList.add("tab-btn--active");
    tabSettings.classList.remove("tab-btn--active");
    viewsWrapper.style.transform = "translateX(-280px)";
  });

  // ── Load Saved Preferences ──────────────────────────────────
  chrome.storage.sync.get(
    {
      defaultTone: "workChat",
      pillEnabled: true,
      decodeEnabled: true
    },
    (result) => {
      selectedTone = result.defaultTone;
      togglePill.checked = result.pillEnabled;
      toggleDecode.checked = result.decodeEnabled;
      updateToneUI();
    }
  );

  // ── Load Real Statistics ─────────────────────────────────────
  chrome.storage.local.get({ statRewrites: 0, statDecoded: 0 }, (stats) => {
    const rewrites = stats.statRewrites;
    const decoded = stats.statDecoded;
    const timeSaved = Math.round(rewrites * 0.17);
    statRewrites.textContent = rewrites.toLocaleString();
    statDecoded.textContent = decoded.toLocaleString();
    statTime.textContent = `${timeSaved} mins`;
  });

  // ── Tone Switching ──────────────────────────────────────────
  toneItems.forEach((item) => {
    item.addEventListener("click", () => {
      selectedTone = item.dataset.tone;
      updateToneUI();
    });
  });

  // ── Save Preferences ────────────────────────────────────────
  saveBtn.addEventListener("click", () => {
    chrome.storage.sync.set(
      {
        defaultTone: selectedTone,
        pillEnabled: togglePill.checked,
        decodeEnabled: toggleDecode.checked
      },
      () => {
        const originalText = saveBtn.textContent;
        const originalBg = saveBtn.style.background;
        saveBtn.textContent = "Saved!";
        saveBtn.style.background = "#34C759";
        saveBtn.style.pointerEvents = "none";
        setTimeout(() => {
          saveBtn.textContent = originalText;
          saveBtn.style.background = originalBg;
          saveBtn.style.pointerEvents = "auto";
        }, 1500);
      }
    );
  });

  function updateToneUI() {
    toneItems.forEach((item) => {
      if (item.dataset.tone === selectedTone) {
        item.classList.add("seg-item--active");
      } else {
        item.classList.remove("seg-item--active");
      }
    });
  }
});
