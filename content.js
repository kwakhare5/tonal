// Set of processed inputs to avoid duplicate buttons
const processedInputs = new WeakSet();

// UI State
const TONE_LEVELS = ['Texting', 'Work Chat', 'Corporate'];

// Helper to show toasts
function showToast(message, type = 'info') {
  let toast = document.getElementById('ts-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ts-toast';
    document.body.appendChild(toast);
  }
  
  toast.className = `ts-toast-visible ${type}`;
  toast.innerText = message;
  
  setTimeout(() => {
    toast.className = '';
  }, 3000);
}

// Function to find the right place to insert the button
function findInsertionPoint(inputElement) {
  // For Gmail, we often want the toolbar or just next to the input
  const gmailToolbar = inputElement.closest('.M9')?.querySelector('.T-I.J-J5-Ji') || inputElement.closest('table')?.parentNode;
  // For Slack, try to find the formatting toolbar parent
  const slackToolbar = inputElement.closest('[data-qa="texty_tab_formatting_button"]')?.parentNode || inputElement.parentNode;
  
  return inputElement.parentNode;
}

// Inject Send Button
function injectSendButton(inputElement) {
  if (!window.chrome || !window.chrome.runtime || !window.chrome.runtime.id) {
    console.warn("Tonal: Extension reloaded. Please refresh the page.");
    return;
  }
  
  chrome.storage.sync.get(['apiKey', 'defaultTone'], (data) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'ts-send-wrapper';
    
    const defaultTone = data.defaultTone || 'Work Chat';
    
    const btn = document.createElement('button');
    btn.className = 'ts-btn';
    btn.innerHTML = `<span class="ts-icon">✨</span> <span class="ts-tone-label">${defaultTone}</span>`;
    btn.dataset.tone = defaultTone;
    
    // Create Undo button (hidden initially)
    const undoBtn = document.createElement('button');
    undoBtn.className = 'ts-btn ts-undo-btn ts-hidden';
    undoBtn.innerHTML = `↩ Undo`;
    
    let originalText = '';
    
    // Cycle tone
    btn.querySelector('.ts-tone-label').addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const currentTone = btn.dataset.tone;
      const nextIndex = (TONE_LEVELS.indexOf(currentTone) + 1) % TONE_LEVELS.length;
      const nextTone = TONE_LEVELS[nextIndex];
      btn.dataset.tone = nextTone;
      btn.querySelector('.ts-tone-label').innerText = nextTone;
    });
    
    // Run conversion
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      chrome.storage.sync.get(['apiKey'], (data) => {

        const textToConvert = inputElement.innerText.trim();
        if (textToConvert.length < 10) {
          showToast('Type more before converting', 'error');
          return;
        }

        originalText = textToConvert;
        
        btn.classList.add('loading');
        btn.innerHTML = `<span class="ts-spinner">↻</span> Converting...`;
        btn.disabled = true;

        chrome.runtime.sendMessage({
          type: 'TONAL_CONVERT',
          text: textToConvert,
          toneLevel: btn.dataset.tone,
          apiKey: data.apiKey
        }, (response) => {
          btn.classList.remove('loading');
          btn.disabled = false;
          btn.innerHTML = `<span class="ts-icon">✨</span> <span class="ts-tone-label">${btn.dataset.tone}</span>`;
          
          if (response && response.success) {
            btn.classList.add('done');
            setTimeout(() => btn.classList.remove('done'), 2000);
            
            replaceTextInInput(inputElement, response.text);
            
            undoBtn.classList.remove('ts-hidden');
          } else {
            const errorMsg = response?.error || 'Connection issue. Check your internet.';
            showToast(errorMsg, 'error');
          }
        });
      });
    });
    
    undoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      replaceTextInInput(inputElement, originalText);
      undoBtn.classList.add('ts-hidden');
    });
    
    wrapper.appendChild(btn);
    wrapper.appendChild(undoBtn);
    
    // Toggle visibility based on text content
    const toggleVisibility = () => {
      if (inputElement.innerText.trim().length > 0) {
        wrapper.classList.remove('ts-hidden');
      } else {
        wrapper.classList.add('ts-hidden');
      }
    };
    
    inputElement.addEventListener('input', toggleVisibility);
    inputElement.addEventListener('keyup', toggleVisibility);
    toggleVisibility(); // Initial check
    
    const insertionPoint = inputElement.parentNode;
    insertionPoint.style.position = 'relative'; // Ensure absolute positioning works
    insertionPoint.appendChild(wrapper);
  });
}

function replaceTextInInput(inputElement, newText) {
  inputElement.focus();

  // Method 1: execCommand (Chrome standard)
  document.execCommand('selectAll', false, null);
  const inserted = document.execCommand('insertText', false, newText);

  // Method 2: Fallback for WhatsApp and apps that ignore execCommand
  if (!inserted || inputElement.innerText.trim() !== newText.trim()) {
    inputElement.innerHTML = newText;
  }

  // Dispatch events so the host app (Gmail, Slack, WhatsApp) picks up the change
  inputElement.dispatchEvent(new Event('input', { bubbles: true }));
  inputElement.dispatchEvent(new Event('change', { bubbles: true }));
  inputElement.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
}

