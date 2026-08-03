const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\Niloy\\.gemini\\antigravity-ide\\brain\\923e11f8-ec56-4fe2-8d49-7d8116600f1f\\media__1785738883082.png';
const publicDir = 'd:\\tns-hrms\\public';
const assetsDir = 'd:\\tns-hrms\\src\\assets';
const destPublic = path.join(publicDir, 'logo.png');
const destAsset = path.join(assetsDir, 'logo.png');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

fs.copyFileSync(src, destPublic);
fs.copyFileSync(src, destAsset);

const base64 = fs.readFileSync(src).toString('base64');
const logoDataContent = `export const logoDataUri = "data:image/png;base64,${base64}";\n`;
fs.writeFileSync(path.join(assetsDir, 'logoData.js'), logoDataContent);

console.log('✅ Logo image successfully copied to public/logo.png, src/assets/logo.png, and src/assets/logoData.js!');
