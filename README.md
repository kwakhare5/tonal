<div align="center">

<!-- PROJECT LOGO / BANNER -->
<img src="https://raw.githubusercontent.com/kwakhare5/Tonal/main/icons/icon128.png" alt="Tonal banner" width="128"/>

<br/>
<br/>

# Tonal

### Precision tone translation for Gmail, Slack, and LinkedIn

<br/>

<!-- BADGES -->
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=flat-square)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-4285F4?style=flat-square&logo=google-chrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Geist Type](https://img.shields.io/badge/Typography-Geist-000000?style=flat-square)](https://vercel.com/font)
[![Last Commit](https://img.shields.io/github/last-commit/kwakhare5/Tonal?style=flat-square)](https://github.com/kwakhare5/Tonal/commits/main)

<br/>

<!-- QUICK NAVIGATION LINKS -->
[🚀 Quickstart](#quickstart) · [🏗️ Architecture](#architecture) · [🛡️ Privacy](#privacy--security)

</div>

---

## 🧩 What is Tonal?

Tonal is a **zero-dependency Chrome extension** acting as a precision translator inside Gmail, Slack, and LinkedIn. It bridges the gap between raw drafts and professional execution.

Built with **Shadow DOM isolation**, it ensures that your professional communication remains visually pristine and functionally stable, regardless of the host platform's complexity.

---

## ✅ Core Features

- ✅ **Precision Sending** — Convert casual notes to **Formal Professional** or **Work Chat** instantly.
- ✅ **Blunt Decoding** — Select jargon-heavy text and click **Decode** for a blunt, plain English explanation.
- ✅ **Unkillable Pill** — **1.5s Heartbeat Watchdog** ensures Tonal persists through framework re-renders.
- ✅ **Identity Lock** — AI engine preserves names, dates, and emails as immutable constants.

---

## 🏗️ Architecture

Tonal utilizes a stateless, high-performance bridge between your browser and the Groq Llama 3.3 70B engine.

```text
  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
  │   Content    │      │  Background  │      │  Cloudflare  │
  │   Script     │─────▶│   Worker     │─────▶│    Worker    │
  │ (Shadow DOM) │      │  (Manifest V3)│     │   (Proxy)    │
  └──────────────┘      └──────────────┘      └──────────────┘
                                                     │
                                             ┌───────▼──────┐
                                             │  Groq Engine │
                                             │ (Llama 3.3   │
                                             │   70B Vers)  │
                                             └──────────────┘
```

---

## 🚀 Quickstart

### Prerequisites

- Chrome Browser
- Groq API Key

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/kwakhare5/Tonal.git
cd Tonal

# 2. Open Extension Management
# In Chrome: chrome://extensions/

# 3. Load Unpacked
# Click 'Load unpacked' and select the Tonal folder.
```

### Configuration

1. Click the **Tonal Icon** in your toolbar.
2. Enter your **Groq API Key**.
3. Refresh your Gmail, Slack, or LinkedIn tabs.

---

## 📖 Documentation

### Technical Mechanisms

| Feature | Type | Description |
|-----------|------|-------------|
| **Heartbeat** | `1.5s` | Watchdog timer ensuring pill presence via `requestAnimationFrame`. |
| **Sync Loop** | `5-Tick` | Multi-attempt retry logic for stable LinkedIn/Draft.js text replacement. |
| **Isolation** | `Shadow DOM` | Nuclear-level CSS resets to prevent host site pollution. |

### Usage Examples

**Sending Mode:**
Type "hey can u send that doc" -> Click Tonal Pill -> Select **Formal** -> Text becomes "I hope you are well. Could you please send over the document at your earliest convenience?"

**Decoding Mode:**
Select "We need to synergize our core competencies" -> Click **Decode** -> Result: "We need to use our skills to get results."

---

## 📁 Project Structure

```text
Tonal/
│
├── manifest.json            # Extension Config
├── src/
│   ├── core/
│   │   └── tonal.js         # Design System & UI Components
│   ├── extension/
│   │   ├── adapters/        # Platform-specific Logic
│   │   │   ├── gmail.js     # Lexical/Classic Support
│   │   │   ├── slack.js     # Quill/Lexical Support
│   │   │   └── linkedin.js  # Draft.js / Multi-Tick Sync
│   │   ├── background.js    # Service Worker Proxy
│   │   └── content.js       # Injection Engine
│   └── popup.js             # Extension Settings
│
├── icons/                   # Branding Assets
└── README.md
```

---

## 🧪 Stability Checklist

- [x] **Gmail Integration**: Verified on Lexical and Classic compose boxes.
- [x] **Slack Compatibility**: Verified on Browser-based Quill/Lexical editors.
- [x] **LinkedIn Stability**: Multi-Tick restoration logic confirmed.
- [x] **Zero Drift**: Absolute positioning watchdog confirmed.
- [x] **Privacy**: 100% Stateless request cycle verified.

---

## 🤝 Contributing

We value **clarity over cleverness**. If you'd like to contribute:

1. Fork the repo
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 🛡️ Privacy & Security

> Tonal operates on a **Stateless** principle.
> We do not store, log, or train on your messages.
> Requests are processed in-memory and purged immediately.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Karan Wakhare**

[![GitHub](https://img.shields.io/badge/GitHub-kwakhare5-181717?style=flat-square&logo=github)](https://github.com/kwakhare5)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/karan-wakhare)

---

<div align="center">
  <sub>If this helped you, consider giving it a ⭐ — it means a lot!</sub>
</div>