// MutationObserver to watch for dynamic inputs
const selectors = [
  // Gmail
  'div[aria-label="Message Body"]',
  '.Am.Al.editable',
  '[role="textbox"][aria-multiline="true"]',
  'div[role="textbox"][aria-label*="compose"]',
  // Slack
  '.ql-editor[data-placeholder]',
  '[data-qa="message_input"]',
  '[data-lexical-editor="true"]',
  '.p-rich_text_input__editable',
  // LinkedIn
  '.msg-form__contenteditable',
  'div[aria-label="Write a message..."]',
  '.ql-editor',
  // WhatsApp Web
  'div[contenteditable="true"][data-tab="10"]',
  'div[contenteditable="true"][title="Type a message"]',
  'div[aria-placeholder="Type a message"]',
  'div[aria-label="Type a message"]',
  '#main div[contenteditable="true"]'
];

function initObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        document.querySelectorAll(selectors.join(', ')).forEach((el) => {
          if (!el.dataset.tsInjected && el.isContentEditable) {
            el.dataset.tsInjected = 'true';
            processedInputs.add(el);
            injectSendButton(el);
          }
        });
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  
  // Initial check
  document.querySelectorAll(selectors.join(', ')).forEach((el) => {
    if (!el.dataset.tsInjected && el.isContentEditable) {
      el.dataset.tsInjected = 'true';
      processedInputs.add(el);
      injectSendButton(el);
    }
  });
}

// Delay observer slightly for SPAs
setTimeout(initObserver, 1500);

// Selection Handling for Decode
let decodeFloat = null;
let decodeCard = null;

function removeDecodeUI() {
  if (decodeFloat) {
    decodeFloat.remove();
    decodeFloat = null;
  }
  if (decodeCard) {
    decodeCard.remove();
    decodeCard = null;
  }
}

document.addEventListener('mouseup', handleSelection);
document.addEventListener('keyup', handleSelection);

function handleSelection(e) {
  // Don't do anything if we click inside our own decode card
  if (e.target.closest('.ts-decode-card') || e.target.closest('.ts-decode-float')) {
    return;
  }
  
  setTimeout(() => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    // Determine if selection is inside an input/contenteditable
    let isInsideInput = false;
    if (selection.anchorNode) {
      let node = selection.anchorNode;
      while (node) {
        if (node.nodeType === 1 && (node.isContentEditable || node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')) {
          isInsideInput = true;
          break;
        }
        node = node.parentNode;
      }
    }

    if (text.length >= 20 && !isInsideInput) {
      if (!decodeFloat && !decodeCard) {
        showDecodeFloat(selection);
      } else if (decodeFloat) {
        // Update position if selection changes
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        decodeFloat.style.top = `${rect.bottom + 5}px`;
        decodeFloat.style.left = `${rect.right - 40}px`;
      }
    } else {
      removeDecodeUI();
    }
  }, 10);
}

function showDecodeFloat(selection) {
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  decodeFloat = document.createElement('button');
  decodeFloat.className = 'ts-decode-float';
  decodeFloat.innerText = 'Decode ↓';
  decodeFloat.style.top = `${rect.bottom + 5}px`;
  decodeFloat.style.left = `${rect.right - 40}px`;
  
  decodeFloat.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const selectedText = selection.toString().trim();
    
    if (!window.chrome || !window.chrome.runtime || !window.chrome.runtime.id) {
      showToast('Extension reloaded. Please refresh the page.', 'error');
      return;
    }
    
    chrome.storage.sync.get(['apiKey'], (data) => {
      
      decodeFloat.innerText = 'Decoding...';
      
      chrome.runtime.sendMessage({
        type: 'TONAL_DECODE',
        text: selectedText,
        apiKey: data.apiKey
      }, (response) => {
        if (response && response.success) {
          showDecodeCard(response.text, rect);
        } else {
          showToast(response?.error || 'Decoding failed', 'error');
          removeDecodeUI();
        }
      });
    });
  });
  
  document.body.appendChild(decodeFloat);
}

function showDecodeCard(decodedText, rect) {
  if (decodeFloat) {
    decodeFloat.remove();
    decodeFloat = null;
  }
  
  decodeCard = document.createElement('div');
  decodeCard.className = 'ts-decode-card';
  decodeCard.style.top = `${rect.bottom + 10}px`;
  // Ensure it doesn't go offscreen horizontally
  const leftPos = Math.min(rect.left, window.innerWidth - 340);
  decodeCard.style.left = `${Math.max(10, leftPos)}px`;
  
  decodeCard.innerHTML = `
    <div class="ts-decode-content">${decodedText}</div>
    <button class="ts-copy-btn">📋 Copy</button>
  `;
  
  decodeCard.querySelector('.ts-copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(decodedText);
    const copyBtn = decodeCard.querySelector('.ts-copy-btn');
    copyBtn.innerText = '✓ Copied';
    setTimeout(() => {
      copyBtn.innerText = '📋 Copy';
    }, 2000);
  });
  
  document.body.appendChild(decodeCard);
}

document.addEventListener('click', (e) => {
  if (decodeCard && !e.target.closest('.ts-decode-card')) {
    removeDecodeUI();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    removeDecodeUI();
  }
});
