const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'assets', 'images');
fs.mkdirSync(outDir, { recursive: true });

// Transparent 1x1 PNG
const transparentPngB64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8AABgMBAtKOR7wAAAAASUVORK5CYII=';

const files = [
  'icon.png',
  'adaptive-icon.png',
  'favicon.png',
  'splash-icon.png'
];

for (const name of files) {
  const target = path.join(outDir, name);
  const buf = Buffer.from(transparentPngB64, 'base64');
  fs.writeFileSync(target, buf);
  console.log('Wrote', target);
}

