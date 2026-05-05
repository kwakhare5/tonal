document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('api-key');
  const defaultToneSlider = document.getElementById('default-tone-slider');
  const toneMap = ['Texting', 'Work Chat', 'Corporate'];
  const saveBtn = document.getElementById('save-btn');
  const statusMsg = document.getElementById('status-msg');
  const badge = document.getElementById('connected-badge');

  // Load existing settings
  chrome.storage.sync.get(['apiKey', 'defaultTone'], (data) => {
    if (data.apiKey) {
      apiKeyInput.value = data.apiKey;
    }
    
    // Always show ready since there's a default key
    badge.classList.add('visible');
    
    if (data.defaultTone) {
      defaultToneSlider.value = toneMap.indexOf(data.defaultTone).toString();
    }
  });

  // Save settings
  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const defaultTone = toneMap[parseInt(defaultToneSlider.value, 10)];
    
    statusMsg.className = '';
    statusMsg.textContent = '';
    
    if (apiKey && !apiKey.startsWith('AIza')) {
      statusMsg.textContent = 'Invalid key format. Gemini keys start with "AIza"';
      statusMsg.className = 'error-text';
      return;
    }
    
    // Disable button while saving
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;
    
    chrome.storage.sync.set({
      apiKey: apiKey,
      defaultTone: defaultTone
    }, () => {
      saveBtn.textContent = 'Save Settings';
      saveBtn.disabled = false;
      
      statusMsg.textContent = 'Settings saved successfully!';
      statusMsg.className = 'success-text';
      
      setTimeout(() => {
        statusMsg.textContent = '';
      }, 3000);
    });
  });
});
