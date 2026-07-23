/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const srcJs = path.resolve(__dirname, '../../extension/core/tonal.js');
const srcCss = path.resolve(__dirname, '../../extension/core/tonal.css');
const destJs = path.resolve(__dirname, '../src/extension_shared/tonal.js');
const destCss = path.resolve(__dirname, '../src/extension_shared/tonal.css');

// Ensure destination directory exists
fs.mkdirSync(path.dirname(destJs), { recursive: true });

// Copy if source files exist (local environment)
if (fs.existsSync(srcJs) && fs.existsSync(srcCss)) {
  fs.copyFileSync(srcJs, destJs);
  fs.copyFileSync(srcCss, destCss);
  console.log('Successfully synced extension assets to website.');
} else {
  console.log('Extension source files not found. Using cached assets.');
}
