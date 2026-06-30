const fs = require('fs');
const path = require('path');

// Minimal 1x1 PNG (red pixel) - valid PNG file
const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

const assetsDir = path.join(__dirname, '../apps/mobile/assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const buf = Buffer.from(PNG_BASE64, 'base64');
['icon.png', 'splash.png', 'adaptive-icon.png', 'favicon.png'].forEach((f) => {
  fs.writeFileSync(path.join(assetsDir, f), buf);
  console.log('Created', f);
});
