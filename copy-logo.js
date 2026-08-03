const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\Niloy\\.gemini\\antigravity-ide\\brain\\923e11f8-ec56-4fe2-8d49-7d8116600f1f\\media__1785738883082.png';
const destDir = 'd:\\tns-hrms\\public';
const dest = path.join(destDir, 'logo.png');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('Logo copied successfully to ' + dest);
